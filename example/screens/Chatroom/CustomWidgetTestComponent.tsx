import {TouchableOpacity, ImageStyle, StyleSheet} from 'react-native';
import React from 'react';
import {LMChatIcon} from '@likeminds.community/chat-rn-core/ChatSX/uiComponents';
import Layout from '@likeminds.community/chat-rn-core/ChatSX/constants/Layout';
import { useInputBoxContext } from '@likeminds.community/chat-rn-core';


const stylesNew = StyleSheet.create({
  emojiButton: {
    padding: Layout.normalize(10),
    position: 'absolute',
    right: 30,
  },
  emoji: {
    width: Layout.normalize(40),
    height: Layout.normalize(40),
    resizeMode: 'contain',
  },
});

export const CustomWidgetTestComponent = () => {
  const {
    isUploadScreen,
    chatRequestState,
    isEditable,
    voiceNotes,
    isDeleteAnimation,
    inputBoxStyles,
  } = useInputBoxContext();
  return (
    <>
      {!isUploadScreen &&
      !(chatRequestState === 0 || chatRequestState === null) &&
      !isEditable &&
      !voiceNotes?.recordTime &&
      !isDeleteAnimation ? (
        <TouchableOpacity
          style={[stylesNew.emojiButton]}
          onPress={()=>{

          }}>
          <LMChatIcon
            assetPath={require('../../assets/images/chatActive.png')}
            iconStyle={
              [
                stylesNew.emoji,
                inputBoxStyles?.attachmentIconStyles,
              ] as ImageStyle
            }
          />
        </TouchableOpacity>
      ) : null}
    </>
  );
};