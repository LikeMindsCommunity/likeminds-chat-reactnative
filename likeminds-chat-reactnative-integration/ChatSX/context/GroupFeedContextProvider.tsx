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

export interface GroupFeedContextProps {
  children?: ReactNode;
}

export interface GroupFeedContext {
  isLoading: any;
  shimmerIsLoading: any;
  invitePage: any;
  FCMToken: any;
  navigation: any;
  groupFeedChatrooms: any;
  unseenCount: any;
  totalCount: any;

  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setShimmerIsLoading: Dispatch<SetStateAction<boolean>>;
  setInvitePage: any;
  setFCMToken: Dispatch<SetStateAction<string>>;
  getExploreTabCount: any;
  getChatroomFromLocalDB: any;
  getAppConfig: any;
  handleLoadMore: any;
  renderFooter: any;
}

const GroupFeedContext = createContext<GroupFeedContext | undefined>(undefined);

export const useGroupFeedContext = () => {
  const context = useContext(GroupFeedContext);
  if (!context) {
    throw new Error(
      "useGroupFeedContext must be used within an GroupFeedContextProvider"
    );
  }
  return context;
};

export const GroupFeedContextProvider = ({
  children,
}: GroupFeedContextProps) => {
  const myClient = Client.myClient;
  const [isLoading, setIsLoading] = useState(false);
  const [shimmerIsLoading, setShimmerIsLoading] = useState(true);
  const [invitePage, setInvitePage] = useState(1);
  const [FCMToken, setFCMToken] = useState("");
  const isFocused = useIsFocused();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useAppDispatch();

  let {
    myChatrooms,
    unseenCount,
    totalCount,
    page,
    invitedChatrooms,
    community,
    groupFeedChatrooms,
  } = useAppSelector((state) => state.homefeed);
  const user = useAppSelector((state) => state.homefeed.user);
  const db = myClient?.firebaseInstance();

  groupFeedChatrooms = [...invitedChatrooms, ...groupFeedChatrooms];

  const INITIAL_SYNC_PAGE = 1;

  let startTime = 0;
  let endTime = 0;

  const getExploreTabCount = async () => {
    try {
      const exploreTabCount = await myClient?.getExploreTabCount();
      dispatch({ type: GET_HOMEFEED_CHAT_SUCCESS, body: exploreTabCount?.data });
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
    // To get total number of chatrooms and number of unseen chatrooms
    getExploreTabCount();
  }, []);

  // Fetching already existing groupfeed chatrooms from Realm
  const getChatroomFromLocalDB = async () => {
    try {
      const existingChatrooms: any = await myClient?.getFilteredChatrooms(false);
      if (!!existingChatrooms && existingChatrooms.length != 0) {
        setShimmerIsLoading(false);
        dispatch({
          type: SET_INITIAL_GROUPFEED_CHATROOM,
          body: { groupFeedChatrooms: existingChatrooms },
        });
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
      if (appConfig?.isGroupFeedChatroomsSynced === undefined) {
        startTime = Date.now() / 1000;
        setTimeout(() => {
          myClient?.initiateAppConfig();
          myClient?.setAppConfig(false);
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
    const initiate = async () => {
      try {
        await getAppConfig();
        if (!user?.sdkClientInfo?.community) {
          return;
        }
        await paginatedSyncAPI(INITIAL_SYNC_PAGE, user, false);
        if (shimmerIsLoading == true) {
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
          error?.stack,
          LMSeverity.ERROR
        )
      }
    };
    initiate();
  }, [user, startTime, shimmerIsLoading]);

  useEffect(() => {
    const query = ref(db, `/community/${community?.id}`);
    return onValue(query, (snapshot) => {
      try {
        if (snapshot.exists()) {
          if (!user?.sdkClientInfo?.community) {
            return;
          }
          if (isFocused) {
            paginatedSyncAPI(INITIAL_SYNC_PAGE, user, false);
            setShimmerIsLoading(false);
            setTimeout(() => {
              getChatroomFromLocalDB();
            }, 500);
          }
        }
      } catch (error) {
        Client?.myClient?.handleException(
          error,
          error?.stack,
          LMSeverity.ERROR
        )
      }
    });
  }, [user, isFocused]);

  async function fetchData() {
    try {
      const invitesRes: any = await dispatch(
        getInvites({ channelType: 1, page: 1, pageSize: 10 }, false) as any
      );

      if (invitesRes?.userInvites) {
        if (invitesRes?.userInvites?.length < 10) {
          const payload = {
            page: 1,
          };
        } else {
          await dispatch(
            updateInvites({ channelType: 1, page: 2, pageSize: 10 }, false) as any
          );
          setInvitePage((invitePage) => {
            return invitePage + 1;
          });
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

  useLayoutEffect(() => {
    fetchData();
  }, [navigation]);

  useEffect(() => {
    const token = async () => {
      const isPermissionEnabled = await requestUserPermission();
      if (isPermissionEnabled) {
        const fcmToken = await fetchFCMToken();
        if (fcmToken) {
          setFCMToken(fcmToken);
        }
      }
    };
    token();
  }, []);

  async function updateData(newPage: number) {
    try {
      const payload = {
        page: newPage,
      };
      const response = await dispatch(updateHomeFeedData(payload, false) as any);
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

  const loadData = async (newPage: number) => {
    setIsLoading(true);
    setTimeout(async () => {
      const res: any = await updateData(newPage);
      if (res) {
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleLoadMore = async () => {
    if (!isLoading) {
      if (
        groupFeedChatrooms?.length === 0 &&
        invitedChatrooms === 10 * invitePage
      ) {
        setIsLoading(true);
        await dispatch(
          updateInvites(
            { channelType: 1, page: invitePage + 1, pageSize: 10 },
            false
          ) as any
        );
        setInvitePage((invitePage) => {
          return invitePage + 1;
        });
        setIsLoading(false);
      } else if (
        groupFeedChatrooms?.length > 0 &&
        groupFeedChatrooms?.length % 10 === 0 &&
        groupFeedChatrooms?.length === 10 * page
      ) {
        const newPage = page + 1;
        dispatch({ type: SET_PAGE, body: newPage });
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

  const contextValues: GroupFeedContext = {
    isLoading,
    shimmerIsLoading,
    invitePage,
    FCMToken,
    navigation,
    groupFeedChatrooms,
    unseenCount,
    totalCount,

    setIsLoading,
    setShimmerIsLoading,
    setInvitePage,
    setFCMToken,
    getExploreTabCount,
    getChatroomFromLocalDB,
    getAppConfig,
    handleLoadMore,
    renderFooter,
  };

  return (
    <GroupFeedContext.Provider value={contextValues}>
      {children}
    </GroupFeedContext.Provider>
  );
};
