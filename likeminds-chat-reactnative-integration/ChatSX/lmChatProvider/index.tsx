import React, {
  createContext,
  ReactNode,
  useMemo,
  useState,
  useContext,
  useEffect,
} from "react";
import STYLES from "../constants/Styles";
import { Platform, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAppDispatch } from "../store";
import { Credentials } from "../credentials";
import {
  CLEAR_CHATROOM_CONVERSATION,
  CLEAR_CHATROOM_DETAILS,
  INIT_API_SUCCESS,
  PROFILE_DATA_SUCCESS,
  STORE_MY_CLIENT,
  UPDATE_FILE_UPLOADING_OBJECT,
} from "../store/types/types";
import notifee, { EventType } from "@notifee/react-native";
import { getRoute } from "../notifications/routes";
import * as RootNavigation from "../RootNavigation";
import { navigationRef } from "../RootNavigation";
import { setupPlayer } from "../audio";
import { LMChatClient } from "@likeminds.community/chat-rn";
import { GiphySDK } from "@giphy/react-native-sdk";
import { GIPHY_SDK_API_KEY } from "../awsExports";
import { Client } from "../client";
import { FAILED } from "../constants/Strings";
import { LMChatProviderProps, ThemeContextProps } from "./type";
import { getUniqueId } from "react-native-device-info";
import getNotification, {
  fetchFCMToken,
  requestUserPermission,
} from "../notifications";
import messaging from "@react-native-firebase/messaging";
import { StackActions } from "@react-navigation/native";

// Create the theme context
export const LMChatStylesContext = createContext<ThemeContextProps | undefined>(
  undefined
);

//PropTypes for the LMChatProvider component

// Create a context for LMChatProvider
const LMChatContext = createContext<LMChatClient | undefined>(undefined);

// Create a hook to use the LMChatContext
export const useLMChat = () => {
  const context = useContext(LMChatContext);
  if (!context) {
    throw new Error("useLMChat must be used within an LMChatProvider");
  }
  return context;
};

export const useLMChatStyles = () => {
  const context = useContext(LMChatStylesContext);
  if (!context) {
    throw new Error("useLMChatStyles must be used within an LMChatProvider");
  }
  return context;
};

export const LMChatProvider = ({
  myClient,
  children,
  userName,
  userUniqueId,
  cohortId,
  reactionListStyles,
  chatBubbleStyles,
  inputBoxStyles,
  themeStyles,
}: LMChatProviderProps): JSX.Element => {
  const [isInitiated, setIsInitiated] = useState(false);
  const [fcmToken, setFcmToken] = useState("");
  const [isRegisterdDevice, setIsRegisterdDevice] = useState(false);

  //To navigate onPress notification while android app is in background state / quit state.
  useEffect(() => {
    async function bootstrap() {
      const initialNotification = await notifee.getInitialNotification();

      if (initialNotification) {
        const routes = getRoute(initialNotification?.notification?.data?.route);
        setTimeout(() => {
          RootNavigation.navigate(routes.route, routes.params);
        }, 1000);
      }
    }
    bootstrap();
  }, []);

  // to initialise track player
  useEffect(() => {
    async function setup() {
      await setupPlayer();
    }
    setup();
  }, []);

  // to configure gifphy sdk
  useEffect(() => {
    GiphySDK.configure({ apiKey: GIPHY_SDK_API_KEY });
  }, []);

  useEffect(() => {
    const func = async () => {
      const res: any = await myClient?.getAllAttachmentUploadConversations();
      if (res) {
        const len = res.length;
        if (len > 0) {
          for (let i = 0; i < len; i++) {
            const data = res[i];
            const uploadingFilesMessagesSavedObject = JSON.parse(data?.value);
            dispatch({
              type: UPDATE_FILE_UPLOADING_OBJECT,
              body: {
                message: {
                  ...uploadingFilesMessagesSavedObject,
                  isInProgress: FAILED,
                },
                ID: data?.key,
              },
            });
          }
        }
      }
    };

    func();
  }, []);

  // to get dispatch
  const dispatch = useAppDispatch();

  useEffect(() => {
    const callRegisterDevice = async () => {
      const deviceID = await getUniqueId();
      const payload = {
        token: fcmToken,
        xDeviceId: deviceID,
        xPlatformCode: Platform.OS === "ios" ? "ios" : "an",
      };
      await myClient.registerDevice(payload);
      const addMemberToCohortPayload = {
        cohortId: parseInt(cohortId),
        uuids: [userUniqueId],
      };
      await myClient?.addMemberToCohort(addMemberToCohortPayload);
      setIsRegisterdDevice(true);
    };
    if (fcmToken) {
      callRegisterDevice();
    }
  }, [fcmToken]);

  useEffect(() => {
    //setting client in Client class
    Client.setMyClient(myClient);

    // storing myClient followed by community details
    const callInitApi = async () => {
      const payload = {
        uuid: userUniqueId, // uuid
        userName: userName, // user name
        isGuest: false,
      };

      Credentials.setCredentials(userName, userUniqueId);

      const initiateApiResponse = await myClient?.initiateUser(payload);

      dispatch({
        type: INIT_API_SUCCESS,
        body: { community: initiateApiResponse?.data?.community },
      });

      const getMemberStateResponse = await myClient?.getMemberState();

      dispatch({
        type: PROFILE_DATA_SUCCESS,
        body: {
          member: getMemberStateResponse?.data?.member,
          memberRights: getMemberStateResponse?.data?.memberRights,
        },
      });

      const isPermissionEnabled = await requestUserPermission();
      if (isPermissionEnabled) {
        const fcmToken = await fetchFCMToken();
        if (fcmToken) {
          setFcmToken(fcmToken);
        }
      }

      setIsInitiated(true);
    };
    callInitApi();
  }, []);

  useMemo(() => {
    if (themeStyles) {
      STYLES.setTheme(themeStyles);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      const val = await getNotification(remoteMessage);
      return val;
    });

    notifee.onForegroundEvent(async ({ type, detail }) => {
      if (detail?.notification?.data?.route != undefined) {
        const navigation = navigationRef?.current;
        let currentRoute = navigation?.getCurrentRoute();
        let routes = await getRoute(detail?.notification?.data?.route);

        if (type === EventType.PRESS) {
          if (!!navigation) {
            if ((currentRoute?.name as any) === routes?.route) {
              if (
                JSON.stringify(routes?.params) !==
                JSON.stringify(currentRoute?.params)
              ) {
                dispatch({
                  type: CLEAR_CHATROOM_CONVERSATION,
                  body: { conversations: [] },
                });
                dispatch({
                  type: CLEAR_CHATROOM_DETAILS,
                  body: { chatroomDetails: {} },
                });
                const popAction = StackActions.pop(1);
                navigation.dispatch(popAction);
                setTimeout(() => {
                  navigation.navigate(
                    routes?.route as never,
                    routes?.params as never
                  );
                }, 1000);
              }
            } else {
              navigation.navigate(
                routes?.route as never,
                routes?.params as never
              ); //navigate(CHATROOM, {chatroomID: 69285});
            }
          }
        }
      }
    });

    return unsubscribe;
  }, [isRegisterdDevice]);

  return isInitiated && isRegisterdDevice ? (
    <LMChatContext.Provider value={myClient}>
      <LMChatStylesContext.Provider
        value={{ reactionListStyles, chatBubbleStyles, inputBoxStyles }}
      >
        <GestureHandlerRootView style={styles.flexStyling}>
          <View style={styles.flexStyling}>{children}</View>
        </GestureHandlerRootView>
      </LMChatStylesContext.Provider>
    </LMChatContext.Provider>
  ) : (
    <></>
  );
};

const styles = StyleSheet.create({
  flexStyling: {
    flex: 1,
  },
});
