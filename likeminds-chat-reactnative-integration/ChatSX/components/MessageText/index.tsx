import { View, Text } from "react-native";
import React from "react";
import { styles } from "../AttachmentConversations/styles";
import { decode, generateGifString } from "../../commonFuctions";
import { GIF_TEXT } from "../../constants/Strings";
import { useAppSelector } from "../../store";
import { useChatroomContext } from "../../context/ChatroomContext";
import STYLES from "../../constants/Styles";
import { useMessageContext } from "../../context/MessageContext";
import MoreLess from "../MoreLess";

const MessageText = () => {
  const { item } = useMessageContext();
  const { chatroomName } = useChatroomContext();
  const { user } = useAppSelector((state) => state.homefeed);

  let firstAttachment = item?.attachments[0];

  const isGif = firstAttachment?.type === GIF_TEXT;
  const chatBubbleStyles = STYLES.$CHAT_BUBBLE_STYLE;
  const textStyles = chatBubbleStyles?.textStyles;
  const linkTextColor = chatBubbleStyles?.linkTextColor;
  const taggingTextColor = chatBubbleStyles?.taggingTextColor;
  const showMoreTextStyle = STYLES.$CHAT_BUBBLE_STYLE.showMoreTextStyle;
  return (
    <View style={styles.messageText as any}>
      <MoreLess
        text={isGif ? generateGifString(item?.answer) : item?.answer}
        enableClick={true}
        chatroomName={chatroomName}
        communityId={user?.sdkClientInfo?.community}
        textStyles={textStyles}
        linkTextColor={linkTextColor}
        taggingTextColor={taggingTextColor}
        showMoreTextStyle={showMoreTextStyle}
      />
    </View>
  );
};

export default MessageText;
