
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

  return (
    <>
      {isReply && !isUploadScreen && (
        <View
          style={StyleSheet.flatten([
            styles.replyBox, 
            inputBoxStyles?.replyBoxViewStyles?.replyBox, 
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
              inputBoxStyles?.replyBoxViewStyles?.replyBoxClose, 
            ])}
          >
            <LMChatIcon
              assetPath={require("../../assets/images/close_icon.png")}
              iconStyle={StyleSheet.flatten([
                styles.replyCloseImg, 
                inputBoxStyles?.replyBoxViewStyles?.replyCloseImg, 
              ])}
            />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default ReplyBoxView;
