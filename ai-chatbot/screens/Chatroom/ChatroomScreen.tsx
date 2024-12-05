import React from 'react';
import {
  ChatRoom,
  ChatroomHeader,
  MessageList,
  MessageInput,
  useChatroomContext,
  useMessageListContext,
  useExploreFeedContext,
  ChatroomTopic
} from '@likeminds.community/chat-rn-core';
import {ReactionList} from '../../customisableComponents/ReactionList';
import ChatroomTabNavigator from '../../src/ChatroomTabNavigator';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

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
      'Sorry your rights has been disabled, contact you CM for more info!',
  };

  const {
    setChatroomTopic,
    leaveChatroom,
    leaveSecretChatroom,
    joinChatroom,
    joinSecretChatroom,
    muteNotifications,
    unmuteNotifications,
    showJoinAlert,
    showRejectAlert,
    onApprove,
    onReject,
    onTapToUndo,
    blockMember,
    unblockMember,
  } = useChatroomContext();
  const {scrollToBottom} = useMessageListContext();

  const customSetChatroomTopic = async () => {
    console.log('before custom chatroom topic');
    const response = await setChatroomTopic();
    console.log('response from custom chatroom topic', response);
  };
  const customLeaveChatroom = async () => {
    console.log('before custom leave chatroom');
    const response = await leaveChatroom();
    console.log('response after custom leave chatroom', response);
  };
  const customLeaveSecretChatroom = async () => {
    console.log('before custom leave secret chatroom');
    const response = await leaveSecretChatroom();
    console.log('response after custom leave secret chatroom', response);
  };
  const customJoinChatroom = async () => {
    console.log('before custom join chatroom');
    const response = await joinChatroom();
    console.log('response after custom join chatroom', response);
  };
  const customJoinSecretChatroom = async () => {
    console.log('before custom join secret chatroom');
    const response = await joinSecretChatroom();
    console.log('response after custom join secret chatroom', response);
  };
  const customMuteNotifications = async () => {
    console.log('before custom mute notifications');
    await muteNotifications();
    console.log('after custom mute notifications');
  };
  const customUnMuteNotifications = async () => {
    console.log('before custom un-mute notifications');
    await unmuteNotifications();
    console.log('after custom un-mute notifications');
  };
  const customShowJoinAlert = async () => {
    console.log('before custom show join alert');
    await showJoinAlert();
    console.log('after custom show join alert');
  };
  const customShowRejectAlert = async () => {
    console.log('before custom show reject alert');
    await showRejectAlert();
    console.log('after custom show reject alert');
  };
  const customOnApprove = async () => {
    console.log('before custom on approve dm request');
    const response = await onApprove();
    console.log('response after custom on approve dm request', response);
  };
  const customOnReject = async () => {
    console.log('before custom on reject dm request');
    const response = await onReject();
    console.log('response after custom on reject dm request', response);
  };
  const customOnTapToUndo = async () => {
    console.log('before custom on tap to undo');
    const response = await onTapToUndo();
    console.log('response after custom on tap to undo', response);
  };
  const customBlockMember = async () => {
    console.log('before custom block member');
    const response = await blockMember();
    console.log('response after custom block member', response);
  };
  const customUnBlockMember = async () => {
    console.log('before custom un-block member');
    const response = await unblockMember();
    console.log('response after custom un-block member', response);
  };
  const customScrollToBottom = async () => {
    console.log('before custom scroll to bottom');
    await scrollToBottom();
    console.log('after custom scroll to bottom');
  };

  const navigation = useNavigation<StackNavigationProp<any>>();

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
      setChatroomTopic={customSetChatroomTopic}
      leaveChatroom={customLeaveChatroom}
      leaveSecretChatroom={customLeaveSecretChatroom}
      joinChatroom={customJoinChatroom}
      muteNotifications={customMuteNotifications}
      unmuteNotifications={customUnMuteNotifications}
      onApprove={customOnApprove}
      onReject={customOnReject}
      blockMember={customBlockMember}
      unblockMember={customUnBlockMember}>
      {/* ChatroomHeader */}
      <ChatroomHeader showThreeDotsOnHeader={true} showThreeDotsOnSelectedHeader={true} />
      
      {/* Chtroom Topic */}
      <ChatroomTopic />

      {/* Message List */}
      <MessageList
        onTapToUndo={customOnTapToUndo}
        scrollToBottom={customScrollToBottom}
        showChatroomTopic={showChatroomTopic}
      />

      {/* Input Box Flow */}
      <MessageInput
        joinSecretChatroomProp={customJoinSecretChatroom}
        showJoinAlertProp={customShowJoinAlert}
        showRejectAlertProp={customShowRejectAlert}
        hintMessages={hintMessages}
      />
    </ChatRoom>
  );
}
