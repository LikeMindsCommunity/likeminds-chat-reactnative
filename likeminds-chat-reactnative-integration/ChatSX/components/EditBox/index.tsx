import { View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { LMChatIcon } from "../../uiComponents";
import { ReplyBox } from "../ReplyConversations";
import { SELECTED_MESSAGES, SET_EDIT_MESSAGE } from "../../store/types/types";
import { useInputBoxContext } from "../../context/InputBoxContext";
import { useAppDispatch } from "../../store";
import { styles } from "../InputBox/styles"; // Importing existing styles

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
    inputBoxStyles, // Accessing dynamic styles from the context
  } = useInputBoxContext();
  const dispatch = useAppDispatch();

 

  const  editBoxStyles = inputBoxStyles?.editBoxStyles;
  return (
    <>
      {isEditable ? (
        <View
          style={StyleSheet.flatten([
            styles.replyBox, 
            editBoxStyles?.containerStyle, 
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
              editBoxStyles?.closeButtonStyle, 
            ])}
          >
            <LMChatIcon
              assetPath={
                editBoxStyles?.closeIconStyle?.assetPath ??
                require("../../assets/images/close_icon.png") 
              }
              height={editBoxStyles?.closeIconStyle?.height ?? 24} 
              width={editBoxStyles?.closeIconStyle?.width ?? 24} 
              iconStyle={StyleSheet.flatten([
                styles.replyCloseImg, 
                editBoxStyles?.closeIconStyle?.iconStyle,
              ])}
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </>
  );
};

export default EditBox;
