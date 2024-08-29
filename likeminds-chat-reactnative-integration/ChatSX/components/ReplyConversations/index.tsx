import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  TextStyle,
} from "react-native";
import React, { useEffect, useState } from "react";
import STYLES from "../../constants/Styles";
import { styles } from "./styles";
import { decode, generateGifString } from "../../commonFuctions";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  GET_CONVERSATIONS_SUCCESS,
  LONG_PRESSED,
  SELECTED_MESSAGES,
  SET_POSITION,
} from "../../store/types/types";
import {
  AUDIO_TEXT,
  CAPITAL_GIF_TEXT,
  DOCUMENT_STRING,
  GIF_TEXT,
  IMAGE_TEXT,
  NOT_SUPPORTED_TEXT,
  PDF_TEXT,
  PHOTO_STRING,
  VIDEO_STRING,
  VIDEO_TEXT,
  VOICE_NOTE_STRING,
  VOICE_NOTE_TEXT,
} from "../../constants/Strings";
import AttachmentConversations from "../AttachmentConversations";
import { getCurrentConversation } from "../../utils/chatroomUtils";
import { useMessageContext } from "../../context/MessageContext";
import { useChatroomContext } from "../../context/ChatroomContext";
import { useMessageListContext } from "../../context/MessageListContext";
import Layout from "../../constants/Layout";
import MessageHeader from "../MessageHeader";
import MessageFooter from "../MessageFooter";
import { useCustomComponentsContext } from "../../context/CustomComponentContextProvider";
import { NavigateToProfileParams } from "../../callBacks/type";
import { CallBack } from "../../callBacks/callBackClass";

interface ReplyConversations {
  item: any;
  isTypeSent: boolean;
  isIncluded: boolean;
  onScrollToIndex: any;
  openKeyboard: any;
  longPressOpenKeyboard: any;
  reactionArr: any;
  navigation: any;
  handleFileUpload: any;
  chatroomID: any;
  chatroomName: string;
  setIsReplyFound: React.Dispatch<React.SetStateAction<boolean>>;
  setReplyConversationId: React.Dispatch<React.SetStateAction<string>>;
}

interface ReplyBox {
  item: any;
  isIncluded?: boolean;
  chatroomName: string;
}

export const ReplyBox = ({ item, chatroomName }: ReplyBox) => {
  const { user } = useAppSelector((state) => state.homefeed);
  const isGif = item?.attachments[0]?.type === GIF_TEXT ? true : false;
  const answer = isGif ? generateGifString(item?.answer) : item?.answer;

  const chatBubbleStyles = STYLES.$CHAT_BUBBLE_STYLE;

  //styling props
  chatBubbleStyles?.receivedMessageBackgroundColor;
  const textStyles = chatBubbleStyles?.textStyles;
  const linkTextColor = chatBubbleStyles?.linkTextColor;
  const taggingTextColor = chatBubbleStyles?.taggingTextColor;
  //styling props ended

  return (
    <View style={styles.replyBox}>
      <View>
        <Text style={styles.replySender} numberOfLines={1}>
          {item?.member?.id == user?.id ? "You" : item?.member?.name}
        </Text>
      </View>
      <View style={styles.alignRow}>
        <Text numberOfLines={1} style={{ width: "100%" }}>
          <Text>
            {item?.hasFiles ? (
              item?.attachments[0]?.type === IMAGE_TEXT ? (
                <Image
                  source={require("../../assets/images/image_icon3x.png")}
                  style={styles.icon}
                />
              ) : item?.attachments[0]?.type === PDF_TEXT ? (
                <Image
                  source={require("../../assets/images/document_icon3x.png")}
                  style={styles.icon}
                />
              ) : item?.attachments[0]?.type === VIDEO_TEXT ? (
                <Image
                  source={require("../../assets/images/video_icon3x.png")}
                  style={styles.icon}
                />
              ) : item?.attachments[0]?.type === VOICE_NOTE_TEXT ? (
                <Image
                  source={require("../../assets/images/mic_icon3x.png")}
                  style={[styles.icon, { tintColor: "grey" }]}
                />
              ) : item?.attachments[0]?.type === GIF_TEXT ? (
                <View style={styles.gifView}>
                  <Text style={styles.gifText}>{CAPITAL_GIF_TEXT}</Text>
                </View>
              ) : Number(item?.state) === 10 ? (
                <Image
                  source={require("../../assets/images/poll_icon3x.png")}
                  style={[styles.icon, { tintColor: "grey" }]}
                />
              ) : item?.ogTags?.url != null ? (
                <Image
                  source={require("../../assets/images/link_icon.png")}
                  style={[styles.icon, { tintColor: "grey" }]}
                />
              ) : null
            ) : null}
          </Text>
          <Text
            style={
              [
                styles.messageText,
                textStyles ? { ...textStyles } : null,
              ] as TextStyle
            }
          >
            {decode({
              text: !!answer
                ? answer
                : item?.attachments[0]?.type === PDF_TEXT
                ? DOCUMENT_STRING
                : item?.attachments[0]?.type === IMAGE_TEXT
                ? PHOTO_STRING
                : item?.attachments[0]?.type === VIDEO_TEXT
                ? VIDEO_STRING
                : item?.attachments[0]?.type === VOICE_NOTE_TEXT
                ? VOICE_NOTE_STRING
                : item?.attachments[0]?.type === GIF_TEXT
                ? CAPITAL_GIF_TEXT
                : item?.attachments[0]?.type === AUDIO_TEXT
                ? NOT_SUPPORTED_TEXT
                : null,
              enableClick: false,
              chatroomName: chatroomName,
              communityId: user?.sdkClientInfo?.community,
              textStyles: textStyles,
              linkTextColor: linkTextColor,
              taggingTextColor: taggingTextColor,
            })}
          </Text>
          {!!item?.hasFiles && item?.attachments.length > 1 ? (
            <Text
              style={
                [
                  styles.messageText,
                  textStyles ? { ...textStyles } : null,
                ] as TextStyle
              }
            >{` (+${item?.attachments.length - 1} more)`}</Text>
          ) : null}
        </Text>
      </View>
    </View>
  );
};

const ReplyConversations = () => {
  const dispatch = useAppDispatch();
  const { conversations, selectedMessages, stateArr, isLongPress }: any =
    useAppSelector((state) => state.chatroom);
  const { customReplyBox } = useCustomComponentsContext();
  const { user } = useAppSelector((state) => state.homefeed);
  const [flashListMounted, setFlashListMounted] = useState(false);

  const chatBubbleStyles = STYLES.$CHAT_BUBBLE_STYLE;

  //styling props
  const borderRadius = chatBubbleStyles?.borderRadius;
  const sentMessageBackgroundColor =
    chatBubbleStyles?.sentMessageBackgroundColor;
  const receivedMessageBackgroundColor =
    chatBubbleStyles?.receivedMessageBackgroundColor;
  const selectedMessageBackgroundColor =
    chatBubbleStyles?.selectedMessageBackgroundColor;
  const textStyles = chatBubbleStyles?.textStyles;
  const linkTextColor = chatBubbleStyles?.linkTextColor;
  const taggingTextColor = chatBubbleStyles?.taggingTextColor;
  const messageReceivedHeader = chatBubbleStyles?.messageReceivedHeader;
  const senderNameStyles = messageReceivedHeader?.senderNameStyles;
  const senderDesignationStyles =
    messageReceivedHeader?.senderDesignationStyles;

  const SELECTED_BACKGROUND_COLOR = selectedMessageBackgroundColor
    ? selectedMessageBackgroundColor
    : STYLES.$COLORS.SELECTED_BLUE;
  // styling props ended

  const lmChatInterface = CallBack.lmChatInterface;

  const {
    isIncluded,
    item,
    isTypeSent,
    reactionArr,
    isItemIncludedInStateArr,

    handleLongPress,
    handleOnPress: openKeyboard,
  } = useMessageContext();

  const { chatroomID, chatroomName } = useChatroomContext();

  const { customMessageHeader, customMessageFooter } =
    useCustomComponentsContext();

  const { scrollToIndex, setReplyConversationId, setIsReplyFound } =
    useMessageListContext();

  const handleOnPress = async (event: any) => {
    const isStateIncluded = stateArr.includes(item?.state);
    if (isLongPress) {
      if (isIncluded) {
        const filterdMessages = selectedMessages.filter(
          (val: any) => val?.id !== item?.id && !stateArr.includes(val?.state)
        );
        if (filterdMessages.length > 0) {
          dispatch({
            type: SELECTED_MESSAGES,
            body: [...filterdMessages],
          });
        } else {
          dispatch({
            type: SELECTED_MESSAGES,
            body: [...filterdMessages],
          });
          dispatch({ type: LONG_PRESSED, body: false });
        }
      } else {
        if (!isStateIncluded) {
          dispatch({
            type: SELECTED_MESSAGES,
            body: [...selectedMessages, item],
          });
        }
      }
    } else {
      const index = conversations.findIndex(
        (element: any) => element?.id == item?.replyConversationObject?.id
      );
      if (index >= 0) {
        if (!flashListMounted) {
          setTimeout(() => {
            scrollToIndex(index);
            setReplyConversationId(item?.replyConversationObject?.id);
            setIsReplyFound(true);
            setFlashListMounted(true);
          }, 100);
        } else {
          scrollToIndex(index);
          setReplyConversationId(item?.replyConversationObject?.id);
          setIsReplyFound(true);
        }
      } else {
        const newConversation = await getCurrentConversation(
          item?.replyConversationObject,
          chatroomID?.toString()
        );
        dispatch({
          type: GET_CONVERSATIONS_SUCCESS,
          body: { conversations: newConversation },
        });
        const index = newConversation.findIndex(
          (element) => element?.id == item?.replyConversationObject?.id
        );
        if (index >= 0) {
          scrollToIndex(index);
          setReplyConversationId(item?.replyConversationObject?.id);
          setIsReplyFound(true);
        }
      }
    }
  };
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
            styles.replyMessage,
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
          {/* Reply conversation message sender name */}
          {item?.member?.id == user?.id ? null : customMessageHeader ? (
            customMessageHeader
          ) : (
            <MessageHeader />
          )}
          <TouchableOpacity
            onLongPress={handleLongPress}
            delayLongPress={200}
            onPress={handleOnPress}
          >
            {customReplyBox ? (
              customReplyBox(item?.replyConversationObject, chatroomName)
            ) : (
              <ReplyBox
                isIncluded={isIncluded}
                item={item?.replyConversationObject}
                chatroomName={chatroomName}
              />
            )}
          </TouchableOpacity>
          {item?.attachmentCount > 0 ? (
            <AttachmentConversations
              isReplyConversation={true}
              isReply={true}
            />
          ) : (
            <View>
              <View
                style={
                  [
                    styles.messageText,
                    textStyles ? { ...textStyles } : null,
                  ] as TextStyle
                }
              >
                {decode({
                  text: item?.answer,
                  enableClick: true,
                  chatroomName: chatroomName,
                  communityId: user?.sdkClientInfo?.community,
                  textStyles: textStyles,
                  linkTextColor: linkTextColor,
                  taggingTextColor: taggingTextColor,
                })}
              </View>
              {customMessageFooter ? customMessageFooter : <MessageFooter />}
            </View>
          )}
        </View>
        {(reactionArr.length > 0 || item?.answer?.split("").length > 100) &&
        !isTypeSent ? (
          <Pressable
            onLongPress={handleLongPress}
            delayLongPress={200}
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
      {!isItemIncludedInStateArr && !(item?.attachmentCount > 0) ? (
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

export default ReplyConversations;
