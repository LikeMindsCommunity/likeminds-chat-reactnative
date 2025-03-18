import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewProps,
  Text,
  View,
} from "react-native";
import STYLES from "../constants/Styles";
import { useAppDispatch, useAppSelector } from "../store";
import { Client } from "../client";
import { ChatroomContextValues, useChatroomContext } from "./ChatroomContext";
import {
  paginatedConversations,
  paginatedConversationsEnd,
  paginatedConversationsStart,
} from "../store/actions/chatroom";
import { GetConversationsRequestBuilder } from "@likeminds.community/chat-rn";
import { GET_CONVERSATIONS_SUCCESS } from "../store/types/types";
import { DocumentType, GetConversationsType } from "../enums";
import { Conversation } from "@likeminds.community/chat-rn/dist/shared/responseModels/Conversation";
import { styles } from "../components/MessageList/styles";
import { decode, generateGifString } from "../commonFuctions";
import { CAPITAL_GIF_TEXT, VOICE_NOTE_STRING } from "../constants/Strings";
import { getCurrentConversation } from "../utils/chatroomUtils";
import { convertToChatroomTopicSchema } from "../assets/chatSchema";
import { useIsFocused } from "@react-navigation/native";
import { LMSeverity } from "@likeminds.community/chat-rn"

interface MessageListContextProps {
  children?: ReactNode;
}

export interface MessageListContextValues {
  flatlistRef: any;
  isFound: boolean;
  flashListMounted: boolean;
  isReplyFound: boolean;
  setIsReplyFound: Dispatch<SetStateAction<boolean>>;
  replyConversationId: string;
  setReplyConversationId: Dispatch<SetStateAction<string>>;
  setKeyboardVisible: Dispatch<SetStateAction<boolean>>;
  setIsFound: Dispatch<SetStateAction<boolean>>;
  setFlashListMounted: Dispatch<SetStateAction<boolean>>;
  handleOnScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  renderFooter: () => React.JSX.Element | null;
  getIconAttachment: (conversation: Conversation) => React.JSX.Element | null;
  scrollToIndex: (index: any) => any;
  scrollToBottom: any;
  isScrollingUp: boolean;
  keyboardVisible: boolean;
}

const MessageListContext = createContext<MessageListContextValues | undefined>(
  undefined
);

export const useMessageListContext = () => {
  const context = useContext(MessageListContext);
  if (!context) {
    throw new Error(
      "useMessageListContext must be used within an MessageListContextProvider"
    );
  }
  return context;
};

export const MessageListContextProvider = ({
  children,
}: MessageListContextProps) => {
  const {
    conversations,
    chatroomID,
    user,
    chatroomName,
    isNavigationToSearchedConversation,
    searchedConversation,
  }: ChatroomContextValues = useChatroomContext();
  const [endPage, setEndPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldLoadMoreChatEnd, setShouldLoadMoreChatEnd] = useState(true);
  const [shouldLoadMoreChatStart, setShouldLoadMoreChatStart] = useState(true);
  const [response, setResponse] = useState<any>([]);
  const [flashListMounted, setFlashListMounted] = useState(false);
  const [isFound, setIsFound] = useState(false);
  const [isReplyFound, setIsReplyFound] = useState(false);
  const [replyConversationId, setReplyConversationId] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);

  const flatlistRef = useRef<any>(null);
  const dispatch = useAppDispatch();
  const { messageSent }: any = useAppSelector((state) => state.chatroom);
  const myClient = Client.myClient;
  const PAGE_SIZE = 200;
  const isFocused = useIsFocused();

  const scrollToBottom = async () => {
    try {
      const payload = GetConversationsRequestBuilder.builder()
        .setChatroomId(chatroomID?.toString())
        .setLimit(100)
        .setType(GetConversationsType.ALL)
        .build();

      const conversationsFromRealm = await myClient?.getConversations(payload);

      if (conversationsFromRealm[0]?.id !== conversations[0]?.id) {
        dispatch({
          type: GET_CONVERSATIONS_SUCCESS,
          body: { conversations: conversationsFromRealm },
        });
      }

      flatlistRef.current.scrollToIndex({ animated: true, index: 0 });
    } catch (error) {
      Client?.myClient?.handleException(
        error,
        {
          exception: error,
          trace: error?.stack
        },
        LMSeverity.ERROR
      )
    }
  };

  // this useEffect scroll to Index of latest message when we send the message.
  useEffect(() => {
    if (conversations?.length > 0) {
      flatlistRef?.current?.scrollToIndex({
        animated: false,
        index: 0,
      });
    }
  }, [messageSent]);

  const scrollToVisibleIndex = (index: number) => {
    if (flatlistRef.current) {
      flatlistRef.current.scrollToIndex({
        animated: false,
        index: index,
        viewPosition: 0.7,
      });
    }
  };

  //function calls paginatedConversations action which internally calls getConversation to update conversation array with the new data.
  async function paginatedData(newPage: number) {
    const payload = {
      chatroomID: chatroomID,
      conversationID: conversations[conversations?.length - 1]?.id,
      scrollDirection: 0,
      paginateBy: 50,
      topNavigate: false,
    };
    const response = await dispatch(
      paginatedConversations(payload, true) as any
    );
    return response;
  }

  // function shows loader in between calling the API and getting the response
  const loadData = async (newPage?: number) => {
    try {
      setIsLoading(true);
      const payload = GetConversationsRequestBuilder.builder()
        .setChatroomId(chatroomID?.toString())
        .setLimit(PAGE_SIZE)
        .setMedianConversation(conversations[conversations.length - 1])
        .build();
      const newConversations = await myClient.getConversations(payload);
      dispatch({
        type: GET_CONVERSATIONS_SUCCESS,
        body: { conversations: [...conversations, ...newConversations] },
      });
      if (newConversations.length == 0) {
        setShouldLoadMoreChatEnd(false);
      }
      if (newConversations) {
        setIsLoading(false);
      }
    } catch (error) {
      Client?.myClient?.handleException(
        error,
        {
          exception: error,
          trace: error?.stack
        },
        LMSeverity.ERROR
      )
    }
  };

  // function shows loader in between calling the API and getting the response
  const loadStartData = async (newPage?: number) => {
    try {
      setIsLoading(true);
      const payload = GetConversationsRequestBuilder.builder()
        .setChatroomId(chatroomID?.toString())
        .setLimit(PAGE_SIZE)
        .setMedianConversation(conversations[0])
        .setType(GetConversationsType.BELOW)
        .build();

      let newConversations = await myClient.getConversations(payload);
      newConversations = newConversations.reverse();
      dispatch({
        type: GET_CONVERSATIONS_SUCCESS,
        body: { conversations: [...newConversations, ...conversations] },
      });

      if (newConversations.length !== 0 && !isFound) {
        const length = newConversations.length;
        let index = length;
        if (
          conversations[index + 1].attachmentCount == 0 &&
          conversations[index + 1].polls == undefined
        ) {
          index = length - 2;
        } else if (length < PAGE_SIZE) {
          index = length;
        } else {
          index = length + 8;
        }
        scrollToVisibleIndex(index);
      }
      if (newConversations.length == 0) {
        setShouldLoadMoreChatStart(false);
      }
      if (newConversations) {
        setIsLoading(false);
      }
    } catch (error) {
      Client?.myClient?.handleException(
        error,
        {
          exception: error,
          trace: error?.stack
        },
        LMSeverity.ERROR
      )
    }
  };

  //function checks the pagination logic, if it verifies the condition then call loadData
  const handleLoadMore = () => {
    loadData();
  };

  // function scroll to specific message
  const scrollToIndex = (index: any) => {
    flatlistRef.current?.scrollToIndex({
      animated: true,
      index,
      viewPosition: 0.7,
    });
  };

  const renderFooter = () => {
    return isLoading ? (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" color={STYLES.$COLORS.SECONDARY} />
      </View>
    ) : null;
  };

  // Function calls paginatedConversationsEnd action which internally calls getConversations to update conversation array with the new data.
  async function endOfPaginatedData() {
    try {
      const payload = {
        chatroomID: chatroomID,
        conversationID: conversations[conversations?.length - 1]?.id,
        scrollDirection: 0, //scroll up -> 0
        paginateBy: 50,
        topNavigate: false,
      };
      const response = await dispatch(
        paginatedConversationsEnd(payload, true) as any
      );
      return response;
    } catch (error) {
      Client?.myClient?.handleException(
        error,
        {
          exception: error,
          trace: error?.stack
        },
        LMSeverity.ERROR
      )
    }
  }

  // Function shows loader in between calling the API and getting the response
  const endLoadData = async () => {
    setIsLoading(true);
    const res: any = await endOfPaginatedData();

    // To check if its the end of list (top of list in our case)
    if (res?.conversations?.length == 0) {
      setShouldLoadMoreChatEnd(false);
    }

    if (res) {
      setIsLoading(false);
    }
  };

  // Function checks the pagination logic, if it verifies the condition then call endLoadData
  const handleOnEndReached = () => {
    if (!isLoading && conversations?.length > 0) {
      // checking if conversations length is greater the 15 as it convered all the screen sizes of mobiles, and pagination API will never call if screen is not full messages.
      if (conversations?.length > 15) {
        const newPage = endPage + 1;
        setEndPage(newPage);
        endLoadData();
      }
    }
  };

  // Function calls paginatedConversationsStart action which internally calls getConversations to update conversation array with the new data.
  async function startOfPaginatedData() {
    try {
      const payload = {
        chatroomID: chatroomID,
        conversationID: conversations[0]?.id,
        scrollDirection: 1, //scroll down -> 1
        paginateBy: 50,
        topNavigate: false,
      };
      const response = await dispatch(
        paginatedConversationsStart(payload, true) as any
      );
      return response;
    } catch (error) {
      Client?.myClient?.handleException(
        error,
        {
          exception: error,
          trace: error?.stack
        },
        LMSeverity.ERROR
      )
    }
  }

  // this useEffect is used to jump to searched conversation
  useEffect(() => {
    async function scrollToSearchedConversation() {
      try {
        const newConversation = await getCurrentConversation(
          convertToChatroomTopicSchema(searchedConversation),
          chatroomID?.toString()
        );
        dispatch({
          type: GET_CONVERSATIONS_SUCCESS,
          body: { conversations: newConversation },
        });
        const index = newConversation.findIndex(
          (element) => element?.id == searchedConversation?.id
        );
        if (index >= 0) {
          scrollToIndex(index);
          setReplyConversationId(searchedConversation?.id);
          setIsFound(true);
        }
      } catch (error) {
        Client?.myClient?.handleException(
          error,
          error?.stack,
          LMSeverity.ERROR
        )
      }
    }
    if (isNavigationToSearchedConversation) {
      scrollToSearchedConversation();
    }
  }, [isFocused]);

  // This is for scrolling down mainly ie whenever response changes this useEffect will be triggered and it'll calculate the index of the last message before prepending of new data and scroll to that index
  useEffect(() => {
    setTimeout(() => {
      if (response) {
        const len = response?.conversations?.length;
        if (len != 0 && len != undefined) {
          let index = len;
          if (
            conversations[index + 1].attachmentCount == 0 &&
            conversations[index + 1].polls == undefined
          ) {
            index = len - 2;
          }
          scrollToVisibleIndex(index);
        }
        setIsLoading(false);
      }
    }, 1500);
  }, [response]);

  // function shows loader in between calling the API and getting the response
  const startLoadData = async () => {
    setIsLoading(true);
    const res: any = await startOfPaginatedData();

    // To check if its the start of list (bottom of list in our case)
    if (res?.conversations?.length == 0) {
      setShouldLoadMoreChatStart(false);
    }
    setResponse(res);
  };

  // Function checks the pagination logic, if it verifies the condition then call startLoadData
  const handleOnStartReached = () => {
    if (!isLoading && conversations?.length > 0) {
      // Checking if conversations length is greater the 15 as it convered all the screen sizes of mobiles, and pagination API will never call if screen is not full messages.
      if (conversations?.length > 15) {
        const newPage = startPage + 1;
        setStartPage(newPage);
        startLoadData();
      }
    }
  };

  const onStartReached = () => {
    loadStartData();
  };

  const onEndReached = () => {
    handleOnEndReached();
  };

  // For Scrolling Up
  const handleOnScroll: ScrollViewProps["onScroll"] = (event) => {
    const offset = (event as any).nativeEvent.contentOffset.y;
    const visibleLength = (event as any).nativeEvent.layoutMeasurement.height;
    const contentLength = (event as any).nativeEvent.contentSize.height;
    const onStartReachedThreshold = 10;
    const onEndReachedThreshold = 10;

    const isUp = offset > 0;

    setIsScrollingUp(isUp);
    setCurrentOffset(offset);

    // Check if scroll has reached start of list.
    const isScrollAtStart = offset < onStartReachedThreshold;
    // Check if scroll has reached end of list.
    const isScrollAtEnd =
      contentLength - visibleLength - offset < onEndReachedThreshold;

    if (isScrollAtStart && shouldLoadMoreChatStart && !isFound) {
      renderFooter();
      onStartReached();
    }

    if (isScrollAtEnd && shouldLoadMoreChatEnd) {
      renderFooter();
      handleLoadMore();
    }
  };

  const renderAllMedia = (
    imageCount: number,
    videosCount: number,
    pdfCount: number,
    val: Conversation
  ) => {
    return (
      <View style={styles.alignCenter}>
        <Text numberOfLines={2} style={styles.attachment_msg}>
          <Text style={styles.attachment_msg}>{imageCount}</Text>{" "}
          <Image
            source={require("../assets/images/image_icon3x.png")}
            style={styles.chatroomTopicIcon}
          />{" "}
          <Text style={styles.attachment_msg}>{videosCount}</Text>{" "}
          <Image
            source={require("../assets/images/video_icon3x.png")}
            style={styles.chatroomTopicIcon}
          />{" "}
          <Text style={styles.attachment_msg}>{pdfCount}</Text>{" "}
          <Image
            source={require("../assets/images/document_icon3x.png")}
            style={styles.chatroomTopicIcon}
          />{" "}
          {decode({
            text: val?.answer,
            enableClick: false,
            chatroomName: chatroomName,
            communityId: user?.sdkClientInfo?.community,
          })}
        </Text>
      </View>
    );
  };

  const renderImageVideo = (
    imageCount: number,
    videosCount: number,
    val: Conversation
  ) => {
    return (
      <View style={styles.alignCenter}>
        <Text numberOfLines={2} style={styles.attachment_msg}>
          <Text style={styles.attachment_msg}>{imageCount}</Text>{" "}
          <Image
            source={require("../assets/images/image_icon3x.png")}
            style={styles.chatroomTopicIcon}
          />{" "}
          <Text style={styles.attachment_msg}>{videosCount}</Text>{" "}
          <Image
            source={require("../assets/images/video_icon3x.png")}
            style={styles.chatroomTopicIcon}
          />{" "}
          {decode({
            text: val?.answer,
            enableClick: false,
            chatroomName: chatroomName,
            communityId: user?.sdkClientInfo?.community,
          })}
        </Text>
      </View>
    );
  };

  const renderVideoPdf = (
    videosCount: number,
    pdfCount: number,
    val: Conversation
  ) => {
    return (
      <View style={styles.alignCenter}>
        <Text numberOfLines={2} style={styles.attachment_msg}>
          <Text style={styles.attachment_msg}>{videosCount}</Text>{" "}
          <Image
            source={require("../assets/images/video_icon3x.png")}
            style={styles.chatroomTopicIcon}
          />{" "}
          <Text style={styles.attachment_msg}>{pdfCount}</Text>{" "}
          <Image
            source={require("../assets/images/document_icon3x.png")}
            style={styles.chatroomTopicIcon}
          />{" "}
          {decode({
            text: val?.answer,
            enableClick: false,
            chatroomName: chatroomName,
            communityId: user?.sdkClientInfo?.community,
          })}
        </Text>
      </View>
    );
  };

  const renderImagePdf = (
    imageCount: number,
    pdfCount: number,
    val: Conversation
  ) => {
    return (
      <View style={styles.alignCenter}>
        <Text numberOfLines={2} style={styles.attachment_msg}>
          <Text style={styles.attachment_msg}>{imageCount}</Text>{" "}
          <Image
            source={require("../assets/images/image_icon3x.png")}
            style={styles.chatroomTopicIcon}
          />{" "}
          <Text style={styles.attachment_msg}>{pdfCount}</Text>{" "}
          <Image
            source={require("../assets/images/document_icon3x.png")}
            style={styles.chatroomTopicIcon}
          />{" "}
          {decode({
            text: val?.answer,
            enableClick: false,
            chatroomName: chatroomName,
            communityId: user?.sdkClientInfo?.community,
          })}
        </Text>
      </View>
    );
  };

  const renderPdf = (pdfCount: number, val: Conversation) => {
    return (
      <View style={[styles.alignCenter]}>
        {!val?.answer ? (
          <Text style={styles.attachment_msg}>
            {pdfCount > 1 && (
              <Text style={styles.attachment_msg}>{pdfCount}</Text>
            )}
            <Image
              source={require("../assets/images/document_icon3x.png")}
              style={styles.chatroomTopicIcon}
            />
            {pdfCount > 1 ? "Documents" : "Document"}
          </Text>
        ) : (
          <Text numberOfLines={2} style={styles.attachment_msg}>
            {pdfCount > 1 && (
              <>
                <Text style={styles.attachment_msg}>{pdfCount}</Text>
                &nbsp;
              </>
            )}
            <Image
              source={require("../assets/images/document_icon3x.png")}
              style={styles.chatroomTopicIcon}
            />{" "}
            {decode({
              text: val?.answer,
              enableClick: false,
              chatroomName: chatroomName,
              communityId: user?.sdkClientInfo?.community,
            })}
          </Text>
        )}
      </View>
    );
  };

  const renderVideo = (videosCount: number, val: Conversation) => {
    return (
      <View
        style={[
          styles.alignCenter,
          {
            marginBottom: -2,
          },
        ]}
      >
        {!val?.answer ? (
          <Text style={styles.attachment_msg}>
            {videosCount > 1 && (
              <Text style={styles.attachment_msg}>{videosCount}</Text>
            )}{" "}
            <Image
              source={require("../assets/images/video_icon3x.png")}
              style={styles.chatroomTopicIcon}
            />{" "}
            {videosCount > 1 ? "Videos" : "Video"}
          </Text>
        ) : (
          <Text numberOfLines={2} style={styles.attachment_msg}>
            {videosCount > 1 && (
              <>
                <Text style={styles.attachment_msg}>{videosCount}</Text>
                &nbsp;
              </>
            )}
            <Image
              source={require("../assets/images/video_icon3x.png")}
              style={styles.chatroomTopicIcon}
            />{" "}
            {decode({
              text: val?.answer,
              enableClick: false,
              chatroomName: chatroomName,
              communityId: user?.sdkClientInfo?.community,
            })}
          </Text>
        )}
      </View>
    );
  };

  const renderImage = (imageCount: number, val: Conversation) => {
    return (
      <View style={[styles.alignCenter]}>
        {!val?.answer ? (
          <Text style={styles.attachment_msg}>
            {imageCount > 1 && (
              <Text style={styles.attachment_msg}>{imageCount}</Text>
            )}{" "}
            <Image
              source={require("../assets/images/image_icon3x.png")}
              style={styles.chatroomTopicIcon}
            />{" "}
            {imageCount > 1 ? "Photos" : "Photo"}
          </Text>
        ) : (
          <Text numberOfLines={2} style={styles.attachment_msg}>
            {imageCount > 1 && (
              <>
                <Text style={styles.attachment_msg}>{imageCount}</Text>
                &nbsp;
              </>
            )}
            <Image
              source={require("../assets/images/image_icon3x.png")}
              style={styles.chatroomTopicIcon}
            />{" "}
            {decode({
              text: val?.answer,
              enableClick: false,
              chatroomName: chatroomName,
              communityId: user?.sdkClientInfo?.community,
            })}
          </Text>
        )}
      </View>
    );
  };

  const renderPoll = (val: Conversation) => {
    return (
      <View style={[styles.alignCenter]}>
        <Text numberOfLines={2} style={styles.attachment_msg}>
          <Image
            source={require("../assets/images/poll_icon3x.png")}
            style={[
              styles.chatroomTopicIcon,
              { tintColor: STYLES.$COLORS.PRIMARY },
            ]}
          />{" "}
          {decode({
            text: val?.answer,
            enableClick: false,
            chatroomName: chatroomName,
            communityId: user?.sdkClientInfo?.community,
          })}
        </Text>
      </View>
    );
  };

  const renderGif = (val: Conversation) => {
    let answer = generateGifString(val?.answer);
    return (
      <View style={[styles.alignCenter]}>
        {!answer ? (
          <View style={styles.gif_attachment_msg}>
            <View style={styles.gifView}>
              <Text style={styles.gifText}>{CAPITAL_GIF_TEXT}</Text>
            </View>
            <Text style={styles.attachment_msg}>
              <View style={styles.sub_attachment_msg} />
              {CAPITAL_GIF_TEXT}
            </Text>
          </View>
        ) : (
          <Text numberOfLines={2} style={styles.attachment_msg}>
            <View style={styles.gifView}>
              <Text style={styles.gifText}>{CAPITAL_GIF_TEXT}</Text>
            </View>
            <View style={styles.sub_attachment_msg} />
            {decode({
              text: val?.answer,
              enableClick: false,
              chatroomName: chatroomName,
              communityId: user?.sdkClientInfo?.community,
            })}
          </Text>
        )}
      </View>
    );
  };

  const renderVoiceNote = (val: Conversation) => {
    return (
      <View style={[styles.alignCenter]}>
        <Text numberOfLines={2} style={styles.attachment_msg}>
          <Image
            source={require("../assets/images/mic_icon3x.png")}
            style={[
              styles.chatroomTopicIcon,
              { tintColor: STYLES.$COLORS.PRIMARY },
            ]}
          />
          {VOICE_NOTE_STRING}
        </Text>
      </View>
    );
  };

  const renderLink = (val: Conversation) => {
    return (
      <View
        style={[
          styles.alignCenter,
          {
            marginBottom: -2,
          },
        ]}
      >
        <Text numberOfLines={2} style={styles.attachment_msg}>
          <Image
            source={require("../assets/images/link_icon.png")}
            style={styles.chatroomTopicIcon}
          />{" "}
          {decode({
            text: val?.answer,
            enableClick: false,
            chatroomName: chatroomName,
            communityId: user?.sdkClientInfo?.community,
          })}
        </Text>
      </View>
    );
  };

  // To get icon along with count along with answer
  const getIconAttachment = (conversation: Conversation) => {
    const attachments = conversation?.attachments;
    let imageCount = 0;
    let videosCount = 0;
    let pdfCount = 0;
    let gifCount = 0;
    let voiceNoteCount = 0;
    const ogTags = conversation?.ogTags;

    if (attachments?.length) {
      for (let i = 0; i < attachments?.length; i++) {
        if (attachments[i].type == DocumentType.IMAGE) {
          imageCount++;
        } else if (attachments[i].type == DocumentType.VIDEO) {
          videosCount++;
        } else if (attachments[i].type == DocumentType.PDF) {
          pdfCount++;
        } else if (attachments[i].type == DocumentType.GIF_TEXT) {
          gifCount++;
        } else if (attachments[i].type == DocumentType.VOICE_NOTE) {
          voiceNoteCount++;
        } else {
          continue;
        }
      }
    }

    if (imageCount > 0 && videosCount > 0 && pdfCount > 0) {
      return renderAllMedia(imageCount, videosCount, pdfCount, conversation);
    } else if (imageCount > 0 && videosCount > 0) {
      return renderImageVideo(imageCount, videosCount, conversation);
    } else if (videosCount > 0 && pdfCount > 0) {
      return renderVideoPdf(videosCount, pdfCount, conversation);
    } else if (imageCount > 0 && pdfCount > 0) {
      return renderImagePdf(imageCount, pdfCount, conversation);
    } else if (pdfCount > 0) {
      return renderPdf(pdfCount, conversation);
    } else if (videosCount > 0) {
      return renderVideo(videosCount, conversation);
    } else if (imageCount > 0) {
      return renderImage(imageCount, conversation);
    } else if (conversation?.state === 10) {
      return renderPoll(conversation);
    } else if (gifCount) {
      return renderGif(conversation);
    } else if (voiceNoteCount) {
      return renderVoiceNote(conversation);
    } else if (ogTags) {
      return renderLink(conversation);
    } else {
      return (
        <Text style={styles.deletedMessage}>
          This message is not supported yet
        </Text>
      );
    }
  };

  const contextValues: MessageListContextValues = {
    flatlistRef,
    isFound,
    flashListMounted,
    setIsReplyFound,
    setReplyConversationId,
    setIsFound,
    setKeyboardVisible,
    setFlashListMounted,
    handleOnScroll,
    renderFooter,
    getIconAttachment,
    scrollToIndex,
    isReplyFound,
    replyConversationId,
    keyboardVisible,
    isScrollingUp,
    scrollToBottom,
  };

  return (
    <MessageListContext.Provider value={contextValues}>
      {children}
    </MessageListContext.Provider>
  );
};
