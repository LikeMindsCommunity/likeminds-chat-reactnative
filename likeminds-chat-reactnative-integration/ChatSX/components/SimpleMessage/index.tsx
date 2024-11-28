import {
  View,
  Text,
  Pressable,
  Image,
  TouchableOpacity,
  TextLayoutLine,
} from "react-native";
import React, { useState } from "react";
import { useMessageContext } from "../../context/MessageContext";
import { useChatroomContext } from "../../context/ChatroomContext";
import STYLES from "../../constants/Styles";
import { useAppSelector } from "../../store";
import { styles } from "../Messages/styles";
import { decode } from "../../commonFuctions";
import MessageFooter from "../MessageFooter";
import MessageHeader from "../MessageHeader";
import StateMessage from "../StateMessage";
import { useCustomComponentsContext } from "../../context/CustomComponentContextProvider";
import { NavigateToProfileParams } from "../../callBacks/type";
import { CallBack } from "../../callBacks/callBackClass";
import MoreLess from "../MoreLess";

interface SimpleMessageProps {
  onTapToUndoProp?: () => void;
}

const SimpleMessage = ({ onTapToUndoProp }: SimpleMessageProps) => {
  const [showMore, setShowMore] = useState(false);
  const { user } = useAppSelector((state) => state.homefeed);
  const {
    item,
    isIncluded,
    reactionArr,
    isTypeSent,
    userIdStringified,
    isItemIncludedInStateArr,

    handleLongPress,
    handleOnPress,
  } = useMessageContext();

  const { chatroomName } = useChatroomContext();
  const { customMessageHeader, customMessageFooter, customStateMessage } =
    useCustomComponentsContext();

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
  const showMoreTextStyle = chatBubbleStyles.showMoreTextStyle;

  const SELECTED_BACKGROUND_COLOR = selectedMessageBackgroundColor
    ? selectedMessageBackgroundColor
    : STYLES.$COLORS.SELECTED_BLUE;
  // styling props ended

  const lmChatInterface = CallBack.lmChatInterface;

  const MAX_LINES = 3;

  return (
    <View style={styles.messageParent}>
      {isItemIncludedInStateArr ? (
        customStateMessage ? (
          customStateMessage
        ) : (
          <StateMessage onTapToUndoProp={onTapToUndoProp} />
        )
      ) : (
        <View
          style={[
            styles.alignMessage,
            {
              justifyContent: isTypeSent ? "flex-end" : "flex-start",
            },
          ]}
        >
          <View
            style={[
              styles.message,
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
                      ? {
                          backgroundColor: receivedMessageBackgroundColor,
                        }
                      : null,
                  ],
              isIncluded
                ? { backgroundColor: SELECTED_BACKGROUND_COLOR }
                : null,
            ]}
          >
            {item?.member?.id ==
            userIdStringified ? null : customMessageHeader ? (
              customMessageHeader
            ) : (
              <MessageHeader />
            )}
            <MoreLess
              text={item?.answer}
              enableClick={true}
              chatroomName={chatroomName}
              communityId={user?.sdkClientInfo?.community}
              textStyles={textStyles}
              linkTextColor={linkTextColor}
              taggingTextColor={taggingTextColor}
              showMoreTextStyle={showMoreTextStyle}
            />
            {customMessageFooter ? customMessageFooter : <MessageFooter />}
          </View>
          {(reactionArr.length > 0 || item?.answer?.split("").length > 100) &&
          !isTypeSent ? (
            <Pressable
              onLongPress={handleLongPress}
              delayLongPress={200}
              onPress={handleOnPress}
            >
              <Image
                style={{
                  height: 25,
                  width: 25,
                  resizeMode: "contain",
                }}
                source={require("../../assets/images/add_more_emojis3x.png")}
              />
            </Pressable>
          ) : null}
        </View>
      )}

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

export default SimpleMessage;
