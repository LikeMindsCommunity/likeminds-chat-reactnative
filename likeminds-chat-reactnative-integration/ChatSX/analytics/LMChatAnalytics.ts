import { CallBack } from "../callBacks/callBackClass";

export class LMChatAnalytics {
  static track(
    eventName: string,
    eventProperties?: Map<string | undefined, string | undefined>
  ) {
    const lmChatInterface = CallBack.lmChatInterface;
    lmChatInterface?.onEventTriggered(eventName, eventProperties);
  }
}
