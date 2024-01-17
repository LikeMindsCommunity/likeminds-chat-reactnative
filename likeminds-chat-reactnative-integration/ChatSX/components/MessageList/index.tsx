import {
  View,
  Text,
  Pressable,
  Image,
  ScrollViewProps,
  ActivityIndicator,
} from "react-native";
import React, {
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { FlashList } from "@shopify/flash-list";
import Swipeable from "../Swipeable";
import Messages from "../Messages";
import { decode, generateGifString } from "../../commonFuctions";
import { ChatroomType, DocumentType, GetConversationsType } from "../../enums";
import { useAppDispatch, useAppSelector } from "../../store";
import STYLES from "../../constants/Styles";
import {
  GET_CONVERSATIONS_SUCCESS,
  SET_POSITION,
} from "../../store/types/types";
import { styles } from "./styles";
import {
  paginatedConversations,
  paginatedConversationsEnd,
  paginatedConversationsStart,
} from "../../store/actions/chatroom";
import { GetConversationsRequestBuilder } from "@likeminds.community/chat-rn";
import { Conversation } from "@likeminds.community/chat-rn/dist/shared/responseModels/Conversation";
import { CAPITAL_GIF_TEXT, VOICE_NOTE_STRING } from "../../constants/Strings";
import { getCurrentConversation } from "../../utils/chatroomUtils";
import { useLMChatStyles } from "../../lmChatProvider";
import { Client } from "../../client";

const MessageList = forwardRef(
  (
    {
      chatroomID,
      handleLongPress,
      handleClick,
      removeReaction,
      onTapToUndo,
      handleFileUpload,
      navigation,
    }: any,
    ref: any
  ) => {
    const [endPage, setEndPage] = useState(1);
    const [startPage, setStartPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [shouldLoadMoreChatEnd, setShouldLoadMoreChatEnd] = useState(true);
    const [shouldLoadMoreChatStart, setShouldLoadMoreChatStart] =
      useState(true);
    const [response, setResponse] = useState<any>([]);
    const [flashListMounted, setFlashListMounted] = useState(false);
    const [isFound, setIsFound] = useState(false);

    const flatlistRef = useRef<any>(null);
    const dispatch = useAppDispatch();
    const {
      conversations = [],
      chatroomDBDetails,
      messageSent,
      selectedMessages,
      stateArr,
      currentChatroomTopic,
    }: any = useAppSelector((state) => state.chatroom);
    const myClient = Client.myClient;
    const { uploadingFilesMessages }: any = useAppSelector(
      (state) => state.upload
    );
    const { user } = useAppSelector((state) => state.homefeed);
    const PAGE_SIZE = 200;

    const LMChatContextStyles = useLMChatStyles();
    const chatBubbleStyles = LMChatContextStyles?.chatBubbleStyles;

    //styling props
    const selectedBackgroundColor = chatBubbleStyles?.selectedBackgroundColor;

    const SELECTED_BACKGROUND_COLOR = selectedBackgroundColor
      ? selectedBackgroundColor
      : STYLES.$COLORS.SELECTED_BLUE;
    // styling props ended

    const chatroomType = chatroomDBDetails?.type;
    const chatroomWithUser = chatroomDBDetails?.chatroomWithUser;

    // This useEffect is used to highlight the chatroom topic conversation for 1 sec on scrolling to it
    useEffect(() => {
      if (isFound) {
        setTimeout(() => {
          setIsFound(false);
        }, 1000);
      }
    }, [isFound]);

    {
      /* `{? = then}`, `{: = else}`  */
    }
    {
      /*
        if DM ?
          if userID !=== chatroomWithUserID ?
            chatroomWithUserName
          : memberName
        : chatroomHeaderName
    */
    }

    const chatroomName =
      chatroomType === ChatroomType.DMCHATROOM
        ? user?.id != chatroomWithUser?.id
          ? chatroomWithUser?.name
          : chatroomDBDetails?.member?.name!
        : chatroomDBDetails?.header;

    {
      /* `{? = then}`, `{: = else}`  */
    }
    {
      /*
            if DM ?
              if userID !=== chatroomWithUserID ?
                chatroomWithUserImageURL
              : memberImageURL
            : null
        */
    }
    const chatroomProfile =
      chatroomType === ChatroomType.DMCHATROOM
        ? user?.id !== chatroomWithUser?.id
          ? chatroomWithUser?.imageUrl
          : chatroomDBDetails?.member?.imageUrl!
        : null;

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
    };

    // function shows loader in between calling the API and getting the response
    const loadStartData = async (newPage?: number) => {
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
    };

    //function checks the pagination logic, if it verifies the condition then call loadData
    const handleLoadMore = () => {
      loadData();
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
    }

    // Function shows loader in between calling the API and getting the response
    const endLoadData = async () => {
      setIsLoading(true);
      const res = await endOfPaginatedData();

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
    }

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
      const res = await startOfPaginatedData();

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
      const offset = event.nativeEvent.contentOffset.y;
      const visibleLength = event.nativeEvent.layoutMeasurement.height;
      const contentLength = event.nativeEvent.contentSize.height;
      const onStartReachedThreshold = 10;
      const onEndReachedThreshold = 10;

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
              source={require("../../assets/images/image_icon3x.png")}
              style={styles.chatroomTopicIcon}
            />{" "}
            <Text style={styles.attachment_msg}>{videosCount}</Text>{" "}
            <Image
              source={require("../../assets/images/video_icon3x.png")}
              style={styles.chatroomTopicIcon}
            />{" "}
            <Text style={styles.attachment_msg}>{pdfCount}</Text>{" "}
            <Image
              source={require("../../assets/images/document_icon3x.png")}
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
              source={require("../../assets/images/image_icon3x.png")}
              style={styles.chatroomTopicIcon}
            />{" "}
            <Text style={styles.attachment_msg}>{videosCount}</Text>{" "}
            <Image
              source={require("../../assets/images/video_icon3x.png")}
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
              source={require("../../assets/images/video_icon3x.png")}
              style={styles.chatroomTopicIcon}
            />{" "}
            <Text style={styles.attachment_msg}>{pdfCount}</Text>{" "}
            <Image
              source={require("../../assets/images/document_icon3x.png")}
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
              source={require("../../assets/images/image_icon3x.png")}
              style={styles.chatroomTopicIcon}
            />{" "}
            <Text style={styles.attachment_msg}>{pdfCount}</Text>{" "}
            <Image
              source={require("../../assets/images/document_icon3x.png")}
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
              )}{" "}
              <Image
                source={require("../../assets/images/document_icon3x.png")}
                style={styles.chatroomTopicIcon}
              />{" "}
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
                source={require("../../assets/images/document_icon3x.png")}
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
                source={require("../../assets/images/video_icon3x.png")}
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
                source={require("../../assets/images/video_icon3x.png")}
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
                source={require("../../assets/images/image_icon3x.png")}
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
                source={require("../../assets/images/image_icon3x.png")}
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
              source={require("../../assets/images/poll_icon3x.png")}
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
              source={require("../../assets/images/mic_icon3x.png")}
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
              source={require("../../assets/images/link_icon.png")}
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
    return (
      <>
        <FlashList
          ref={flatlistRef}
          data={conversations}
          keyExtractor={(item: any, index) => {
            const isArray = Array.isArray(item);
            return isArray ? `${index}` : `${item?.id}`;
          }}
          extraData={{
            value: [
              selectedMessages,
              uploadingFilesMessages,
              stateArr,
              conversations,
            ],
          }}
          estimatedItemSize={250}
          renderItem={({ item: value, index }: any) => {
            const uploadingFilesMessagesIDArr = Object.keys(
              uploadingFilesMessages
            );
            let item = { ...value };
            if (uploadingFilesMessagesIDArr.includes(value?.id?.toString())) {
              item = uploadingFilesMessages[value?.id];
            }

            const isStateIncluded = stateArr.includes(item?.state);

            let isIncluded = selectedMessages.some(
              (val: any) => val?.id === item?.id && !isStateIncluded
            );

            if (isFound && item?.id == currentChatroomTopic?.id) {
              isIncluded = true;
            }

            return (
              <View style={{ marginLeft: 30 }}>
                {index < conversations?.length &&
                conversations[index]?.date !==
                  conversations[index + 1]?.date ? (
                  <View style={[styles.statusMessage]}>
                    <Text
                      style={{
                        color: STYLES.$COLORS.FONT_PRIMARY,
                        fontSize: STYLES.$FONT_SIZES.SMALL,
                        fontFamily: STYLES.$FONT_TYPES.LIGHT,
                      }}
                    >
                      {item?.date}
                    </Text>
                  </View>
                ) : null}

                <Swipeable
                  onFocusKeyboard={() => {
                    ref?.current?.focus();
                  }}
                  item={item}
                  isStateIncluded={isStateIncluded}
                >
                  <Pressable
                    onLongPress={(event) => {
                      const { pageX, pageY } = event.nativeEvent;
                      dispatch({
                        type: SET_POSITION,
                        body: { pageX: pageX, pageY: pageY },
                      });
                      handleLongPress(
                        isStateIncluded,
                        isIncluded,
                        item,
                        selectedMessages
                      );
                    }}
                    delayLongPress={200}
                    onPress={function (event) {
                      const { pageX, pageY } = event.nativeEvent;
                      dispatch({
                        type: SET_POSITION,
                        body: { pageX: pageX, pageY: pageY },
                      });
                      handleClick(
                        isStateIncluded,
                        isIncluded,
                        item,
                        false,
                        selectedMessages
                      );
                    }}
                    style={
                      isIncluded
                        ? selectedBackgroundColor
                          ? { backgroundColor: SELECTED_BACKGROUND_COLOR }
                          : {
                              backgroundColor:
                                STYLES.$COLORS.SELECTED_CHAT_BUBBLE,
                            }
                        : null
                    }
                  >
                    <Messages
                      chatroomName={chatroomName}
                      chatroomID={chatroomID}
                      chatroomType={chatroomType}
                      onScrollToIndex={(index: any) => {
                        flatlistRef.current?.scrollToIndex({
                          animated: true,
                          index,
                        });
                      }}
                      isIncluded={isIncluded}
                      item={item}
                      navigation={navigation}
                      openKeyboard={() => {
                        handleClick(
                          isStateIncluded,
                          isIncluded,
                          item,
                          true,
                          selectedMessages
                        );
                      }}
                      longPressOpenKeyboard={() => {
                        handleLongPress(
                          isStateIncluded,
                          isIncluded,
                          item,
                          selectedMessages
                        );
                      }}
                      removeReaction={(
                        item: any,
                        reactionArr: any,
                        removeFromList?: any
                      ) => {
                        removeReaction(item, reactionArr, removeFromList);
                      }}
                      handleTapToUndo={() => {
                        onTapToUndo();
                      }}
                      handleFileUpload={handleFileUpload}
                    />
                  </Pressable>
                </Swipeable>
              </View>
            );
          }}
          onScroll={handleOnScroll}
          ListHeaderComponent={renderFooter}
          ListFooterComponent={renderFooter}
          keyboardShouldPersistTaps={"handled"}
          inverted
        />
        {!(Object.keys(currentChatroomTopic).length === 0) &&
        chatroomType !== ChatroomType.DMCHATROOM ? (
          <Pressable
            style={styles.chatroomTop}
            onPress={async () => {
              const index = conversations.findIndex(
                (element: any) => element?.id == currentChatroomTopic?.id
              );
              if (index >= 0) {
                if (!flashListMounted) {
                  setTimeout(() => {
                    flatlistRef.current?.scrollToIndex({
                      animated: true,
                      index,
                    });
                    setIsFound(true);
                    setFlashListMounted(true);
                  }, 1000);
                } else {
                  flatlistRef.current?.scrollToIndex({
                    animated: true,
                    index,
                  });
                  setIsFound(true);
                }
              } else {
                const newConversation = await getCurrentConversation(
                  currentChatroomTopic,
                  chatroomID?.toString()
                );
                dispatch({
                  type: GET_CONVERSATIONS_SUCCESS,
                  body: { conversations: newConversation },
                });
                const index = newConversation.findIndex(
                  (element) => element?.id == currentChatroomTopic?.id
                );
                if (index >= 0) {
                  flatlistRef.current?.scrollToIndex({
                    animated: true,
                    index,
                  });
                  setIsFound(true);
                }
              }
            }}
          >
            <View style={styles.chatroomTopic}>
              <View>
                <Image
                  source={
                    currentChatroomTopic?.member?.imageUrl
                      ? { uri: currentChatroomTopic?.member?.imageUrl }
                      : require("../../assets/images/default_pic.png")
                  }
                  style={styles.chatroomTopicAvatar}
                />
              </View>
              <View style={styles.chatRoomTopicInfo}>
                <Text
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  style={{
                    color: STYLES.$COLORS.FONT_PRIMARY,
                    fontSize: STYLES.$FONT_SIZES.LARGE,
                    fontFamily: STYLES.$FONT_TYPES.BOLD,
                  }}
                >
                  Current Topic
                </Text>

                {currentChatroomTopic?.hasFiles == true ? (
                  getIconAttachment(currentChatroomTopic)
                ) : currentChatroomTopic?.state === 10 ? (
                  getIconAttachment(currentChatroomTopic)
                ) : currentChatroomTopic?.ogTags?.url !== null &&
                  currentChatroomTopic?.ogTags ? (
                  getIconAttachment(currentChatroomTopic)
                ) : (
                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={2}
                    style={{
                      color: STYLES.$COLORS.MSG,
                      fontSize: STYLES.$FONT_SIZES.MEDIUM,
                      fontFamily: STYLES.$FONT_TYPES.LIGHT,
                      lineHeight: 18,
                    }}
                  >
                    {decode({
                      text: currentChatroomTopic?.answer,
                      enableClick: false,
                      chatroomName: chatroomName,
                      communityId: user?.sdkClientInfo?.community,
                    })}
                  </Text>
                )}
              </View>
              <View>
                {currentChatroomTopic?.attachmentCount > 0 &&
                currentChatroomTopic?.attachments.length > 0 &&
                currentChatroomTopic?.attachments[0]?.type !==
                  DocumentType.PDF &&
                currentChatroomTopic?.attachments[0]?.type !==
                  DocumentType.VOICE_NOTE ? (
                  <Image
                    source={{
                      uri:
                        currentChatroomTopic?.attachments[0]?.type ==
                        DocumentType.IMAGE
                          ? currentChatroomTopic?.attachments[0]?.url
                          : currentChatroomTopic?.attachments[0]?.thumbnailUrl,
                    }}
                    style={styles.chatroomTopicAttachment}
                  />
                ) : currentChatroomTopic?.ogTags?.url !== null &&
                  currentChatroomTopic?.ogTags?.image !== "" &&
                  currentChatroomTopic?.ogTags !== undefined &&
                  currentChatroomTopic?.ogTags !== null &&
                  Object.keys(currentChatroomTopic).length !== 0 ? (
                  <Image
                    source={{
                      uri: currentChatroomTopic?.ogTags?.image,
                    }}
                    style={styles.chatroomTopicAttachment}
                  />
                ) : null}
              </View>
            </View>
          </Pressable>
        ) : null}
      </>
    );
  }
);

export default MessageList;
