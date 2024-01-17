import { NavigateToProfileParams } from "./type";

class LMChatCallbacksInterface {
  navigateToProfile(params: NavigateToProfileParams) {}
  navigateToHomePage() {}
  onEventTriggered(eventName: string, eventProperties?: Map<string, string>) {}
}

export default LMChatCallbacksInterface;
