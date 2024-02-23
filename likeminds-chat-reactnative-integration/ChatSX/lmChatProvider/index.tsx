import React, {
  createContext,
  ReactNode,
  useMemo,
  useState,
  useEffect,
} from "react";
import { Platform, StyleSheet, View, KeyboardAvoidingView } from "react-native";
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
import { GiphySDK } from "@giphy/react-native-sdk";
import { GIPHY_SDK_API_KEY } from "../awsExports";
import { Client } from "../client";
import { FAILED } from "../constants/Strings";
import { LMChatProviderProps } from "./type";
import { getUniqueId } from "react-native-device-info";
import getNotification, {
  fetchFCMToken,
  requestUserPermission,
} from "../notifications";
import messaging from "@react-native-firebase/messaging";
import { StackActions } from "@react-navigation/native";
import { CallBack } from "../callBacks/callBackClass";

export const LMChatProvider = ({
  myClient,
  children,
  userName,
  userUniqueId,
  profileImageUrl,
  lmChatInterface,
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
      setIsRegisterdDevice(true);
    };
    if (fcmToken) {
      callRegisterDevice();
    }
  }, [fcmToken]);

  useEffect(() => {
    //setting client in Client class
    Client.setMyClient(myClient);

    // setting lmChatInterface in CallBack class
    CallBack.setLMChatInterface(lmChatInterface);

    // storing myClient followed by community details
    const callInitApi = async () => {
      const payload = {
        uuid: userUniqueId, // uuid
        userName: userName, // user name
        isGuest: false,
        imageUrl: profileImageUrl,
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

  return isInitiated && isRegisterdDevice ? (
    <GestureHandlerRootView style={styles.flexStyling}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.flexStyling}>{children}</View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  ) : (
    <></>
  );
};

const styles = StyleSheet.create({
  flexStyling: {
    flex: 1,
  },
});
