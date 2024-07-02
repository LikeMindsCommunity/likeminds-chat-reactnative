import { View, Image, Pressable, TouchableOpacity } from "react-native";
import React from "react";
import { generateGifString } from "../../commonFuctions";
import STYLES from "../../constants/Styles";

import { useAppSelector } from "../../store";
import { AUDIO_TEXT, GIF_TEXT } from "../../constants/Strings";
import { useMessageContext } from "../../context/MessageContext";
import Layout from "../../constants/Layout";
import MessageHeader from "../MessageHeader";
import MessageText from "../MessageText";
import MessageFooter from "../MessageFooter";
import { useCustomComponentsContext } from "../../context/CustomComponentContextProvider";
import { useAttachmentConversationContext } from "../../context/AttachmentConversationContext";
import { styles } from "../AttachmentConversations/styles";
import { ImageVideoConversationView } from "../ImageVideoConversationView";
import { NavigateToProfileParams } from "../../callBacks/type";
import { CallBack } from "../../callBacks/callBackClass";

const ImageVideoConversation = () => {
  const {
    isIncluded,
    item,
    isTypeSent,
    handleLongPress,
    handleOnPress: openKeyboard,
    isItemIncludedInStateArr,
  } = useMessageContext();

  const { customMessageHeader, customMessageFooter } =
    useCustomComponentsContext();

  let firstAttachment = item?.attachments[0];

  const isGif = firstAttachment?.type === GIF_TEXT;
  const isAnswer = isGif ? !!generateGifString(item?.answer) : !!item?.answer;
  const { user } = useAppSelector((state) => state.homefeed);
  const { isReply, isReplyConversation } = useAttachmentConversationContext();

  const chatBubbleStyles = STYLES.$CHAT_BUBBLE_STYLE;

  //styling props
  const borderRadius = chatBubbleStyles?.borderRadius;
  const sentMessageBackgroundColor =
    chatBubbleStyles?.sentMessageBackgroundColor;
  const receivedMessageBackgroundColor =
    chatBubbleStyles?.receivedMessageBackgroundColor;
  const selectedMessageBackgroundColor =
    chatBubbleStyles?.selectedMessageBackgroundColor;

  const SELECTED_BACKGROUND_COLOR = selectedMessageBackgroundColor
    ? selectedMessageBackgroundColor
    : STYLES.$COLORS.SELECTED_BLUE;
  // styling props ended

  const delayLongPress = 200;

  const lmChatInterface = CallBack.lmChatInterface;

  return (
    <View style={styles.messageParent}>
      <View
        style={[
          styles.displayRow,
          {
            justifyContent: isTypeSent ? "flex-end" : "flex-start",
          },
        ]}
      >
        <View
          style={[
            styles.attachmentMessage,
            {
              width: isReplyConversation ? "100%" : "80%",
              padding: isReplyConversation ? 0 : 10,
            },
            borderRadius ? { borderRadius: borderRadius } : null,
            isTypeSent
              ? [
                  styles.sentMessage,
                  sentMessageBackgroundColor
                    ? { backgroundColor: sentMessageBackgroundColor }
                    : null,
                ]
              : [
                  styles.receivedMessage,
                  receivedMessageBackgroundColor
                    ? { backgroundColor: receivedMessageBackgroundColor }
                    : null,
                ],
            isIncluded ? { backgroundColor: SELECTED_BACKGROUND_COLOR } : null,
          ]}
        >
          {/* Message Header */}
          {item?.member?.id == user?.id?.toString() ||
          isReply ? null : customMessageHeader ? (
            customMessageHeader
          ) : (
            <MessageHeader />
          )}

          <ImageVideoConversationView />

          {/* Message text */}
          {isAnswer ? <MessageText /> : null}

          {/* Message Footer */}
          {customMessageFooter ? customMessageFooter : <MessageFooter />}
        </View>

        {/* Add reaction emoji */}
        {!isTypeSent && !(firstAttachment?.type === AUDIO_TEXT) ? (
          <Pressable
            onLongPress={handleLongPress}
            delayLongPress={delayLongPress}
            onPress={openKeyboard}
          >
            <Image
              style={{
                height: Layout.normalize(25),
                width: Layout.normalize(25),
                resizeMode: "contain",
              }}
              source={require("../../assets/images/add_more_emojis3x.png")}
            />
          </Pressable>
        ) : null}
      </View>

      {/* Sharp corner styles of a chat bubble */}
      {!isItemIncludedInStateArr ? (
        <View>
          {isTypeSent ? (
            <View
              style={[
                styles.typeSent,
                sentMessageBackgroundColor
                  ? {
                      borderBottomColor: sentMessageBackgroundColor,
                      borderLeftColor: sentMessageBackgroundColor,
                    }
                  : null,
                isIncluded
                  ? {
                      borderBottomColor: SELECTED_BACKGROUND_COLOR,
                      borderLeftColor: SELECTED_BACKGROUND_COLOR,
                    }
                  : null,
              ]}
            />
          ) : (
            <View
              style={[
                styles.typeReceived,
                receivedMessageBackgroundColor
                  ? {
                      borderBottomColor: receivedMessageBackgroundColor,
                      borderRightColor: receivedMessageBackgroundColor,
                    }
                  : null,
                isIncluded
                  ? {
                      borderBottomColor: SELECTED_BACKGROUND_COLOR,
                      borderRightColor: SELECTED_BACKGROUND_COLOR,
                    }
                  : null,
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  const params: NavigateToProfileParams = {
                    taggedUserId: null,
                    member: item?.member,
                  };
                  lmChatInterface.navigateToProfile(params);
                }}
              >
                <Image
                  source={
                    item?.member?.imageUrl
                      ? { uri: item?.member?.imageUrl }
                      : require("../../assets/images/default_pic.png")
                  }
                  style={styles.chatroomTopicAvatar}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
};

export default ImageVideoConversation;
