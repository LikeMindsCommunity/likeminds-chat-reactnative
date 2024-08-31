import { LMChatClient } from "@likeminds.community/chat-rn";
import React from "react";

export interface LMChatProviderProps {
  myClient: LMChatClient;
  children?: React.ReactNode;
  userName?: string;
  userUniqueId?: string;
  apiKey?: string;
  accessToken?: string;
  refreshToken?: string;
  profileImageUrl?: string;
  lmChatInterface?: any;
  imageUrl?: string;
}
