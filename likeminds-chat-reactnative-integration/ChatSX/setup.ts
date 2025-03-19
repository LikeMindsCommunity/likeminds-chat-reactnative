import { playbackService } from "./audio";
import { ConversationState, LMChatClient, LMStackTrace } from "@likeminds.community/chat-rn";
import { LMSeverity } from "@likeminds.community/chat-rn"
import { Client } from "./client";
import AudioPlayer from "./optionalDependecies/AudioPlayer";
const packageJson = require("../package.json");

export const initMyClient = (
  filterStateMessage: ConversationState[],
  shareLogsWithLM: boolean = true,
  onErrorHandler?: (exception: string, stackTrace: LMStackTrace) => void
) => {
  const myClient = LMChatClient
    .setfilterStateConversation(filterStateMessage)
    .setInitiateLoggerRequest({
      sdkConfig: {
        coreVersion: packageJson.version,
        dataLayerVersion: packageJson.dependencies["@likeminds.community/chat-rn"],
      },
      shareLogsWithLM,
      logLevel: LMSeverity.INFO,
      onErrorHandler: onErrorHandler ? onErrorHandler : () => { }
    })
    .setVersionCode(43)
    .build();

  Client.setMyClient(myClient);

  AudioPlayer
    ? AudioPlayer?.default?.registerPlaybackService(() => playbackService)
    : null;

  return myClient;
};
