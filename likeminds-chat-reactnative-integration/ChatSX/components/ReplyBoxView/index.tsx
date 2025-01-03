import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ReplyBox } from "../ReplyConversations";
import { LMChatIcon } from "../../uiComponents";
import { styles } from "../InputBox/styles";
import { SET_IS_REPLY, SET_REPLY_MESSAGE } from "../../store/types/types";
import { useInputBoxContext } from "../../context/InputBoxContext";
import { useAppDispatch } from "../../store";

interface ReplyBoxViewProps {
  handleReplyBoxCloseProp?: () => void;
}

const ReplyBoxView = ({ handleReplyBoxCloseProp }: ReplyBoxViewProps) => {
  const { isReply, isUploadScreen, replyMessage, chatroomName } =
    useInputBoxContext();
  const dispatch = useAppDispatch();
  return (
    <>
      {isReply && !isUploadScreen && (
        <View style={styles.replyBox}>
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
            style={styles.replyBoxClose}
          >
            <LMChatIcon
              assetPath={require("../../assets/images/close_icon.png")}
              iconStyle={styles.replyCloseImg}
            />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default ReplyBoxView;
