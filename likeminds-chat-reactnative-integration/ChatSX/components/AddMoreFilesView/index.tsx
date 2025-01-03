import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { LMChatIcon } from "../../uiComponents";
import { styles } from "../InputBox/styles";
import { useInputBoxContext } from "../../context/InputBoxContext";
import { ChatroomType } from "../../enums";

interface AddMoreFilesViewProps {
  handleGalleryProp?: () => void;
  handleDocumentProp?: () => void;
}

const AddMoreFilesView = ({
  handleGalleryProp,
  handleDocumentProp,
}: AddMoreFilesViewProps) => {
  const {
    isUploadScreen,
    isDoc,
    isGif,
    selectGallery,
    selectDoc,
    isUserChatbot,
    chatroomType,
  } = useInputBoxContext();
  return (
    <>
      {!!isUploadScreen &&
      !isDoc &&
      !isGif &&
      !(chatroomType == ChatroomType.DMCHATROOM && isUserChatbot) ? (
        <TouchableOpacity
          style={styles.addMoreButton}
          onPress={() => {
            if (handleGalleryProp) {
              handleGalleryProp();
            } else {
              selectGallery();
            }
          }}
        >
          <LMChatIcon
            assetPath={require("../../assets/images/addImages3x.png")}
            iconStyle={styles.emoji}
          />
        </TouchableOpacity>
      ) : !!isUploadScreen &&
        !isDoc &&
        !isGif &&
        !(chatroomType == ChatroomType.DMCHATROOM && isUserChatbot) ? (
        <TouchableOpacity
          style={styles.addMoreButton}
          onPress={() => {
            if (handleDocumentProp) {
              handleDocumentProp();
            } else {
              selectDoc();
            }
          }}
        >
          <LMChatIcon
            assetPath={require("../../assets/images/add_more_docs3x.png")}
            iconStyle={styles.emoji}
          />
        </TouchableOpacity>
      ) : isUploadScreen ? (
        <View style={styles.paddingHorizontal} />
      ) : null}
    </>
  );
};

export default AddMoreFilesView;
