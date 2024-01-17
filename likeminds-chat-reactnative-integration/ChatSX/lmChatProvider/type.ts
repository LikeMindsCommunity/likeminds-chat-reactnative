import { LMChatClient } from "@likeminds.community/chat-rn";
import LMChatCallbacksInterface from "../callBacks";

interface ReactionListStylesProps {
  reactionSize?: number;
  reactionLeftItemStroke?: string;
  reactionRightItemStroke?: string;
  reactionItemBorderRadius?: number;
  gap?: number;
  selectedMessageBackgroundColor?: string;
}

interface TextStyles {
  fontSize: number;
  fontStyle: string;
  fontFamily: string;
}

interface ChatBubbleStylesProps {
  borderRadius?: number;
  sentMessageBackgroundColor?: string;
  receivedMessageBackgroundColor?: string;
  selectedBackgroundColor?: string;
  selectedMessageBackgroundColor?: string;
  textStyles?: TextStyles;
  linkTextColor?: string;
  taggingTextColor?: string;
  stateMessagesBackgroundColor?: string;
  stateMessagesTextStyles?: TextStyles;
  deletedMessagesTextStyles?: TextStyles;
}

interface InputBoxStyles {
  placeholderTextColor?: string;
  inputTextStyle?: {
    width?: string;
    height?: number;
    elevation?: number;
    backgroundColor?: string;
  };
  selectionColor?: string;
  plainTextStyle?: {
    color?: string;
  };
  partsTextStyle?: {
    color?: string;
  };
  sendIconStyles?: {
    width?: number;
    height?: number;
    resizeMode?: string;
    marginLeft?: number;
  };
  attachmentIconStyles?: {
    width?: number;
    height?: number;
    resizeMode?: string;
  };
  micIconStyles?: {
    width?: number;
    height?: number;
    resizeMode?: string;
  };
  cameraIconStyles?: {
    width?: number;
    height?: number;
    resizeMode?: string;
  };
  galleryIconStyles?: {
    width?: number;
    height?: number;
    resizeMode?: string;
  };
  documentIconStyles?: {
    width?: number;
    height?: number;
    resizeMode?: string;
  };
  pollIconStyles?: {
    width?: number;
    height?: number;
    resizeMode?: string;
  };
}

interface ThemeStyles {
  hue?: number;
  fontColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  lightBackgroundColor?: string;
}

// Define the context type
export interface ThemeContextProps {
  reactionListStyles?: ReactionListStylesProps;
  chatBubbleStyles?: ChatBubbleStylesProps;
  inputBoxStyles?: InputBoxStyles;
}

export interface LMChatProviderProps {
  myClient: LMChatClient;
  children: React.ReactNode;
  userName: string;
  userUniqueId: string;
  profileImageUrl: string;
  lmChatInterface: LMChatCallbacksInterface;
  reactionListStyles?: ReactionListStylesProps;
  chatBubbleStyles?: ChatBubbleStylesProps;
  inputBoxStyles?: InputBoxStyles;
  themeStyles?: ThemeStyles;
}
