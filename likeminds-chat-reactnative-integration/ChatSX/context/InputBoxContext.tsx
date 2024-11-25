import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Client } from "../client";
import STYLES from "../constants/Styles";
import { ChatroomContextValues, useChatroomContext } from "./ChatroomContext";
import {
  LaunchActivityProps,
  VoiceNotesPlayerProps,
  VoiceNotesProps,
} from "../components/InputBox/models";
import { useAppDispatch, useAppSelector } from "../store";
import {
  Easing,
  Keyboard,
  PermissionsAndroid,
  Platform,
  Vibration,
  View,
} from "react-native";
import AWS, { CognitoIdentityCredentials, S3 } from "aws-sdk";
import { POOL_ID, REGION } from "../awsExports";
import {
  atLeastAndroid13,
  detectMentions,
  extractPathfromRouteQuery,
  getAllPdfThumbnail,
  getPdfThumbnail,
  getVideoThumbnail,
} from "../commonFuctions";
import { check, PERMISSIONS, request } from "react-native-permissions";
import {
  BLOCKED_DM,
  CHARACTER_LIMIT_MESSAGE,
  GIF_TEXT,
  GRANTED,
  IMAGE_TEXT,
  PDF_TEXT,
  SUCCESS,
  VIDEO_TEXT,
  VOICE_NOTE_TEXT,
} from "../constants/Strings";
import {
  convertToMentionValues,
  replaceMentionValues,
} from "../uiComponents/LMChatTextInput/utils";
import {
  CLEAR_SELECTED_FILE_TO_VIEW,
  CLEAR_SELECTED_FILES_TO_UPLOAD,
  CLEAR_SELECTED_VOICE_NOTE_FILES_TO_UPLOAD,
  EDIT_CONVERSATION,
  EMPTY_BLOCK_DELETION,
  FILE_SENT,
  LONG_PRESSED,
  MESSAGE_SENT,
  SELECTED_FILE_TO_VIEW,
  SELECTED_FILES_TO_UPLOAD,
  SELECTED_FILES_TO_UPLOAD_THUMBNAILS,
  SELECTED_MESSAGES,
  SELECTED_MORE_FILES_TO_UPLOAD,
  SELECTED_VOICE_NOTE_FILES_TO_UPLOAD,
  SET_CHATROOM_TOPIC,
  SET_EDIT_MESSAGE,
  SET_FILE_UPLOADING_MESSAGES,
  SET_IS_REPLY,
  SET_REPLY_MESSAGE,
  SHOW_TOAST,
  STATUS_BAR_STYLE,
  UPDATE_CHAT_REQUEST_STATE,
  UPDATE_CONVERSATIONS,
  UPDATE_LAST_CONVERSATION,
} from "../store/types/types";
import {
  Asset,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from "react-native-image-picker";
import { FILE_UPLOAD } from "../constants/Screens";
import DocumentPicker from "react-native-document-picker";
import { createThumbnail } from "react-native-create-thumbnail";
import {
  requestAudioRecordPermission,
  requestCameraPermission,
  requestStoragePermission,
} from "../utils/permissions";
import { chatSchema } from "../assets/chatSchema";
import { ChatroomChatRequestState, ChatroomType, Events, Keys } from "../enums";
import { onConversationsCreate } from "../store/actions/chatroom";
import { getChatroomType, getConversationType } from "../utils/analyticsUtils";
import { LMChatAnalytics } from "../analytics/LMChatAnalytics";
import { LMChatLoader } from "../uiComponents";
import Layout from "../constants/Layout";
import { LINK_PREVIEW_REGEX } from "../constants/Regex";
import { generateAudioSet, generateVoiceNoteName } from "../audio";
import ReactNativeBlobUtil from "react-native-blob-util";
import { Conversation } from "@likeminds.community/chat-rn/dist/shared/responseModels/Conversation";
import GIFPicker from "../optionalDependecies/Gif";

export interface InputBoxContextProps {
  children: ReactNode;
  replyChatID?: any;
  chatroomID?: any;
  chatRequestState?: any;
  chatroomType?: any;
  navigation?: any;
  isUploadScreen?: boolean;
  isPrivateMember?: boolean;
  isDoc?: boolean;
  myRef?: any;
  previousMessage?: string;
  handleFileUpload?: any;
  isEditable?: boolean;
  setIsEditable?: any;
  isSecret?: any;
  chatroomWithUser?: any;
  chatroomName?: any;
  currentChatroomTopic?: Conversation;
  isGif?: boolean;
}

export interface InputBoxContext {
  isVoiceNoteIconPress: any;
  hideDMSentAlert: any;
  handleVideoThumbnail: any;
  handleImageAndVideoUpload: any;
  selectGallery: any;
  selectDoc: any;
  openCamera: any;
  selectGIF: any;
  handleModalClose: any;
  sendDmRequest: any;
  showDMSentAlert: any;
  handleCamera: any;
  handleGallery: any;
  handleDoc: any;
  onSend: any;
  taggingAPI: any;
  loadData: any;
  handleLoadMore: any;
  renderFooter: any;
  detectLinkPreview: any;
  handleInputChange: any;
  onEdit: any;
  askPermission: any;
  setModalVisible: any;
  chatroomType: any;
  DMSentAlertModalVisible: any;
  message: any;
  inputBoxStyles: any;
  isKeyBoardFocused: any;
  isIOS: any;
  isUploadScreen: any;
  isReply: any;
  isUserTagging: any;
  isEditable: any;
  ogTagsState: any;
  userTaggingList: any;
  userTaggingListHeight: any;
  groupTags: any;
  taggedUserName: any;
  setMessage: any;
  setUserTaggingList: any;
  setGroupTags: any;
  setIsUserTagging: any;
  replyMessage: any;
  chatroomName: any;
  showLinkPreview: any;
  closedOnce: any;
  setShowLinkPreview: any;
  setClosedOnce: any;
  setClosedPreview: any;
  editConversation: any;
  setIsEditable: any;
  isDoc: any;
  isGif: any;
  voiceNotes: any;
  isRecordingLocked: any;
  chatRequestState: any;
  inputHeight: any;
  setInputHeight: any;
  myRef: any;
  MAX_LENGTH: any;
  isPrivateMember: any;
  isRecordingPermission: any;
  setIsVoiceNoteIconPress: any;
  modalVisible: any;
  navigation: any;
  chatroomID: any;
  conversations: any;
  setIsRecordingLocked: any;
  setVoiceNotes: any;
}

const InputBoxContext = createContext<InputBoxContext | undefined>(undefined);

export const useInputBoxContext = () => {
  const context = useContext(InputBoxContext);
  if (!context) {
    throw new Error(
      "useInputBoxContext must be used within an InputBoxContextProvider"
    );
  }
  return context;
};

export const InputBoxContextProvider = ({
  children,
  replyChatID,
  chatroomID,
  chatRequestState,
  chatroomType,
  navigation,
  isUploadScreen,
  isPrivateMember,
  isDoc,
  myRef,
  previousMessage = "",
  handleFileUpload,
  isEditable,
  setIsEditable,
  isSecret,
  chatroomWithUser,
  chatroomName,
  currentChatroomTopic,
  isGif,
}: InputBoxContextProps) => {
  const myClient = Client.myClient;
  const inputBoxStyles = STYLES.$INPUT_BOX_STYLE;

  const [isKeyBoardFocused, setIsKeyBoardFocused] = useState(false);
  const [message, setMessage] = useState(previousMessage);
  const [inputHeight, setInputHeight] = useState(25);
  const [modalVisible, setModalVisible] = useState(false);
  const [DMSentAlertModalVisible, setDMSentAlertModalVisible] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<any>(null);
  const [debounceLinkPreviewTimeout, setLinkPreviewDebounceTimeout] =
    useState<any>(null);
  const [isUserTagging, setIsUserTagging] = useState(false);
  const [userTaggingList, setUserTaggingList] = useState<any>([]);
  const [userTaggingListHeight, setUserTaggingListHeight] = useState<any>(116);
  const [groupTags, setGroupTags] = useState<any>([]);
  const [taggedUserName, setTaggedUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [voiceNotes, setVoiceNotes] = useState<VoiceNotesProps>({
    recordSecs: 0,
    recordTime: "",
    name: "",
  });
  const [isVoiceResult, setIsVoiceResult] = useState(false);
  const [isRecordingLocked, setIsRecordingLocked] = useState(false);
  const [isRecordingPermission, setIsRecordingPermission] = useState(false);
  const [isVoiceNoteIconPress, setIsVoiceNoteIconPress] = useState(false);

  const { chatroomDBDetails }: any = useAppSelector((state) => state.chatroom);

  const [ogTagsState, setOgTagsState] = useState<any>({});
  const [closedOnce, setClosedOnce] = useState(false);
  const [showLinkPreview, setShowLinkPreview] = useState(true);
  const [url, setUrl] = useState("");
  const [closedPreview, setClosedPreview] = useState(false);

  const MAX_FILE_SIZE = 104857600; // 100MB in bytes
  const MAX_LENGTH = 300;

  const isIOS = Platform.OS === "ios" ? true : false;

  const taggedUserNames: any = [];

  let refInput = useRef<any>();

  const GiphyContentType = GIFPicker?.GiphyContentType;
  const GiphyDialog = GIFPicker?.GiphyDialog;
  const GiphyDialogEvent = GIFPicker?.GiphyDialogEvent;
  const GiphyDialogMediaSelectEventHandler =
    GIFPicker?.GiphyDialogMediaSelectEventHandler;
  const GiphyMedia = GIFPicker?.GiphyMedia;
  type GiphyDialogMediaSelectEventHandlerType =
    typeof GiphyDialogMediaSelectEventHandler;
  type GiphyMediaType = typeof GiphyMedia;

  const {
    selectedFilesToUpload = [],
    selectedVoiceNoteFilesToUpload = [],
    selectedFilesToUploadThumbnails = [],
    conversations = [],
    selectedMessages = [],
  }: any = useAppSelector((state) => state.chatroom);
  const { user, community }: any = useAppSelector((state) => state.homefeed);
  const {
    chatroomDetails,
    isReply,
    replyMessage,
    editConversation,
    fileSent,
  }: any = useAppSelector((state) => state.chatroom);

  let isGroupTag = false;

  const dispatch = useAppDispatch();

  AWS.config.update({
    region: REGION, // Replace with your AWS region, e.g., 'us-east-1'
    credentials: new CognitoIdentityCredentials({
      IdentityPoolId: POOL_ID, // Replace with your Identity Pool ID
    }),
  });

  const s3 = new S3();

  // to ask audio recording permission
  useEffect(() => {
    async function checkAndroidPermission() {
      const isAtLeastAndroid13 = atLeastAndroid13();
      if (isAtLeastAndroid13) {
        const isRecordAudioPermission = await PermissionsAndroid.check(
          "android.permission.RECORD_AUDIO"
        );
        const isReadMediaAudioPermission = await PermissionsAndroid.check(
          "android.permission.READ_MEDIA_AUDIO"
        );
        if (isRecordAudioPermission && isReadMediaAudioPermission) {
          setIsRecordingPermission(true);
        }
      } else {
        const isRecordAudioPermission = await PermissionsAndroid.check(
          "android.permission.RECORD_AUDIO"
        );
        const isReadExternalStoragePermission = await PermissionsAndroid.check(
          "android.permission.READ_EXTERNAL_STORAGE"
        );
        const isWriteExternalStoragePermission = await PermissionsAndroid.check(
          "android.permission.WRITE_EXTERNAL_STORAGE"
        );
        if (
          isRecordAudioPermission &&
          isReadExternalStoragePermission &&
          isWriteExternalStoragePermission
        ) {
          setIsRecordingPermission(true);
        }
      }
    }

    async function checkIosPermission() {
      const val = await check(PERMISSIONS.IOS.MICROPHONE);
      if (val === GRANTED) {
        setIsRecordingPermission(true);
      }
    }

    if (Platform.OS === "android") {
      checkAndroidPermission();
    } else {
      checkIosPermission();
    }
  }, []);

  // to clear message on ChatScreen InputBox when fileSent from UploadScreen
  useEffect(() => {
    if (!isUploadScreen) {
      setMessage("");
      setInputHeight(25);
    }
  }, [fileSent]);

  // to clear message on ChatScreen InputBox when fileSent from UploadScreen
  useEffect(() => {
    if (isEditable) {
      const convertedText = convertToMentionValues(
        `${editConversation?.answer} `, // to put extra space after a message whwn we want to edit a message
        ({ URLwithID, name }) => {
          if (!URLwithID) {
            return `@[${name}](${name})`;
          } else {
            return `@[${name}](${URLwithID})`;
          }
        }
      );
      setMessage(convertedText);
    }
  }, [isEditable, selectedMessages]);

  // Handling GIFs selection in GiphyDialog
  useEffect(() => {
    if (GIFPicker) {
      GiphyDialog.configure({
        mediaTypeConfig: [GiphyContentType.Recents, GiphyContentType.Gif],
      });
      const handler: GiphyDialogMediaSelectEventHandlerType = (e) => {
        selectGIF(e.media, message);
        GiphyDialog.hide();
      };
      const listener = GiphyDialog.addListener(
        GiphyDialogEvent.MediaSelected,
        handler
      );
      return () => {
        listener.remove();
      };
    }
  }, [message]);

  // to handle video thumbnail
  const handleVideoThumbnail = async (images: any) => {
    const res = await getVideoThumbnail({
      selectedImages: images,
      initial: true,
    });
    dispatch({
      type: SELECTED_FILES_TO_UPLOAD_THUMBNAILS,
      body: {
        images: res?.selectedFilesToUploadThumbnails,
      },
    });
    dispatch({
      type: SELECTED_FILES_TO_UPLOAD,
      body: {
        images: res?.selectedFilesToUpload,
      },
    });
  };

  // this method sets image and video to upload on FileUpload screen via redux.
  const handleImageAndVideoUpload = async (selectedImages: Asset[]) => {
    if (selectedImages) {
      if (isUploadScreen === false) {
        // to select images and videos from chatroom.
        await handleVideoThumbnail(selectedImages);
        dispatch({
          type: SELECTED_FILE_TO_VIEW,
          body: { image: selectedImages[0] },
        });
        dispatch({
          type: STATUS_BAR_STYLE,
          body: { color: STYLES.$STATUS_BAR_STYLE["light-content"] },
        });
      } else {
        // to select more images and videos on FileUpload screen (isUploadScreen === true)
        const res = await getVideoThumbnail({
          // selected files will be saved in redux inside get video function
          selectedImages,
          selectedFilesToUpload,
          selectedFilesToUploadThumbnails,
          initial: false,
        });
        dispatch({
          type: SELECTED_FILES_TO_UPLOAD_THUMBNAILS,
          body: {
            images: res?.selectedFilesToUploadThumbnails,
          },
        });
        dispatch({
          type: SELECTED_FILES_TO_UPLOAD,
          body: {
            images: res?.selectedFilesToUpload,
          },
        });
      }
    }
  };

  //select Images and videoes From Gallery
  const selectGallery = async () => {
    const options: LaunchActivityProps = {
      mediaType: "mixed",
      selectionLimit: 0,
    };

    navigation.navigate(FILE_UPLOAD, {
      chatroomID: chatroomID,
      previousMessage: message, // to keep message on uploadScreen InputBox
    });
    await launchImageLibrary(options, async (response: ImagePickerResponse) => {
      if (response?.didCancel) {
        if (selectedFilesToUpload.length === 0) {
          navigation.goBack();
        }
      } else if (response.errorCode) {
        return;
      } else {
        const selectedImages: Asset[] | undefined = response.assets; // selectedImages can be anything images or videos or both

        if (!selectedImages) {
          return;
        }
        for (let i = 0; i < selectedImages?.length; i++) {
          const fileSize = selectedImages[i]?.fileSize;
          if (Number(fileSize) >= MAX_FILE_SIZE) {
            dispatch({
              type: SHOW_TOAST,
              body: { isToast: true, msg: "Files above 100 MB is not allowed" },
            });
            navigation.goBack();
            return;
          }
        }
        handleImageAndVideoUpload(selectedImages);
      }
    });
  };

  //select Documents From Gallery
  const selectDoc = async () => {
    try {
      navigation.navigate(FILE_UPLOAD, {
        chatroomID: chatroomID,
        previousMessage: message, // to keep message on uploadScreen InputBox
      });
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
        allowMultiSelection: true,
      });
      const selectedDocs: any = response; // selectedImages can be anything images or videos or both
      const docsArrlength = selectedDocs?.length;
      if (docsArrlength > 0) {
        for (let i = 0; i < docsArrlength; i++) {
          if (selectedDocs[i].size >= MAX_FILE_SIZE) {
            dispatch({
              type: SHOW_TOAST,
              body: { isToast: true, msg: "Files above 100 MB is not allowed" },
            });
            navigation.goBack();
            return;
          }
        }
        if (isUploadScreen === false) {
          const allThumbnailsArr = await getAllPdfThumbnail(selectedDocs);

          //loop is for appending thumbanil in the object we get from document picker
          for (let i = 0; i < selectedDocs?.length; i++) {
            selectedDocs[i] = {
              ...selectedDocs[i],
              thumbnailUrl: allThumbnailsArr[i]?.uri,
            };
          }

          //redux action to save thumbnails for bottom horizontal scroll list in fileUpload, it does not need to have complete pdf, only thumbnail is fine
          dispatch({
            type: SELECTED_FILES_TO_UPLOAD_THUMBNAILS,
            body: { images: allThumbnailsArr },
          });

          //redux action to save thumbnails along with pdf to send and view on fileUpload screen
          dispatch({
            type: SELECTED_FILES_TO_UPLOAD,
            body: { images: selectedDocs },
          });
          const res: any = await getPdfThumbnail(selectedDocs[0]);

          //redux action to save thumbnail of selected file
          dispatch({
            type: SELECTED_FILE_TO_VIEW,
            body: { image: { ...selectedDocs[0], thumbnailUrl: res[0]?.uri } },
          });

          //redux action to change status bar color
          dispatch({
            type: STATUS_BAR_STYLE,
            body: { color: STYLES.$STATUS_BAR_STYLE["light-content"] },
          });
        } else if (isUploadScreen === true) {
          const arr: any = await getAllPdfThumbnail(selectedDocs);
          for (let i = 0; i < selectedDocs?.length; i++) {
            selectedDocs[i] = { ...selectedDocs[i], thumbnailUrl: arr[i]?.uri };
          }

          //redux action to select more files to upload
          dispatch({
            type: SELECTED_MORE_FILES_TO_UPLOAD,
            body: { images: selectedDocs },
          });

          //redux action to save thumbnail of selected files. It saves thumbnail as URI only not as thumbnail property
          dispatch({
            type: SELECTED_FILES_TO_UPLOAD_THUMBNAILS,
            body: { images: [...selectedFilesToUploadThumbnails, ...arr] },
          });
        }
      }
    } catch (error) {
      if (selectedFilesToUpload.length === 0) {
        navigation.goBack();
      }
    }
  };
  // this method launches native camera
  const openCamera = async () => {
    try {
      const options: LaunchActivityProps = {
        mediaType: "photo",
        selectionLimit: 0,
      };
      navigation.navigate(FILE_UPLOAD, {
        chatroomID: chatroomID,
        previousMessage: message, // to keep message on uploadScreen InputBox
      });
      await launchCamera(options, async (response: ImagePickerResponse) => {
        if (response?.didCancel) {
          if (selectedFilesToUpload.length === 0) {
            navigation.goBack();
          }
        } else if (response.errorCode) {
          return;
        } else {
          const selectedImages: Asset[] | undefined = response.assets; // selectedImages would be images only

          if (!selectedImages) {
            return;
          }
          if (selectedImages?.length > 0) {
            const fileSize = selectedImages[0]?.fileSize;
            if (Number(fileSize) >= MAX_FILE_SIZE) {
              dispatch({
                type: SHOW_TOAST,
                body: {
                  isToast: true,
                  msg: "Files above 100 MB is not allowed",
                },
              });
              navigation.goBack();
              return;
            }
          }
          await handleImageAndVideoUpload(selectedImages);
        }
      });
    } catch (error) {
      if (selectedFilesToUpload.length === 0) {
        navigation.goBack();
      }
    }
  };

  // to select gif from list of GIFs
  const selectGIF = async (gif: GiphyMediaType, message: string) => {
    const item = { ...gif, thumbnailUrl: "" };

    navigation.navigate(FILE_UPLOAD, {
      chatroomID: chatroomID,
      previousMessage: message, // to keep message on uploadScreen InputBox
    });

    await createThumbnail({
      url: gif?.data?.images?.fixed_width?.mp4,
      timeStamp: 10000,
    })
      .then((response) => {
        item.thumbnailUrl = response?.path;

        dispatch({
          type: SELECTED_FILE_TO_VIEW,
          body: { image: item },
        });
        dispatch({
          type: SELECTED_FILES_TO_UPLOAD,
          body: {
            images: [item],
          },
        });
        dispatch({
          type: STATUS_BAR_STYLE,
          body: { color: STYLES.$STATUS_BAR_STYLE["light-content"] },
        });
      })
      .catch((err) => {});
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  useEffect(() => {
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

  // function calls a confirm alert which will further call onSend function onConfirm.
  const sendDmRequest = () => {
    showDMSentAlert();
  };

  const showDMSentAlert = () => {
    setDMSentAlertModalVisible(true);
  };

  const hideDMSentAlert = () => {
    setDMSentAlertModalVisible(false);
  };

  // function handles opening of camera functionality
  const handleCamera = async () => {
    if (isIOS) {
      await openCamera();
    } else {
      const res = await requestCameraPermission();
      if (res === true) {
        await openCamera();
      }
    }
  };

  // function handles the selection of images and videos
  const handleGallery = async () => {
    if (isIOS) {
      selectGallery();
    } else {
      const res = await requestStoragePermission();
      if (res === true) {
        selectGallery();
      }
    }
  };

  // function handles the slection of documents
  const handleDoc = async () => {
    if (isIOS) {
      selectDoc();
    } else {
      const res = await requestStoragePermission();
      if (res === true) {
        selectDoc();
      }
    }
  };

  // this method is trigerred whenever user presses the send button
  const onSend = async (
    conversation: string,
    voiceNote?: any,
    isSendWhileVoiceNoteRecorderPlayerRunning?: boolean
  ) => {
    setClosedPreview(true);
    setShowLinkPreview(false);
    setMessage("");
    setInputHeight(25);
    setIsVoiceResult(false);
    setVoiceNotes({
      recordSecs: 0,
      recordTime: "",
      name: "",
    });
    // -- Code for local message handling for normal and reply for now
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const time = new Date(Date.now());
    const hr = time.getHours();
    const min = time.getMinutes();
    const ID = Date.now();
    const filesToUpload = selectedFilesToUpload?.length;
    const voiceNotesToUpload =
      voiceNote?.length > 0 ? voiceNote : selectedVoiceNoteFilesToUpload;
    const attachmentsCount =
      filesToUpload > 0 ? filesToUpload : voiceNotesToUpload?.length; //if any

    let dummySelectedFileArr: any = []; //if any
    let dummyAttachmentsArr: any = []; //if any

    // for making data for `images`, `videos` and `pdf` key
    if (attachmentsCount > 0) {
      for (let i = 0; i < attachmentsCount; i++) {
        const attachmentType = selectedFilesToUpload[i]?.type?.split("/")[0];
        const docAttachmentType = selectedFilesToUpload[i]?.type?.split("/")[1];
        if (attachmentType === IMAGE_TEXT) {
          const obj = {
            imageUrl: selectedFilesToUpload[i].uri,
            index: i,
          };
          dummySelectedFileArr = [...dummySelectedFileArr, obj];
        } else if (attachmentType === VIDEO_TEXT) {
          const obj = {
            videoUrl: selectedFilesToUpload[i].uri,
            index: i,
            thumbnailUrl: selectedFilesToUpload[i].thumbanil,
          };
          dummySelectedFileArr = [...dummySelectedFileArr, obj];
        } else if (docAttachmentType === PDF_TEXT) {
          const obj = {
            pdfFile: selectedFilesToUpload[i].uri,
            index: i,
          };
          dummySelectedFileArr = [...dummySelectedFileArr, obj];
        }
      }
    }

    // for making data for `attachments` key
    if (attachmentsCount > 0) {
      for (let i = 0; i < attachmentsCount; i++) {
        const attachmentType = selectedFilesToUpload[i]?.data?.type
          ? selectedFilesToUpload[i]?.data?.type
          : selectedFilesToUpload[i]?.type?.split("/")[0];
        const docAttachmentType = selectedFilesToUpload[i]?.type?.split("/")[1];
        const audioAttachmentType = voiceNotesToUpload[i]?.type;
        const audioURI = voiceNotesToUpload[i]?.uri;
        const URI = selectedFilesToUpload[i]?.uri;
        if (attachmentType === IMAGE_TEXT) {
          const obj = {
            ...selectedFilesToUpload[i],
            type: attachmentType,
            url: URI,
            index: i,
          };
          dummyAttachmentsArr = [...dummyAttachmentsArr, obj];
        } else if (attachmentType === VIDEO_TEXT) {
          const obj = {
            ...selectedFilesToUpload[i],
            type: attachmentType,
            url: URI,
            thumbnailUrl: selectedFilesToUpload[i].thumbnailUrl,
            index: i,
            name: selectedFilesToUpload[i].fileName,
          };
          dummyAttachmentsArr = [...dummyAttachmentsArr, obj];
        } else if (docAttachmentType === PDF_TEXT) {
          const obj = {
            ...selectedFilesToUpload[i],
            type: docAttachmentType,
            url: URI,
            index: i,
            name: selectedFilesToUpload[i].name,
          };
          dummyAttachmentsArr = [...dummyAttachmentsArr, obj];
        } else if (audioAttachmentType === VOICE_NOTE_TEXT) {
          const obj = {
            ...voiceNotesToUpload[i],
            type: audioAttachmentType,
            url: audioURI,
            index: i,
            name: voiceNotesToUpload[i].name,
            metaRO: {
              size: null,
              duration: voiceNotesToUpload[i].duration,
            },
          };
          dummyAttachmentsArr = [...dummyAttachmentsArr, obj];
        } else if (attachmentType === GIF_TEXT) {
          let obj = {
            ...selectedFilesToUpload[i],
            type: attachmentType,
            url: selectedFilesToUpload[i]?.url,
            thumbnailUrl: selectedFilesToUpload[i].thumbnailUrl,
            index: i,
            name: selectedFilesToUpload[i].name,
          };
          dummyAttachmentsArr = [...dummyAttachmentsArr, obj];
        }
      }
    }

    const conversationText = replaceMentionValues(
      conversation,
      ({ id, name }) => {
        // example ID = `user_profile/8619d45e-9c4c-4730-af8e-4099fe3dcc4b`
        const PATH = extractPathfromRouteQuery(id);
        if (!PATH) {
          const newName = name.substring(1);
          isGroupTag = true;
          taggedUserNames.push(name);
          return `<<${name}|route://${newName}>>`;
        } else {
          taggedUserNames.push(name);
          return `<<${name}|route://${id}>>`;
        }
      }
    );

    const isMessageTrimmed =
      !!conversation.trim() ||
      isVoiceResult ||
      isSendWhileVoiceNoteRecorderPlayerRunning;

    // check if message is empty string or not
    if ((isMessageTrimmed && !isUploadScreen) || isUploadScreen) {
      const replyObj = chatSchema.reply;
      if (isReply) {
        replyObj.replyConversation = replyMessage?.id?.toString();
        replyObj.replyConversationObject = replyMessage;
        replyObj.member.name = user?.name;
        replyObj.member.id = user?.id?.toString();
        replyObj.member.sdkClientInfo = user?.sdkClientInfo;
        replyObj.member.uuid = user?.uuid;
        replyObj.answer = conversationText?.trim()?.toString();
        replyObj.createdAt = `${hr.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}:${min.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        })}`;
        replyObj.id = ID?.toString();
        replyObj.chatroomId = chatroomDetails?.chatroom?.id?.toString();
        replyObj.communityId = community?.id?.toString();
        replyObj.date = `${
          time.getDate() < 10 ? `0${time.getDate()}` : time.getDate()
        } ${months[time.getMonth()]} ${time.getFullYear()}`;
        replyObj.chatroomId = chatroomDetails?.chatroom?.id?.toString();
        replyObj.communityId = community?.id?.toString();
        replyObj.date = `${
          time.getDate() < 10 ? `0${time.getDate()}` : time.getDate()
        } ${months[time.getMonth()]} ${time.getFullYear()}`;
        replyObj.attachmentCount = attachmentsCount;
        replyObj.attachments = dummyAttachmentsArr;
        replyObj.hasFiles = attachmentsCount > 0 ? true : false;
        replyObj.attachmentsUploaded = attachmentsCount > 0 ? true : false;
        replyObj.images = dummySelectedFileArr;
        replyObj.videos = dummySelectedFileArr;
        replyObj.pdf = dummySelectedFileArr;
        if (!closedOnce || !closedPreview) {
          replyObj.ogTags = ogTagsState;
        }
      }
      const obj = chatSchema.normal;
      obj.member.name = user?.name;
      obj.member.id = user?.id?.toString();
      obj.member.sdkClientInfo = user?.sdkClientInfo;
      obj.member.uuid = user?.uuid;
      obj.answer = conversationText?.trim()?.toString();
      obj.createdAt = `${hr.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })}:${min.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })}`;
      obj.id = ID?.toString();
      obj.chatroomId = chatroomDetails?.chatroom?.id?.toString();
      obj.communityId = community?.id?.toString();
      obj.date = `${
        time.getDate() < 10 ? `0${time.getDate()}` : time.getDate()
      } ${months[time.getMonth()]} ${time.getFullYear()}`;
      obj.attachmentCount = attachmentsCount;
      obj.attachments = dummyAttachmentsArr;
      obj.hasFiles = attachmentsCount > 0 ? true : false;
      obj.attachmentsUploaded = attachmentsCount > 0 ? true : false;
      obj.images = dummySelectedFileArr;
      obj.videos = dummySelectedFileArr;
      obj.pdf = dummySelectedFileArr;
      if (!closedOnce || !closedPreview) {
        obj.ogTags = ogTagsState;
      }

      dispatch({
        type: UPDATE_CONVERSATIONS,
        body: isReply
          ? { obj: { ...replyObj, isInProgress: SUCCESS } }
          : { obj: { ...obj, isInProgress: SUCCESS } },
      });

      dispatch({
        type: MESSAGE_SENT,
        body: isReply ? { id: replyObj?.id } : { id: obj?.id },
      });

      if (
        chatroomType !== ChatroomType.DMCHATROOM && // if not DM
        chatRequestState !== null // if not first DM message sent to an user
      ) {
        if (isReply) {
          if (attachmentsCount > 0) {
            const editedReplyObj = { ...replyObj, isInProgress: SUCCESS };
            await myClient?.saveNewConversation(
              chatroomID?.toString(),
              editedReplyObj
            );
          } else {
            await myClient?.saveNewConversation(
              chatroomID?.toString(),
              replyObj
            );
          }
        } else {
          if (attachmentsCount > 0) {
            const editedObj = { ...obj, isInProgress: SUCCESS };
            await myClient?.saveNewConversation(
              chatroomID?.toString(),
              editedObj
            );
          } else {
            await myClient?.saveNewConversation(chatroomID?.toString(), obj);
          }
        }
      }

      if (isUploadScreen) {
        dispatch({
          type: CLEAR_SELECTED_FILES_TO_UPLOAD,
        });
        dispatch({
          type: CLEAR_SELECTED_FILE_TO_VIEW,
        });
      }

      if (isReply) {
        dispatch({ type: SET_IS_REPLY, body: { isReply: false } });
        dispatch({ type: SET_REPLY_MESSAGE, body: { replyMessage: "" } });
      }

      // -- Code for local message handling ended
      // condition for request DM for the first time
      if (
        chatroomType === ChatroomType.DMCHATROOM && // if DM
        chatRequestState === null &&
        isPrivateMember // isPrivateMember = false when none of the member on both sides is CM.
      ) {
        const response = await myClient?.sendDMRequest({
          chatroomId: parseInt(chatroomID),
          chatRequestState: ChatroomChatRequestState.INITIATED,
          text: conversation?.trim(),
        });

        dispatch({
          type: SHOW_TOAST,
          body: { isToast: true, msg: "Direct messaging request sent" },
        });

        //dispatching redux action for local handling of chatRequestState
        dispatch({
          type: UPDATE_CHAT_REQUEST_STATE,
          body: { chatRequestState: ChatroomChatRequestState.INITIATED },
        });
        await myClient?.saveNewConversation(
          chatroomID?.toString(),
          response?.data?.conversation
        );
        await myClient?.updateChatRequestState(
          chatroomID?.toString(),
          ChatroomChatRequestState.INITIATED
        );
      } else if (
        chatroomType === ChatroomType.DMCHATROOM && // if DM
        chatRequestState === null &&
        !isPrivateMember // isPrivateMember = false when none of the member on both sides is CM.
      ) {
        const response = await myClient?.sendDMRequest({
          chatroomId: parseInt(chatroomID),
          chatRequestState: ChatroomChatRequestState.ACCEPTED,
          text: conversation?.trim(),
        });

        dispatch({
          type: UPDATE_CHAT_REQUEST_STATE,
          body: { chatRequestState: ChatroomChatRequestState.ACCEPTED },
        });
        await myClient?.saveNewConversation(
          chatroomID?.toString(),
          response?.data?.conversation
        );
        await myClient?.updateChatRequestState(
          chatroomID?.toString(),
          ChatroomChatRequestState.ACCEPTED
        );
      } else {
        if (!isUploadScreen) {
          const payload: any = {
            chatroomId: chatroomID,
            hasFiles: false,
            text: conversationText?.trim(),
            temporaryId: ID?.toString(),
            attachmentCount: attachmentsCount,
            repliedConversationId: replyMessage?.id,
          };

          if (
            Object.keys(ogTagsState).length !== 0 &&
            url &&
            (!closedOnce || !closedPreview)
          ) {
            payload.ogTags = ogTagsState;
          } else if (url && (!closedOnce || !closedPreview)) {
            payload.shareLink = url;
          }

          const response: any = await dispatch(onConversationsCreate(payload));

          if (response) {
            await myClient?.replaceSavedConversation(response?.conversation, response?.widgets);
          }

          //Handling conversation failed case
          if (response === undefined) {
            dispatch({
              type: SHOW_TOAST,
              body: {
                isToast: true,
                msg: BLOCKED_DM,
              },
            });
            dispatch({
              type: EMPTY_BLOCK_DELETION,
              body: {},
            });
          } else if (response && attachmentsCount > 0) {
            // start uploading

            dispatch({
              type: SET_FILE_UPLOADING_MESSAGES,
              body: {
                message: isReply
                  ? {
                      ...replyObj,
                      id: response?.id,
                      temporaryId: ID,
                      isInProgress: SUCCESS,
                    }
                  : {
                      ...obj,
                      id: response?.id,
                      temporaryId: ID,
                      isInProgress: SUCCESS,
                    },
                ID: response?.id,
              },
            });

            const id = response?.id;
            const message = isReply
              ? {
                  ...replyObj,
                  id: response?.id,
                  temporaryId: ID,
                  isInProgress: SUCCESS,
                }
              : {
                  ...obj,
                  id: response?.id,
                  temporaryId: ID,
                  isInProgress: SUCCESS,
                };

            await myClient?.saveAttachmentUploadConversation(
              id.toString(),
              JSON.stringify(message)
            );

            if (voiceNotesToUpload?.length > 0) {
              await handleFileUpload(
                response?.id,
                false,
                true,
                voiceNotesToUpload
              );
            } else {
              await handleFileUpload(response?.id, false);
            }
          }
        } else {
          dispatch({
            type: FILE_SENT,
            body: { status: !fileSent },
          });
          navigation.goBack();
          const payload: any = {
            chatroomId: chatroomID,
            hasFiles: false,
            text: conversationText?.trim(),
            temporaryId: ID?.toString(),
            attachmentCount: attachmentsCount,
            repliedConversationId: replyMessage?.id,
          };

          if (
            Object.keys(ogTagsState).length !== 0 &&
            url &&
            (!closedOnce || !closedPreview)
          ) {
            payload.ogTags = ogTagsState;
          } else if (url && (!closedOnce || !closedPreview)) {
            payload.shareLink = url;
          }

          const response: any = await dispatch(onConversationsCreate(payload));

          await myClient?.replaceSavedConversation(response?.conversation, response?.widgets);

          if (response === undefined) {
            dispatch({
              type: SHOW_TOAST,
              body: {
                isToast: true,
                msg: "Message not sent. Please check your internet connection",
              },
            });
          } else if (response) {
            // start uploading
            dispatch({
              type: SET_FILE_UPLOADING_MESSAGES,
              body: {
                message: isReply
                  ? {
                      ...replyObj,
                      id: response?.id,
                      temporaryId: ID,
                      isInProgress: SUCCESS,
                    }
                  : {
                      ...obj,
                      id: response?.id,
                      temporaryId: ID,
                      isInProgress: SUCCESS,
                    },
                ID: response?.id,
              },
            });

            const id = response?.id;
            const message = isReply
              ? {
                  ...replyObj,
                  id: response?.id,
                  temporaryId: ID,
                  isInProgress: SUCCESS,
                }
              : {
                  ...obj,
                  id: response?.id,
                  temporaryId: ID,
                  isInProgress: SUCCESS,
                };

            await myClient?.saveAttachmentUploadConversation(
              id?.toString(),
              JSON.stringify(message)
            );

            await handleFileUpload(response?.id, false);
          }
          dispatch({
            type: STATUS_BAR_STYLE,
            body: { color: STYLES.$STATUS_BAR_STYLE.default },
          });
        }
      }
      let selectedType;
      if (isReply) {
        selectedType = getConversationType(replyObj);
      } else {
        selectedType = getConversationType(obj);
      }
      LMChatAnalytics.track(
        Events.CHATROOM_RESPONDED,
        new Map<string, string>([
          [
            Keys.CHATROOM_TYPE,
            getChatroomType(
              chatroomDBDetails?.type?.toString(),
              chatroomDBDetails?.isSecret
            ),
          ],
          [Keys.COMMUNITY_ID, user?.sdkClientInfo?.community?.toString()],
          [Keys.CHATROOM_NAME, chatroomName?.toString()],
          [Keys.CHATROOM_LAST_CONVERSATION_TYPE, selectedType?.toString()],
          ["count_tagged_users", taggedUserNames?.length?.toString()],
          ["name_tagged_users", taggedUserNames?.toString()],
          ["is_group_tag", isGroupTag?.toString()],
        ])
      );
    }

    dispatch({ type: CLEAR_SELECTED_VOICE_NOTE_FILES_TO_UPLOAD });
    setIsRecordingLocked(false);
    setOgTagsState({});
    setUrl("");
    setClosedOnce(false);
    setClosedPreview(false);
  };

  const taggingAPI = async ({
    page,
    searchName,
    chatroomId,
    isSecret,
  }: any) => {
    const res = await myClient?.getTaggingList({
      page: page,
      pageSize: 10,
      searchName: searchName,
      chatroomId: chatroomId,
      isSecret: isSecret,
    });
    return res?.data;
  };

  // function shows loader in between calling the API and getting the response
  const loadData = async (newPage: number) => {
    setIsLoading(true);
    const res = await taggingAPI({
      page: newPage,
      searchName: taggedUserName,
      chatroomId: chatroomID,
      isSecret: isSecret,
    });
    if (res) {
      isSecret
        ? setUserTaggingList([...userTaggingList, ...res?.chatroomParticipants])
        : setUserTaggingList([...userTaggingList, ...res?.communityMembers]);
      setIsLoading(false);
    }
  };

  //function checks the pagination logic, if it verifies the condition then call loadData
  const handleLoadMore = () => {
    const userTaggingListLength = userTaggingList.length;
    if (!isLoading && userTaggingListLength > 0) {
      // checking if conversations length is greater the 15 as it convered all the screen sizes of mobiles, and pagination API will never call if screen is not full messages.
      if (userTaggingListLength >= 10 * page) {
        const newPage = page + 1;
        setPage(newPage);
        loadData(newPage);
      }
    }
  };

  //pagination loader in the footer
  const renderFooter = () => {
    return isLoading ? (
      <View style={{ paddingVertical: Layout.normalize(20) }}>
        <LMChatLoader color={STYLES.$COLORS.SECONDARY} />
      </View>
    ) : null;
  };

  // to detect link preview and call the decodeUrl API
  async function detectLinkPreview(link: string) {
    const payload = {
      url: link,
    };
    const decodeUrlResponse = await myClient?.decodeUrl(payload);
    const ogTags = decodeUrlResponse?.data?.ogTags;
    if (ogTags !== undefined) {
      setOgTagsState(ogTags);
    }
  }

  // this mehthod is trigerred whenever there is any change in the input box
  const handleInputChange = async (event: string) => {
    const parts = event.split(LINK_PREVIEW_REGEX);
    if (parts?.length > 1) {
      {
        parts?.map((value: string) => {
          if (LINK_PREVIEW_REGEX.test(value) && !isUploadScreen) {
            clearTimeout(debounceLinkPreviewTimeout);
            const timeoutId = setTimeout(() => {
              for (let i = 0; i < parts.length; i++) {
                setShowLinkPreview(true);
                if (LINK_PREVIEW_REGEX.test(parts[i]) && !closedPreview) {
                  setShowLinkPreview(true);
                  setUrl(parts[i]);
                  detectLinkPreview(parts[i]);
                  break;
                }
              }
            }, 500);
            setLinkPreviewDebounceTimeout(timeoutId);
          }
        });
      }
    } else {
      setOgTagsState({});
      setShowLinkPreview(false);
    }
    if (chatRequestState === 0 || chatRequestState === null) {
      if (event.length >= MAX_LENGTH) {
        dispatch({
          type: SHOW_TOAST,
          body: {
            isToast: true,
            msg: CHARACTER_LIMIT_MESSAGE,
          },
        });
      } else if (event.length < MAX_LENGTH) {
        setMessage(event);
      }
    } else {
      setMessage(event);

      // chatroomType === ChatroomType.DMCHATROOM (if DM don't detect and show user tags)
      const newMentions =
        chatroomType === ChatroomType.DMCHATROOM ? [] : detectMentions(event);

      if (newMentions.length > 0) {
        const length = newMentions.length;
        setTaggedUserName(newMentions[length - 1]);
      }

      // debouncing logic
      clearTimeout(debounceTimeout);

      const len = newMentions.length;
      if (len > 0) {
        const timeoutID = setTimeout(async () => {
          setPage(1);
          const res = await taggingAPI({
            page: 1,
            searchName: newMentions[len - 1],
            chatroomId: chatroomID,
            isSecret: isSecret,
          });
          if (len > 0) {
            const groupTagsLength = res?.groupTags?.length;
            const communityMembersLength = isSecret
              ? res?.chatroomParticipants.length
              : res?.communityMembers.length;
            const arrLength = communityMembersLength + groupTagsLength;
            if (arrLength >= 5) {
              setUserTaggingListHeight(5 * 58);
            } else if (arrLength < 5) {
              const height = communityMembersLength * 58 + groupTagsLength * 80;
              setUserTaggingListHeight(height);
            }
            isSecret
              ? setUserTaggingList(res?.chatroomParticipants)
              : setUserTaggingList(res?.communityMembers);
            setGroupTags(res?.groupTags);
            setIsUserTagging(true);
          }
        }, 500);

        setDebounceTimeout(timeoutID);
      } else {
        if (isUserTagging) {
          setUserTaggingList([]);
          setGroupTags([]);
          setIsUserTagging(false);
        }
      }
    }
  };
  // this function is for editing a conversation
  const onEdit = async () => {
    const selectedConversation = editConversation;

    const conversationId = selectedConversation?.id;
    const previousConversation = selectedConversation;

    let changedConversation;
    const conversationText = replaceMentionValues(message, ({ id, name }) => {
      // example ID = `user_profile/8619d45e-9c4c-4730-af8e-4099fe3dcc4b`
      const PATH = extractPathfromRouteQuery(id);
      if (!PATH) {
        return `<<${name}|route://${name}>>`;
      } else {
        return `<<${name}|route://${id}>>`;
      }
    });

    const editedConversation = conversationText;
    changedConversation = {
      ...selectedConversation,
      answer: editedConversation,
      isEdited: true,
    };

    dispatch({
      type: EDIT_CONVERSATION,
      body: {
        previousConversation: previousConversation,
        changedConversation: changedConversation,
      },
    });

    dispatch({
      type: SET_EDIT_MESSAGE,
      body: {
        editConversation: "",
      },
    });

    const index = conversations.findIndex((element: any) => {
      return element?.id == selectedConversation?.id;
    });

    if (index === 0) {
      dispatch({
        type: UPDATE_LAST_CONVERSATION,
        body: {
          lastConversationAnswer: editedConversation,
          chatroomType: chatroomType,
          chatroomID: chatroomID,
        },
      });
    }
    dispatch({ type: SELECTED_MESSAGES, body: [] });
    dispatch({ type: LONG_PRESSED, body: false });
    setMessage("");
    setInputHeight(25);
    setIsEditable(false);

    const payload = {
      conversationId: conversationId,
      text: editedConversation,
    };

    let editConversationResponse;
    if (currentChatroomTopic) {
      editConversationResponse = await myClient?.editConversation(
        payload,
        currentChatroomTopic
      );
    } else {
      editConversationResponse = await myClient?.editConversation(payload);
    }
    if (conversationId == currentChatroomTopic?.id) {
      dispatch({
        type: SET_CHATROOM_TOPIC,
        body: {
          currentChatroomTopic: editConversationResponse?.data?.conversation,
        },
      });
    }
    await myClient?.updateConversation(
      conversationId?.toString(),
      editConversationResponse?.data?.conversation
    );
    LMChatAnalytics.track(
      Events.MESSAGE_EDITED,
      new Map<string, string>([
        [Keys.TYPE, getConversationType(selectedConversation)],
        [Keys.DESCRIPTION_UPDATED, false?.toString()],
      ])
    );
  };

  const askPermission = async () => {
    if (!isIOS) {
      const permission = await requestAudioRecordPermission();
      setIsRecordingPermission(!!permission);
    } else {
      const permission = await request(PERMISSIONS.IOS.MICROPHONE);
      if (permission === GRANTED) {
        setIsRecordingPermission(true);
      }
    }
  };

  useEffect(() => {
    if (isVoiceNoteIconPress) {
      setTimeout(() => {
        setIsVoiceNoteIconPress(false);
      }, 2000);
    }
  }, [isVoiceNoteIconPress]);

  const contextValues: InputBoxContext = {
    isVoiceNoteIconPress,
    hideDMSentAlert,
    handleVideoThumbnail,
    handleImageAndVideoUpload,
    selectGallery,
    selectDoc,
    openCamera,
    selectGIF,
    handleModalClose,
    sendDmRequest,
    showDMSentAlert,
    handleCamera,
    handleGallery,
    handleDoc,
    onSend,
    taggingAPI,
    loadData,
    handleLoadMore,
    renderFooter,
    detectLinkPreview,
    handleInputChange,
    onEdit,
    askPermission,
    setModalVisible,
    chatroomType,
    DMSentAlertModalVisible,
    message,
    inputBoxStyles,
    isKeyBoardFocused,
    isIOS,
    isUploadScreen,
    isReply,
    isUserTagging,
    isEditable,
    ogTagsState,
    userTaggingList,
    userTaggingListHeight,
    groupTags,
    taggedUserName,
    setMessage,
    setUserTaggingList,
    setGroupTags,
    setIsUserTagging,
    replyMessage,
    chatroomName,
    showLinkPreview,
    closedOnce,
    setShowLinkPreview,
    setClosedOnce,
    setClosedPreview,
    editConversation,
    setIsEditable,
    isDoc,
    isGif,
    chatRequestState,
    inputHeight,
    setInputHeight,
    myRef,
    MAX_LENGTH,
    isPrivateMember,
    isRecordingPermission,
    setIsVoiceNoteIconPress,
    modalVisible,
    navigation,
    chatroomID,
    conversations,
    isRecordingLocked,
    setIsRecordingLocked,
    voiceNotes,
    setVoiceNotes,
  };

  return (
    <InputBoxContext.Provider value={contextValues}>
      {children}
    </InputBoxContext.Provider>
  );
};
