export const chatSchema: any = {
  normal: {
    answer: "5",
    attachmentCount: 0,
    attachments: [],
    attachmentsUploaded: false,
    images: [],
    videos: [],
    pdf: [],
    chatroomId: "1129579",
    communityId: "50451",
    createdAt: "16:11",
    createdEpoch: 1678790461662,
    date: "14 Mar 2023",
    hasFiles: false,
    id: `-${Date.now().toString()}`,
    isEdited: false,
    member: {
      id: "119638",
      imageUrl: "",
      isGuest: false,
      isOwner: false,
      memberSince: "Member since Dec 29 2022",
      memberSinceEpoch: 1672311098,
      name: "Sanju",
      organisationName: null,
      route:
        "route://member_community_profile?community_id=50451&member_id=119638",
      state: 4,
      updatedAt: 1672311098,
      userUniqueId: "0d6f9958-a2db-46aa-a4b1-c40d268b767b",
      sdkClientInfo: {
        community: 50506,
        communityId: 50506,
        user: "90084",
        userUniqueId: "Xv BC",
        uuid: "Xv BC",
      },
      uuid: "Xv BC",
    },
    reactions: [],
    state: 0,
    ogTags: {},
    widget: null,
    widgetId: "",
  },
  reply: {
    answer: "Hey",
    attachmentCount: 0,
    attachments: [],
    images: [],
    videos: [],
    pdf: [],
    attachmentsUploaded: false,
    chatroomId: "1129579",
    communityId: "50451",
    createdAt: "15:48",
    createdEpoch: 1678961924282,
    date: "16 Mar 2023",
    hasFiles: false,
    id: `-${Date.now().toString()}`,
    isEdited: false,
    lastSeen: true,
    member: {
      id: "119638",
      imageUrl:
        "https://prod-likeminds-media.s3.ap-south-1.amazonaws.com/files/profile/1672311097431",
      isGuest: false,
      isOwner: false,
      memberSince: "Member since Dec 29 2022",
      memberSinceEpoch: 1672311098,
      name: "Sanju",
      organisationName: null,
      route:
        "route://member_community_profile?community_id=50451&member_id=119638",
      state: 4,
      updatedAt: 1672311098,
      userUniqueId: "0d6f9958-a2db-46aa-a4b1-c40d268b767b",
      sdkClientInfo: {
        community: 50506,
        communityId: 50506,
        user: "90084",
        userUniqueId: "Xv BC",
        uuid: "Xv BC",
      },
      uuid: "Xv BC",
    },
    reactions: [],
    replyConversation: "2228595",
    replyConversationObject: {
      answer: "5",
      attachmentCount: 0,
      attachmentsUploaded: false,
      chatroomId: "1129579",
      communityId: "50451",
      createdAt: "1678790461662",
      createdEpoch: 1678790461662,
      date: "14 Mar 2023",
      hasFiles: false,
      id: "2228595",
      isEdited: false,
      member: {
        id: "119638",
        imageUrl: "",
        isGuest: false,
        isOwner: false,
        memberSince: "Member since Dec 29 2022",
        memberSinceEpoch: 1672311098,
        name: "Sanju",
        organisationName: null,
        sdkClientInfo: {
          community: 50506,
          communityId: 50506,
          user: "90084",
          userUniqueId: "Xv BC",
          uuid: "Xv BC",
        },
        uuid: "Xv BC",
        route:
          "route://member_community_profile?community_id=50451&member_id=119638",
        state: 4,
        updatedAt: 1672311098,
        userUniqueId: "0d6f9958-a2db-46aa-a4b1-c40d268b767b",
      },
      reactions: [],
      state: 0,
      widget: null,
      widgetId: "",
    },
    state: 0,
    ogTags: {},
    widget: null,
    widgetId: "",
  },
};

export const convertToChatroomTopicSchema = (item) => ({
  id: item.id.toString(),
  chatroomId: item.chatroom.id.toString(),
  communityId: item.community.id.toString(),
  member: {
    uid: item.member.id.toString(),
    id: item.member.id.toString(),
    name: item.member.name,
    imageUrl: item.member.imageUrl,
    state: item.state,
    customIntroText: undefined,
    customClickText: undefined,
    customTitle: "Member",
    communityId: item.community.id.toString(),
    isOwner: false,
    isGuest: item.member.isGuest,
    userUniqueId: item.member.userUniqueId,
    uuid: item.member.uuid,
    sdkClientInfo: {
      community: item.member.sdkClientInfo.community.toString(),
      user: item.member.sdkClientInfo.user.toString(),
      userUniqueId: item.member.sdkClientInfo.userUniqueId,
      uuid: item.member.sdkClientInfo.uuid,
    },
  },
  replyId: undefined,
  ogTags: {
    url: undefined,
    title: undefined,
    image: undefined,
    description: undefined,
  },
  answer: item.answer,
  state: item.state,
  createdEpoch: item.createdAt,
  createdAt: new Date(item.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
  cardId: undefined,
  attachments: item.attachments,
  replyConversation: undefined,
  replyConversationObject: undefined,
  date: new Date(item.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
  isEdited: item.isEdited,
  lastSeen: false,
  replyConversationId: undefined,
  userId: undefined,
  deletedBy: undefined,
  attachmentCount: item.attachmentCount,
  attachmentsUploaded: item.attachmentsUploaded,
  uploadWorkerUUID: undefined,
  localSavedEpoch: 0,
  temporaryId: item.createdAt.toString().slice(-4), // Randomly generated temp id using last 4 digits of epoch time
  reactions: [],
  hasFiles: false,
  isAnonymous: undefined,
  allowAddOption: undefined,
  pollType: undefined,
  pollTypeText: undefined,
  submitTypeText: undefined,
  deletedByUserId: undefined,
  expiryTime: undefined,
  multipleSelectNo: undefined,
  multipleSelectState: undefined,
  polls: [],
  pollAnswerText: undefined,
  toShowResults: undefined,
  replyChatRoomId: undefined,
  isInProgress: undefined,
  lastUpdatedAt: item.lastUpdated,
  deletedByMember: undefined,
  community: [],
  chatroom: [],
  widget: item.widget,
  widgetId: item.widgetId
});
