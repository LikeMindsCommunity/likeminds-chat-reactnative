import { playbackService } from "./audio";
import { ConversationState, LMChatClient } from "@likeminds.community/chat-rn";
import { Client } from "./client";
import AudioPlayer from "./optionalDependecies/AudioPlayer";

export const initMyClient = (filterStateMessage: ConversationState[]) => {
  const myClient = LMChatClient.setfilterStateConversation(filterStateMessage)
    .setVersionCode(40)
    .build();

  Client.setMyClient(myClient);

  AudioPlayer
    ? AudioPlayer?.default?.registerPlaybackService(() => playbackService)
    : null;

  return myClient;
};
