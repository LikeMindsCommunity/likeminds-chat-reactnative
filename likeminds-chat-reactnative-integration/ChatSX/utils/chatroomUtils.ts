import { Conversation } from "@likeminds.community/chat-rn/dist/shared/responseModels/Conversation";
import { UserInfo } from "../db/models";
import { GetConversationsType } from "../enums";
import { Client } from "../client";
import { Chatroom } from "@likeminds.community/chat-rn/dist/shared/responseModels/Chatroom";
import { Member } from "@likeminds.community/chat-rn/dist/shared/responseModels/Member";

enum Roles {
  Chatbot = 'chatbot',
    Member = 'member',
    Admin = 'admin',
}

// This method is to create a temporary state message for updation of chatroom topic
export const createTemporaryStateMessage = (
  currentChatroomTopic: Conversation,
  user: UserInfo
) => {
  const temporaryStateMessage = { ...currentChatroomTopic };
  if (
    temporaryStateMessage?.hasFiles == false ||
    (temporaryStateMessage?.hasFiles == true &&
      temporaryStateMessage?.answer) ||
    temporaryStateMessage?.answer
  ) {
    temporaryStateMessage.answer = `<<${user?.name}|route://member_profile/${user?.id}?member_id=${user?.id}&community_id=${user?.sdkClientInfo?.community}>> changed current topic to ${currentChatroomTopic?.answer}`;
    temporaryStateMessage.state = 12;
    const currentDate = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    const formattedDate = currentDate.toLocaleDateString("en-GB", options);
    temporaryStateMessage.date = formattedDate;
    temporaryStateMessage.id = Date.now()?.toString();
    temporaryStateMessage.attachments = [];
    temporaryStateMessage.attachmentCount = undefined;
    temporaryStateMessage.hasFiles = false;
    temporaryStateMessage.ogTags = undefined;
    temporaryStateMessage.createdEpoch = temporaryStateMessage.createdEpoch + 1;
  } else if (
    temporaryStateMessage?.hasFiles == true &&
    temporaryStateMessage?.attachments
  ) {
    temporaryStateMessage.answer = `<<${user?.name}|route://member_profile/${user?.id}?member_id=${user?.id}&community_id=${user?.sdkClientInfo?.community}>> set a ${temporaryStateMessage?.attachments[0]?.type} message as current topic`;
    temporaryStateMessage.state = 12;
    const currentDate = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    const formattedDate = currentDate.toLocaleDateString("en-GB", options);
    temporaryStateMessage.date = formattedDate;
    temporaryStateMessage.id = Date.now()?.toString();
    temporaryStateMessage.attachments = [];
    temporaryStateMessage.attachmentCount = undefined;
    temporaryStateMessage.hasFiles = false;
    temporaryStateMessage.ogTags = undefined;
    temporaryStateMessage.createdEpoch = temporaryStateMessage.createdEpoch + 1;
  }

  return temporaryStateMessage;
};

// This method is to get above, current and below conversation and create a new conversation
export const getCurrentConversation = async (
  currentChatroomTopic: Conversation,
  chatroomId: string
) => {
  let topicConversation;
  if (currentChatroomTopic?.id) {
    topicConversation = await Client.myClient?.getConversation(
      currentChatroomTopic?.id
    );
  }
  const payload = {
    chatroomId: chatroomId,
    limit: 100,
    medianConversation: currentChatroomTopic,
    type: GetConversationsType.ABOVE,
  };
  const aboveConversations = await Client.myClient?.getConversations(payload);
  payload.type = GetConversationsType.BELOW;
  const belowConversations = await Client.myClient?.getConversations(payload);
  let newConversation = aboveConversations.concat(
    topicConversation,
    belowConversations
  );
  newConversation = newConversation.reverse();
  return newConversation;
};

// function to get whether we're in a conversation with a chatbot
export const isOtherUserAIChatbot = (chatroom: Chatroom, user: Member ) => {
  if (chatroom == null || chatroom == undefined || user == null || user == undefined) {
    return false;
  }
  let otherMember: Member | undefined;
  if (user?.uuid == chatroom?.member?.sdkClientInfo?.uuid) {
    otherMember = chatroom?.chatroomWithUser
  } else {
    otherMember = chatroom?.member;
  }
  if ((otherMember?.roles as unknown as Roles[])?.includes(Roles.Chatbot)) {
    return true;
  }
  return false;
}

// function to split the filename into the name of the file and it's extension
export function splitFileName(filename: string) {
  // Check if the filename contains a dot
  if (!filename.includes('.')) {
    return {
      name: filename,
      extension: ''
    };
  }

  const lastDotIndex = filename.lastIndexOf('.');
  const name = filename.substring(0, lastDotIndex);
  const extension = filename.substring(lastDotIndex + 1);

  return {
    name: name,
    extension: extension
  };
}