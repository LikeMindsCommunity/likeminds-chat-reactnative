import messaging from "@react-native-firebase/messaging";
import notifee, {
  AndroidGroupAlertBehavior,
  AndroidImportance,
  AndroidLaunchActivityFlag,
  EventType,
} from "@notifee/react-native";
import React from "react";
import {
  decodeForNotifications,
  generateGifString,
  getNotificationsMessage,
} from "../commonFuctions";
import { Platform } from "react-native";
import { Client } from "../client";
import { getRoute } from "./routes";
import { Credentials } from "../credentials";
import { ChatroomData } from "./models";
import { Conversation } from "@likeminds.community/chat-rn/dist/shared/responseModels/Conversation";
import { Chatroom } from "@likeminds.community/chat-rn/dist/shared/responseModels/Chatroom";
import { ChatroomRO } from "@likeminds.community/chat-rn/dist/localDb/models/ChatroomRO";
import { Attachment } from "@likeminds.community/chat-rn/dist/shared/responseModels/Attachment";
import { chatSchema } from "../assets/chatSchema";
import {MediaAttachment} from "../commonFuctions/model"


export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  return enabled;
}

export const fetchFCMToken = async () => {
  const fcmToken = await messaging().getToken();
  return fcmToken;
};

function generateRouteForChatroom(communityId: string, communityName: string) {
  return `route://chatroom_followed_feed?community_id=${communityId}&community_name=${communityName}`;
}

// Generates the child route for chatroom with provided chatroomId
function generateRouteChildForChatroom(chatroomId: string, lastConversationId: string) {
  return `route://collabcard?collabcard_id=${chatroomId}&last_conversation_id=${lastConversationId}`;
}

// Generates the chatroom name with the unseen messages count
function generateChatroomNameWithMessagesCount(chatroomHeader: string, unseenCount: number) {
  if (unseenCount === 1) {
      return `${chatroomHeader} (1 message)`;
  } else {
      return `${chatroomHeader} (${unseenCount} messages)`
  }
}

function convertToAttachmentsArray(attachments: Attachment[], time: number) {
  if(attachments && attachments?.length > 0) {
    return attachments.map( attachment => ({
      name: attachment?.name,
      url: attachment?.url,
      awsFolderPath: "",
      localFilePath: "",
      thumbnailUrl: "",
      thumbnailAWSFolderPath: "",
      thumbnailLocalFilePath: "",
      meta: {
        size: attachment?.meta?.size,
      },
      createdAt: time,
      updatedAt: time,
      fileUrl: attachment?.url,
      type: attachment?.type,
      index: attachment?.index
    }))
  }
  return []
}

function formatTimestampTo24Hour(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export default async function getNotification(remoteMessage: any) {
  const users = await Client.myClient?.getUserSchema();
  const isIOS = Platform.OS === "ios" ? true : false;
  const message = isIOS
    ? generateGifString(remoteMessage?.notification?.body)
    : generateGifString(remoteMessage?.data?.sub_title);
  const channelId = await notifee.createChannel({
    id: "important",
    name: "Important Notifications",
    importance: AndroidImportance.HIGH,
  });

  let decodedAndroidMsg;
  let decodedIOSMsg;
  if (isIOS) {
    decodedIOSMsg = decodeForNotifications(message);
  } else {
    decodedAndroidMsg = decodeForNotifications(message);
  }

  if (!remoteMessage?.data?.route) {
    return;
  }

  const route = await getRoute(remoteMessage?.data?.route);
  const navigationRoute = route?.params?.navigationRoute;

  if (navigationRoute === "collabcard" && navigationRoute) {
    const UUID =
      Credentials.userUniqueId.length > 0
        ? Credentials.userUniqueId
        : users?.userUniqueID;
    const userName =
      Credentials.username.length > 0 ? Credentials.username : users?.username;

    const user: any = await Client.myClient.getUserFromLocalStorage();
    const payload = {
      uuid: UUID, // uuid
      userName: userName, // user name
      isGuest: false,
      apiKey: user?.apiKey,
    };

    if (isIOS) {
      await notifee.displayNotification({
        title: remoteMessage?.data?.title,
        body: isIOS ? decodedIOSMsg : decodedAndroidMsg,
        data: remoteMessage?.data,
        id: remoteMessage?.messageId,
        android: {
          channelId,
          // pressAction is needed if you want the notification to open the app when pressed
          pressAction: {
            id: "default",
            launchActivity: "default",
          },
          importance: AndroidImportance.HIGH,
        },
      });
    } else {
      const res = await Client.myClient.initiateUser(payload);
      if (res !== undefined && res !== null) {
        let formattedMessage = JSON.parse(remoteMessage?.data?.unread_follow_notification);

        const creator = formattedMessage?.chatroom_last_conversation_creator;
        const sdkClientInfo = creator?.sdk_client_info;

        let conversation: Conversation = {
          communityId: formattedMessage?.community_id?.toString(),
          createdEpoch: formattedMessage?.chatroom_last_conversation_timestamp,
          chatroomId: formattedMessage?.chatroom_id?.toString(),
          answer: formattedMessage?.chatroom_last_conversation,
          state: 0,
          member: {
            id: creator?.id?.toString() as string,
            uuid: creator?.uuid,
            userUniqueId: creator?.user_unique_id,
            isGuest: creator?.is_guest,
            name: creator?.name,
            imageUrl: creator?.image_url,
            sdkClientInfo: {
              user: sdkClientInfo?.user?.toString(),
              userUniqueId: sdkClientInfo?.user_unique_id,
              uuid: sdkClientInfo?.uuid,
              community: sdkClientInfo?.community,
              communityId: sdkClientInfo?.community
            },
            isOwner: false
          },
          id: formattedMessage?.chatroom_last_conversation_id?.toString(),
          attachmentCount: formattedMessage?.attachments?.length ?? 0,
          attachmentUploaded: formattedMessage?.attachments?.length > 0,
          attachments: convertToAttachmentsArray(
            formattedMessage?.attachments,
            formattedMessage?.chatroom_last_conversation_timestamp
          ),
          hasFiles: formattedMessage?.attachments?.length > 0,
          createdAt: formatTimestampTo24Hour(formattedMessage?.chatroom_last_conversation_timestamp)
        }


        const chatroomCreator = formattedMessage?.chatroom_creator;
        const lastConversationCreator = formattedMessage?.chatroom_last_conversation_creator;
        const sdkClientInfoCreator = chatroomCreator?.sdk_client_info;
        const sdkClientInfoLastCreator = lastConversationCreator?.sdk_client_info;

        let chatroom: Chatroom = {
          id: formattedMessage?.chatroom_id?.toString(),
          state: 0,
          muteStatus: false,
          title: formattedMessage?.chatroom_title,
          member: {
            id: chatroomCreator?.id?.toString() as string,
            uuid: chatroomCreator?.uuid,
            userUniqueId: chatroomCreator?.user_unique_id,
            isGuest:chatroomCreator?.is_guest,
            name: chatroomCreator?.name,
            imageUrl: chatroomCreator?.image_url,
            sdkClientInfo: {
              user: sdkClientInfoCreator?.user?.toString(),
              userUniqueId: sdkClientInfoCreator?.user_unique_id,
              uuid: sdkClientInfoCreator?.uuid,
              community: sdkClientInfoCreator?.community,
              communityId: sdkClientInfoCreator?.community,
            },
            isOwner: false
          },
          communityId: formattedMessage?.community_id?.toString(),
          lastConversationId: formattedMessage?.chatroom_last_conversation_id?.toString(),
          chatroomWithUser: {
            id: lastConversationCreator?.id?.toString() as string,
            uuid: lastConversationCreator?.uuid,
            userUniqueId: lastConversationCreator?.user_unique_id,
            isGuest: lastConversationCreator?.is_guest,
            name: lastConversationCreator?.name,
            imageUrl: lastConversationCreator?.image_url,
            sdkClientInfo: {
              user: sdkClientInfoLastCreator?.user?.toString(),
              userUniqueId: sdkClientInfoLastCreator?.user_unique_id,
              uuid: sdkClientInfoLastCreator?.uuid,
              community: sdkClientInfoLastCreator?.community,
              communityId: sdkClientInfoLastCreator?.community,
            },
            isOwner: false,
          },
          chatroomWithUserId: lastConversationCreator?.id?.toString(),
          followStatus: true
        };

        const response = await Client?.myClient?.getUnreadChatrooms(chatroom,conversation);
        if (response?.success === false){
          await notifee.displayNotification({
            title: remoteMessage?.data?.title,
            body: decodedAndroidMsg,
            data: remoteMessage?.data,
            id: remoteMessage?.messageId,
            android: {
              channelId,
              // pressAction is needed if you want the notification to open the app when pressed
              pressAction: {
                id: "default",
                launchActivity: "default",
              },
              importance: AndroidImportance.HIGH,
            },
          });
        } else {
          const unreadConversation = response?.data;
          const sortedUnreadConversation: ChatroomRO[] = unreadConversation?.sort(
            (a: ChatroomRO, b: ChatroomRO) => {
              return (
                (b?.lastConversationRO?.createdEpoch as number) -
                (a?.lastConversationRO?.createdEpoch as number)
              );
            }
          );
          let totalCount = 0;
          for (const obj of sortedUnreadConversation) {
            if (obj.hasOwnProperty("unseenCount")) {
              totalCount += obj?.unseenCount ?? 0;
            }
          }
  
          // Create summary
          notifee.displayNotification({
            title: navigationRoute,
            subtitle: `${totalCount} messages from ${sortedUnreadConversation?.length} chatrooms`,
            android: {
              channelId,
              groupSummary: true,
              groupId: navigationRoute?.toString(16),
              groupAlertBehavior: AndroidGroupAlertBehavior.SUMMARY,
              pressAction: {
                id: "default",
                launchActivity: "default",
                launchActivityFlags: [AndroidLaunchActivityFlag.SINGLE_TOP],
              },
            },
            id: "group",
          });

          // Children
          for (let i = 0; i < sortedUnreadConversation.length; i++) {
            const convertedGifString = generateGifString(
              sortedUnreadConversation[i]?.lastConversationRO?.answer ?? ""
            );

            const decodedMessage = convertedGifString
              ? decodeForNotifications(convertedGifString)
              : "";

            const message = getNotificationsMessage(
              sortedUnreadConversation[i]?.lastConversationRO?.attachments as unknown as MediaAttachment[] ?? [],
              decodedMessage
            );
            notifee.displayNotification({
              title: generateChatroomNameWithMessagesCount(sortedUnreadConversation[i]?.header as string, sortedUnreadConversation[i]?.unseenCount) ?? "",
              body: `<b>${sortedUnreadConversation[i]?.lastConversationRO?.member?.name}</b>: ${message}`,
              android: {
                channelId,
                groupId: navigationRoute?.toString(16),
                groupAlertBehavior: AndroidGroupAlertBehavior.SUMMARY,
                timestamp:
                  sortedUnreadConversation[i]
                    ?.lastConversationRO?.createdEpoch ?? Date.now(),
                showTimestamp: true,
                sortKey: i?.toString(),
                pressAction: {
                  id: "default",
                  launchActivity: "default",
                  launchActivityFlags: [AndroidLaunchActivityFlag.SINGLE_TOP],
                },
              },
              data: { route: generateRouteChildForChatroom(sortedUnreadConversation[i]?.id?.toString(),sortedUnreadConversation[i]?.lastConversationRO?.id?.toString() ?? "") },
              id: sortedUnreadConversation[i]?.id?.toString(),
            });
          }
        }
      }
    }
  } else {
    await notifee.displayNotification({
      title: remoteMessage?.data?.title,
      subtitle: remoteMessage?.data?.sub_title,
      android: {
        channelId,
        pressAction: {
          id: "default",
          launchActivity: "default",
        },
        importance: AndroidImportance.HIGH,
      }
    })
  }
}
