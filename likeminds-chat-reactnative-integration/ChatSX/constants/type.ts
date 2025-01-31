import { ImageStyle, TextStyle, ViewStyle } from "react-native";

interface FontTypes {
  LIGHT?: string;
  MEDIUM?: string;
  SEMI_BOLD?: string;
  BOLD?: string;
  BLACK?: string;
}

export interface StylesProps {
  hue?: number;
  fontColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  lightBackgroundColor?: string;
  fontTypes?: FontTypes;
}

export interface ChatroomHeaderStyles {
  chatroomNameHeaderStyle?: {
    color?: string;
    fontSize?: number;
    fontFamily?: string;
  };
  chatroomSubHeaderStyle?: {
    color?: string;
    fontSize?: number;
    fontFamily?: string;
  };
  chatroomSelectedHeaderIcons?: {
    tintColor?: string;
  };
}

export interface FileUploadStyles {
  selectedImageBorderColor?: string;
}

export interface CarouselScreenStyles {
  headerTitle?: {
    color?: string;
    fontSize?: number;
    fontFamily?: string;
  };
  headerSubtitle?: {
    color?: string;
    fontSize?: number;
    fontFamily?: string;
  };
}

export interface HomeFeedStyles {
  avatar?: {
    borderRadius?: string;
  };
  title?: {
    color?: string;
    fontSize?: number;
    fontFamily?: string;
  };
  lastConversation?: {
    color?: string;
    fontSize?: number;
    fontFamily?: string;
  };
  unreadCount?: {
    color?: string;
    fontSize?: number;
    fontFamily?: string;
    borderRadius?: string;
    backgroundColor?: string;
  };
  lastConversationTime?: {
    color?: string;
    fontSize?: number;
    fontFamily?: string;
  };
}

export interface ExploreChatroomStyles {
  header?: {
    color?: string;
    fontSize?: number;
    fontFamily?: string;
    placeHolderText?: string;
  };
  filterHeader?: {
    color?: string;
    fontSize?: number;
    fontFamily?: string;
  };
  chatroomTitle?: {
    color?: string;
    fontSize?: number;
    fontFamily?: string;
  };
  chatroomSubTitle?: {
    color?: string;
    fontSize?: number;
    fontFamily?: string;
  };
  chatroomDescription?: {
    color?: string;
    fontSize?: number;
    fontFamily?: string;
  };
  joinButton?: {
    placeHolderText?: string;
    color?: string;
    fontSize?: number;
    fontFamily?: string;
    backgroundColor?: string;
    borderRadius?: string;
  };
  joinedButton?: {
    placeHolderText?: string;
    color?: string;
    fontSize?: number;
    fontFamily?: string;
    backgroundColor?: string;
    borderRadius?: string;
  };
}

export interface MemberDirectoryStyles {
  userNameStyles?: {
    color?: string;
    fontSize?: number;
    fontFamily?: string;
  };
  userTitleStyles?: {
    color?: string;
    fontSize?: number;
    fontFamily?: string;
  };
  searchPlaceholderText?: string;
}

export interface ChatroomTopicStyles {
  topicHeader?: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
  };
  topicDescription?: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
  };
  topicPlaceholder?: string;
}

export interface ChatBubbleStyles {
  borderRadius?: number;
  sentMessageBackgroundColor?: string;
  receivedMessageBackgroundColor?: string;
  selectedBackgroundColor?: string;
  selectedMessageBackgroundColor?: string;
  textStyles?: {
    fontSize?: number;
    fontStyle?: string;
    fontFamily?: string;
  };
  linkTextColor?: string;
  taggingTextColor?: string;
  selectedMessagesBackgroundColor?: string;
  stateMessagesTextStyles?: {
    fontSize?: number;
    fontStyle?: string;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
  };
  messageReceivedHeader?: {
    senderNameStyles?: {
      fontSize?: number;
      fontFamily?: string;
      color?: string;
    };
    senderDesignationStyles?: {
      fontSize?: number;
      fontFamily?: string;
      color?: string;
    };
  };
  dateStateMessage?: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
  };
  playPauseBoxIcon?: {
    backgroundColor?: string;
  };
  voiceNoteSlider?: {
    minimumTrackTintColor?: string;
    thumbTintColor?: string;
  };
  pollVoteSliderColor?: {
    backgroundColor?: string;
  };
  imageVideoAttachmentsBorderRadius?: number;
  showMoreTextStyle?: TextStyle;
}

export interface ReactionListStyles {
  reactionSize?: number;
  reactionLeftItemStroke?: string;
  reactionRightItemStroke?: string;
  reactionItemBorderRadius?: number;
  gap?: number;
  selectedMessageBackgroundColor?: string;
  tabOptionColor?: string;
}

export interface InputBoxStyles {
  placeholderTextColor?: string;
  selectionColor?: string;
  partsTextStyle?: {
    color?: string;
  };
  plainTextStyle?: {
    color?: string;
  };
  placeholderText?: string;
  inputTextStyle?: {
    flexGrow?: number;
    fontSize?: number;
    fontFamily?: string;
    maxHeight?: number;
    padding?: number;
    marginBottom?: number;
    overflow?: "visible" | "hidden" | "scroll" | undefined;
  };
  sendIconStyles?: {
    width?: number;
    height?: number;
    resizeMode?: string;
    marginLeft?: number;
    tintColor?: string;
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
    tintColor?: string;
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
  messageInputMarginBottom?: number;
  editBoxStyles?: EditBoxStyles;
  userTaggingListStyles?: UserTaggingListStyles;
  replyBoxViewStyles?: ReplyBoxViewStyles;
  linkPreviewInputViewStyles?: LinkPreviewInputViewStyles;
  addMoreFilesViewStyles?: AddMoreFilesViewStyles;
  inputBoxViewStyles?: InputBoxViewStyles;
  selectFilesModalStyles?: SelectFilesModalStyles;
  sendDMRequestModalStyles?: SendDMRequestModalStyles;


}
export interface EditBoxStyles {
  containerStyle?: {
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    padding?: number;
    borderRadius?: number;
  };
  closeButtonStyle?: {
    backgroundColor?: string;
    padding?: number;
    borderRadius?: number;
  };
  closeIconStyle?: {
    width?: number;
    height?: number;
    tintColor?: string;
  };
}
export interface SendDMRequestModalStyles {
  modal?: {
    flex?: number;
    justifyContent?: string;
    alignItems?: string;
    backgroundColor?: string;
  };
  modalContainer?: {
    backgroundColor?: string;
    borderRadius?: number;
    padding?: number;
    width?: string | number;
    elevation?: number;
  };
  title?: {
    fontSize?: number;
    fontWeight?: string;
    textAlign?: string;
    marginBottom?: number;
  };
  message?: {
    fontSize?: number;
    textAlign?: string;
    color?: string;
    marginBottom?: number;
  };
  buttonContainer?: {
    flexDirection?: string;
    justifyContent?: string;
    marginTop?: number;
  };
  button?: {
    padding?: number;
    borderRadius?: number;
    marginHorizontal?: number;
  };
  cancelButton?: {
    backgroundColor?: string;
  };
  okButton?: {
    backgroundColor?: string;
  };
  buttonText?: {
    fontSize?: number;
    fontWeight?: string;
    textAlign?: string;
  };
  cancelButtonText?: {
    color?: string;
  };
}

export interface UserTaggingListStyles {
  taggableUsersBox?: {
    backgroundColor?: string;
    height?: number | string;
  };
  taggableUserView?: {
    flexDirection?: "row" | "column";
    padding?: number;
    alignItems?: string;
  };
  avatar?: {
    width?: number;
    height?: number;
    borderRadius?: number;
  };
  infoContainer?: {
    gap?: number;
    borderBottomWidth?: number;
  };
  title?: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
  };
  subTitle?: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
  };
}
export interface ReplyBoxViewStyles {
  replyBox?: {
    backgroundColor?: string;
    padding?: number;
    borderRadius?: number;
    margin?: number;
  };
  replyBoxClose?: {
    padding?: number;
    alignItems?: string;
    justifyContent?: string;
  };
  replyCloseImg?: {
    width?: number;
    height?: number;
    tintColor?: string;
  };
}
export interface LinkPreviewInputViewStyles {
  linkPreviewBox?: {
    backgroundColor?: string;
    padding?: number;
    borderRadius?: number;
    margin?: number;
  };
  replyBoxClose?: {
    padding?: number;
    alignItems?: string;
    justifyContent?: string;
  };
  replyCloseImg?: {
    width?: number;
    height?: number;
    tintColor?: string;
  };
}
export interface AddMoreFilesViewStyles {
  addMoreButton?: {
    padding?: number;
    margin?: number;
    borderRadius?: number;
    backgroundColor?: string;
    alignItems?: string;
    justifyContent?: string;
  };
  emoji?: {
    width?: number;
    height?: number;
    tintColor?: string;
  };
}
export interface InputBoxViewStyles {
  voiceNotesInputParent?: {
    paddingVertical?: number;
    marginHorizontal?: number;
    backgroundColor?: string;
  };
  recordTitle?: {
    fontSize?: number;
    color?: string;
    fontWeight?: string;
  };
  emoji?: {
    width?: number;
    height?: number;
    tintColor?: string;
  };
  input?: {
    borderWidth?: number;
    borderColor?: string;
    borderRadius?: number;
    padding?: number;
    backgroundColor?: string;
  };
  gifView?: {
    backgroundColor?: string;
    padding?: number;
    borderRadius?: number;
  };
  gifText?: {
    fontSize?: number;
    color?: string;
    fontWeight?: string;
  };
}
export interface SelectFilesModalStyles {
  centeredView?: {
    flex?: number;
    justifyContent?: string;
    alignItems?: string;
    backgroundColor?: string;
  };
  modalViewParent?: {
    backgroundColor?: string;
    borderRadius?: number;
    padding?: number;
    margin?: number;
    shadowColor?: string;
    shadowOpacity?: number;
    shadowRadius?: number;
    elevation?: number;
  };
  modalView?: {
    padding?: number;
    backgroundColor?: string;
    borderRadius?: number;
  };
  alignModalElements?: {
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    padding?: number;
  };
  iconContainer?: {
    alignItems?: string;
    justifyContent?: string;
    marginVertical?: number;
  };
  cameraIconStyles?: ImageStyle;
  galleryIconStyles?: ImageStyle;
  documentIconStyles?: ImageStyle;
  pollIconStyles?: ImageStyle;
}
export interface SearchInChatroomStyles {
  backArrowColor?: string;
  crossIconColor?: string;
  searchPlaceholderTextColor?: string;
  searchText?: TextStyle;
  userImageStyles?: ImageStyle;
  userNameStyles?: TextStyle;
  timeStampStyles?: TextStyle;
  searchedHighlightedTextStyle?: TextStyle;
  searchedNonHighlightedTextStyle?: TextStyle;
}

export interface ChatBotInitiateScreenStyles {
  previewTextStyle?: TextStyle;
  parentViewStyle?: ViewStyle
}

export interface LMChatAIButtonStyle {
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  iconStyle?: ImageStyle;
}
