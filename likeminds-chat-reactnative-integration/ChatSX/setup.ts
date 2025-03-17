import { playbackService } from "./audio";
import { ConversationState, LMChatClient } from "@likeminds.community/chat-rn";
import { LMSeverity } from "@likeminds.community/chat-js"
import { Client } from "./client";
import AudioPlayer from "./optionalDependecies/AudioPlayer";

export const initMyClient = (filterStateMessage: ConversationState[]) => {
  const myClient = LMChatClient
    .setfilterStateConversation(filterStateMessage)
    .setInitiateLoggerRequest({
      sdkConfig: {
        coreVersion: '1.10.0',
        dataLayerVersion: '1.15.0'
      },
      shareLogsWithLM: true,
      logLevel: LMSeverity.INFO,
      onErrorHandler: (exception, trace) => {
        console.log("ERROR", {
          exception,
          trace
        })
      }
    })
    .setVersionCode(42)
    .build();

  Client.setMyClient(myClient);

  AudioPlayer
    ? AudioPlayer?.default?.registerPlaybackService(() => playbackService)
    : null;

  return myClient;
};
