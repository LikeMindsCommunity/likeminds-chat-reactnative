
import { styles } from "../InputBox/styles";
import { TouchableOpacity, ImageStyle, Keyboard, StyleSheet } from "react-native";
import React from "react";
import { LMChatIcon } from "../../uiComponents";
import { useInputBoxContext } from "../../context/InputBoxContext";
import { ChatroomChatRequestState, ChatroomType } from "../../enums";
import Layout from "../../constants/Layout";

interface AddFilesViewProps {
  handleFilesViewProp?: () => void;
}

const AddFilesView = ({ handleFilesViewProp }: AddFilesViewProps) => {
  const {
    isUploadScreen,
    chatRequestState,
    isUserChatbot,
    isEditable,
    voiceNotes,
    isDeleteAnimation,
    setModalVisible,
    inputBoxStyles,
    chatroomType
  } = useInputBoxContext();

  // Combine the styles using StyleSheet.flatten to prevent overriding by STYLES
  const buttonStyle = StyleSheet.flatten([
    inputBoxStyles?.inputBoxViewStyles?.emojiButton,
    styles.emojiButton,
  ]);

  const iconStyle = StyleSheet.flatten([
    inputBoxStyles?.inputBoxViewStyles?.attachmentIconStyles,
    styles.emoji,
    isUserChatbot
      ? {
          height: Layout.normalize(20),
          width: Layout.normalize(20),
        }
      : null,
  ] as ImageStyle);

  return (
    <>
      {!isUploadScreen &&
      !isEditable &&
      !voiceNotes?.recordTime &&
      !isDeleteAnimation && !(chatroomType == ChatroomType.DMCHATROOM && chatRequestState == null) ? (
        <TouchableOpacity
          style={buttonStyle}
          onPress={() => {
            if (handleFilesViewProp) {
              handleFilesViewProp();
            } else {
              Keyboard.dismiss();
              setModalVisible(true);
            }
          }}
        >
          <LMChatIcon
            assetPath={
              isUserChatbot
                ? require("../../assets/images/chatbot_attachment_button3x.png")
                : require("../../assets/images/open_files3x.png")
            }
            iconStyle={iconStyle}
          />
        </TouchableOpacity>
      ) : null}
    </>
  );
};

export default AddFilesView;
