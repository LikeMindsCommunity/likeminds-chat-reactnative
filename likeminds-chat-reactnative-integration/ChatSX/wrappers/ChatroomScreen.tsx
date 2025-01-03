import React from "react";
import MessageInput from "../components/MessageInput";
import { ChatRoom } from "../screens/ChatRoom";
import ChatroomHeader from "../components/ChatroomHeader";
import ChatroomTopic from "../components/ChatroomTopic";
import MessageList from "../components/MessageList";
import { InputBoxContextProvider } from "../context/InputBoxContext";
import {
  ChatroomContextValues,
  useChatroomContext,
} from "../context/ChatroomContext";
import MessageInputBox from "../components/InputBox";

interface HintMessages {
  messageForRightsDisabled?: string;
  messageForMemberCanMessage?: string;
  messageForAnnouncementRoom?: string;
  respondingDisabled?: string;
}

export function ChatroomScreen() {
  const showViewParticipants = true;
  const showShareChatroom = true;
  const showMuteNotifications = true;
  const showLeaveChatroom = true;
  const showJoinChatroom = true;
  const showUnmuteNotifications = true;
  const showBlockMember = true;
  const showUnBlockMember = true;
  const showViewProfile = true;
  const showSecretLeaveChatroom = true;
  const showChatroomTopic = true;
  const hintMessages: HintMessages = {
    messageForMemberCanMessage:
      "Sorry, at this time only CM's can message here!",
    messageForRightsDisabled:
      "Sorry your rights has been disabled, contact you CM for more info!",
  };

  const {
    chatroomID,
    chatroomWithUser,
    currentChatroomTopic,
    chatroomType,
    replyChatID,
    isEditable,
    chatroomName,
    isSecret,
    refInput,
    chatroomDBDetails,

    setIsEditable,
    handleFileUpload,
  }: ChatroomContextValues = useChatroomContext();

  return (
    <ChatRoom
      showViewParticipants={showViewParticipants}
      showShareChatroom={showShareChatroom}
      showMuteNotifications={showMuteNotifications}
      showLeaveChatroom={showLeaveChatroom}
      showJoinChatroom={showJoinChatroom}
      showUnmuteNotifications={showUnmuteNotifications}
      showBlockMember={showBlockMember}
      showUnBlockMember={showUnBlockMember}
      showViewProfile={showViewProfile}
      showSecretLeaveChatroom={showSecretLeaveChatroom}
    >
      {/* ChatroomHeader */}
      <ChatroomHeader
        showThreeDotsOnHeader={true}
        showThreeDotsOnSelectedHeader={true}
      />

      {/* Chtroom Topic */}
      <ChatroomTopic />

      {/* Message List */}
      <MessageList showChatroomTopic={showChatroomTopic} />

      {/* Input Box Flow */}
      <InputBoxContextProvider
        chatroomName={chatroomName}
        chatroomWithUser={chatroomWithUser}
        replyChatID={replyChatID}
        chatroomID={chatroomID}
        isUploadScreen={false}
        myRef={refInput}
        handleFileUpload={handleFileUpload}
        isEditable={isEditable}
        setIsEditable={(value: boolean) => {
          setIsEditable(value);
        }}
        isSecret={isSecret}
        chatroomType={chatroomType}
        currentChatroomTopic={currentChatroomTopic}
        isPrivateMember={chatroomDBDetails.isPrivateMember}
        chatRequestState={chatroomDBDetails.chatRequestState}
      >
        <MessageInput hintMessages={hintMessages}>
          <MessageInputBox />
        </MessageInput>
      </InputBoxContextProvider>
    </ChatRoom>
  );
}
