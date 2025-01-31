import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import LottieView from "../../optionalDependecies/LottieView";
import { styles } from "../InputBox/styles";
import Animated from "react-native-reanimated";
import {
  LMChatIcon,
  LMChatTextInput,
  LMChatTextView,
} from "../../uiComponents";
import {
  CAPITAL_GIF_TEXT,
  CHATBOT_MESSAGE_PLACEHOLDER,
  MESSAGE_BOX_PLACEHOLDER,
  SLIDE_TO_CANCEL,
} from "../../constants/Strings";
import STYLES from "../../constants/Styles";
import { useInputBoxContext } from "../../context/InputBoxContext";
import Layout from "../../constants/Layout";
import { ChatroomChatRequestState, ChatroomType } from "../../enums";

interface InputBoxViewwProps {
  handleStopRecordProp?: () => void;
  clearVoiceRecordProp?: () => void;
  onPausePlayProp?: () => void;
  onResumePlayProp?: () => void;
  handleGifProp?: () => void;
}

const InputBoxView = ({
  handleStopRecordProp,
  clearVoiceRecordProp,
  onPausePlayProp,
  onResumePlayProp,
  handleGifProp,
}: InputBoxViewwProps) => {
  const {
    isEditable,
    voiceNotes,
    isVoiceResult,
    isDeleteAnimation,
    micIconOpacity,
    isRecordingLocked,
    handleStopRecord,
    clearVoiceRecord,
    isVoiceNotePlaying,
    onPausePlay,
    voiceNotesPlayer,
    onResumePlay,
    startPlay,
    voiceNotesLink,
    isUploadScreen,
    chatRequestState,
    GIFPicker,
    GiphyDialog,
    inputBoxStyles,
    inputHeight,
    message,
    myRef,
    handleInputChange,
    setInputHeight,
    MAX_LENGTH,
    isUserChatbot,
    chatroomType,
  } = useInputBoxContext();

  const inputBoxViewStyles = inputBoxStyles?.inputBoxViewStyles;

  return (
    <>
      {isDeleteAnimation && LottieView ? (
        <View
          style={StyleSheet.flatten([
            styles.voiceNotesInputParent,
            styles.voiceRecorderInput,
            {
              paddingVertical: 0,
              marginVertical: 0,
              marginHorizontal: Layout.normalize(10),
            },
            inputBoxViewStyles?.voiceNotesInputParent, 
          ])}
        >
          <View style={styles.alignItems}>
            <LottieView
              source={require("../../assets/lottieJSON/delete.json")}
              style={{ height: 40, width: 40 }}
              autoPlay
            />
          </View>
        </View>
      ) : !!voiceNotes?.recordTime && !isVoiceResult ? (
        <View
          style={StyleSheet.flatten([
            styles.voiceNotesInputParent,
            styles.voiceRecorderInput,
            inputBoxViewStyles?.voiceNotesInputParent, 
          ])}
        >
          <View style={styles.alignItems}>
            <Animated.View style={[{ opacity: micIconOpacity }]}>
              <LMChatIcon
                assetPath={require("../../assets/images/record_icon3x.png")}
                iconStyle={StyleSheet.flatten([
                  styles.emoji,
                  inputBoxViewStyles?.emoji, 
                ])}
              />
            </Animated.View>
            <LMChatTextView
              textStyle={StyleSheet.flatten([
                styles.recordTitle,
                inputBoxViewStyles?.recordTitle, 
              ])}
            >
              {voiceNotes.recordTime}
            </LMChatTextView>
          </View>
          {isRecordingLocked ? (
            <View style={styles.alignItems}>
              <TouchableOpacity
                onPress={
                  handleStopRecordProp ? handleStopRecordProp : handleStopRecord
                }
              >
                <LMChatIcon
                  assetPath={require("../../assets/images/stop_recording_icon3x.png")}
                  iconStyle={StyleSheet.flatten([
                    styles.emoji,
                    inputBoxViewStyles?.emoji, 
                  ])}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={
                  clearVoiceRecordProp ? clearVoiceRecordProp : clearVoiceRecord
                }
              >
                <LMChatIcon
                  assetPath={require("../../assets/images/cross_circle_icon3x.png")}
                  iconStyle={StyleSheet.flatten([
                    styles.emoji,
                    inputBoxViewStyles?.emoji, 
                  ])}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.alignItems}>
              <LMChatIcon
                assetPath={require("../../assets/images/left_chevron_icon3x.png")}
                iconStyle={StyleSheet.flatten([
                  styles.chevron,
                  inputBoxViewStyles?.chevron, 
                ])}
              />
              <LMChatTextView
                textStyle={StyleSheet.flatten([
                  styles.recordTitle,
                  inputBoxViewStyles?.recordTitle, 
                ])}
              >
                {SLIDE_TO_CANCEL}
              </LMChatTextView>
            </View>
          )}
        </View>
      ) : isVoiceResult ? (
        <View
          style={StyleSheet.flatten([
            styles.voiceNotesInputParent,
            styles.voiceRecorderInput,
            inputBoxViewStyles?.voiceNotesInputParent, 
          ])}
        >
          <View style={styles.alignItems}>
            {isVoiceNotePlaying ? (
              <TouchableOpacity
                onPress={() => {
                  if (onPausePlayProp) {
                    onPausePlayProp();
                  } else {
                    onPausePlay();
                  }
                }}
              >
                <LMChatIcon
                  assetPath={require("../../assets/images/pause_icon3x.png")}
                  iconStyle={StyleSheet.flatten([
                    styles.emoji,
                    inputBoxViewStyles?.emoji, 
                  ])}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  if (onResumePlayProp) {
                    onResumePlayProp();
                  } else {
                    if (voiceNotesPlayer?.playTime !== "") {
                      onResumePlay();
                    } else {
                      startPlay(voiceNotesLink);
                    }
                  }
                }}
              >
                <LMChatIcon
                  assetPath={require("../../assets/images/play_icon3x.png")}
                  iconStyle={StyleSheet.flatten([
                    styles.emoji,
                    inputBoxViewStyles?.emoji, 
                  ])}
                />
              </TouchableOpacity>
            )}
            {isVoiceNotePlaying || voiceNotesPlayer?.playTime ? (
              <LMChatTextView
                textStyle={StyleSheet.flatten([
                  styles.recordTitle,
                  inputBoxViewStyles?.recordTitle, 
                ])}
              >
                {voiceNotesPlayer?.playTime}
              </LMChatTextView>
            ) : (
              <LMChatTextView
                textStyle={StyleSheet.flatten([
                  styles.recordTitle,
                  inputBoxViewStyles?.recordTitle, 
                ])}
              >
                {voiceNotes?.recordTime}
              </LMChatTextView>
            )}
          </View>
          <TouchableOpacity
            onPress={
              clearVoiceRecordProp ? clearVoiceRecordProp : clearVoiceRecord
            }
            style={styles.alignItems}
          >
            <LMChatIcon
              assetPath={require("../../assets/images/cross_circle_icon3x.png")}
              iconStyle={StyleSheet.flatten([
                styles.emoji,
                inputBoxViewStyles?.emoji, 
              ])}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={StyleSheet.flatten([
            styles.inputParent,
            isUploadScreen
              ? { marginHorizontal: Layout.normalize(5) }
              : { marginHorizontal: Layout.normalize(15) },
            inputBoxViewStyles?.inputParent, 
          ])}
        >
          {!isUploadScreen &&
          !(chatRequestState === ChatroomChatRequestState.INITIATED ||
            (chatroomType == ChatroomType.DMCHATROOM && chatRequestState == null)) &&
          !isEditable &&
          !voiceNotes?.recordTime &&
          !isDeleteAnimation ? (
            GIFPicker && !isUserChatbot ? (
              <TouchableOpacity
                style={StyleSheet.flatten([
                  styles.gifView,
                  inputBoxViewStyles?.gifView, 
                ])}
                onPress={() => {
                  if (handleGifProp) {
                    handleGifProp();
                  } else {
                    GiphyDialog.show();
                  }
                }}
              >
                <LMChatTextView
                  textStyle={StyleSheet.flatten([
                    styles.gifText,
                    inputBoxViewStyles?.gifText, 
                  ])}
                >
                  {CAPITAL_GIF_TEXT}
                </LMChatTextView>
              </TouchableOpacity>
            ) : null
          ) : null}
          <LMChatTextInput
            placeholderText={
              inputBoxStyles?.placeholderText
                ? inputBoxStyles?.placeholderText
                : isUserChatbot
                ? CHATBOT_MESSAGE_PLACEHOLDER
                : MESSAGE_BOX_PLACEHOLDER
            }
            placeholderTextColor={inputBoxStyles?.placeholderTextColor}
            plainTextStyle={StyleSheet.flatten([
              inputBoxStyles?.plainTextStyle,
              {
                color: isUploadScreen
                  ? STYLES.$BACKGROUND_COLORS.LIGHT
                  : STYLES.$BACKGROUND_COLORS.DARK,
              },
            ])}
            style={StyleSheet.flatten([
              styles.input,
              inputBoxStyles?.inputTextStyle,
              {
                height: Math.max(25, inputHeight),
                color: isUploadScreen
                  ? STYLES.$BACKGROUND_COLORS.LIGHT
                  : STYLES.$BACKGROUND_COLORS.DARK,
              },
            ])}
            onContentSizeChange={(event) => {
              setInputHeight(event.nativeEvent.contentSize.height);
            }}
            multilineField
            inputRef={myRef}
            onType={handleInputChange}
            autoFocus={false}
            selectionColor={inputBoxStyles?.selectionColor}
            partTypes={[
              {
                trigger: "@",
                textStyle: inputBoxStyles?.partsTextStyle
                  ? inputBoxStyles?.partsTextStyle
                  : { color: "#0276fa" }, 
              },
            ]}
            inputText={message}
            maxLength={
              chatroomType == ChatroomType.DMCHATROOM &&
              (chatRequestState === 0 || chatRequestState === null)
                ? MAX_LENGTH
                : undefined
            }
          />
        </View>
      )}
    </>
  );
};

export default InputBoxView;
