import { View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import LinkPreviewInputBox from "../linkPreviewInputBox";
import { LMChatIcon } from "../../uiComponents";
import { styles } from "../InputBox/styles";
import { useInputBoxContext } from "../../context/InputBoxContext";

interface LinkPreviewInputViewProps {
  handleLinkPreviewCloseProp?: () => void;
}

const LinkPreviewInputView = ({ handleLinkPreviewCloseProp }: LinkPreviewInputViewProps) => {
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

  const linkPreviewStyles = inputBoxStyles?.linkPreviewInputViewStyles;

  return (
    <>
      {Object.keys(ogTagsState || {}).length !== 0 && showLinkPreview && !closedOnce ? (
        <View
          style={StyleSheet.flatten([
            styles.taggableUsersBox,
            linkPreviewStyles?.linkPreviewBox,
            {
              backgroundColor: isUploadScreen
                ? "black"
                : linkPreviewStyles?.linkPreviewBox?.backgroundColor || "white",
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
              linkPreviewStyles?.replyBoxClose,
            ])}
          >
            <LMChatIcon
              iconUrl={linkPreviewStyles?.replyCloseImg?.iconUrl}
              assetPath={
                linkPreviewStyles?.replyCloseImg?.assetPath ??
                require("../../assets/images/close_icon.png") // Default icon
              }
              color={linkPreviewStyles?.replyCloseImg?.color}
              height={linkPreviewStyles?.replyCloseImg?.height ?? 24} // Default height
              width={linkPreviewStyles?.replyCloseImg?.width ?? 24} // Default width
              iconStyle={StyleSheet.flatten([
                styles.replyCloseImg,
                linkPreviewStyles?.replyCloseImg?.iconStyle,
              ])}
              boxFit={linkPreviewStyles?.replyCloseImg?.boxFit}
              boxStyle={linkPreviewStyles?.replyCloseImg?.boxStyle}
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </>
  );
};

export default LinkPreviewInputView;
