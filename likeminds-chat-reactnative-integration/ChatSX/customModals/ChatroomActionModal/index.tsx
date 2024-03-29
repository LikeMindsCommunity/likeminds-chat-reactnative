import { View, Text, Modal, Pressable, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "../../screens/ChatRoom/styles";
import { ChatroomActions } from "../../enums";
import {
  ChatroomContextValues,
  useChatroomContext,
} from "../../context/ChatroomContext";
import { onShare } from "../../shareUtils";
import {
  CustomisableMethodsContextProps,
  useCustomisableMethodsContext,
} from "../../context/CustomisableMethodsContext";
import { VIEW_PARTICIPANTS } from "../../constants/Screens";

const ChatroomActionModal = () => {
  const {
    joinChatroomProp,
    muteNotificationsProp,
    unmuteNotificationsProp,
    unblockMemberProp,
    showViewParticipants,
    showShareChatroom,
    showMuteNotifications,
    showJoinChatroom,
    showLeaveChatroom,
    showSecretLeaveChatroom,
    showUnmuteNotifications,
    showBlockMember,
    showUnBlockMember,
    showViewProfile,
  }: CustomisableMethodsContextProps = useCustomisableMethodsContext();
  const {
    chatroomID,
    chatroomType,
    chatroomDBDetails,
    navigation,
    isSecret,
    filteredChatroomActions,
    modalVisible,
    setModalVisible,
    handleModalClose,
    showWarningModal,
    joinChatroom,
    muteNotifications,
    unmuteNotifications,
    handleBlockMember,
    unblockMember,
    chatroomName,
  }: ChatroomContextValues = useChatroomContext();
  const updatedFilteredChatroomActions = filteredChatroomActions?.map(
    (item) => {
      if (
        item.id === ChatroomActions.VIEW_PARTICIPANTS &&
        showViewParticipants
      ) {
        return { id: item.id, title: item.title };
      }
      if (item.id === ChatroomActions.LEAVE_CHATROOM && showLeaveChatroom) {
        return { id: item.id, title: item.title };
      }
      if (
        item.id === ChatroomActions.LEAVE_SECRET_CHATROOM &&
        showSecretLeaveChatroom
      ) {
        return { id: item.id, title: item.title };
      }
      if (item.id === ChatroomActions.SHARE && showShareChatroom) {
        return { id: item.id, title: item.title };
      }
      if (
        item.id === ChatroomActions.MUTE_NOTIFICATIONS &&
        showMuteNotifications
      ) {
        return { id: item.id, title: item.title };
      }
      if (
        item.id === ChatroomActions.UNMUTE_NOTIFICATIONS &&
        showUnmuteNotifications
      ) {
        return { id: item.id, title: item.title };
      }
      if (item.id === ChatroomActions.JOIN_CHATROOM && showJoinChatroom) {
        return { id: item.id, title: item.title };
      }
      if (item.id === ChatroomActions.VIEW_PROFILE && showViewProfile) {
        return { id: item.id, title: item.title };
      }
      if (item.id === ChatroomActions.BLOCK_MEMBER && showBlockMember) {
        return { id: item.id, title: item.title };
      }
      if (item.id === ChatroomActions.UNBLOCK_MEMBER && showUnBlockMember) {
        return { id: item.id, title: item.title };
      }
      return { id: null, title: null };
    }
  );

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <Pressable style={styles.centeredView} onPress={handleModalClose}>
        <View>
          <Pressable onPress={() => {}} style={[styles.modalView]}>
            {updatedFilteredChatroomActions?.map((val: any, index: any) => {
              return (
                val?.title != null && (
                  <TouchableOpacity
                    onPress={async () => {
                      if (val?.id === ChatroomActions.VIEW_PARTICIPANTS) {
                        setModalVisible(false);
                        navigation.navigate(VIEW_PARTICIPANTS, {
                          chatroomID: chatroomID,
                          isSecret: isSecret,
                          chatroomName: chatroomName,
                        });
                      } else if (
                        val?.id === ChatroomActions.LEAVE_CHATROOM ||
                        val?.id === ChatroomActions.LEAVE_SECRET_CHATROOM
                      ) {
                        showWarningModal();
                        setModalVisible(false);
                      } else if (val?.id === ChatroomActions.JOIN_CHATROOM) {
                        if (!isSecret) {
                          joinChatroomProp
                            ? await joinChatroomProp()
                            : await joinChatroom();
                        }
                        setModalVisible(false);
                      } else if (
                        val?.id === ChatroomActions.MUTE_NOTIFICATIONS
                      ) {
                        muteNotificationsProp
                          ? await muteNotificationsProp()
                          : await muteNotifications();
                        setModalVisible(false);
                      } else if (
                        val?.id === ChatroomActions.UNMUTE_NOTIFICATIONS
                      ) {
                        unmuteNotificationsProp
                          ? await unmuteNotificationsProp()
                          : await unmuteNotifications();
                        setModalVisible(false);
                      } else if (val?.id === ChatroomActions.VIEW_PROFILE) {
                        //View Profile code
                      } else if (val?.id === ChatroomActions.BLOCK_MEMBER) {
                        await handleBlockMember();
                        setModalVisible(false);
                      } else if (val?.id === ChatroomActions.UNBLOCK_MEMBER) {
                        unblockMemberProp
                          ? await unblockMemberProp()
                          : await unblockMember();
                        setModalVisible(false);
                      } else if (val?.id === ChatroomActions.SHARE) {
                        //   Share flow
                        onShare(
                          chatroomID,
                          chatroomType,
                          chatroomDBDetails?.isSecret
                        );
                      }
                    }}
                    key={val?.id}
                    style={styles.filtersView}
                  >
                    <Text style={styles.filterText}>{val?.title}</Text>
                  </TouchableOpacity>
                )
              );
            })}
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

export default ChatroomActionModal;
