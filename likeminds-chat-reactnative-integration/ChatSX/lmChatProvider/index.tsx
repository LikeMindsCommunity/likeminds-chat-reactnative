import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAppDispatch } from "../store";
import { Credentials } from "../credentials";
import { UPDATE_FILE_UPLOADING_OBJECT } from "../store/types/types";
import { setupPlayer } from "../audio";
import { GIPHY_SDK_API_KEY } from "../awsExports";
import { Client } from "../client";
import { FAILED } from "../constants/Strings";
import { LMChatProviderProps } from "./type";
import { CallBack } from "../callBacks/callBackClass";
import GIFPicker from "../optionalDependecies/Gif";
import { Token } from "../tokens";
import { InitUserWithUuid, ValidateUser } from "@likeminds.community/chat-rn";
import {
  getMemberState,
  initAPI,
  validateUser,
} from "../store/actions/homefeed";

export const LMChatProvider = ({
  myClient,
  children,
  userName,
  userUniqueId,
  apiKey,
  accessToken,
  refreshToken,
  profileImageUrl,
  lmChatInterface,
}: LMChatProviderProps) => {
  const [isInitiated, setIsInitiated] = useState(false);

  // to initialise track player
  useEffect(() => {
    async function setup() {
      await setupPlayer();
    }
    setup();
  }, []);

  // to configure gifphy sdk
  useEffect(() => {
    if (GIFPicker) {
      const { GiphySDK } = GIFPicker;
      GiphySDK?.configure({ apiKey: GIPHY_SDK_API_KEY });
    }
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
    //setting client in Client class
    Client.setMyClient(myClient);

    // setting lmChatInterface in CallBack class
    CallBack.setLMChatInterface(lmChatInterface);

    const callValidateApi = async (accessToken, refreshToken) => {
      const payload: ValidateUser = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      const validateResponse = await dispatch(validateUser(payload, true));

      if (validateResponse !== undefined && validateResponse !== null) {
        // calling getMemberState API
        await dispatch(getMemberState());
      }
      setIsInitiated(true);
    };

    // storing myClient followed by community details
    async function callInitiateAPI() {
      const { accessToken, refreshToken } = await myClient?.getTokens();
      if (accessToken && refreshToken) {
        callValidateApi(accessToken, refreshToken);
        return;
      }
      const payload: InitUserWithUuid = {
        userName: userName,
        apiKey: apiKey,
        uuid: userUniqueId,
        isGuest: false,
      };
      const initiateResponse: any = await dispatch(initAPI(payload));
      if (initiateResponse !== undefined && initiateResponse !== null) {
        // calling getMemberState API
        await dispatch(getMemberState());
        await myClient.setTokens(
          initiateResponse?.accessToken,
          initiateResponse?.refreshToken
        );
        Token.setToken(initiateResponse?.accessToken);
        setIsInitiated(true);
      }
    }
    if (accessToken && refreshToken) {
      callValidateApi(accessToken, refreshToken);
    } else if (apiKey && userName && userUniqueId) {
      callInitiateAPI();
    }
  }, [accessToken, refreshToken]);

  return isInitiated ? (
    <GestureHandlerRootView style={styles.flexStyling}>
      <View style={styles.flexStyling}>{children}</View>
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
