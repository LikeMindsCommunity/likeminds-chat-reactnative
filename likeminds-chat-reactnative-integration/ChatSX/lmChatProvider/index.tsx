import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAppDispatch } from "../store";
import { Credentials } from "../credentials";
import {
  INIT_API_SUCCESS,
  PROFILE_DATA_SUCCESS,
  UPDATE_FILE_UPLOADING_OBJECT,
} from "../store/types/types";
import { setupPlayer } from "../audio";
import { GIPHY_SDK_API_KEY } from "../awsExports";
import { Client } from "../client";
import { FAILED } from "../constants/Strings";
import { LMChatProviderProps } from "./type";
import { CallBack } from "../callBacks/callBackClass";
import GIFPicker from "../optionalDependecies/Gif";
import { Token } from "../tokens";

export const LMChatProvider = ({
  myClient,
  children,
  userName,
  userUniqueId,
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
      Token.setToken(initiateApiResponse?.data?.accessToken);

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

      setIsInitiated(true);
    };
    callInitApi();
  }, []);

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
