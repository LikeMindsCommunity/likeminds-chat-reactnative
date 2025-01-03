import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { LMChatIcon } from "../../uiComponents";
import { ReplyBox } from "../ReplyConversations";
import { styles } from "../InputBox/styles";
import { SELECTED_MESSAGES, SET_EDIT_MESSAGE } from "../../store/types/types";
import { useInputBoxContext } from "../../context/InputBoxContext";
import { useAppDispatch } from "../../store";

interface EditBoxProps {
  handleEditBoxCloseProp?: () => void;
}

const EditBox = ({ handleEditBoxCloseProp }: EditBoxProps) => {
  const {
    setIsEditable,
    setMessage,
    isEditable,
    chatroomName,
    editConversation,
  } = useInputBoxContext();
  const dispatch = useAppDispatch();
  return (
    <>
      {isEditable ? (
        <View style={styles.replyBox}>
          <ReplyBox
            isIncluded={false}
            item={editConversation}
            chatroomName={chatroomName}
          />
          <TouchableOpacity
            onPress={() => {
              if (handleEditBoxCloseProp) {
                handleEditBoxCloseProp();
              } else {
                setIsEditable(false);
                setMessage("");
                dispatch({
                  type: SET_EDIT_MESSAGE,
                  body: {
                    editConversation: "",
                  },
                });
                dispatch({
                  type: SELECTED_MESSAGES,
                  body: [],
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
      ) : null}
    </>
  );
};

export default EditBox;
