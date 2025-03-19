import { View, Text, TouchableOpacity, Image, SafeAreaView, Keyboard } from "react-native";
import React, { useLayoutEffect, useMemo, useState } from "react";
import { ChatroomChatRequestState, ChatroomType } from "../../enums";
import { styles } from "../../screens/ChatRoom/styles";
import {
  ChatroomContextValues,
  useChatroomContext,
} from "../../context/ChatroomContext";
import { EXPLORE_FEED, HOMEFEED } from "../../constants/Screens";
import STYLES from "../../constants/Styles";
import {
  APPROVE_BUTTON,
  COMMUNITY_MANAGER_DISABLED_CHAT,
  DM_BLOCKED_USER,
  DM_REQUEST_SENT_MESSAGE,
  REJECT_BUTTON,
  REQUEST_SENT,
} from "../../constants/Strings";
import { LMChatTextView } from "../../uiComponents";
import { isOtherUserAIChatbot } from "../../utils/chatroomUtils"

interface HintMessages {
  messageForRightsDisabled?: string;
  messageForMemberCanMessage?: string;
  messageForAnnouncementRoom?: string;
  respondingDisabled?: string;
}

interface MessageInput {
  children?: React.ReactNode;
  joinSecretChatroomProp?: () => void;
  showJoinAlertProp?: () => void;
  showRejectAlertProp?: () => void;
  hintMessages?: HintMessages;
  conversationMetaData?: Record<string, any>;
}

const MessageInput = ({
  children,
  joinSecretChatroomProp,
  showJoinAlertProp,
  showRejectAlertProp,
  hintMessages,
  conversationMetaData,
}: MessageInput) => {
  const {
    navigation,
    chatroomID,
    showDM,
    user,
    memberRights,
    chatroomWithUser,
    chatroomDBDetails,
    currentChatroomTopic,
    chatroomType,
    replyChatID,
    isEditable,
    isRealmDataPresent,
    chatroomFollowStatus,
    chatroomDBDetailsLength,
    chatRequestState,
    chatroomName,
    previousRoute,
    isSecret,
    refInput,
    filteredChatroomActions,

    setIsEditable,
    joinSecretChatroom,
    showJoinAlert,
    showRejectAlert,
    handleDMApproveClick,
    handleDMRejectClick,
    handleFileUpload,
  }: ChatroomContextValues = useChatroomContext();
  const messageForRightsDisabled = hintMessages?.messageForRightsDisabled;
  const messageForMemberCanMessage = hintMessages?.messageForMemberCanMessage;
  const messageForAnnouncementRoom = hintMessages?.messageForAnnouncementRoom;
  const respondingDisabled = hintMessages?.respondingDisabled;
  const isOtherUserChatbot = useMemo(() => {
    return isOtherUserAIChatbot(chatroomDBDetails, user)
  }, [user, chatroomDBDetails]);

  const [isKeyBoardFocused, setIsKeyBoardFocused] = useState(false);

  useLayoutEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyBoardFocused(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyBoardFocused(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <View
      style={{
        marginTop: "auto",
      }}
    >
      {/* if chatroomType !== 10 (Not DM) then show group bottom changes, else if chatroomType === 10 (DM) then show DM bottom changes */}
      {chatroomType !== ChatroomType.DMCHATROOM && memberRights?.length > 0 ? (
        <View>
          {!(chatroomDBDetailsLength === 0) &&
          previousRoute?.name === EXPLORE_FEED
            ? !chatroomFollowStatus && (
                <TouchableOpacity
                  onPress={() => {
                    joinSecretChatroomProp
                      ? joinSecretChatroomProp()
                      : joinSecretChatroom();
                  }}
                  style={[styles.joinBtnContainer, { alignSelf: "center" }]}
                >
                  <Image
                    source={require("../../assets/images/join_group3x.png")}
                    style={styles.icon}
                  />
                  <Text style={styles.join}>{"Join"}</Text>
                </TouchableOpacity>
              )
            : null}
          {!(chatroomDBDetailsLength === 0) ? (
            //case to block normal user from messaging in a chatroom where only CMs can message
            user.state !== 1 &&
            chatroomDBDetails?.memberCanMessage === false ? (
              <View style={styles.disabledInput}>
                <Text style={styles.disabledInputText}>
                  {messageForMemberCanMessage
                    ? messageForMemberCanMessage
                    : "Only Community Manager can message here."}
                </Text>
              </View>
            ) : //case to allow CM for messaging in an Announcement Room
            !(user.state !== 1 && chatroomDBDetails?.type === 7) &&
              chatroomFollowStatus &&
              memberRights[3]?.isSelected === true ? (
              <>{children}</>
            ) : //case to block normal users from messaging in an Announcement Room
            user.state !== 1 && chatroomDBDetails?.type === 7 ? (
              <View style={styles.disabledInput}>
                <Text style={styles.disabledInputText}>
                  {messageForAnnouncementRoom
                    ? messageForAnnouncementRoom
                    : "Only Community Manager can message here."}
                </Text>
              </View>
            ) : memberRights[3]?.isSelected === false ? (
              <View style={styles.disabledInput}>
                <Text style={styles.disabledInputText}>
                  {messageForRightsDisabled
                    ? messageForRightsDisabled
                    : " The community managers have restricted you from responding here."}
                </Text>
              </View>
            ) : !(Object.keys(chatroomDBDetails)?.length === 0) &&
              previousRoute?.name === HOMEFEED &&
              isRealmDataPresent ? (
              <View
                style={{
                  padding: 20,
                  backgroundColor: STYLES.$COLORS.TERTIARY,
                }}
              >
                <Text
                  style={styles.inviteText}
                >{`${chatroomDBDetails?.header} invited you to join this secret group.`}</Text>
                <View style={{ marginTop: 10 }}>
                  <TouchableOpacity
                    onPress={() => {
                      showJoinAlertProp ? showJoinAlertProp() : showJoinAlert();
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      flexGrow: 1,
                      paddingVertical: 10,
                    }}
                  >
                    <Image
                      style={styles.emoji}
                      source={require("../../assets/images/like_icon3x.png")}
                    />
                    <Text style={styles.inviteBtnText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      showRejectAlertProp
                        ? showRejectAlertProp()
                        : showRejectAlert();
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      flexGrow: 1,
                      paddingVertical: 10,
                    }}
                  >
                    <Image
                      style={styles.emoji}
                      source={require("../../assets/images/ban_icon3x.png")}
                    />
                    <Text style={styles.inviteBtnText}>{REJECT_BUTTON}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.disabledInput}>
                <Text style={styles.disabledInputText}>
                  {respondingDisabled
                    ? respondingDisabled
                    : "Responding is disabled"}
                </Text>
              </View>
            )
          ) : (
            <View style={styles.disabledInput}>
              <Text style={styles.disabledInputText}>Loading...</Text>
            </View>
          )}
        </View>
      ) : chatroomType === ChatroomType.DMCHATROOM &&
        memberRights?.length > 0 ? (
        <View>
          {chatRequestState === ChatroomChatRequestState.INITIATED &&
          (chatroomDBDetails?.chatRequestedBy
            ? chatroomDBDetails?.chatRequestedBy?.id !== user?.id?.toString()
            : null) ? (
            <View style={styles.dmRequestView}>
              <Text style={styles.inviteText}>{DM_REQUEST_SENT_MESSAGE}</Text>
              <View style={styles.dmRequestButtonBox}>
                <TouchableOpacity
                  onPress={() => {
                    handleDMApproveClick();
                  }}
                  style={styles.requestMessageTextButton}
                >
                  <Image
                    style={styles.emoji}
                    source={require("../../assets/images/like_icon3x.png")}
                  />
                  <Text style={styles.inviteBtnText}>{APPROVE_BUTTON}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleDMRejectClick();
                  }}
                  style={styles.requestMessageTextButton}
                >
                  <Image
                    style={styles.emoji}
                    source={require("../../assets/images/ban_icon3x.png")}
                  />
                  <Text style={styles.inviteBtnText}>{REJECT_BUTTON}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
          {showDM === false ? (
            <View style={styles.disabledInput}>
              <Text style={styles.disabledInputText}>
                {COMMUNITY_MANAGER_DISABLED_CHAT}
              </Text>
            </View>
          ) : showDM === true &&
            (chatRequestState === ChatroomChatRequestState.INITIATED ||
              chatRequestState === ChatroomChatRequestState.REJECTED) ? (
            chatRequestState === ChatroomChatRequestState.REJECTED &&
            chatroomDBDetails?.chatRequestedBy?.id == user?.id?.toString() ? (
              <View style={styles.disabledInput}>
                <Text style={styles.disabledInputText}>{DM_BLOCKED_USER}</Text>
              </View>
            ) : (
              <View style={styles.disabledInput}>
                <Text style={styles.disabledInputText}>{REQUEST_SENT}</Text>
              </View>
            )
          ) : (showDM === true &&
              chatRequestState === ChatroomChatRequestState.ACCEPTED) ||
            chatRequestState === null ? (
            <>{children}</>
          ) : (
            <View style={styles.disabledInput}>
              <Text style={styles.disabledInputText}>Loading...</Text>
            </View>
          )}
        </View>
      ) : null}
      <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center' }}>
        {
          isOtherUserChatbot ? 
          <LMChatTextView textStyle={{
            fontSize: 13,
            color: "#999999",
          }}>
            AI may make mistakes.
          </LMChatTextView> : <></>
        }
      </SafeAreaView>
    </View>
  );
};

export default MessageInput;
