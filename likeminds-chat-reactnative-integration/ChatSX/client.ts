import { LMChatClient } from "@likeminds.community/chat-rn-beta";;

export class Client {
  private static _myClient: LMChatClient;

  static setMyClient(myClient: LMChatClient): void {
    Client._myClient = myClient;
  }

  static get myClient(): LMChatClient {
    return Client._myClient;
  }
}
