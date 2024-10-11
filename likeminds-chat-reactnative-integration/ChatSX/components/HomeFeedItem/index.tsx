import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Pressable,
  Platform,
  TextStyle,
  ImageStyle,
} from "react-native";
import { decode } from "../../commonFuctions";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  ACCEPT_INVITE,
  ACCEPT_INVITE_SUCCESS,
  REJECT_INVITE_SUCCESS,
  SET_PAGE,
  SHOW_TOAST,
} from "../../store/types/types";
import { styles } from "./styles";
import STYLES from "../../constants/Styles";
import { CHATROOM } from "../../constants/Screens";
import {
  CANCEL_BUTTON,
  CAPITAL_GIF_TEXT,
  CONFIRM_BUTTON,
  DELETED_MESSAGE,
  IMAGE_TEXT,
  MESSAGE_NOT_SUPPORTED,
  PDF_TEXT,
  VIDEO_TEXT,
} from "../../constants/Strings";
import Layout from "../../constants/Layout";
import { paginatedSyncAPI } from "../../utils/syncChatroomApi";
import { ChatroomChatRequestState } from "../../enums";
import { ChatroomType } from "../../enums";
import { DocumentType } from "../../enums";
import { Client } from "../../client";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AudioPlayer from "../../optionalDependecies/AudioPlayer";

interface Props {
  avatar: string;
  title: string;
  lastMessage: string;
  time: string;
  pinned: boolean;
  unreadCount: number;
  lastConversation: any;
  chatroomID: number;
  lastConversationMember?: string;
  isSecret: boolean;
  deletedBy?: string;
  inviteReceiver?: any;
  chatroomType: number;
  muteStatus: boolean;
}

const HomeFeedItem: React.FC<Props> = ({
  avatar,
  title,
  lastMessage,
  time,
  pinned = false,
  unreadCount,
  lastConversation,
  chatroomID,
  lastConversationMember,
  isSecret,
  deletedBy,
  inviteReceiver,
  chatroomType,
  muteStatus,
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.homefeed);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const myClient = Client.myClient;
  const homeFeedStyles = STYLES.$HOME_FEED_STYLE;
  const unreadCountStyle = homeFeedStyles.unreadCount;
  const lastConversationTime = homeFeedStyles.lastConversationTime;
  const titleStyle = homeFeedStyles.title;
  const lastConversationStyle = homeFeedStyles.lastConversation;
  const avatarStyles = homeFeedStyles.avatar;

  const showJoinAlert = () =>
    Alert.alert(
      "Join this chatroom?",
      "You are about to join this secret chatroom.",
      [
        {
          text: CANCEL_BUTTON,
          style: "default",
        },
        {
          text: CONFIRM_BUTTON,
          onPress: async () => {
            await myClient?.inviteAction({
              channelId: `${chatroomID}`,
              inviteStatus: 1,
            });
            dispatch({
              type: SHOW_TOAST,
              body: { isToast: true, msg: "Invitation accepted" },
            });
            dispatch({ type: ACCEPT_INVITE_SUCCESS, body: chatroomID });
            dispatch({ type: SET_PAGE, body: 1 });
            await paginatedSyncAPI(1, user, false);
          },
          style: "default",
        },
      ],
      {
        cancelable: false,
      }
    );

  const showRejectAlert = () =>
    Alert.alert(
      "Reject Invitation?",
      "Are you sure you want to reject the invitation to join this chatroom?",
      [
        {
          text: CANCEL_BUTTON,
          style: "default",
        },
        {
          text: CONFIRM_BUTTON,
          onPress: async () => {
            await myClient?.inviteAction({
              channelId: `${chatroomID}`,
              inviteStatus: 2,
            });
            dispatch({
              type: SHOW_TOAST,
              body: { isToast: true, msg: "Invitation rejected" },
            });

            dispatch({ type: REJECT_INVITE_SUCCESS, body: chatroomID });
          },
          style: "default",
        },
      ],
      {
        cancelable: false,
      }
    );

  const getFeedIconAttachment = (val: any) => {
    const attachments = val.attachments;
    let imageCount = 0;
    let videosCount = 0;
    let pdfCount = 0;
    let voiceNoteCount = 0;
    let gifCount = 0;
    const ogTags = val?.ogTags;

    for (let i = 0; i < attachments.length; i++) {
      if (attachments[i].type == DocumentType.IMAGE) {
        imageCount++;
      } else if (attachments[i].type == DocumentType.VIDEO) {
        videosCount++;
      } else if (attachments[i].type == DocumentType.PDF) {
        pdfCount++;
      } else if (attachments[i].type == DocumentType.VOICE_NOTE) {
        voiceNoteCount++;
      } else if (attachments[i].type == DocumentType.GIF_TEXT) {
        gifCount++;
      }
    }

    if (imageCount > 0 && videosCount > 0 && pdfCount > 0) {
      return (
        <View style={styles.alignCenter}>
          <View style={styles.alignCenter}>
            <Text style={styles.attachment_msg}>{imageCount}</Text>
            <Image
              source={require("../../assets/images/image_icon3x.png")}
              style={styles.icon}
            />
          </View>
          <View style={styles.alignCenter}>
            <Text style={styles.attachment_msg}>{videosCount}</Text>
            <Image
              source={require("../../assets/images/video_icon3x.png")}
              style={styles.icon}
            />
          </View>
          <View style={styles.alignCenter}>
            <Text style={styles.attachment_msg}>{pdfCount}</Text>
            <Image
              source={require("../../assets/images/document_icon3x.png")}
              style={styles.icon}
            />
          </View>
        </View>
      );
    } else if (imageCount > 0 && videosCount > 0) {
      return (
        <View style={styles.alignCenter}>
          <View style={styles.alignCenter}>
            <Text style={styles.attachment_msg}>{imageCount}</Text>
            <Image
              source={require("../../assets/images/image_icon3x.png")}
              style={styles.icon}
            />
          </View>
          <View style={styles.alignCenter}>
            <Text style={styles.attachment_msg}>{videosCount}</Text>
            <Image
              source={require("../../assets/images/video_icon3x.png")}
              style={styles.icon}
            />
          </View>
        </View>
      );
    } else if (videosCount > 0 && pdfCount > 0) {
      return (
        <View style={styles.alignCenter}>
          <View style={styles.alignCenter}>
            <Text style={styles.attachment_msg}>{videosCount}</Text>
            <Image
              source={require("../../assets/images/video_icon3x.png")}
              style={styles.icon}
            />
          </View>
          <View style={styles.alignCenter}>
            <Text style={styles.attachment_msg}>{pdfCount}</Text>
            <Image
              source={require("../../assets/images/document_icon3x.png")}
              style={styles.icon}
            />
          </View>
        </View>
      );
    } else if (imageCount > 0 && pdfCount > 0) {
      return (
        <View style={styles.alignCenter}>
          <View style={styles.alignCenter}>
            <Text style={styles.attachment_msg}>{imageCount}</Text>
            <Image
              source={require("../../assets/images/image_icon3x.png")}
              style={styles.icon}
            />
          </View>
          <View style={styles.alignCenter}>
            <Text style={styles.attachment_msg}>{pdfCount}</Text>
            <Image
              source={require("../../assets/images/document_icon3x.png")}
              style={styles.icon}
            />
          </View>
        </View>
      );
    } else if (pdfCount > 0) {
      return (
        <View style={[styles.alignCenter]}>
          {pdfCount > 1 && (
            <Text style={styles.attachment_msg}>{pdfCount}</Text>
          )}
          <Image
            source={require("../../assets/images/document_icon3x.png")}
            style={styles.icon}
          />
          <Text style={styles.attachment_msg}>
            {pdfCount > 1 ? "Documents" : "Document"}
          </Text>
        </View>
      );
    } else if (videosCount > 0) {
      return (
        <View
          style={[
            styles.alignCenter,
            {
              marginBottom: Layout.normalize(-2),
            },
          ]}
        >
          {videosCount > 1 && (
            <Text style={styles.attachment_msg}>{videosCount}</Text>
          )}
          <Image
            source={require("../../assets/images/video_icon3x.png")}
            style={[
              styles.icon,
              {
                height:
                  Platform.OS === "ios"
                    ? Layout.normalize(15)
                    : Layout.normalize(10),
              },
            ]}
          />
          <Text style={styles.attachment_msg}>
            {videosCount > 1 ? "Videos" : "Video"}
          </Text>
        </View>
      );
    } else if (imageCount > 0) {
      return (
        <View
          style={[
            styles.alignCenter,
            {
              marginBottom: Layout.normalize(-2),
            },
          ]}
        >
          {imageCount > 1 && (
            <Text style={styles.attachment_msg}>{imageCount}</Text>
          )}
          <Image
            source={require("../../assets/images/image_icon3x.png")}
            style={styles.icon}
          />
          <Text style={styles.attachment_msg}>
            {imageCount > 1 ? "Photos" : "Photo"}
          </Text>
        </View>
      );
    } else if (voiceNoteCount > 0 && AudioPlayer != undefined) {
      return (
        <View
          style={[
            styles.alignCenter,
            {
              marginBottom: Layout.normalize(-2),
            },
          ]}
        >
          <Image
            source={require("../../assets/images/mic_icon3x.png")}
            style={[styles.icon, { tintColor: "grey" }]}
          />
          <Text style={styles.attachment_msg}>{"Voice Note"}</Text>
        </View>
      );
    } else if (gifCount > 0) {
      return (
        <View
          style={[
            styles.alignCenter,
            {
              marginBottom: Layout.normalize(-2),
              gap: Layout.normalize(5),
            },
          ]}
        >
          <View style={styles.gifView}>
            <Text style={styles.gifText}>{CAPITAL_GIF_TEXT}</Text>
          </View>
          <Text style={styles.attachment_msg}>{CAPITAL_GIF_TEXT}</Text>
        </View>
      );
    } else if (val?.state === 10) {
      return (
        <View style={[styles.alignCenter]}>
          <Image
            source={require("../../assets/images/poll_icon3x.png")}
            style={[styles.icon, { tintColor: STYLES.$COLORS.PRIMARY }]}
          />
          <Text style={styles.attachment_msg}>{val?.answer}</Text>
        </View>
      );
    } else if (ogTags && ogTags?.title != null) {
      return (
        <View
          style={[
            styles.alignCenter,
            {
              marginBottom: Layout.normalize(-2),
            },
          ]}
        >
          <Image
            source={require("../../assets/images/link_icon.png")}
            style={styles.icon}
          />
          <Text style={styles.attachment_msg}>{val?.answer}</Text>
        </View>
      );
    } else {
      return <Text style={styles.deletedMessage}>{MESSAGE_NOT_SUPPORTED}</Text>;
    }
  };

  return (
    <Pressable
      onPress={() => {
        // TODO - Currently from backend we don't get the secret chatroom data without accepting or rejecting the invitation, so diabling the click for now so user can't go inside an invited secret chatroom without accepting the invitation
        if (inviteReceiver) {
          return;
        }
        setTimeout(() => {
          navigation.navigate(CHATROOM, {
            chatroomID: chatroomID,
            isInvited: inviteReceiver ? true : false,
          });
        }, 300);
      }}
      style={({ pressed }) => [
        { opacity: pressed ? 0.5 : 1.0 },
        styles.itemContainer,
      ]}
    >
      <View>
        <Image
          source={
            avatar
              ? { uri: avatar }
              : require("../../assets/images/default_pic.png")
          }
          style={
            [
              styles.avatar,
              avatarStyles?.borderRadius && {
                borderRadius: avatarStyles?.borderRadius,
              },
            ] as ImageStyle
          }
        />
        {chatroomType === ChatroomType.DMCHATROOM ? (
          <View style={styles.dmAvatarBubble}>
            <Image
              source={require("../../assets/images/dm_message_bubble3x.png")}
              style={
                [
                  styles.dmAvatarBubbleImg,
                  avatarStyles?.borderRadius && {
                    borderRadius: avatarStyles?.borderRadius,
                  },
                ] as ImageStyle
              }
            />
          </View>
        ) : null}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.headerContainer}>
          <Text
            style={
              [
                styles.title,
                titleStyle?.color && {
                  color: titleStyle?.color,
                },
                titleStyle?.fontSize && {
                  fontSize: titleStyle?.fontSize,
                },
                titleStyle?.fontFamily && {
                  fontFamily: titleStyle?.fontFamily,
                },
              ] as TextStyle
            }
            numberOfLines={1}
          >
            {title}
            {isSecret ? (
              <Image
                source={require("../../assets/images/lock_icon3x.png")}
                style={styles.lockIcon}
              />
            ) : null}
          </Text>
          {time ? (
            <Text
              style={
                [
                  styles.time,
                  lastConversationTime?.color && {
                    color: lastConversationTime?.color,
                  },
                  lastConversationTime?.fontSize && {
                    fontSize: lastConversationTime?.fontSize,
                  },
                  lastConversationTime?.fontFamily && {
                    fontFamily: lastConversationTime?.fontFamily,
                  },
                ] as TextStyle
              }
            >
              {time}
            </Text>
          ) : null}
        </View>
        {!!lastConversation && !inviteReceiver ? (
          <Text
            numberOfLines={1}
            style={[
              styles.parentLastMessage,
              {
                width: "80%",
              },
            ]}
          >
            {deletedBy !== "null" &&
            deletedBy !== null &&
            deletedBy !== undefined ? (
              <Text style={styles.deletedMessage}>{DELETED_MESSAGE}</Text>
            ) : (
              <Text
                style={[
                  styles.alignCenter,
                  {
                    overflow: "hidden",
                  },
                ]}
              >
                {chatroomType !== ChatroomType.DMCHATROOM ? (
                  <Text
                    style={styles.lastMessage}
                  >{`${lastConversationMember == user?.name ? "You" : lastConversationMember}: `}</Text>
                ) : null}

                <Text
                  numberOfLines={1}
                  style={
                    [
                      styles.parentLastMessage,
                      lastConversationStyle?.color && {
                        color: lastConversationStyle?.color,
                      },
                      lastConversationStyle?.fontSize && {
                        fontSize: lastConversationStyle?.fontSize,
                      },
                      lastConversationStyle?.fontFamily && {
                        fontFamily: lastConversationStyle?.fontFamily,
                      },
                    ] as TextStyle
                  }
                >
                  {lastConversation.hasFiles > 0
                    ? getFeedIconAttachment(lastConversation)
                    : lastConversation?.state === 10
                    ? getFeedIconAttachment(lastConversation)
                    : lastConversation?.ogTags &&
                      lastConversation?.ogTags?.url !== null
                    ? getFeedIconAttachment(lastConversation)
                    : decode({
                        text: lastMessage,
                        enableClick: false,
                        chatroomName: title,
                        communityId: user?.sdkClientInfo?.community,
                      })}
                </Text>
              </Text>
            )}
          </Text>
        ) : inviteReceiver ? (
          <Text
            style={styles.lastMessage}
          >{`${"Member"} invited you to join `}</Text>
        ) : null}
      </View>
      {!lastConversation && !!inviteReceiver ? (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: Layout.normalize(10),
          }}
        >
          <TouchableOpacity
            onPress={() => {
              showRejectAlert();
            }}
            style={styles.inviteIcon}
          >
            <Image
              style={styles.secretInviteIcons}
              source={require("../../assets/images/invite_cross3x.png")}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              showJoinAlert();
            }}
            style={[styles.inviteIcon, { borderColor: "#5046E5" }]}
          >
            <Image
              style={styles.secretInviteIcons}
              source={require("../../assets/images/invite_tick3x.png")}
            />
          </TouchableOpacity>
        </View>
      ) : null}
      {/* {pinned && <View style={styles.pinned} />} */}
      {muteStatus ? (
        <View
          style={[
            styles.unreadCountContainer,
            { backgroundColor: "transparent" },
            unreadCount > 0 ? { right: Layout.normalize(45) } : null,
          ]}
        >
          <Image
            source={require("../../assets/images/mute_icon.png")}
            style={[styles.muteIcon, { tintColor: "#5A5A5A" }]}
          />
        </View>
      ) : null}
      {unreadCount ? (
        unreadCount > 100 ? (
          <View style={styles.unreadCountContainer}>
            <Text
              style={
                [
                  styles.unreadCount,
                  unreadCountStyle?.color && {
                    color: unreadCountStyle?.color,
                  },
                  unreadCountStyle?.fontSize && {
                    fontSize: unreadCountStyle?.fontSize,
                  },
                  unreadCountStyle?.fontFamily && {
                    fontFamily: unreadCountStyle?.fontFamily,
                  },
                  unreadCountStyle?.borderRadius && {
                    borderRadius: unreadCountStyle?.borderRadius,
                  },
                  unreadCountStyle?.backgroundColor && {
                    backgroundColor: unreadCountStyle?.backgroundColor,
                  },
                ] as TextStyle
              }
            >
              99+
            </Text>
          </View>
        ) : (
          <View style={styles.unreadCountContainer}>
            <Text
              style={
                [
                  styles.unreadCount,
                  unreadCountStyle?.color && {
                    color: unreadCountStyle?.color,
                  },
                  unreadCountStyle?.fontSize && {
                    fontSize: unreadCountStyle?.fontSize,
                  },
                  unreadCountStyle?.fontFamily && {
                    fontFamily: unreadCountStyle?.fontFamily,
                  },
                  unreadCountStyle?.borderRadius && {
                    borderRadius: unreadCountStyle?.borderRadius,
                  },
                  unreadCountStyle?.backgroundColor && {
                    backgroundColor: unreadCountStyle?.backgroundColor,
                  },
                ] as TextStyle
              }
            >
              {unreadCount}
            </Text>
          </View>
        )
      ) : null}
    </Pressable>
  );
};

export default HomeFeedItem;
