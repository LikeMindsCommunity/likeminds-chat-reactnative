import {
  View,
  Text,
  TouchableOpacity,
  ImageStyle,
  Vibration,
  Pressable,
} from "react-native";
import React from "react";
import { VOICE_NOTE_TEXT } from "../../constants/Strings";
import { styles } from "../InputBox/styles";
import { LMChatIcon } from "../../uiComponents";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useInputBoxContext } from "../../context/InputBoxContext";
import { ChatroomType } from "../../enums";

export interface OnSendMessageProp {
  message: string;
  metaData?: Record<string, any>;
  voiceNote?: any;
  isSendWhileVoiceNoteRecorderPlayerRunning?: boolean;
}
interface RecordSendInputFabViewProp {
  onSendMessageProp?: ({
    message,
    metaData,
    voiceNote,
    isSendWhileVoiceNoteRecorderPlayerRunning,
  }: OnSendMessageProp) => void;
}

const RecordSendInputFabView = ({
  onSendMessageProp,
}: RecordSendInputFabViewProp) => {
  const {
    isUploadScreen,
    chatRequestState,
    isEditable,
    voiceNotes,
    message,
    isVoiceResult,
    inputBoxStyles,
    isRecordingLocked,
    chatroomType,
    isPrivateMember,
    sendDmRequest,
    onEdit,
    voiceNotesLink,
    isIOS,
    isVoiceNoteRecording,
    stopRecord,
    onSend,
    stopPlay,
    metaData,
    isVoiceNotePlaying,
    isRecordingPermission,
    AudioRecorder,
    AudioPlayer,
    composedGesture,
    lockAnimatedStyles,
    upChevronAnimatedStyles,
    panStyle,
    askPermission,
    setIsVoiceNoteIconPress,
    isUserChatbot,
  } = useInputBoxContext();
  return (
    <>
      {/* {
          is message ||
          is voice recorded ||
          is File upload screen ||
          is recording locked ||
          is first DM message
        } */}
      {!!message ||
      isVoiceResult ||
      isUploadScreen ||
      isRecordingLocked ||
      (chatroomType === ChatroomType.DMCHATROOM &&
        chatRequestState === null) ? (
        <TouchableOpacity
          onPressOut={async () => {
            if (
              chatroomType === ChatroomType.DMCHATROOM && // if DM
              chatRequestState === null &&
              isPrivateMember && // isPrivateMember = false when none of the member on both sides is CM.
              !!message
            ) {
              sendDmRequest();
            } else {
              if (isEditable) {
                onEdit();
              } else {
                const voiceNote = [
                  {
                    uri: voiceNotesLink,
                    type: VOICE_NOTE_TEXT,
                    name: `${voiceNotes.name}.${isIOS ? "m4a" : "mp3"}`,
                    duration: Math.floor(voiceNotes.recordSecs / 1000),
                  },
                ];
                if (isVoiceNoteRecording) {
                  await stopRecord();
                  if (onSendMessageProp) {
                    onSendMessageProp({
                      message,
                      metaData,
                      voiceNote,
                      isSendWhileVoiceNoteRecorderPlayerRunning: true,
                    });
                  } else {
                    onSend(message, metaData, voiceNote, true);
                  }
                } else if (isVoiceNotePlaying) {
                  await stopPlay();
                  if (onSendMessageProp) {
                    onSendMessageProp({
                      message,
                      metaData,
                      voiceNote,
                      isSendWhileVoiceNoteRecorderPlayerRunning: true,
                    });
                  } else {
                    onSend(message, metaData, voiceNote, true);
                  }
                } else {
                  if (onSendMessageProp) {
                    onSendMessageProp({ message, metaData });
                  } else {
                    onSend(message, metaData);
                  }
                }
              }
            }
          }}
          style={styles.sendButton}
        >
          <LMChatIcon
            assetPath={require("../../assets/images/send_button3x.png")}
            iconStyle={
              [styles.send, inputBoxStyles?.sendIconStyles] as ImageStyle
            }
          />
        </TouchableOpacity>
      ) : (
        <View>
          {isRecordingPermission &&
          AudioRecorder &&
          AudioPlayer &&
          !isUserChatbot ? (
            <GestureDetector gesture={composedGesture}>
              <Animated.View>
                {voiceNotes.recordTime && !isRecordingLocked && (
                  <View
                    style={[styles.lockRecording, styles.inputBoxWithShadow]}
                  >
                    <Animated.View style={lockAnimatedStyles}>
                      <LMChatIcon
                        assetPath={require("../../assets/images/lock_icon3x.png")}
                        iconStyle={styles.lockIconStyle}
                      />
                    </Animated.View>
                    <Animated.View style={upChevronAnimatedStyles}>
                      <LMChatIcon
                        assetPath={require("../../assets/images/up_chevron_icon3x.png")}
                        iconStyle={styles.chevronUpStyle}
                      />
                    </Animated.View>
                  </View>
                )}

                <Animated.View style={[styles.sendButton, panStyle]}>
                  <Pressable
                    onPress={() => {
                      setIsVoiceNoteIconPress(true);
                      Vibration.vibrate(0.5 * 100);
                    }}
                    style={[styles.sendButton, { position: "absolute" }]}
                  >
                    <LMChatIcon
                      assetPath={require("../../assets/images/mic_icon3x.png")}
                      iconStyle={
                        [
                          styles.mic,
                          inputBoxStyles?.micIconStyles,
                        ] as ImageStyle
                      }
                    />
                  </Pressable>
                </Animated.View>
              </Animated.View>
            </GestureDetector>
          ) : AudioRecorder && !isUserChatbot ? (
            <Animated.View style={[styles.sendButton, panStyle]}>
              <Pressable
                onPress={askPermission}
                onLongPress={askPermission}
                style={[styles.sendButton, { position: "absolute" }]}
              >
                <LMChatIcon
                  assetPath={require("../../assets/images/mic_icon3x.png")}
                  iconStyle={
                    [styles.mic, inputBoxStyles?.micIconStyles] as ImageStyle
                  }
                />
              </Pressable>
            </Animated.View>
          ) : (
            <TouchableOpacity style={styles.sendButton}>
              <LMChatIcon
                assetPath={require("../../assets/images/send_button3x.png")}
                iconStyle={
                  [styles.send, inputBoxStyles?.sendIconStyles] as ImageStyle
                }
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </>
  );
};

export default RecordSendInputFabView;
