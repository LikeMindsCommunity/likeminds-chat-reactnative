import { LMChatClient } from "@likeminds.community/chat-rn";
import React from "react";

export interface LMOverlayProviderProps {
  myClient: LMChatClient;
  children: React.ReactNode;
  userName: string;
  userUniqueId: string;
  profileImageUrl: string;
  lmChatInterface?: any;
}
