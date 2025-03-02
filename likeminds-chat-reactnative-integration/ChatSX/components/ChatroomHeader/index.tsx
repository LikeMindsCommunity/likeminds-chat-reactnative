import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Keyboard,
  StatusBar,
} from "react-native";
import React, { useEffect, useMemo } from "react";
import { Client } from "../../client";
import {
  ChatroomContextValues,
  useChatroomContext,
} from "../../context/ChatroomContext";
import { styles } from "../../screens/ChatRoom/styles";
import { ChatroomType, Events, Keys } from "../../enums";
import STYLES from "../../constants/Styles";
import {
  CLEAR_CHATROOM_CONVERSATION,
  CLEAR_CHATROOM_DETAILS,
  CLEAR_CHATROOM_TOPIC,
  GET_CONVERSATIONS_SUCCESS,
  LONG_PRESSED,
  SELECTED_MESSAGES,
  SET_EDIT_MESSAGE,
  SET_IS_REPLY,
  SET_REPLY_MESSAGE,
  SHOW_TOAST,
} from "../../store/types/types";
import { LMChatAnalytics } from "../../analytics/LMChatAnalytics";
import { getConversationType } from "../../utils/analyticsUtils";
import { copySelectedMessages } from "../../commonFuctions";
import { useAppDispatch, useAppSelector } from "../../store";
import { VOICE_NOTE_TEXT } from "../../constants/Strings";
import AudioPlayer from "../../optionalDependecies/AudioPlayer";
import RNClipboard from "../../optionalDependecies/RNClipboard";
import CommunityClipboard from "../../optionalDependecies/CommunityClipboard";
import { RadialGradient } from "../../../ChatSX/radialGradient";
import { NavigateToGroupDetailsParams } from "../../../ChatSX/callBacks/type";
import { CallBack } from "../../../ChatSX/callBacks/callBackClass";
import Layout from "../../../ChatSX/constants/Layout";
import { SEARCH_IN_CHATROOM } from "../../constants/Screens";
import { useNavigation } from "@react-navigation/native";
import { isOtherUserAIChatbot } from "../../utils/chatroomUtils";

interface ChatroomHeaderProps {
  showChatroomIcon?: boolean;
  customChatroomUserTitle?: string;
  showThreeDotsOnHeader?: boolean;
  showThreeDotsOnSelectedHeader?: boolean;
  gradientStyling?: any;
  backIconPath?: string;
  groupIcon?: any;
  hideSearchIcon?: boolean;
}

const ChatroomHeader = ({
  showChatroomIcon,
  customChatroomUserTitle,
  showThreeDotsOnHeader,
  showThreeDotsOnSelectedHeader,
  gradientStyling,
  backIconPath,
  groupIcon,
  hideSearchIcon,
}: ChatroomHeaderProps) => {
  const myClient = Client.myClient;
  const {
    navigation,
    conversations,
    chatroomID,
    user,
    chatroomDetails,
    chatroomDBDetails,
    isLongPress,
    isReact,
    selectedMessages,
    currentChatroomTopic,
    chatroomType,
    chatroomFollowStatus,
    memberCanMessage,
    chatRequestState,
    chatroomName,
    chatroomProfile,
    filteredChatroomActions,
    modalVisible,
    refInput,

    setIsEditable,
    setReplyChatID,
    setModalVisible,
    setReportModalVisible,
    setIsReact,
    backAction,
  }: ChatroomContextValues = useChatroomContext();

  const lmChatInterface = CallBack.lmChatInterface;
  const chatroomHeaderStyles = STYLES.$CHATROOM_HEADER_STYLE;
  const chatroomNameHeaderStyle = chatroomHeaderStyles?.chatroomNameHeaderStyle;
  const chatroomSubHeaderStyle = chatroomHeaderStyles?.chatroomSubHeaderStyle;
  const chatroomSelectedHeaderIcons =
    chatroomHeaderStyles?.chatroomSelectedHeaderIcons;
  const isOtherUserChatbot = useMemo(() => {
    return isOtherUserAIChatbot(chatroomDBDetails, user);
  }, [chatroomDBDetails, user]);

  const dispatch = useAppDispatch();

  const { messageUploadInProgressId } = useAppSelector((state) => state.chatroom);

  // Initial header of chatroom screen
  const setInitialHeader = () => {
    navigation.setOptions({
      title: "",
      headerShadowVisible: false,
      headerLeft: () => (
        <View style={styles.headingContainer}>
          <TouchableOpacity
            onPress={() => {
              dispatch({
                type: CLEAR_CHATROOM_CONVERSATION,
                body: { conversations: [] },
              });
              dispatch({
                type: CLEAR_CHATROOM_DETAILS,
                body: { chatroomDBDetails: {} },
              });
              dispatch({ type: SET_IS_REPLY, body: { isReply: false } });
              dispatch({
                type: SET_REPLY_MESSAGE,
                body: { replyMessage: "" },
              });
              Keyboard.dismiss();
              backAction();
            }}
          >
            <Image
              source={
                backIconPath
                  ? backIconPath
                  : isOtherUserChatbot
                  ? require("../../assets/images/chatbot_arrow3x.png")
                  : require("../../assets/images/back_arrow3x.png")
              }
              style={
                backIconPath
                  ? styles.backOptionalBtn
                  : isOtherUserChatbot
                  ? styles.chatBotBackBtn
                  : styles.backBtn
              }
            />
          </TouchableOpacity>
          {!(Object.keys(chatroomDBDetails)?.length === 0) ? (
            <View style={styles.alignRow}>
              {chatroomType === ChatroomType.DMCHATROOM ? (
                <View style={styles.profile}>
                  <Image
                    source={
                      chatroomProfile
                        ? { uri: chatroomProfile }
                        : require("../../assets/images/default_pic.png")
                    }
                    style={styles.avatar}
                  />
                </View>
              ) : null}

              <View style={styles.chatRoomInfo}>
                <View>
                  {showChatroomIcon &&
                  chatroomType !== ChatroomType.DMCHATROOM ? (
                    <Image
                      source={
                        chatroomDBDetails?.chatroomImageUrl
                          ? { uri: chatroomDBDetails?.chatroomImageUrl }
                          : groupIcon
                      }
                      style={styles.avatar}
                    />
                  ) : null}
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      const params: NavigateToGroupDetailsParams = {
                        chatroom: chatroomDBDetails,
                      };
                      lmChatInterface.navigateToGroupDetails(params);
                    }}
                  >
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={{
                        color: chatroomNameHeaderStyle?.color
                          ? chatroomNameHeaderStyle?.color
                          : STYLES.$COLORS.FONT_PRIMARY,
                        fontSize: chatroomNameHeaderStyle?.fontSize
                          ? chatroomNameHeaderStyle?.fontSize
                          : STYLES.$FONT_SIZES.LARGE,
                        fontFamily: chatroomNameHeaderStyle?.fontFamily
                          ? chatroomNameHeaderStyle?.fontFamily
                          : STYLES.$FONT_TYPES.BOLD,
                        maxWidth: Layout.normalize(220),
                      }}
                    >
                      {chatroomName}
                    </Text>
                  </TouchableOpacity>
                  {chatroomType !== ChatroomType.DMCHATROOM ? (
                    <Text
                      style={{
                        color: chatroomSubHeaderStyle?.color
                          ? chatroomSubHeaderStyle?.color
                          : STYLES.$COLORS.MSG,
                        fontSize: chatroomSubHeaderStyle?.fontSize
                          ? chatroomSubHeaderStyle?.fontSize
                          : STYLES.$FONT_SIZES.SMALL,
                        fontFamily: chatroomSubHeaderStyle?.fontFamily
                          ? chatroomSubHeaderStyle?.fontFamily
                          : STYLES.$FONT_TYPES.LIGHT,
                        marginBottom: 3,
                      }}
                    >
                      {chatroomDetails?.participantCount != undefined
                        ? `${chatroomDetails?.participantCount} participants`
                        : ""}
                    </Text>
                  ) : chatroomType === ChatroomType.DMCHATROOM &&
                    customChatroomUserTitle ? (
                    <Text
                      style={{
                        color: chatroomSubHeaderStyle?.color
                          ? chatroomSubHeaderStyle?.color
                          : STYLES.$COLORS.MSG,
                        fontSize: chatroomSubHeaderStyle?.fontSize
                          ? chatroomSubHeaderStyle?.fontSize
                          : STYLES.$FONT_SIZES.SMALL,
                        fontFamily: chatroomSubHeaderStyle?.fontFamily
                          ? chatroomSubHeaderStyle?.fontFamily
                          : STYLES.$FONT_TYPES.LIGHT,
                      }}
                    >
                      {customChatroomUserTitle}
                    </Text>
                  ) : null}
                </View>
              </View>
            </View>
          ) : null}
        </View>
      ),
      headerRight: () =>
        filteredChatroomActions?.length > 0 &&
        showThreeDotsOnHeader && (
          <View style={styles.headerRight}>
            {!hideSearchIcon ? (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(SEARCH_IN_CHATROOM, {
                    chatroomId: chatroomID,
                  });
                }}
              >
                <Image
                  source={require("../../assets/images/search_icon3x.png")}
                  style={styles.threeDots}
                />
              </TouchableOpacity>
            ) : null}

            {chatroomDetails && !isOtherUserChatbot ? (
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Image
                  source={require("../../assets/images/three_dots3x.png")}
                  style={styles.threeDots}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        ),
      ...(gradientStyling && Object.keys(gradientStyling).length !== 0
        ? {
            headerBackground: () => (
              <View style={{ flex: 1 }}>
                <StatusBar
                  translucent
                  backgroundColor="transparent"
                  barStyle="light-content"
                />
                <RadialGradient {...gradientStyling} />
              </View>
            ),
          }
        : {}),
    });
  };

  // Selected header of chatroom screen
  const setSelectedHeader = () => {
    navigation.setOptions({
      title: "",
      headerShadowVisible: false,
      headerLeft: () => (
        <View style={styles.headingContainer}>
          <TouchableOpacity
            onPress={() => {
              setIsReact(false);
              dispatch({ type: SELECTED_MESSAGES, body: [] });
              dispatch({ type: LONG_PRESSED, body: false });
              setInitialHeader();
            }}
          >
            <Image
              source={
                isOtherUserChatbot
                  ? require("../../assets/images/chatbot_arrow3x.png")
                  : require("../../assets/images/blue_back_arrow3x.png")
              }
              style={[
                styles.selectedBackBtn,
                {
                  tintColor:
                    chatroomSelectedHeaderIcons?.tintColor !== undefined
                      ? chatroomSelectedHeaderIcons?.tintColor
                      : undefined,
                },
              ]}
            />
          </TouchableOpacity>
          <View style={styles.chatRoomInfo}>
            <Text
              style={{
                color: STYLES.$COLORS.FONT_PRIMARY,
                fontSize: STYLES.$FONT_SIZES.LARGE,
                fontFamily: STYLES.$FONT_TYPES.BOLD,
              }}
            >
              {selectedMessages?.length}
            </Text>
          </View>
        </View>
      ),
      headerRight: () => {
        const len = selectedMessages?.length;
        const communityManagerState = 1;
        let userCanDeleteParticularMessageArr: any = [];
        let selectedMessagesIDArr: any = [];
        let isCopy = false;
        let showCopyIcon = true;
        let isDelete = false;
        const isFirstMessageDeleted = selectedMessages[0]?.deletedBy;
        let isSelectedMessageEditable = false;
        const selectedMessagesLength = selectedMessages?.length;
        // check if selected message is user's own message to disable self report
        let isOwnMessage = selectedMessages.some((message) => {
          return message?.member?.uuid == user?.uuid;
        });

        //Logic to set isSelectedMessageEditable true/false, based on that we will show edit icon.
        if (selectedMessagesLength === 1) {
          if (
            selectedMessages[0]?.member?.id == user?.id &&
            !!selectedMessages[0]?.answer &&
            selectedMessages[0]?.deletedBy == null
          ) {
            isSelectedMessageEditable = true;
          } else {
            isSelectedMessageEditable = false;
          }
        } else {
          isSelectedMessageEditable = false;
        }

        //Logic to set isCopy, showCopyIcon, isDelete true/false, based on that we will show respective icons.
        for (let i = 0; i < selectedMessagesLength; i++) {
          if (selectedMessages[i]?.attachmentCount > 0) {
            showCopyIcon = false;
          }

          if (!selectedMessages[i]?.deletedBy && showCopyIcon) {
            isCopy = true;
          } else if (!showCopyIcon) {
            isCopy = false;
          }

          if (
            selectedMessages[i]?.member?.id == user?.id &&
            !selectedMessages[i]?.deletedBy
          ) {
            userCanDeleteParticularMessageArr = [
              ...userCanDeleteParticularMessageArr,
              true,
            ];
            selectedMessagesIDArr = [
              ...selectedMessagesIDArr,
              selectedMessages[i]?.id,
            ];
          } else {
            userCanDeleteParticularMessageArr = [
              ...userCanDeleteParticularMessageArr,
              false,
            ];
            selectedMessagesIDArr = [
              ...selectedMessagesIDArr,
              selectedMessages[i]?.id,
            ];
          }
        }

        if (userCanDeleteParticularMessageArr.includes(false)) {
          if (
            user?.state === communityManagerState &&
            userCanDeleteParticularMessageArr?.length === 1 &&
            !isFirstMessageDeleted
          ) {
            isDelete = true;
          } else {
            isDelete = false;
          }
        } else {
          isDelete = true;
        }

        selectedMessagesIDArr?.forEach((messageId) => {
          if (messageId == messageUploadInProgressId) {
            isDelete = false;
          }
        })


        return (
          <View style={styles.selectedHeadingContainer}>
            {len === 1 &&
              !isFirstMessageDeleted &&
              memberCanMessage &&
              chatroomFollowStatus &&
              !isOtherUserChatbot && (
                <TouchableOpacity
                  onPress={() => {
                    if (len > 0) {
                      setReplyChatID(selectedMessages[0]?.id);
                      setIsReact(false);
                      dispatch({ type: SET_IS_REPLY, body: { isReply: true } });
                      dispatch({
                        type: SET_REPLY_MESSAGE,
                        body: { replyMessage: selectedMessages[0] },
                      });
                      dispatch({ type: SELECTED_MESSAGES, body: [] });
                      dispatch({ type: LONG_PRESSED, body: false });
                      setInitialHeader();
                      refInput?.current.focus();
                      LMChatAnalytics.track(
                        Events.MESSAGE_REPLY,
                        new Map<string, string>([
                          [Keys.TYPE, getConversationType(selectedMessages[0])],
                          [Keys.CHATROOM_ID, chatroomID?.toString()],
                          [
                            Keys.REPLIED_TO_MEMBER_ID,
                            selectedMessages[0]?.member?.id,
                          ],
                          [
                            Keys.REPLIED_TO_MEMBER_STATE,
                            selectedMessages[0]?.member?.state,
                          ],
                          [Keys.REPLIED_TO_MESSAGE_ID, selectedMessages[0]?.id],
                        ])
                      );
                    }
                  }}
                >
                  <Image
                    source={require("../../assets/images/reply_icon3x.png")}
                    style={[
                      styles.threeDots,
                      {
                        tintColor:
                          chatroomSelectedHeaderIcons?.tintColor !== undefined
                            ? chatroomSelectedHeaderIcons?.tintColor
                            : undefined,
                      },
                    ]}
                  />
                </TouchableOpacity>
              )}

            {RNClipboard || CommunityClipboard ? (
              <>
                {len === 1 && !isFirstMessageDeleted && isCopy ? (
                  <TouchableOpacity
                    onPress={() => {
                      setIsReact(false);
                      const output = copySelectedMessages(
                        selectedMessages,
                        chatroomID
                      );
                      if (RNClipboard) {
                        RNClipboard?.setString(output);
                      }
                      if (CommunityClipboard) {
                        CommunityClipboard?.setString(output);
                      }
                      dispatch({ type: SELECTED_MESSAGES, body: [] });
                      dispatch({ type: LONG_PRESSED, body: false });
                      dispatch({
                        type: SHOW_TOAST,
                        body: { isToast: true, msg: "Message copied" },
                      });
                      setInitialHeader();
                    }}
                  >
                    <Image
                      source={require("../../assets/images/copy_icon3x.png")}
                      style={[
                        styles.threeDots,
                        {
                          tintColor:
                            chatroomSelectedHeaderIcons?.tintColor !== undefined
                              ? chatroomSelectedHeaderIcons?.tintColor
                              : undefined,
                        },
                      ]}
                    />
                  </TouchableOpacity>
                ) : len > 1 && isCopy ? (
                  <TouchableOpacity
                    onPress={() => {
                      setIsReact(false);
                      const output = copySelectedMessages(
                        selectedMessages,
                        chatroomID
                      );
                      if (RNClipboard) {
                        RNClipboard?.setString(output);
                      }
                      if (CommunityClipboard) {
                        CommunityClipboard?.setString(output);
                      }
                      dispatch({ type: SELECTED_MESSAGES, body: [] });
                      dispatch({ type: LONG_PRESSED, body: false });
                      setInitialHeader();
                    }}
                  >
                    <Image
                      source={require("../../assets/images/copy_icon3x.png")}
                      style={styles.threeDots}
                    />
                  </TouchableOpacity>
                ) : null}
              </>
            ) : null}

            {isSelectedMessageEditable &&
            !isOtherUserChatbot &&
            (chatroomType === ChatroomType.DMCHATROOM
              ? !!chatRequestState
              : true) ? ( // this condition checks in case of DM, chatRequestState != 0 && chatRequestState != null then only show edit Icon
              <TouchableOpacity
                onPress={() => {
                  setIsReact(false);
                  setIsEditable(true);
                  dispatch({
                    type: SET_EDIT_MESSAGE,
                    body: { editConversation: { ...selectedMessages[0] } },
                  });
                  dispatch({ type: SELECTED_MESSAGES, body: [] });
                  refInput.current.focus();
                }}
              >
                <Image
                  source={require("../../assets/images/edit_icon3x.png")}
                  style={[
                    styles.editIcon,
                    {
                      tintColor:
                        chatroomSelectedHeaderIcons?.tintColor !== undefined
                          ? chatroomSelectedHeaderIcons?.tintColor
                          : undefined,
                    },
                  ]}
                />
              </TouchableOpacity>
            ) : null}
            {isDelete && !isOtherUserChatbot && (
              <TouchableOpacity
                onPress={async () => {
                  setIsReact(false);
                  const res = await myClient
                    .deleteConversations({
                      conversationIds: selectedMessagesIDArr,
                      reason: "none",
                    })
                    .then(async () => {
                      dispatch({ type: SELECTED_MESSAGES, body: [] });
                      dispatch({ type: LONG_PRESSED, body: false });
                      let updatedConversations;
                      for (let i = 0; i < selectedMessagesIDArr.length; i++) {
                        LMChatAnalytics.track(
                          Events.MESSAGE_DELETED,
                          new Map<string, string>([
                            [
                              Keys.TYPE,
                              getConversationType(selectedMessages[i]),
                            ],
                            [Keys.CHATROOM_ID, chatroomID?.toString()],
                          ])
                        );
                        if (
                          selectedMessagesIDArr[i] == currentChatroomTopic?.id
                        ) {
                          dispatch({
                            type: CLEAR_CHATROOM_TOPIC,
                          });
                          updatedConversations =
                            await myClient?.deleteConversation(
                              selectedMessagesIDArr[i],
                              user,
                              conversations,
                              true,
                              chatroomID?.toString()
                            );
                        } else {
                          updatedConversations =
                            await myClient?.deleteConversation(
                              selectedMessagesIDArr[i],
                              user,
                              conversations,
                              false,
                              chatroomID?.toString()
                            );
                        }
                        // to stop audio player if we delete the message
                        const conversation: any =
                          await myClient.getConversation(
                            selectedMessagesIDArr[i]
                          );
                        if (
                          conversation[0]?.attachments[0]?.type ==
                          VOICE_NOTE_TEXT
                        ) {
                          AudioPlayer
                            ? await AudioPlayer?.default?.reset()
                            : null;
                        }
                      }
                      dispatch({
                        type: GET_CONVERSATIONS_SUCCESS,
                        body: { conversations: updatedConversations },
                      });
                      setInitialHeader();
                    })
                    .catch(() => {
                      Alert.alert("Delete message failed");
                    });
                }}
              >
                <Image
                  source={require("../../assets/images/delete_icon3x.png")}
                  style={[
                    styles.threeDots,
                    {
                      tintColor:
                        chatroomSelectedHeaderIcons?.tintColor !== undefined
                          ? chatroomSelectedHeaderIcons?.tintColor
                          : undefined,
                    },
                  ]}
                />
              </TouchableOpacity>
            )}

            {len === 1 &&
              !isOtherUserChatbot &&
              !isOwnMessage &&
              !isFirstMessageDeleted &&
              showThreeDotsOnSelectedHeader && (
                <TouchableOpacity
                  onPress={() => {
                    setIsReact(false);
                    setReportModalVisible(true);
                  }}
                >
                  <Image
                    source={require("../../assets/images/three_dots3x.png")}
                    style={[
                      styles.threeDots,
                      {
                        tintColor:
                          chatroomSelectedHeaderIcons?.tintColor !== undefined
                            ? chatroomSelectedHeaderIcons?.tintColor
                            : undefined,
                      },
                    ]}
                  />
                </TouchableOpacity>
              )}
          </View>
        );
      },
    });
  };

  // this useEffect update initial header when we get chatroomDetails.
  useEffect(() => {
    setInitialHeader();
  }, [chatroomDBDetails, chatroomDetails]);

  // this useEffect update headers when we longPress or update selectedMessages array.
  useEffect(() => {
    if (selectedMessages?.length === 0) {
      setInitialHeader();
    } else if (isLongPress) {
      setSelectedHeader();
    }
  }, [isLongPress, selectedMessages]);
  return <></>;
};

export default ChatroomHeader;
