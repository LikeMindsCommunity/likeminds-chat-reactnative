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
    .setVersionCode(32)
    .build();

  Client.setMyClient(myClient);

  AudioPlayer
    ? AudioPlayer?.default?.registerPlaybackService(() => playbackService)
    : null;

  return myClient;
};
