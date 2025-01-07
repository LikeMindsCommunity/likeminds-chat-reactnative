import { STYLES } from "@likeminds.community/chat-rn-core";

export const setStyles = (gender: string) => {
  // themeStyling
  const themeStyles =
    gender === "male"
      ? {
          fontColor: "black",
          primaryColor: "#B7D340",
          secondaryColor: "#B7D340",
          lightBackgroundColor: "hsl(161, 67%, 91%)",
          fontTypes: {
            LIGHT: "NunitoSans-Light",
            MEDIUM: "NunitoSans-Medium",
            SEMI_BOLD: "NunitoSans-SemiBold",
            BOLD: "NunitoSans-Bold",
            BLACK: "NunitoSans-Black",
          },
        }
      : {
          fontColor: "black",
          primaryColor: "#553B3B",
          secondaryColor: "#553B3B",
          lightBackgroundColor: "hsl(11,53%,94%)",
          fontTypes: {
            LIGHT: "NunitoSans-Light",
            MEDIUM: "NunitoSans-Medium",
            SEMI_BOLD: "NunitoSans-SemiBold",
            BOLD: "NunitoSans-Bold",
            BLACK: "NunitoSans-Black",
          },
        };

  // styling for chatroom header
  const chatroomHeaderStyles = {
    chatroomNameHeaderStyle: {
      color: "white",
      fontSize: 18,
      fontFamily: "NunitoSans-Bold",
    },
    chatroomSubHeaderStyle: {
      color: "white",
      fontSize: 13,
    },
    chatroomSelectedHeaderIcons: {
      tintColor: "white",
    },
  };

  // styling for chatBubble
  const chatBubbleStyles =
    gender === "male"
      ? {
          textStyles: {
            fontSize: 15,
          },
          linkTextColor: "#3CA874",
          taggingTextColor: "#3CA874",
          selectedMessagesBackgroundColor: "#3CA87429",
          stateMessagesTextStyles: {
            color: "#808080",
            backgroundColor: "#C7E3D6",
          },
          dateStateMessage: {
            color: "#808080",
          },
          messageReceivedHeader: {
            senderNameStyles: {
              color: "#3CA874",
              fontSize: 15,
            },
            senderDesignationStyles: {
              fontSize: 14,
            },
          },
          playPauseBoxIcon: {
            backgroundColor: "#B7D340",
          },
          voiceNoteSlider: {
            minimumTrackTintColor: "#B7D340",
            thumbTintColor: "#B7D340",
          },
          pollVoteSliderColor: {
            backgroundColor: "#3CA87429",
          },
          sentMessageBackgroundColor: "#C7E3D6",
        }
      : {
          textStyles: {
            fontSize: 15,
          },
          linkTextColor: "#D88673",
          taggingTextColor: "#D88673",
          selectedMessagesBackgroundColor: "#f7d7de",
          stateMessagesTextStyles: {
            color: "#808080",
            backgroundColor: "#FAD9D2",
          },
          dateStateMessage: {
            color: "#808080",
          },
          messageReceivedHeader: {
            senderNameStyles: {
              color: "#C66B5D",
              fontSize: 15,
            },
            senderDesignationStyles: {
              fontSize: 14,
            },
          },
          playPauseBoxIcon: {
            backgroundColor: "#D88673",
          },
          voiceNoteSlider: {
            minimumTrackTintColor: "#D88673",
            thumbTintColor: "#D88673",
          },
          pollVoteSliderColor: {
            backgroundColor: "hsl(11,53%,94%)",
          },
          sentMessageBackgroundColor: "#FAD9D2",
        };

  // styling for inputBox
  const inputBoxStyles =
    gender === "male"
      ? {
          placeholderTextColor: "#aaa",
          selectionColor: "#3CA874",
          partsTextStyle: {
            color: "#3CA874",
          },
          sendIconStyles: {
            tintColor: "black",
          },
          micIconStyles: {
            tintColor: "black",
          },
        }
      : {
          placeholderTextColor: "#aaa",
          selectionColor: "#D88673",
          partsTextStyle: {
            color: "#D88673",
          },
          sendIconStyles: {
            tintColor: "white",
          },
          micIconStyles: {
            tintColor: "white",
          },
        };

  // styling for reaction list
  const reactionListStyles =
    gender === "male"
      ? {
          tabOptionColor: "#B7D340",
        }
      : {
          tabOptionColor: "#D88673",
        };

  if (chatBubbleStyles) {
    STYLES.setChatBubbleStyle(chatBubbleStyles);
  }

  if (themeStyles) {
    STYLES.setTheme(themeStyles);
  }

  if (chatroomHeaderStyles) {
    STYLES.setChatroomHeaderStyle(chatroomHeaderStyles);
  }

  if (reactionListStyles) {
    STYLES.setReactionListStyle(reactionListStyles);
  }

  if (inputBoxStyles) {
    STYLES.setInputBoxStyle(inputBoxStyles);
  }
};
