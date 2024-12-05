import { LMChatClient } from "@likeminds.community/chat-rn";
import React from "react";
import { LMCoreCallbacks } from "../setupChat";

export interface LMOverlayProviderProps {
  myClient: LMChatClient;
  children: React.ReactNode;
  userName?: string;
  userUniqueId?: string;
  apiKey?: string;
  accessToken?: string;
  refreshToken?: string;
  callbackClass: LMCoreCallbacks;
  profileImageUrl?: string;
  lmChatInterface?: any;
  imageUrl?: string;
}

export interface LMChatBotOverlayProviderProps {
  myClient: LMChatClient;
  children: React.ReactNode;
  lmChatInterface?: any;
  callbackClass: LMCoreCallbacks;
}
