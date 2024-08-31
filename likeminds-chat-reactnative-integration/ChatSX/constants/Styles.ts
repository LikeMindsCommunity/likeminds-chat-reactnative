import { Platform } from "react-native";
import {
  CarouselScreenStyles,
  ChatBubbleStyles,
  ChatroomHeaderStyles,
  ChatroomTopicStyles,
  ExploreChatroomStyles,
  FileUploadStyles,
  HomeFeedStyles,
  InputBoxStyles,
  MemberDirectoryStyles,
  ReactionListStyles,
  SearchInChatroomStyles,
  StylesProps,
} from "./type";

const isIOS = Platform.OS === "ios" ? true : false;

export class STYLES {
  static $COLORS = {
    PRIMARY: "hsl(222, 53%, 15%)",
    SECONDARY: "hsl(222, 47%, 31%)",
    TERTIARY: "#ffffff",
    MSG: "#777e8e",
    FONT_PRIMARY: "hsl(222, 53%, 15%)",
    JOINED_BTN: "hsl(222, 22%, 93%)",
    LIGHT_BLUE: "#0276fa",
    SELECTED_BLUE: "hsl(222, 64%, 95%)",
    SELECTED_CHAT_BUBBLE: "hsl(222, 67%, 91%)",
    RED: "red",
  };
  static $FONT_SIZES = {
    XS: 10,
    SMALL: 12,
    REGULAR: 13,
    MEDIUM: 14,
    LARGE: 16,
    XL: 18,
    XXL: 20,
  };
  static $FONT_WEIGHTS = {
    LIGHT: "200" as const,
    MEDIUM: "500" as const,
    BOLD: "700" as const,
  };
  static $FONT_TYPES = {
    LIGHT: isIOS ? "Helvetica" : "Roboto",
    MEDIUM: isIOS ? "Helvetica" : "Roboto",
    SEMI_BOLD: isIOS ? "Helvetica" : "Roboto",
    BOLD: isIOS ? "Helvetica" : "Roboto",
    BLACK: isIOS ? "Helvetica" : "Roboto",
  };
  static $BACKGROUND_COLORS = {
    LIGHT: "#ffffff",
    DARK: "#000000",
  };
  static $SHADOWS = {
    LIGHT: "0 5px 10px rgba(0, 0, 0, 0.1)",
    MEDIUM: "0 8px 30px rgba(0, 0, 0, 0.3)",
    HEAVY: "0 30px 60px rgba(0, 0, 0, 0.6)",
  };
  static $MARGINS = {
    XS: 5,
    SMALL: 10,
    MEDIUM: 15,
    LARGE: 20,
  };
  static $PADDINGS = {
    SMALL: 10,
    MEDIUM: 15,
    LARGE: 20,
  };
  static $AVATAR = {
    WIDTH: 60,
    HEIGHT: 60,
    BORDER_RADIUS: 35,
  };
  static $ALIGN_ROW = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  };
  static $TEXTVIEW_WIDTH = {
    REGULAR: 240,
  };
  static $STATUS_BAR_STYLE = {
    default: "default",
    "dark-content": "dark-content",
    "light-content": "light-content",
  };
  static $CHAT_BUBBLE_STYLE: ChatBubbleStyles = {};
  static $INPUT_BOX_STYLE: InputBoxStyles = {};
  static $REACTION_LIST_STYLE: ReactionListStyles = {};
  static $CHATROOM_HEADER_STYLE: ChatroomHeaderStyles = {};
  static $CHATROOM_TOPIC_STYLE: ChatroomTopicStyles = {};
  static $FILE_UPLOAD_STYLE: FileUploadStyles = {};
  static $MEMBER_DIRECTORY_STYLE: MemberDirectoryStyles = {};
  static $CAROUSEL_SCREEN_STYLE: CarouselScreenStyles = {};
  static $EXPLORE_CHATROOM_STYLE: ExploreChatroomStyles = {};
  static $HOME_FEED_STYLE: HomeFeedStyles = {};
  static $SEARCH_IN_CHATROOM: SearchInChatroomStyles = {};
  static setTheme({
    hue,
    fontColor,
    primaryColor,
    secondaryColor,
    lightBackgroundColor,
    fontTypes,
  }: StylesProps) {
    STYLES.$COLORS = {
      ...STYLES.$COLORS,
      PRIMARY: primaryColor
        ? primaryColor
        : `hsl( ${hue ? hue : 222}, 53%, 15%)`,
      SECONDARY: secondaryColor
        ? secondaryColor
        : `hsl(${hue ? hue : 222}, 47%, 31%)`,
      FONT_PRIMARY: fontColor ? fontColor : `hsl(${hue ? hue : 222}, 53%, 15%)`,
      JOINED_BTN: lightBackgroundColor
        ? lightBackgroundColor
        : `hsl(${hue ? hue : 222}, 22%, 93%)`,
      SELECTED_BLUE: `hsl(${hue ? hue : 222}, 64%, 95%)`,
      SELECTED_CHAT_BUBBLE: `hsl(${hue ? hue : 222}, 67%, 91%)`,
    };
    STYLES.$FONT_TYPES = {
      ...STYLES.$FONT_TYPES,
      LIGHT: fontTypes?.LIGHT
        ? fontTypes?.LIGHT
        : isIOS
        ? "Helvetica"
        : "Roboto",
      MEDIUM: fontTypes?.MEDIUM
        ? fontTypes?.MEDIUM
        : isIOS
        ? "Helvetica"
        : "Roboto",
      SEMI_BOLD: fontTypes?.SEMI_BOLD
        ? fontTypes?.SEMI_BOLD
        : isIOS
        ? "Helvetica"
        : "Roboto",
      BOLD: fontTypes?.BOLD ? fontTypes?.BOLD : isIOS ? "Helvetica" : "Roboto",
      BLACK: fontTypes?.BLACK
        ? fontTypes?.BLACK
        : isIOS
        ? "Helvetica"
        : "Roboto",
    };
  }
  static setChatBubbleStyle(chatBubbleStyles: ChatBubbleStyles) {
    STYLES.$CHAT_BUBBLE_STYLE = {
      ...chatBubbleStyles,
    };
  }
  static setInputBoxStyle(inputBoxStyles: InputBoxStyles) {
    STYLES.$INPUT_BOX_STYLE = {
      ...inputBoxStyles,
    };
  }
  static setReactionListStyle(reactionListStyles: ReactionListStyles) {
    STYLES.$REACTION_LIST_STYLE = {
      ...reactionListStyles,
    };
  }
  static setChatroomHeaderStyle(chatroomHeaderStyles: ChatroomHeaderStyles) {
    STYLES.$CHATROOM_HEADER_STYLE = {
      ...chatroomHeaderStyles,
    };
  }
  static setChatroomTopicStyle(chatroomTopicStyles: ChatroomTopicStyles) {
    STYLES.$CHATROOM_TOPIC_STYLE = {
      ...chatroomTopicStyles,
    };
  }
  static setFileUploadStyle(fileUploadStyles: FileUploadStyles) {
    STYLES.$FILE_UPLOAD_STYLE = {
      ...fileUploadStyles,
    };
  }
  static setMemberDirectoryStyle(memberDirectoryStyles: MemberDirectoryStyles) {
    STYLES.$MEMBER_DIRECTORY_STYLE = {
      ...memberDirectoryStyles,
    };
  }
  static setCarouselScreenStyle(carouselScreenStyles: CarouselScreenStyles) {
    STYLES.$CAROUSEL_SCREEN_STYLE = {
      ...carouselScreenStyles,
    };
  }
  static setExploreChatroomStyle(exploreChatroomStyles: ExploreChatroomStyles) {
    STYLES.$EXPLORE_CHATROOM_STYLE = {
      ...exploreChatroomStyles,
    };
  }
  static setHomeFeedStyle(homeFeedStyles: HomeFeedStyles) {
    STYLES.$HOME_FEED_STYLE = {
      ...homeFeedStyles,
    };
  }
  static setSearchInChatroomStyle(
    searchInChatroomStyles: SearchInChatroomStyles
  ) {
    STYLES.$SEARCH_IN_CHATROOM = {
      ...searchInChatroomStyles,
    };
  }
}

export default STYLES;
