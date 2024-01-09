import notifee, { EventType } from "@notifee/react-native";
import getNotification from "./notifications";
import { getRoute } from "./notifications/routes";
import * as RootNavigation from "./RootNavigation";
import messaging from "@react-native-firebase/messaging";
import TrackPlayer from "react-native-track-player";
import { playbackService } from "./audio";
import { ConversationState, LMChatClient } from "@likeminds.community/chat-rn";
import { Client } from "./client";

export const initMyClient = (apiKey: string) => {
  const myClient = LMChatClient.setApiKey(apiKey)
    .setfilterStateConversation([ConversationState.MEMBER_LEFT_SECRET_CHATROOM])
    .build();

  Client.setMyClient(myClient);

  notifee.onBackgroundEvent(async ({ type, detail }) => {
    const routes = getRoute(detail?.notification?.data?.route);

    if (type === EventType.PRESS) {
      if (RootNavigation) {
        setTimeout(() => {
          RootNavigation.navigate(routes.route, routes.params); // e.g. navigate(CHATROOM, {chatroomID: 69285});
        }, 1000);
      }
    }
  });

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    const val = await getNotification(remoteMessage);
    return val;
  });

  TrackPlayer.registerPlaybackService(() => playbackService);

  return myClient;
};
