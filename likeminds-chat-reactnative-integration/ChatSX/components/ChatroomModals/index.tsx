import { View, Text } from "react-native";
import React from "react";
import ChatroomActionModal from "../../customModals/ChatroomActionModal";
import ReportActionModal from "../../customModals/ReportActionModal";
import MessageReactionModal from "../../customModals/MessageReactionModal";
import EmojiKeyboardModal from "../../customModals/EmojiKeyboardModal";
import WarningMessageModal from "../../customModals/WarningMessage";
import ApproveDMRequestModal from "../../customModals/ApproveDMRequest";
import RejectDMRequestModal from "../../customModals/RejectDMRequest";
import BlockDMRequestModal from "../../customModals/BlockDMRequest";

const ChatroomModals = () => {
  return (
    <View style={{position: 'absolute', zIndex: 10}}>
      {/* Chatroom Action Modal */}
      <ChatroomActionModal />

      {/* Report Action Modal */}
      <ReportActionModal />

      {/* Message Reaction Modal */}
      <MessageReactionModal />

      {/* Emoji Keyboard Modal */}
      <EmojiKeyboardModal />

      {/* CHATROOM LEAVING WARNING message modal */}
      <WarningMessageModal />

      {/* APPROVE DM request Modal */}
      <ApproveDMRequestModal />

      {/* REJECT DM request Modal */}
      <RejectDMRequestModal />

      {/* BLOCK DM request Modal */}
      <BlockDMRequestModal />
    </View>
  );
};

export default ChatroomModals;
