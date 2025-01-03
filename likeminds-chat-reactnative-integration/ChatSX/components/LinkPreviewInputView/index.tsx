import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import LinkPreviewInputBox from "../linkPreviewInputBox";
import { LMChatIcon } from "../../uiComponents";
import { styles } from "../InputBox/styles";
import { useInputBoxContext } from "../../context/InputBoxContext";

interface LinkPreviewInputViewProps {
  handleLinkPreviewCloseProp?: () => void;
}

const LinkPreviewInputView = ({
  handleLinkPreviewCloseProp,
}: LinkPreviewInputViewProps) => {
  const {
    ogTagsState,
    showLinkPreview,
    closedOnce,
    isUploadScreen,
    setShowLinkPreview,
    setClosedOnce,
    setClosedPreview,
  } = useInputBoxContext();
  return (
    <>
      {Object.keys(ogTagsState || {}).length !== 0 &&
      showLinkPreview &&
      !closedOnce ? (
        <View
          style={[
            styles.taggableUsersBox,
            {
              backgroundColor: isUploadScreen ? "black" : "white",
            },
          ]}
        >
          <LinkPreviewInputBox ogTags={ogTagsState} />
          <TouchableOpacity
            onPress={() => {
              if (handleLinkPreviewCloseProp) {
                handleLinkPreviewCloseProp();
              } else {
                setShowLinkPreview(false);
                setClosedOnce(true);
                setClosedPreview(true);
              }
            }}
            style={styles.replyBoxClose}
          >
            <LMChatIcon
              assetPath={require("../../assets/images/close_icon.png")}
              iconStyle={styles.replyCloseImg}
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </>
  );
};

export default LinkPreviewInputView;
