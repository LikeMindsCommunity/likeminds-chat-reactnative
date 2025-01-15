import { View, Text, TextStyle, TouchableOpacity, Image } from "react-native";
import React, { useMemo } from "react";
import { ChatroomType } from "../../enums";
import { useMessageContext } from "../../context/MessageContext";
import { useChatroomContext } from "../../context/ChatroomContext";
import { styles } from "../Messages/styles";
import STYLES from "../../constants/Styles";
import { CallBack } from "../../callBacks/callBackClass";

const DeletedMessage = () => {
  const {
    isTypeSent,
    conversationDeletor,
    conversationDeletorName,
    conversationCreator,
    currentUserUuid,
    isIncluded,
    isItemIncludedInStateArr,
    item
  } = useMessageContext();

  const { chatroomType } = useChatroomContext();

  const isOwnMessage = useMemo(() => currentUserUuid === item?.member?.sdkClientInfo?.uuid,
    [currentUserUuid, item])

  const lmChatInterface = CallBack.lmChatInterface

  const chatBubbleStyles = STYLES.$CHAT_BUBBLE_STYLE;

  //styling props
  const selectedMessageBackgroundColor =
    chatBubbleStyles?.selectedMessageBackgroundColor;

  const SELECTED_BACKGROUND_COLOR = selectedMessageBackgroundColor
    ? selectedMessageBackgroundColor
    : STYLES.$COLORS.SELECTED_BLUE;

  const sentMessageBackgroundColor =
    chatBubbleStyles?.sentMessageBackgroundColor;
  const receivedMessageBackgroundColor =
    chatBubbleStyles?.receivedMessageBackgroundColor;
  // styling props ended

  return (
    <View style={styles.messageParent}>
      {!isOwnMessage ? <View
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
            const params = {
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
      </View> : null}
      {chatroomType !== ChatroomType.DMCHATROOM ? (
        currentUserUuid === conversationDeletor ? (
          <View
            style={[
              styles.message,
              isTypeSent ? styles.sentMessage : styles.receivedMessage,
              isIncluded
                ? { backgroundColor: SELECTED_BACKGROUND_COLOR }
                : null,
            ]}
          >
            <Text style={[styles.deletedMsg] as TextStyle[]}>
              You deleted this message
            </Text>
          </View>
        ) : conversationCreator === conversationDeletor ? (
          <View
            style={[
              styles.message,
              isTypeSent ? styles.sentMessage : styles.receivedMessage,
              isIncluded
                ? { backgroundColor: SELECTED_BACKGROUND_COLOR }
                : null,
            ]}
          >
            <Text style={[styles.deletedMsg] as TextStyle[]}>
              This message has been deleted by {conversationDeletorName}
            </Text>
          </View>
        ) : (
          <View
            style={[
              styles.message,
              isTypeSent ? styles.sentMessage : styles.receivedMessage,
              isIncluded
                ? { backgroundColor: SELECTED_BACKGROUND_COLOR }
                : null,
            ]}
          >
            <Text style={[styles.deletedMsg] as TextStyle[]}>
              This message has been deleted by Community Manager
            </Text>
          </View>
        )
      ) : currentUserUuid === conversationDeletor ? (
        <View
          style={[
            styles.message,
            isTypeSent ? styles.sentMessage : styles.receivedMessage,
            isIncluded ? { backgroundColor: SELECTED_BACKGROUND_COLOR } : null,
          ]}
        >
          <Text style={[styles.deletedMsg] as TextStyle[]}>
            You deleted this message
          </Text>
        </View>
      ) : (
        <View
          style={[
            styles.message,
            isTypeSent ? styles.sentMessage : styles.receivedMessage,
            isIncluded ? { backgroundColor: SELECTED_BACKGROUND_COLOR } : null,
          ]}
        >
          <Text style={[styles.deletedMsg] as TextStyle[]}>
            This message has been deleted by {conversationDeletorName}
          </Text>
        </View>
      )}

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
            ></View>
          )}
        </View>
      ) : null}
    </View>
  );
};

export default DeletedMessage;
