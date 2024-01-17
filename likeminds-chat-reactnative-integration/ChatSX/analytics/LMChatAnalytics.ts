import { CallBack } from "../callBacks/callBackClass";

export class LMChatAnalytics {
  static track(eventName: string, eventProperties?: Map<string, string>) {
    const lmChatInterface = CallBack.lmChatInterface;
    lmChatInterface.onEventTriggered(eventName, eventProperties);
  }
}
