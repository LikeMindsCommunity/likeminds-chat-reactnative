import { View, Text, Modal, Pressable, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "../styles";
import {
  BLOCK_DM_REQUEST,
  CANCEL_BUTTON,
  CONFIRM_BUTTON,
} from "../../constants/Strings";
import {
  ChatroomContextValues,
  useChatroomContext,
} from "../../context/ChatroomContext";
import {
  CustomisableMethodsContextProps,
  useCustomisableMethodsContext,
} from "../../context/CustomisableMethodsContext";

const BlockDMRequestModal = () => {
  const { blockMemberProp }: CustomisableMethodsContextProps =
    useCustomisableMethodsContext();
  const {
    DMBlockAlertModalVisible,
    chatroomName,

    blockMember,
    hideDMBlockAlert,
  }: ChatroomContextValues = useChatroomContext();
  return (
    <Modal
      visible={DMBlockAlertModalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={hideDMBlockAlert}
    >
      <Pressable style={styles.modal} onPress={hideDMBlockAlert}>
        <Pressable onPress={() => {}} style={styles.modalContainer}>
          <Text style={styles.title}>{BLOCK_DM_REQUEST}</Text>
          <Text
            style={styles.message}
          >{`Are you sure you do not want to receive new messages from ${chatroomName}?`}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={hideDMBlockAlert}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                {CANCEL_BUTTON}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.okButton]}
              onPress={() => {
                blockMemberProp ? blockMemberProp() : blockMember();
                hideDMBlockAlert();
              }}
            >
              <Text style={styles.buttonText}>{CONFIRM_BUTTON}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default BlockDMRequestModal;
