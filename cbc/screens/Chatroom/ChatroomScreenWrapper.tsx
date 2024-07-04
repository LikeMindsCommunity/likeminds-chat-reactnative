import { Chat } from "@likeminds.community/chat-rn-core";
import React from "react";
import { ChatroomScreen } from "./ChatroomScreen";

function ChatroomScreenWrapper() {
  return (
    <Chat>
      <ChatroomScreen />
    </Chat>
  );
}

export default ChatroomScreenWrapper;
