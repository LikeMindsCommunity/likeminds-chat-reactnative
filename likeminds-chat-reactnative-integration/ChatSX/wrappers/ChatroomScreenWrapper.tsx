import Chat from "../context/Chat";
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
