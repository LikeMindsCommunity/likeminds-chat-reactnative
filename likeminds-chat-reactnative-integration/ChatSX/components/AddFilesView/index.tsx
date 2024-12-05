import { TouchableOpacity, ImageStyle, Keyboard } from "react-native";
import React from "react";
import { LMChatIcon } from "../../uiComponents";
import { styles } from "../InputBox/styles";
import { useInputBoxContext } from "../../context/InputBoxContext";

const AddFilesView = () => {
  const {
    isUploadScreen,
    chatRequestState,
    isEditable,
    voiceNotes,
    isDeleteAnimation,
    setModalVisible,
    inputBoxStyles,
  } = useInputBoxContext();
  return (
    <>
      {!isUploadScreen &&
      !(chatRequestState === 0 || chatRequestState === null) &&
      !isEditable &&
      !voiceNotes?.recordTime &&
      !isDeleteAnimation ? (
        <TouchableOpacity
          style={[styles.emojiButton]}
          onPress={() => {
            Keyboard.dismiss();
            setModalVisible(true);
          }}
        >
          <LMChatIcon
            assetPath={require("../../assets/images/open_files3x.png")}
            iconStyle={
              [styles.emoji, inputBoxStyles?.attachmentIconStyles] as ImageStyle
            }
          />
        </TouchableOpacity>
      ) : null}
    </>
  );
};

export default AddFilesView;
