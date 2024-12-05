import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { LMChatIcon } from "../../uiComponents";
import { styles } from "../InputBox/styles";
import { useInputBoxContext } from "../../context/InputBoxContext";

const AddMoreFilesView = () => {
  const { isUploadScreen, isDoc, isGif, selectGallery, selectDoc } =
    useInputBoxContext();
  return (
    <>
      {!!isUploadScreen && !isDoc && !isGif ? (
        <TouchableOpacity
          style={styles.addMoreButton}
          onPress={() => {
            selectGallery();
          }}
        >
          <LMChatIcon
            assetPath={require("../../assets/images/addImages3x.png")}
            iconStyle={styles.emoji}
          />
        </TouchableOpacity>
      ) : !!isUploadScreen && !!isDoc && !isGif ? (
        <TouchableOpacity
          style={styles.addMoreButton}
          onPress={() => {
            selectDoc();
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
