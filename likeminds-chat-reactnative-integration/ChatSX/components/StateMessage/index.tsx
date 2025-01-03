import { View, Text, Pressable, TextStyle } from "react-native";
import React, { useMemo } from "react";
import { useAppSelector } from "../../store";
import { useMessageContext } from "../../context/MessageContext";
import { useChatroomContext } from "../../context/ChatroomContext";
import STYLES from "../../constants/Styles";
import { decode } from "../../commonFuctions";
import { ChatroomType } from "../../enums";
import { styles } from "../Messages/styles";

interface StateMessage {
  onTapToUndoProp?: () => void;
}

const StateMessage = ({ onTapToUndoProp }: StateMessage) => {
  const { conversations }: any = useAppSelector((state) => state.chatroom);
  const { user } = useAppSelector((state) => state.homefeed);
  const {
    item,
    userIdStringified,
    chatroomWithUser,
    conversationCreator,
    chatroomWithUserUuid,
    chatroomWithUserMemberId,
    currentUserUuid,

    answerTrimming,
  } = useMessageContext();


  const { onTapToUndo, chatroomType, chatroomName, chatroomDBDetails, chatroomDetails, filteredChatroomActions } = useChatroomContext();
  
  
  const chatBubbleStyles = STYLES.$CHAT_BUBBLE_STYLE;

  //styling props
  const linkTextColor = chatBubbleStyles?.linkTextColor;
  const taggingTextColor = chatBubbleStyles?.taggingTextColor;
  const stateMessagesBackgroundColor =
    chatBubbleStyles?.stateMessagesTextStyles?.backgroundColor;
  const stateMessagesTextStyles = chatBubbleStyles?.stateMessagesTextStyles;
  // styling props ended
  return (
    <View>
      {/* state 19 is for the reject DM state message */}
      {/* Logic is when to show TAP TO UNDO =>
                Item's state == 19 &&
                conversation array's first element's ID == 19 &&
                conversations[0]?.id == item?.id &&
                chatRequestBy user should be same as user (when we reject DM chat request by changes to the person who rejected the request)
          */}
      {item?.state === 19 &&
      conversations[0]?.state === 19 &&
      conversations[0]?.id === item?.id &&
      (chatroomDBDetails ? chatroomDBDetails?.chatRequestedBy?.id == user?.id : null) ? (
        <Pressable
          onPress={() => {
            onTapToUndoProp ? onTapToUndoProp() : onTapToUndo();
          }}
          style={[
            styles.statusMessage,
            stateMessagesBackgroundColor
              ? { backgroundColor: stateMessagesBackgroundColor }
              : null,
          ]}
        >
          <Text
            style={
              [
                styles.textCenterAlign,
                {
                  color: STYLES.$COLORS.FONT_PRIMARY,
                  fontFamily: STYLES.$FONT_TYPES.LIGHT,
                },
                stateMessagesTextStyles ? { ...stateMessagesTextStyles } : null,
              ] as TextStyle[]
            }
          >
            {`${item?.answer} `}
            <Text
              style={{
                color: STYLES.$COLORS.LIGHT_BLUE,
                fontFamily: STYLES.$FONT_TYPES.LIGHT,
              }}
            >
              Tap to undo.
            </Text>
          </Text>
        </Pressable>
      ) : (
        <View style={[styles.statusMessage]}>
          <Text style={styles.textCenterAlign}>
            {
              // State 1 refers to initial DM message, so in that case trimming the first user name
              item?.state === 1 && chatroomType === ChatroomType.DMCHATROOM
                ? decode({
                    text: answerTrimming(item?.answer),
                    enableClick: true,
                    chatroomName: chatroomName,
                    communityId: user?.sdkClientInfo?.community,
                    isLongPress: false,
                    memberUuid: conversationCreator,
                    chatroomWithUserUuid: chatroomWithUserUuid,
                    chatroomWithUserMemberId: chatroomWithUserMemberId,
                    textStyles: stateMessagesTextStyles,
                    linkTextColor: linkTextColor,
                    taggingTextColor: taggingTextColor,
                  })
                : decode({
                    text: item?.answer,
                    enableClick: true,
                    chatroomName: chatroomName,
                    communityId: user?.sdkClientInfo?.community,
                    isLongPress: false,
                    memberUuid: conversationCreator,
                    chatroomWithUserUuid: chatroomWithUserUuid,
                    chatroomWithUserMemberId: chatroomWithUserMemberId,
                    textStyles: stateMessagesTextStyles,
                    linkTextColor: linkTextColor,
                    taggingTextColor: taggingTextColor,
                  })
            }
          </Text>
        </View>
      )}
    </View>
  );
};

export default StateMessage;
