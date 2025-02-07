
import {styles} from '../styles';
import { View, Text, Modal, Pressable, TouchableOpacity } from "react-native";
import React from "react";
import {
  CANCEL_BUTTON,
  CONFIRM_BUTTON,
  DM_REQUEST_MESSAGE,
  SEND_DM_REQUEST,
} from "../../constants/Strings";
import { useInputBoxContext } from "../../context/InputBoxContext";
import { StyleSheet } from "react-native";

const SendDMRequestModal = ({
  hideDMSentAlert,
  DMSentAlertModalVisible,
  onSend,
  message,
}: any) => {
  const { inputBoxStyles } = useInputBoxContext(); // Use centralized styles
const sendDMRequestModalStyles= inputBoxStyles?.sendDMRequestModalStyles;
  return (
    <Modal
      visible={DMSentAlertModalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={hideDMSentAlert}
    >
      <Pressable
        style={StyleSheet.flatten([
          styles.modal,
          sendDMRequestModalStyles?.modal,
        ])}
        onPress={hideDMSentAlert}
      >
        <Pressable
          onPress={() => {}}
          style={StyleSheet.flatten([
            styles.modalContainer,
            sendDMRequestModalStyles?.modalContainer,
          ])}
        >
          <Text
            style={StyleSheet.flatten([
              styles.title,
              sendDMRequestModalStyles?.title,
            ])}
          >
            {SEND_DM_REQUEST}
          </Text>
          <Text
            style={StyleSheet.flatten([
              styles.message,
              sendDMRequestModalStyles?.message,
            ])}
          >
            {DM_REQUEST_MESSAGE}
          </Text>
          <View
            style={StyleSheet.flatten([
              styles.buttonContainer,
              sendDMRequestModalStyles?.buttonContainer,
            ])}
          >
            <TouchableOpacity
              style={StyleSheet.flatten([
                styles.button,
                styles.cancelButton,
                sendDMRequestModalStyles?.button,
                sendDMRequestModalStyles?.cancelButton,
              ])}
              onPress={hideDMSentAlert}
            >
              <Text
                style={StyleSheet.flatten([
                  styles.buttonText,
                  styles.cancelButtonText,
                  sendDMRequestModalStyles?.buttonText,
                  sendDMRequestModalStyles?.cancelButtonText,
                ])}
              >
                {CANCEL_BUTTON}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={StyleSheet.flatten([
                styles.button,
                styles.okButton,
                sendDMRequestModalStyles?.button,
                sendDMRequestModalStyles?.okButton,
              ])}
              onPress={() => {
                onSend(message);
                hideDMSentAlert();
              }}
            >
              <Text
                style={StyleSheet.flatten([
                  styles.buttonText,
                  sendDMRequestModalStyles?.buttonText,
                ])}
              >
                {CONFIRM_BUTTON}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default SendDMRequestModal;
