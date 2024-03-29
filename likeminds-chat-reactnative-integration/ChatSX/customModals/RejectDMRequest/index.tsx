import { View, Text, Modal, Pressable, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "../styles";
import {
  REJECT_BUTTON,
  REJECT_DM_REQUEST,
  REJECT_REQUEST_MESSAGE,
  REPORT_AND_REJECT_BUTTON,
} from "../../constants/Strings";
import { REPORT } from "../../constants/Screens";
import { ChatroomType } from "../../enums";
import {
  ChatroomContextValues,
  useChatroomContext,
} from "../../context/ChatroomContext";
import {
  CustomisableMethodsContextProps,
  useCustomisableMethodsContext,
} from "../../context/CustomisableMethodsContext";

const RejectDMRequestModal = () => {
  const { onRejectProp }: CustomisableMethodsContextProps =
    useCustomisableMethodsContext();
  const {
    navigation,
    chatroomID,
    chatroomType,
    DMRejectAlertModalVisible,

    onReject,
    hideDMRejectAlert,
  }: ChatroomContextValues = useChatroomContext();
  return (
    <Modal
      visible={DMRejectAlertModalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={hideDMRejectAlert}
    >
      <Pressable style={styles.modal} onPress={hideDMRejectAlert}>
        <Pressable onPress={() => {}} style={styles.modalContainer}>
          <Text style={styles.title}>{REJECT_DM_REQUEST}</Text>
          <Text style={styles.message}>{REJECT_REQUEST_MESSAGE}</Text>
          <View style={styles.rejectButtonContainer}>
            <TouchableOpacity
              style={[styles.rejectButton, styles.cancelButton]}
              onPress={() => {
                onRejectProp ? onRejectProp() : onReject();
                hideDMRejectAlert();
              }}
            >
              <Text style={[styles.buttonText]}>{REJECT_BUTTON}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.rejectButton, styles.cancelButton]}
              onPress={hideDMRejectAlert}
            >
              <Text style={[styles.buttonText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.rejectButton, styles.okButton]}
              onPress={() => {
                onRejectProp ? onRejectProp() : onReject();
                navigation.navigate(REPORT, {
                  conversationID: chatroomID,
                  isDM: chatroomType === ChatroomType.DMCHATROOM ? true : false,
                });
                hideDMRejectAlert();
              }}
            >
              <Text style={styles.buttonText}>{REPORT_AND_REJECT_BUTTON}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default RejectDMRequestModal;
