import notifee, { EventType } from "@notifee/react-native";
import getNotification from "./notifications";
import { getRoute } from "./notifications/routes";
import * as RootNavigation from "./RootNavigation";
import messaging from "@react-native-firebase/messaging";
import { playbackService } from "./audio";
import { ConversationState, LMChatClient } from "@likeminds.community/chat-rn";
import { Client } from "./client";
import AudioPlayer from "./optionalDependecies/AudioPlayer";

export const initMyClient = (
  apiKey: string,
  filterStateMessage: ConversationState[]
) => {
  const myClient = LMChatClient.setApiKey(apiKey)
    .setfilterStateConversation(filterStateMessage)
    .setVersionCode(31)
    .build();

  Client.setMyClient(myClient);

  AudioPlayer
    ? AudioPlayer?.default?.registerPlaybackService(() => playbackService)
    : null;

  return myClient;
};
