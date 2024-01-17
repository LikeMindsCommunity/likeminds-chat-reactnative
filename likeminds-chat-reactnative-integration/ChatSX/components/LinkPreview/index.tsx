import { View, Text, Image, Linking, Pressable } from "react-native";
import React, { useContext } from "react";
import { styles } from "./styles";
import STYLES from "../../constants/Styles";
import { useAppSelector } from "../../store";
import { decode } from "../../commonFuctions";
import { LinkPreviewProps } from "./models";
import LinkPreviewBox from "../linkPreviewBox";
import { useLMChat, useLMChatStyles } from "../../lmChatProvider";
import { NavigateToProfileParams } from "../../callBacks/type";

const LinkPreview = ({
  description,
  title,
  image,
  url,
  isTypeSent,
  isIncluded,
  item,
  chatroomName,
}: LinkPreviewProps) => {
  const { user } = useAppSelector((state) => state.homefeed);
  const lmChatInterface = useLMChat();

  const LMChatContextStyles = useLMChatStyles();
  const chatBubbleStyles = LMChatContextStyles?.chatBubbleStyles;

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

  const SELECTED_BACKGROUND_COLOR = selectedMessageBackgroundColor
    ? selectedMessageBackgroundColor
    : STYLES.$COLORS.SELECTED_BLUE;
  // styling props ended

  return (
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
        {item?.member?.id == user?.id ? null : (
          <Text
            style={styles.messageInfo}
            numberOfLines={1}
            onPress={() => {
              const params: NavigateToProfileParams = {
                taggedUserId: null,
                member: item?.member,
              };
              lmChatInterface.navigateToProfile(params);
            }}
          >
            {item?.member?.name}
            {item?.member?.customTitle ? (
              <Text
                style={styles.messageCustomTitle}
              >{` • ${item?.member?.customTitle}`}</Text>
            ) : null}
          </Text>
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
          <View style={styles.alignTime}>
            {item?.isEdited ? (
              <Text style={styles.messageDate}>{"Edited • "}</Text>
            ) : null}
            <Text style={styles.messageDate}>{item?.createdAt}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LinkPreview;
