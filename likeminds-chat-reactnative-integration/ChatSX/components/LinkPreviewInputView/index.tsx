import { View, Text, TouchableOpacity , StyleSheet} from "react-native";
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
    inputBoxStyles,
  } = useInputBoxContext();

  return (
    <>
      {Object.keys(ogTagsState || {}).length !== 0 &&
      showLinkPreview &&
      !closedOnce ? (
        <View
          style={StyleSheet.flatten([
            styles.taggableUsersBox, 
            inputBoxStyles?.linkPreviewInputViewStyles?.linkPreviewBox, 
            {
              backgroundColor: isUploadScreen
                ? "black"
                : inputBoxStyles?.linkPreviewInputViewStyles?.linkPreviewBox
                    ?.backgroundColor || "white",
            },
          ])}
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
            style={StyleSheet.flatten([
              styles.replyBoxClose, 
              inputBoxStyles?.linkPreviewInputViewStyles?.replyBoxClose, 
            ])}
          >
            <LMChatIcon
              assetPath={require("../../assets/images/close_icon.png")}
              iconStyle={StyleSheet.flatten([
                styles.replyCloseImg,
                inputBoxStyles?.linkPreviewInputViewStyles?.replyCloseImg,
              ])}
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </>
  );
};

export default LinkPreviewInputView;
