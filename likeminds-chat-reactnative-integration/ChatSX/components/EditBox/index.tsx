import { View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { LMChatIcon } from "../../uiComponents";
import { ReplyBox } from "../ReplyConversations";
import { SELECTED_MESSAGES, SET_EDIT_MESSAGE } from "../../store/types/types";
import { useInputBoxContext } from "../../context/InputBoxContext";
import { useAppDispatch } from "../../store";
import { styles } from "../InputBox/styles"; 


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
    inputBoxStyles, 
  } = useInputBoxContext();
  const dispatch = useAppDispatch();

  return (
    <>
      {isEditable ? (
        <View
          style={StyleSheet.flatten([
            styles.replyBox, 
            inputBoxStyles?.editBoxStyles?.containerStyle, 
          ])}
        >
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
            style={StyleSheet.flatten([
              styles.replyBoxClose, 
              inputBoxStyles?.editBoxStyles?.closeButtonStyle, 
            ])}
          >
            <LMChatIcon
              assetPath={require("../../assets/images/close_icon.png")}
              iconStyle={StyleSheet.flatten([
                styles.replyCloseImg, 
                inputBoxStyles?.editBoxStyles?.closeIconStyle,
              ])}
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </>
  );
};

export default EditBox;
