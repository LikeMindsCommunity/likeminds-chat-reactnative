import { playbackService } from "./audio";
import { ConversationState, LMChatClient, LMStackTrace } from "@likeminds.community/chat-rn";
import { LMSeverity } from "@likeminds.community/chat-rn"
import { Client } from "./client";
import AudioPlayer from "./optionalDependecies/AudioPlayer";

interface InitiateClientRequest {
  filterStateMessage: ConversationState[],
  shareLogsWithLM?: boolean,
  onErrorHandler?: (exception: string, stackTrace: LMStackTrace) => void;
}

export const initMyClient = ({ filterStateMessage, shareLogsWithLM = true, onErrorHandler }: InitiateClientRequest) => {
  const myClient = LMChatClient
    .setfilterStateConversation(filterStateMessage)
    .setInitiateLoggerRequest({
      sdkConfig: {
        coreVersion: '1.10.0',
        dataLayerVersion: '1.15.0'
      },
      shareLogsWithLM,
      logLevel: LMSeverity.WARNING,
      onErrorHandler: onErrorHandler ? onErrorHandler : () => {}
    })
    .setVersionCode(42)
    .build();

  Client.setMyClient(myClient);

  AudioPlayer
    ? AudioPlayer?.default?.registerPlaybackService(() => playbackService)
    : null;

  return myClient;
};
