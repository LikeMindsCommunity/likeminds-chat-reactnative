import React from "react";
import { ChatroomContextProvider } from "./ChatroomContext";
import { MessageListContextProvider } from "./MessageListContext";
import { ExploreFeedContextProvider } from "./ExploreFeedContext";
import { InputBoxContextProvider } from "./InputBoxContext";
interface ChatProps {
  children?: React.ReactNode;
}

function Chat({ children }: ChatProps) {
  return (
    <ChatroomContextProvider>
      <MessageListContextProvider>{children}</MessageListContextProvider>
    </ChatroomContextProvider>
  );
}

export default Chat;
