import { View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { ReplyBox } from "../ReplyConversations";
import { LMChatIcon } from "../../uiComponents";
import { useInputBoxContext } from "../../context/InputBoxContext";
import { useAppDispatch } from "../../store";
import { SET_IS_REPLY, SET_REPLY_MESSAGE } from "../../store/types/types";
import { styles } from "../InputBox/styles";

interface ReplyBoxViewProps {
  handleReplyBoxCloseProp?: () => void;
}

const ReplyBoxView = ({ handleReplyBoxCloseProp }: ReplyBoxViewProps) => {
  const { isReply, isUploadScreen, replyMessage, chatroomName, inputBoxStyles } =
    useInputBoxContext();
  const dispatch = useAppDispatch();
  const replyBoxViewStyles = inputBoxStyles?.replyBoxViewStyles;

  return (
    <>
      {isReply && !isUploadScreen && (
        <View
          style={StyleSheet.flatten([
            styles.replyBox, 
            replyBoxViewStyles?.replyBox, // Updated here
          ])}
        >
          <ReplyBox
            isIncluded={false}
            item={replyMessage}
            chatroomName={chatroomName}
          />
          <TouchableOpacity
            onPress={() => {
              if (handleReplyBoxCloseProp) {
                handleReplyBoxCloseProp();
              } else {
                dispatch({ type: SET_IS_REPLY, body: { isReply: false } });
                dispatch({
                  type: SET_REPLY_MESSAGE,
                  body: { replyMessage: "" },
                });
              }
            }}
            style={StyleSheet.flatten([
              styles.replyBoxClose, 
              replyBoxViewStyles?.replyBoxClose, 
            ])}
          >
            <LMChatIcon
            assetPath={
            replyBoxViewStyles?.replyCloseImg?.assetPath ??
            require("../../assets/images/close_icon.png")
            }
                height={replyBoxViewStyles?.closeIconStyle?.height ?? 24} 
                width={replyBoxViewStyles?.closeIconStyle?.width ?? 24} 
                iconStyle={StyleSheet.flatten([
              styles.replyCloseImg, 
              replyBoxViewStyles?.replyCloseImg?.iconStyle, 
            ])}
          />

          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default ReplyBoxView;
