import { View, Text, TextStyle } from "react-native";
import React from "react";
import { ChatroomType } from "../../enums";
import { useMessageContext } from "../../context/MessageContext";
import { useChatroomContext } from "../../context/ChatroomContext";
import { styles } from "../Messages/styles";
import STYLES from "../../constants/Styles";

const DeletedMessage = () => {
  const {
    isTypeSent,
    conversationDeletor,
    conversationDeletorName,
    conversationCreator,
    currentUserUuid,
    isIncluded,
    isItemIncludedInStateArr,
  } = useMessageContext();

  const { chatroomType } = useChatroomContext();

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
