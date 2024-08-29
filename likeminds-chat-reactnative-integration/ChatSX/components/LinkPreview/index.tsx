import {
  View,
  Text,
  Image,
  Linking,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { styles } from "./styles";
import STYLES from "../../constants/Styles";
import { useAppSelector } from "../../store";
import { decode } from "../../commonFuctions";
import LinkPreviewBox from "../linkPreviewBox";
import { useChatroomContext } from "../../context/ChatroomContext";
import { useMessageContext } from "../../context/MessageContext";
import { NavigateToProfileParams } from "../../callBacks/type";
import { CallBack } from "../../callBacks/callBackClass";
import MessageHeader from "../MessageHeader";
import MessageFooter from "../MessageFooter";
import { useCustomComponentsContext } from "../../context/CustomComponentContextProvider";

const LinkPreview = () => {
  const { user } = useAppSelector((state) => state.homefeed);

  const { isIncluded, item, isTypeSent, isItemIncludedInStateArr } =
    useMessageContext();
  const { chatroomName } = useChatroomContext();

  const { customMessageHeader, customMessageFooter } =
    useCustomComponentsContext();

  const description = item?.ogTags?.description;
  const title = item?.ogTags?.title;
  const image = item?.ogTags?.image;
  const url = item?.ogTags?.url;
  const lmChatInterface = CallBack.lmChatInterface;

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
            styles.linkPreview,
            borderRadius
              ? {
                  borderRadius: borderRadius,
                }
              : null,
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
          <LinkPreviewBox
            description={description}
            title={title}
            url={url}
            image={image}
          />
          <View>
            <View style={styles.messageText as any}>
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
        </View>
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

export default LinkPreview;
