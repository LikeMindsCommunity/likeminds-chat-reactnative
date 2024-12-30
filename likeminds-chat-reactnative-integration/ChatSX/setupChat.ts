import {
  InitUserWithUuid,
  LMChatClient,
  LMSDKCallbacks,
} from "@likeminds.community/chat-rn";
import { Client } from "./client";

// create a class by LMChatCoreCallbacks and take two functions in its contructors, assign these two functions to the class's functions
export class LMCoreCallbacks {
  onAccessTokenExpiredAndRefreshed: (
    accessToken: string,
    refreshToken: string
  ) => void;
  onRefreshTokenExpired: () => { accessToken: string; refreshToken: string };
  constructor(
    onAccessTokenExpiredAndRefreshed: (
      accessToken: string,
      refreshToken: string
    ) => void,
    onRefreshTokenExpired: () => { accessToken: string; refreshToken: string }
  ) {
    this.onAccessTokenExpiredAndRefreshed = onAccessTokenExpiredAndRefreshed;
    this.onRefreshTokenExpired = onRefreshTokenExpired;
  }
}

// create a new class LMChatSdkCallbackImplementation which is an implementation of the abstract class provided by data layer
export class LMSDKCallbacksImplementations extends LMSDKCallbacks {
  lmCoreCallbacks?: LMCoreCallbacks;
  client: LMChatClient;

  onAccessTokenExpiredAndRefreshed(
    accessToken: string,
    refreshToken: string
  ): void {
    this?.lmCoreCallbacks?.onAccessTokenExpiredAndRefreshed(
      accessToken,
      refreshToken
    );
  }

  async onRefreshTokenExpired() {
    const stringifiedUser: any =
      await Client.myClient.getUserFromLocalStorage(); // replace with actual method to get user
    const user = stringifiedUser ? JSON.parse(stringifiedUser) : null;
    if (user?.apiKey) {
      const payload: InitUserWithUuid = {
        apiKey: user.apiKey,
        uuid: user.userUniqueID,
        userName: user.userName,
        isGuest: false,
      };
      const response: any = await Client.myClient.initiateUser(payload);
      await Client.myClient.setTokens(
        response.accessToken,
        response.refreshToken
      );
      return {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      };
    } else {
      const response = await this?.lmCoreCallbacks?.onRefreshTokenExpired();
      if (response) {
        await Client.myClient.setTokens(
          response?.accessToken,
          response?.refreshToken
        );
      }
      return {
        accessToken: response?.accessToken,
        refreshToken: response?.refreshToken,
      };
    }
  }
  constructor(client: LMChatClient, lmCoreCallbacks?: LMCoreCallbacks) {
    super();
    this.lmCoreCallbacks = lmCoreCallbacks;
    this.client = client;
  }
}
