import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  TextStyle,
} from "react-native";
import STYLES from "../../constants/Styles";
import { useAppDispatch, useAppSelector } from "../../store";
import { getExploreFeedData } from "../../store/actions/explorefeed";
import {
  SET_EXPLORE_FEED_PAGE,
  SET_PAGE,
  TO_BE_DELETED,
} from "../../store/types/types";
import ToastMessage from "../ToastMessage";
import { styles } from "./styles";
import { CHATROOM } from "../../constants/Screens";
import { Events, Keys, Sources } from "../../enums";
import { LMChatAnalytics } from "../../analytics/LMChatAnalytics";
import { CHATROOM_JOINED, CHATROOM_LEFT } from "../../constants/Strings";
import { Client } from "../../client";

interface Props {
  avatar: string;
  header: string;
  title: string;
  lastMessage: string;
  pinned: boolean;
  isJoined: boolean;
  participants: number;
  messageCount: number;
  externalSeen: number;
  isSecret: boolean;
  chatroomID: number;
  filterState: any;
  navigation: any;
  participantsIconPath: any;
  totalMessagesIconPath: any;
  joinButtonPath: any;
  joinedButtonPath: any;
}

const ExploreFeedItem: React.FC<Props> = ({
  avatar,
  header,
  title,
  lastMessage,
  pinned = false,
  isJoined = false,
  participants,
  messageCount,
  externalSeen,
  isSecret,
  chatroomID,
  filterState,
  navigation,
  participantsIconPath,
  totalMessagesIconPath,
  joinButtonPath,
  joinedButtonPath,
}) => {
  const [isToast, setIsToast] = useState(false);
  const [msg, setMsg] = useState("");
  const { user } = useAppSelector((state) => state.homefeed);
  const [isChatroomJoined, setIsChatroomJoined] = useState(isJoined);

  const exploreChatroomStyles = STYLES?.$EXPLORE_CHATROOM_STYLE;
  const chatroomTitle = exploreChatroomStyles?.chatroomTitle;
  const chatroomSubTitle = exploreChatroomStyles?.chatroomSubTitle;
  const chatroomDescription = exploreChatroomStyles?.chatroomDescription;
  const joinButton = exploreChatroomStyles?.joinButton;
  const joinedButton = exploreChatroomStyles?.joinedButton;

  const myClient = Client?.myClient;

  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsChatroomJoined(isJoined);
  }, [isJoined]);

  const leaveChatroom = async (val: boolean) => {
    try {
      const payload = {
        collabcardId: chatroomID,
        uuid: user?.sdkClientInfo?.uuid,
        value: val,
      };
      const res = await myClient.followChatroom(payload);
      if (res?.success) {
        setIsChatroomJoined(!isChatroomJoined);
        const payload = {
          orderType: filterState,
          page: 1,
        };
        if (val) {
          setMsg(CHATROOM_JOINED);
          setIsToast(true);
          await myClient?.updateChatroomFollowStatus(
            chatroomID?.toString(),
            true
          );
          LMChatAnalytics.track(
            Events.CHAT_ROOM_FOLLOWED,
            new Map<string, string>([
              [Keys.CHATROOM_ID, chatroomID?.toString()],
              [Keys.COMMUNITY_ID, user?.sdkClientInfo?.community?.toString()],
              [Keys.SOURCE, Sources.COMMUNITY_FEED],
            ])
          );
        } else {
          setMsg(CHATROOM_LEFT);
          setIsToast(true);
          // Updating the followStatus of chatroom to false in case of leaving the chatroo
          await myClient?.updateChatroomFollowStatus(
            chatroomID?.toString(),
            false
          );
          LMChatAnalytics.track(
            Events.CHAT_ROOM_UN_FOLLOWED,
            new Map<string, string>([
              [Keys.CHATROOM_ID, chatroomID?.toString()],
              [Keys.COMMUNITY_ID, user?.sdkClientInfo?.community?.toString()],
              [Keys.SOURCE, Sources.COMMUNITY_FEED],
            ])
          );
        }
        dispatch({ type: SET_EXPLORE_FEED_PAGE, body: 1 });
        await dispatch(getExploreFeedData(payload) as any);
      }
    } catch (error) {
      // process error
    }
  };
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(CHATROOM, { chatroomID: chatroomID });
      }}
      style={styles.itemContainer}
    >
      <View>
        <Image
          source={
            avatar
              ? { uri: avatar }
              : require("../../assets/images/default_pic.png")
          }
          style={styles.avatar}
        />
        {pinned && (
          <View style={styles.pinnedIconParent}>
            <Image
              source={require("../../assets/images/pin_icon_white3x.png")}
              style={styles.pinnedIcon}
            />
          </View>
        )}

        {!externalSeen && !pinned && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>New</Text>
          </View>
        )}
      </View>

      <View style={styles.infoParent}>
        <View style={styles.infoContainer}>
          <View>
            <View style={styles.headerContainer}>
              <Text
                style={
                  [
                    styles.title,
                    chatroomTitle?.color && {
                      color: chatroomTitle?.color,
                    },
                    chatroomTitle?.fontSize && {
                      fontSize: chatroomTitle?.fontSize,
                    },
                    chatroomTitle?.fontFamily && {
                      fontFamily: chatroomTitle?.fontFamily,
                    },
                  ] as TextStyle[]
                }
                numberOfLines={1}
              >
                {header}
                {isSecret ? (
                  <Image
                    source={require("../../assets/images/lock_icon3x.png")}
                    style={styles.lockIcon}
                  />
                ) : null}
              </Text>
            </View>
            <View style={styles.info}>
              <Image
                source={
                  participantsIconPath
                    ? participantsIconPath
                    : require("../../assets/images/participants_icon3x.png")
                }
                style={styles.info_icons}
              />
              <Text
                style={
                  [
                    styles.lastMessage,
                    chatroomSubTitle?.color && {
                      color: chatroomSubTitle?.color,
                    },
                    chatroomSubTitle?.fontSize && {
                      fontSize: chatroomSubTitle?.fontSize,
                    },
                    chatroomSubTitle?.fontFamily && {
                      fontFamily: chatroomSubTitle?.fontFamily,
                    },
                  ] as TextStyle[]
                }
                numberOfLines={1}
              >{`${participants} • `}</Text>
              <Image
                source={
                  totalMessagesIconPath
                    ? totalMessagesIconPath
                    : require("../../assets/images/message_icon3x.png")
                }
                style={styles.info_icons}
              />
              <Text
                style={
                  [
                    styles.lastMessage,
                    chatroomSubTitle?.color && {
                      color: chatroomSubTitle?.color,
                    },
                    chatroomSubTitle?.fontSize && {
                      fontSize: chatroomSubTitle?.fontSize,
                    },
                    chatroomSubTitle?.fontFamily && {
                      fontFamily: chatroomSubTitle?.fontFamily,
                    },
                  ] as TextStyle[]
                }
                numberOfLines={1}
              >{`${messageCount}`}</Text>
            </View>
          </View>
          {/* {pinned && <View style={styles.pinned} />} */}
          {!isSecret ? (
            <View>
              {!isChatroomJoined ? (
                <TouchableOpacity
                  onPress={() => {
                    leaveChatroom(true);
                  }}
                  style={styles.joinBtnContainer}
                >
                  <Image
                    source={
                      joinButtonPath
                        ? joinButtonPath
                        : require("../../assets/images/join_group3x.png")
                    }
                    style={styles.joinIcon}
                  />
                  <Text
                    style={
                      [
                        styles.join,
                        joinButton?.color && {
                          color: joinButton?.color,
                        },
                        joinButton?.fontSize && {
                          fontSize: joinButton?.fontSize,
                        },
                        joinButton?.fontFamily && {
                          fontFamily: joinButton?.fontFamily,
                        },
                        joinButton?.backgroundColor && {
                          backgroundColor: joinButton?.backgroundColor,
                        },
                        joinButton?.borderRadius && {
                          borderRadius: joinButton?.borderRadius,
                        },
                      ] as TextStyle[]
                    }
                  >
                    {joinButton?.placeHolderText
                      ? joinButton?.placeHolderText
                      : "Join"}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    if (!isSecret) {
                      leaveChatroom(false);
                    }
                  }}
                  style={styles.joinedBtnContainer}
                >
                  <Image
                    source={
                      joinedButtonPath
                        ? joinedButtonPath
                        : require("../../assets/images/joined_group3x.png")
                    }
                    style={styles.icon}
                  />
                  <Text
                    style={
                      [
                        styles.joined,
                        joinedButton?.color && {
                          color: joinedButton?.color,
                        },
                        joinedButton?.fontSize && {
                          fontSize: joinedButton?.fontSize,
                        },
                        joinedButton?.fontFamily && {
                          fontFamily: joinedButton?.fontFamily,
                        },
                        joinedButton?.backgroundColor && {
                          backgroundColor: joinedButton?.backgroundColor,
                        },
                        joinedButton?.borderRadius && {
                          borderRadius: joinedButton?.borderRadius,
                        },
                      ] as TextStyle[]
                    }
                  >
                    {joinButton?.placeHolderText
                      ? joinButton?.placeHolderText
                      : "Joined"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null}
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={
              [
                styles.chatroomInfo,
                chatroomDescription?.color && {
                  color: chatroomDescription?.color,
                },
                chatroomDescription?.fontSize && {
                  fontSize: chatroomDescription?.fontSize,
                },
                chatroomDescription?.fontFamily && {
                  fontFamily: chatroomDescription?.fontFamily,
                },
              ] as TextStyle[]
            }
          >
            {title}
          </Text>
        </View>
      </View>
      <ToastMessage
        message={msg}
        isToast={isToast}
        onDismiss={() => {
          setIsToast(false);
        }}
      />
    </TouchableOpacity>
  );
};

export default ExploreFeedItem;
