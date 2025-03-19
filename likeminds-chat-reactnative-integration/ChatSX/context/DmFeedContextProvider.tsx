import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { ActivityIndicator, View } from "react-native";
import Layout from "../constants/Layout";
import STYLES from "../constants/Styles";
import {
  GET_HOMEFEED_CHAT_SUCCESS,
  SET_DM_PAGE,
  SET_INITIAL_DMFEED_CHATROOM,
  SET_INITIAL_GROUPFEED_CHATROOM,
  SET_PAGE,
} from "../store/types/types";
import {
  getInvites,
  updateDMFeedData,
  updateHomeFeedData,
  updateInvites,
} from "../store/actions/homefeed";
import { fetchFCMToken, requestUserPermission } from "../notifications";
import { paginatedSyncAPI } from "../utils/syncChatroomApi";
import { onValue, ref } from "@firebase/database";
import { LMChatAnalytics } from "../analytics/LMChatAnalytics";
import { Events, Keys, Sources } from "../enums";
import { useAppDispatch, useAppSelector } from "../store";
import { Client } from "../client";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { SHOW_LIST_REGEX } from "../commonFuctions";
import { LMSeverity } from "@likeminds.community/chat-rn"

export interface DmFeedContextProps {
  children?: ReactNode;
}

export interface DmFeedContext {
  isLoading: any;
  shimmerIsLoading: any;
  FCMToken: any;
  navigation: any;
  showDM: any;
  showList: any;
  dmFeedChatrooms: any;

  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setShimmerIsLoading: Dispatch<SetStateAction<boolean>>;
  setFCMToken: Dispatch<SetStateAction<string>>;
  getChatroomFromLocalDB: any;
  getAppConfig: any;
  handleLoadMore: any;
  renderFooter: any;
  setShowDM: Dispatch<SetStateAction<boolean>>;
  setShowList: any;
}

const DmFeedContext = createContext<DmFeedContext | undefined>(undefined);

export const useDmFeedContext = () => {
  const context = useContext(DmFeedContext);
  if (!context) {
    throw new Error(
      "useDmFeedContext must be used within an DmFeedContextProvider"
    );
  }
  return context;
};

export const DmFeedContextProvider = ({ children }: DmFeedContextProps) => {
  const myClient = Client.myClient;
  const [isLoading, setIsLoading] = useState(false);
  const [shimmerIsLoading, setShimmerIsLoading] = useState(true);
  const [showDM, setShowDM] = useState(false);
  const [showList, setShowList] = useState<any>(null);
  const [FCMToken, setFCMToken] = useState("");
  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();

  const { myDMChatrooms, dmPage, dmFeedChatrooms } = useAppSelector(
    (state) => state.homefeed
  );
  const { user, community } = useAppSelector((state) => state.homefeed);

  const db = myClient?.firebaseInstance();
  const chatrooms = [...myDMChatrooms];
  const INITIAL_SYNC_PAGE = 1;
  let startTime = 0;
  let endTime = 0;

  async function fetchData() {
    try {
      if (community?.id) {
        const payload = {
          page: 1,
        };
        const apiRes = await myClient?.checkDMStatus({
          requestFrom: "dm_feed_v2",
        });
        const response = apiRes?.data;
        if (response) {
          const routeURL = response?.cta;
          const hasShowList = SHOW_LIST_REGEX.test(routeURL);
          if (hasShowList) {
            const showListValue = routeURL.match(SHOW_LIST_REGEX)[1];
            setShowList(showListValue);
          }
          setShowDM(response?.showDm);
        }
      }
    } catch (error) {
      Client?.myClient?.handleException(
        error,
        {
          exception: error,
          trace: error?.stack
        },
        LMSeverity.ERROR
      )
    }
  }

  useEffect(() => {
    if (isFocused) {
      LMChatAnalytics.track(
        Events.DM_FEED_OPENED,
        new Map<string, string>([[Keys.SOURCE, Sources.HOME_FEED]])
      );
    }
  }, [isFocused]);

  useLayoutEffect(() => {
    fetchData();
  }, [navigation, community]);

  useEffect(() => {
    const token = async () => {
      try {
        const isPermissionEnabled = await requestUserPermission();
        if (isPermissionEnabled) {
          const fcmToken = await fetchFCMToken();
          if (fcmToken) {
            setFCMToken(fcmToken);
          }
        }
      } catch (error) {
        Client?.myClient?.handleException(
          error,
          {
            exception: error,
            trace: error?.stack
          },
          LMSeverity.ERROR
        )
      }
    };
    token();
  }, []);

  // Fetching already existing chatrooms from Realm
  const getChatroomFromLocalDB = async () => {
    try {
      const existingChatrooms: any = await myClient?.getFilteredChatrooms(true);
      if (!!existingChatrooms && existingChatrooms.length !== 0) {
        setShimmerIsLoading(false);
        dispatch({
          type: SET_INITIAL_DMFEED_CHATROOM,
          body: { dmFeedChatrooms: existingChatrooms },
        });
      } else {
        dispatch({
          type: SET_INITIAL_DMFEED_CHATROOM,
          body: { dmFeedChatrooms: [] }
        })
      }
    } catch (error) {
      Client?.myClient?.handleException(
        error,
        {
          exception: error,
          trace: error?.stack
        },
        LMSeverity.ERROR
      )
    }
  };

  const getAppConfig = async () => {
    try {
      const appConfig = await myClient?.getAppConfig();
      if (appConfig?.isDmFeedChatroomsSynced === undefined) {
        startTime = Date.now() / 1000;
        setTimeout(() => {
          myClient?.initiateAppConfig();
          myClient?.setAppConfig(true);
        }, 200);
      } else {
        setShimmerIsLoading(false);
      }
    } catch (error) {
      Client?.myClient?.handleException(
        error,
        {
          exception: error,
          trace: error?.stack
        },
        LMSeverity.ERROR
      )
    }
  };

  useEffect(() => {
    const query = ref(db, `/community/${community?.id}`);
    return onValue(query, (snapshot) => {
      try {
        if (snapshot.exists()) {
          if (!user?.sdkClientInfo?.community) {
            return;
          }
          if (isFocused) {
            paginatedSyncAPI(INITIAL_SYNC_PAGE, user, true);
            setShimmerIsLoading(false);
            setTimeout(() => {
              getChatroomFromLocalDB();
            }, 500);
          }
        }
      } catch (error) {
        Client?.myClient?.handleException(
          error,
          {
            exception: error,
            trace: error?.stack
          },
          LMSeverity.ERROR
        )
      }
    });
  }, [user, isFocused]);

  useEffect(() => {
    const initiate = async () => {
      try {
        await getAppConfig();
        if (!user?.sdkClientInfo?.community) {
          return;
        }
        await paginatedSyncAPI(INITIAL_SYNC_PAGE, user, true);
        if (shimmerIsLoading == true && isFocused) {
          endTime = Date.now() / 1000;
          LMChatAnalytics.track(
            Events.SYNC_COMPLETE,
            new Map<string, string>([
              [Keys.SYNC_COMPLETE, true?.toString()],
              [Keys.TIME_TAKEN, (endTime - startTime)?.toString()],
            ])
          );
        }
        setShimmerIsLoading(false);
        setTimeout(() => {
          getChatroomFromLocalDB();
        }, 500);
      } catch (error) {
        Client?.myClient?.handleException(
          error,
          {
            exception: error,
            trace: error?.stack
          },
          LMSeverity.ERROR
        )
      }
    };
    initiate();
  }, [user, isFocused, shimmerIsLoading, startTime]);

  //function calls updateDMFeedData action to update myDMChatrooms array with the new data.
  async function updateData(newPage: number) {
    try {
      const payload = {
        page: newPage,
      };
      const response = await dispatch(updateDMFeedData(payload, false) as any);
      return response;
    } catch (error) {
      Client?.myClient?.handleException(
        error,
        {
          exception: error,
          trace: error?.stack
        },
        LMSeverity.ERROR
      )
    }
  }

  // function shows loader in between calling the API and getting the response
  const loadData = async (newPage: number) => {
    setIsLoading(true);
    setTimeout(async () => {
      const res: any = await updateData(newPage);
      if (res) {
        setIsLoading(false);
      }
    }, 1500);
  };

  //function checks the pagination logic, if it verifies the condition then call loadData
  const handleLoadMore = async () => {
    if (!isLoading) {
      if (
        myDMChatrooms?.length > 0 &&
        myDMChatrooms?.length % 10 === 0 &&
        myDMChatrooms?.length === 10 * dmPage
      ) {
        const newPage = dmPage + 1;
        dispatch({ type: SET_DM_PAGE, body: newPage });
        loadData(newPage);
      }
    }
  };

  const renderFooter = () => {
    return isLoading ? (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" color={STYLES.$COLORS.SECONDARY} />
      </View>
    ) : null;
  };

  const contextValues: DmFeedContext = {
    isLoading,
    shimmerIsLoading,
    showDM,
    showList,
    FCMToken,
    navigation,
    dmFeedChatrooms,

    setIsLoading,
    setShimmerIsLoading,
    setFCMToken,
    getChatroomFromLocalDB,
    getAppConfig,
    handleLoadMore,
    renderFooter,
    setShowDM,
    setShowList,
  };

  return (
    <DmFeedContext.Provider value={contextValues}>
      {children}
    </DmFeedContext.Provider>
  );
};
