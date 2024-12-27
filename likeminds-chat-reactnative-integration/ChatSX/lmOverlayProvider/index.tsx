import React, { useEffect } from "react";
import { LMChatBotOverlayProviderProps, LMOverlayProviderProps } from "./types";
import { LMChatBotProvider, LMChatProvider } from "../lmChatProvider";
import { StyleSheet, View } from "react-native";
import { ContextProvider } from "../contextStore";
import { LMSDKCallbacksImplementations } from "../setupChat";

export const LMChatBotOverlayProvider = ({
  myClient,
  lmChatInterface,
  children,
  callbackClass
}: LMChatBotOverlayProviderProps) => {

  useEffect(() => {
    myClient?.setLMSDKCallbacks(
      new LMSDKCallbacksImplementations(myClient, callbackClass)
    );
  }, [callbackClass, myClient]);

  return (
    <ContextProvider>
      <LMChatBotProvider
        myClient={myClient}
        lmChatInterface={lmChatInterface}
      >
        <View style={styles.flexStyling}>{children}</View>
      </LMChatBotProvider>
    </ContextProvider>
  );
}

export const LMOverlayProvider = ({
  myClient,
  children,
  userName,
  userUniqueId,
  apiKey,
  accessToken,
  refreshToken,
  callbackClass,
  profileImageUrl,
  lmChatInterface,
  imageUrl,
}: LMOverlayProviderProps) => {
  useEffect(() => {
    myClient.setLMSDKCallbacks(
      new LMSDKCallbacksImplementations(myClient, callbackClass)
    );
  }, [callbackClass, myClient]);
  return (
    <ContextProvider>
      <LMChatProvider
        myClient={myClient}
        userName={userName}
        userUniqueId={userUniqueId}
        apiKey={apiKey}
        accessToken={accessToken}
        refreshToken={refreshToken}
        profileImageUrl={profileImageUrl}
        lmChatInterface={lmChatInterface}
        imageUrl={imageUrl}
      >
        <View style={styles.flexStyling}>{children}</View>
      </LMChatProvider>
    </ContextProvider>
  );
};

const styles = StyleSheet.create({
  flexStyling: {
    flex: 1,
  },
});
