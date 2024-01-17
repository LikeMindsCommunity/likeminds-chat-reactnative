import LMChatCallbacksInterface from "./index";

export class CallBack {
  private static _lmChatInterface: LMChatCallbacksInterface;

  static setLMChatInterface(lmChatInterface: LMChatCallbacksInterface): void {
    CallBack._lmChatInterface = lmChatInterface;
  }

  static get lmChatInterface(): LMChatCallbacksInterface {
    return CallBack._lmChatInterface;
  }
}
