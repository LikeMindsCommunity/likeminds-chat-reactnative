import { TouchableOpacity, ImageStyle, Keyboard } from "react-native";
import React from "react";
import { LMChatIcon } from "../../uiComponents";
import { styles } from "../InputBox/styles";
import { useInputBoxContext } from "../../context/InputBoxContext";
import { ChatroomType } from "../../enums";
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
  } = useInputBoxContext();
  return (
    <>
      {!isUploadScreen &&
      !(
        chatRequestState === ChatroomType.OPENCHATROOM ||
        chatRequestState === null ||
        isUserChatbot
      ) &&
      !isEditable &&
      !voiceNotes?.recordTime &&
      !isDeleteAnimation ? (
        <TouchableOpacity
          style={[styles.emojiButton]}
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
            iconStyle={
              [
                styles.emoji,
                isUserChatbot
                  ? {
                      height: Layout.normalize(20),
                      width: Layout.normalize(20),
                    }
                  : null,
                inputBoxStyles?.attachmentIconStyles,
              ] as ImageStyle
            }
          />
        </TouchableOpacity>
      ) : null}
    </>
  );
};

export default AddFilesView;
