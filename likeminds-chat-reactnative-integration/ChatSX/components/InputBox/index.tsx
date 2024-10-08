import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Modal,
  Pressable,
  Keyboard,
  ActivityIndicator,
  TouchableWithoutFeedback,
  PermissionsAndroid,
  Vibration,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { styles } from "./styles";
import { useAppDispatch, useAppSelector } from "../../store";
import { onConversationsCreate } from "../../store/actions/chatroom";
import {
  CLEAR_SELECTED_FILES_TO_UPLOAD,
  CLEAR_SELECTED_FILE_TO_VIEW,
  EDIT_CONVERSATION,
  FILE_SENT,
  LONG_PRESSED,
  MESSAGE_SENT,
  SELECTED_FILES_TO_UPLOAD,
  SELECTED_FILES_TO_UPLOAD_THUMBNAILS,
  SELECTED_FILE_TO_VIEW,
  SELECTED_MESSAGES,
  SELECTED_MORE_FILES_TO_UPLOAD,
  SET_EDIT_MESSAGE,
  SET_FILE_UPLOADING_MESSAGES,
  SET_IS_REPLY,
  SET_REPLY_MESSAGE,
  SHOW_TOAST,
  STATUS_BAR_STYLE,
  UPDATE_CHAT_REQUEST_STATE,
  UPDATE_CONVERSATIONS,
  UPDATE_LAST_CONVERSATION,
  EMPTY_BLOCK_DELETION,
  SELECTED_VOICE_NOTE_FILES_TO_UPLOAD,
  CLEAR_SELECTED_VOICE_NOTE_FILES_TO_UPLOAD,
  SET_CHATROOM_TOPIC,
} from "../../store/types/types";
import { ReplyBox } from "../ReplyConversations";
import { chatSchema } from "../../assets/chatSchema";
import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
  Asset,
} from "react-native-image-picker";
import DocumentPicker from "react-native-document-picker";
import { CREATE_POLL_SCREEN, FILE_UPLOAD } from "../../constants/Screens";
import STYLES from "../../constants/Styles";
import SendDMRequestModal from "../../customModals/SendDMRequest";
import {
  BLOCKED_DM,
  CAMERA_TEXT,
  CAPITAL_GIF_TEXT,
  CHARACTER_LIMIT_MESSAGE,
  DOCUMENTS_TEXT,
  GIF_TEXT,
  GRANTED,
  IMAGE_TEXT,
  PDF_TEXT,
  PHOTOS_AND_VIDEOS_TEXT,
  POLL_TEXT,
  SLIDE_TO_CANCEL,
  SUCCESS,
  TAP_AND_HOLD,
  VIDEO_TEXT,
  VOICE_NOTE_TEXT,
} from "../../constants/Strings";
import { CognitoIdentityCredentials, S3 } from "aws-sdk";
import AWS from "aws-sdk";
import { POOL_ID, REGION } from "../../awsExports";
import {
  atLeastAndroid13,
  detectMentions,
  extractPathfromRouteQuery,
  getAllPdfThumbnail,
  getPdfThumbnail,
  getVideoThumbnail,
  replaceLastMention,
} from "../../commonFuctions";
import {
  requestAudioRecordPermission,
  requestCameraPermission,
  requestStoragePermission,
} from "../../utils/permissions";
import { FlashList } from "@shopify/flash-list";
import { ChatroomChatRequestState, Events, Keys } from "../../enums";
import { ChatroomType } from "../../enums";
import {
  InputBoxProps,
  LaunchActivityProps,
  VoiceNotesPlayerProps,
  VoiceNotesProps,
} from "./models";
import Animated, {
  AnimatedStyleProp,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import ReactNativeBlobUtil from "react-native-blob-util";
import { generateAudioSet, generateVoiceNoteName } from "../../audio";
import { LINK_PREVIEW_REGEX } from "../../constants/Regex";
import LinkPreviewInputBox from "../linkPreviewInputBox";
import { LMChatAnalytics } from "../../analytics/LMChatAnalytics";
import {
  getChatroomType,
  getConversationType,
} from "../../utils/analyticsUtils";
import { PERMISSIONS, check, request } from "react-native-permissions";
import { createThumbnail } from "react-native-create-thumbnail";
import {
  LMChatIcon,
  LMChatLoader,
  LMChatTextInput,
  LMChatTextView,
} from "../../uiComponents";
import { Client } from "../../client";
import {
  convertToMentionValues,
  replaceMentionValues,
} from "../../uiComponents/LMChatTextInput/utils";
import Layout from "../../constants/Layout";
import GIFPicker from "../../optionalDependecies/Gif";
import AudioRecorder from "../../optionalDependecies/AudioRecorder";
import LottieView from "../../optionalDependecies/LottieView";
import { SyncConversationRequest } from "@likeminds.community/chat-rn";
import { DefaultStyle } from "react-native-reanimated/lib/typescript/hook/commonTypes";
import AudioPlayer from "../../optionalDependecies/AudioPlayer";

// to intialise audio recorder player
const audioRecorderPlayerAttachment = AudioRecorder
  ? new AudioRecorder.default()
  : null;

const MessageInputBox = ({
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
}: InputBoxProps) => {
  const myClient = Client.myClient;
  const inputBoxStyles = STYLES.$INPUT_BOX_STYLE;

  const [isKeyBoardFocused, setIsKeyBoardFocused] = useState(false);
  const [message, setMessage] = useState(previousMessage);
  const [formattedConversation, setFormattedConversation] =
    useState(previousMessage);
  const [inputHeight, setInputHeight] = useState(25);
  const [showEmoji, setShowEmoji] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [pollModalVisible, setPollModalVisible] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [s3UploadResponse, setS3UploadResponse] = useState<any>();
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
  const [voiceNotesPlayer, setVoiceNotesPlayer] =
    useState<VoiceNotesPlayerProps>({
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: "",
      duration: "",
    });
  const [voiceNotesLink, setVoiceNotesLink] = useState("");
  const [isVoiceResult, setIsVoiceResult] = useState(false);
  const [isVoiceNotePlaying, setIsVoiceNotePlaying] = useState(false);
  const [isVoiceNoteRecording, setIsVoiceNoteRecording] = useState(false);
  const [isDraggable, setIsDraggable] = useState(true);
  const [isLongPressedState, setIsLongPressedState] = useState(false);
  const [isRecordingLocked, setIsRecordingLocked] = useState(false);
  const [stopRecording, setStopRecording] = useState(false);
  const [isDeleteAnimation, setIsDeleteAnimation] = useState(false);
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
  const { myChatrooms, user, community }: any = useAppSelector(
    (state) => state.homefeed
  );
  const {
    chatroomDetails,
    isReply,
    replyMessage,
    editConversation,
    fileSent,
  }: any = useAppSelector((state) => state.chatroom);

  const { uploadingFilesMessages }: any = useAppSelector(
    (state) => state.upload
  );
  let isGroupTag = false;

  const dispatch = useAppDispatch();
  const conversationArrayLength = conversations.length;

  AWS.config.update({
    region: REGION, // Replace with your AWS region, e.g., 'us-east-1'
    credentials: new CognitoIdentityCredentials({
      IdentityPoolId: POOL_ID, // Replace with your Identity Pool ID
    }),
  });

  const s3 = new S3();

  // Animation

  const pressed = useSharedValue(false);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const lockOffset = useSharedValue(4);
  const upChevronOffset = useSharedValue(3);
  const micIconOpacity = useSharedValue(1); // Initial opacity value
  const isLongPressed = useSharedValue(false);

  // lock icon animation styles
  const lockAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: lockOffset.value }],
  }));

  // up chevron animated styles
  const upChevronAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: upChevronOffset.value }],
  }));

  // recorder mic icon animation effect
  useEffect(() => {
    micIconOpacity.value = withRepeat(
      withTiming(0, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1, // Infinite repetition (-1)
      true // Reverse the animation direction after each iteration
    );
  }, []);

  // lock icon animation useEffect
  useEffect(() => {
    lockOffset.value = withRepeat(
      withTiming(-lockOffset.value, { duration: 800 }),
      -1, // Infinite repetition (-1)
      true // Reverse the animation direction after each iteration
    );
  }, []);

  // up chevron animation useEffect
  useEffect(() => {
    upChevronOffset.value = withRepeat(
      withTiming(-upChevronOffset.value, { duration: 400 }),
      -1,
      true
    );
  }, []);

  // to hide delete animation
  useEffect(() => {
    if (isDeleteAnimation) {
      setTimeout(() => {
        setIsDeleteAnimation(false);
        setIsVoiceResult(false);
      }, 2200);
    }
  }, [isDeleteAnimation]);

  // to stop the recorder
  useEffect(() => {
    setTimeout(async () => {
      if (!isLongPressedState && isVoiceNoteRecording && !isRecordingLocked) {
        await stopRecord();
        setIsVoiceResult(true);
      }
    }, 300);
  }, [isLongPressedState, isRecordingLocked]);

  // to start Recorder
  useEffect(() => {
    if (isLongPressedState && !isVoiceNoteRecording) {
      Vibration.vibrate(0.5 * 100);
      startRecord();
    }
  }, [isLongPressedState]);

  // long press gesture
  const longPressGesture = Gesture.LongPress()
    .runOnJS(true)
    .minDuration(250)
    .onStart(() => {
      isLongPressed.value = true;
      setIsLongPressedState(true);
    });

  // this method handles onUpdate callback of pan gesture
  const onUpdatePanGesture = (
    event: GestureUpdateEvent<PanGestureHandlerEventPayload>
  ) => {
    "worklet";
    if (isLongPressed.value) {
      if (Math.abs(x.value) >= 120) {
        x.value = withSpring(0);
        if (isDraggable) {
          stopRecord();
          setIsDraggable(false);
          setIsDeleteAnimation(true);
          clearVoiceRecord();
          setIsDraggable(true);
          isLongPressed.value = false;
        }
        pressed.value = false;
        isLongPressed.value = false;
      } else if (Math.abs(y.value) >= 100) {
        y.value = withSpring(0);
        if (isDraggable) {
          setIsDraggable(false);
          setIsDraggable(true);
          setIsRecordingLocked(true);
          setIsLongPressedState(false);
          isLongPressed.value = false;
        }
      } else if (Math.abs(x.value) > 5) {
        x.value = event.translationX;
      } else if (Math.abs(y.value) > 5) {
        y.value = event.translationY;
      } else {
        x.value = event.translationX;
        y.value = event.translationY;
      }
    }
  };

  // this method handles onEnd callback of pan gesture
  const onEndPanGesture = () => {
    "worklet";
    if (
      (Math.abs(x.value) > 5 && Math.abs(x.value) < 120) ||
      (Math.abs(y.value) > 5 && Math.abs(y.value) < 100)
    ) {
      setIsRecordingLocked(false);
      handleStopRecord();
    }
    x.value = withSpring(0);
    y.value = withSpring(0);
    pressed.value = false;
    isLongPressed.value = false;
    setIsLongPressedState(false);
  };

  // draggle mic pan gesture on x-axis and y-axis
  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .enabled(isDraggable)
    .onUpdate(onUpdatePanGesture)
    .onEnd(onEndPanGesture)
    .onFinalize(() => {
      "worklet";
      pressed.value = false;
      isLongPressed.value = false;
      setIsLongPressedState(false);
      setIsDraggable(true);
    })
    .onTouchesCancelled(() => {
      setIsDraggable(true);
    })
    .simultaneousWithExternalGesture(longPressGesture);

  const composedGesture = Gesture.Simultaneous(longPressGesture, panGesture);

  // draggle mic panGesture styles
  const panStyle = useAnimatedStyle((): DefaultStyle => {
    return {
      transform: [
        {
          translateX: x.value,
        },
        {
          translateY: y.value,
        },
        { scale: withTiming(isLongPressed.value ? 1.5 : 1) },
      ],
    };
  }, [x, y]);

  // Animation stop

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
      setFormattedConversation("");
      setInputHeight(25);
    }
  }, [fileSent]);

  // this useEffect is to stop audio player when going out of chatroom, if any audio is running
  useEffect(() => {
    return () => {
      stopRecord();
      stopPlay();
    };
  }, []);

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
    selectGallery();

    // TODO in future for handling permissions
    // if (isIOS) {
    //   selectGallery();
    // } else {
    //   const res = await requestStoragePermission();
    //   if (res === true) {
    //     selectGallery();
    //   }
    // }
  };

  // function handles the slection of documents
  const handleDoc = async () => {
    selectDoc();

    // TODO in future for handling permissions
    // if (isIOS) {
    //   selectDoc();
    // } else {
    //   const res = await requestStoragePermission();
    //   if (res === true) {
    //     selectDoc();
    //   }
    // }
  };

  async function syncConversationAPI(
    page: number,
    maxTimeStamp: number,
    minTimeStamp: number,
    conversationId?: string
  ) {
    const res = myClient?.syncConversation(
      SyncConversationRequest.builder()
        .setChatroomId(chatroomID)
        .setPage(page)
        .setMinTimestamp(minTimeStamp)
        .setMaxTimestamp(maxTimeStamp)
        .setPageSize(500)
        .setConversationId(conversationId)
        .build()
    );
    return res;
  }

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
        replyObj.createdEpoch = Date.now();
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
      obj.createdEpoch = Date.now();
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
          chatroomId: chatroomID,
          chatRequestState: ChatroomChatRequestState.INITIATED,
          text: conversation?.trim(),
        });

        const val = await syncConversationAPI(
          page,
          Math.floor(Date.now() * 1000),
          0
        );
        const conversationData = val?.data?.conversationsData;
        let matchingObject = conversationData.find(
          (obj) => obj.answer === conversation
        );
        matchingObject.member = user;

        // saving the first message to localDB
        await myClient?.saveNewConversation(
          chatroomID?.toString(),
          matchingObject
        );

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
          chatroomId: chatroomID,
          chatRequestState: ChatroomChatRequestState.ACCEPTED,
          text: conversation?.trim(),
        });

        const val = await syncConversationAPI(
          page,
          Math.floor(Date.now() * 1000),
          0
        );
        const conversationData = val?.data?.conversationsData;
        let matchingObject = conversationData.find(
          (obj) => obj.answer === conversation
        );
        matchingObject.member = user;

        // saving the first message to localDB
        await myClient?.saveNewConversation(
          chatroomID?.toString(),
          matchingObject
        );

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

          const response: any = await dispatch(
            onConversationsCreate(payload) as any
          );

          if (response) {
            await myClient?.replaceSavedConversation(response?.conversation);
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

          const response: any = await dispatch(
            onConversationsCreate(payload) as any
          );

          await myClient?.replaceSavedConversation(response?.conversation);

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
        setFormattedConversation(event);
      }
    } else {
      setMessage(event);
      setFormattedConversation(event);

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
      if (
        len > 0 &&
        !(chatroomType === ChatroomType.DMCHATROOM && isUploadScreen)
      ) {
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

  // Audio and play section

  // to stop recorder after 15 min
  useEffect(() => {
    (async function stopRecorder() {
      if (isVoiceNoteRecording) {
        await handleStopRecord();
      }
    })();
  }, [stopRecording]);

  // to start audio recording
  const startRecord = async () => {
    if (!isVoiceNoteRecording) {
      const audioSet = generateAudioSet();

      const name = generateVoiceNoteName();
      const path =
        Platform.OS === "android"
          ? `${ReactNativeBlobUtil.fs.dirs.CacheDir}/${name}.mp3`
          : `${name}.m4a`;

      const result = await audioRecorderPlayerAttachment?.startRecorder(
        path,
        audioSet
      );
      setIsVoiceNoteRecording(true);
      setVoiceNotesLink(result);
      audioRecorderPlayerAttachment?.addRecordBackListener((e) => {
        const seconds = Math.floor(e.currentPosition / 1000);
        if (seconds >= 900) {
          setStopRecording(!stopRecording);
        }
        setVoiceNotes({
          recordSecs: e.currentPosition,
          recordTime: audioRecorderPlayerAttachment
            ?.mmssss(Math.floor(e.currentPosition))
            .slice(0, 5),
          name: name,
        });
        return;
      });
    }
  };

  // to stop audio recording
  const stopRecord = async () => {
    if (isVoiceNoteRecording) {
      await audioRecorderPlayerAttachment?.stopRecorder();
      audioRecorderPlayerAttachment?.removeRecordBackListener();

      // if isVoiceResult is true we show audio player instead of audio recorder
      const voiceNote = {
        uri: voiceNotesLink,
        type: VOICE_NOTE_TEXT,
        name: `${voiceNotes.name}.${isIOS ? "m4a" : "mp3"}`,
        duration: Math.floor(voiceNotes.recordSecs / 1000),
      };
      dispatch({
        type: SELECTED_VOICE_NOTE_FILES_TO_UPLOAD,
        body: {
          audio: [voiceNote],
        },
      });

      setIsVoiceNoteRecording(false);

      LMChatAnalytics.track(
        Events.VOICE_NOTE_RECORDED,
        new Map<string, string>([
          [Keys.CHATROOM_TYPE, chatroomType?.toString()],
          [Keys.CHATROOM_ID, chatroomID?.toString()],
        ])
      );
    }
  };

  const handleStopRecord = async () => {
    // to give some time for initiating the start recorder, then only stop it
    setTimeout(async () => {
      await stopRecord();
      setIsVoiceResult(true);
      setIsRecordingLocked(false);
    }, 500);
  };

  // to reset all the recording data we had previously
  const clearVoiceRecord = async () => {
    if (isVoiceNoteRecording) {
      await stopRecord();
    } else if (isVoiceNotePlaying) {
      await stopPlay();
    }
    setVoiceNotes({
      recordSecs: 0,
      recordTime: "",
      name: "",
    });
    setVoiceNotesPlayer({
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: "",
      duration: "",
    });
    setVoiceNotesLink("");
    setIsRecordingLocked(false);

    dispatch({
      type: CLEAR_SELECTED_VOICE_NOTE_FILES_TO_UPLOAD,
    });

    // if isVoiceResult is false we show audio recorder instead of audio player
    setIsVoiceResult(false);

    LMChatAnalytics.track(
      Events.VOICE_NOTE_CANCELED,
      new Map<string, string>([
        [Keys.CHATROOM_TYPE, chatroomType?.toString()],
        [Keys.CHATROOM_ID, chatroomID?.toString()],
      ])
    );
  };

  // to start playing audio recording
  const startPlay = async (path: string) => {
    await audioRecorderPlayerAttachment?.startPlayer(path);
    audioRecorderPlayerAttachment?.addPlayBackListener((e) => {
      const playTime = audioRecorderPlayerAttachment?.mmssss(
        Math.floor(e.currentPosition)
      );
      const duration = audioRecorderPlayerAttachment?.mmssss(
        Math.floor(e.duration)
      );
      setVoiceNotesPlayer({
        currentPositionSec: e.currentPosition,
        currentDurationSec: e.duration,
        playTime: audioRecorderPlayerAttachment
          ?.mmssss(Math.floor(e.currentPosition))
          .slice(0, 5),
        duration: audioRecorderPlayerAttachment
          ?.mmssss(Math.floor(e.duration))
          .slice(0, 5),
      });

      // to reset the player after audio player completed it duration
      if (playTime === duration) {
        setIsVoiceNotePlaying(false);
        setVoiceNotesPlayer({
          currentPositionSec: 0,
          currentDurationSec: 0,
          playTime: "",
          duration: "",
        });
      }
      return;
    });

    LMChatAnalytics.track(
      Events.VOICE_NOTE_PREVIEWED,
      new Map<string, string>([
        [Keys.CHATROOM_TYPE, chatroomType?.toString()],
        [Keys.CHATROOM_ID, chatroomID?.toString()],
      ])
    );
    setIsVoiceNotePlaying(true);
  };

  // to stop playing audio recording
  const stopPlay = async () => {
    await audioRecorderPlayerAttachment?.stopPlayer();
    setIsVoiceNotePlaying(false);
  };

  // to pause playing audio recording
  const onPausePlay = async () => {
    await audioRecorderPlayerAttachment?.pausePlayer();
    setIsVoiceNotePlaying(false);
  };

  // to resume playing audio recording
  const onResumePlay = async () => {
    await audioRecorderPlayerAttachment?.resumePlayer();
    setIsVoiceNotePlaying(true);
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

  const marginValue = isKeyBoardFocused
    ? Platform.OS === "android"
      ? 5
      : 5
    : isIOS
    ? 20
    : 5;

  return (
    <View>
      {/* shows message how we record voice note */}
      {isVoiceNoteIconPress && (
        <View
          style={[
            styles.tapAndHold,
            {
              bottom: isKeyBoardFocused ? (isIOS ? 65 : 110) : isIOS ? 80 : 70,
            },
          ]}
        >
          <LMChatTextView textStyle={styles.tapAndHoldStyle}>
            {TAP_AND_HOLD}
          </LMChatTextView>
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          !isUploadScreen
            ? {
                marginBottom: inputBoxStyles?.messageInputMarginBottom
                  ? inputBoxStyles?.messageInputMarginBottom
                  : marginValue,
              }
            : null,
        ]}
      >
        <View
          style={
            (isReply && !isUploadScreen) ||
            isUserTagging ||
            isEditable ||
            Object.keys(ogTagsState).length !== 0
              ? [
                  styles.replyBoxParent,
                  {
                    borderTopWidth:
                      isReply && !isUploadScreen && !isUserTagging ? 0 : 0,
                    borderTopLeftRadius:
                      isReply && !isUploadScreen && !isUserTagging ? 10 : 20,
                    borderTopRightRadius:
                      isReply && !isUploadScreen && !isUserTagging ? 10 : 20,
                    backgroundColor: isUploadScreen ? "black" : "white",
                  },
                ]
              : null
          }
        >
          {userTaggingList && isUserTagging ? (
            <View
              style={[
                styles.taggableUsersBox,
                {
                  backgroundColor: isUploadScreen ? "black" : "white",
                  height: userTaggingListHeight,
                },
              ]}
            >
              <FlashList
                data={[...groupTags, ...userTaggingList]}
                renderItem={({ item, index }: any) => {
                  const description = item?.description;
                  const imageUrl = item?.imageUrl;
                  return (
                    <Pressable
                      onPress={() => {
                        const uuid = item?.sdkClientInfo?.uuid;
                        const userName = item?.name;
                        const communityId = item?.sdkClientInfo?.community;
                        LMChatAnalytics.track(
                          Events.USER_TAGS_SOMEONE,
                          new Map<string, string>([
                            [Keys.COMMUNITY_ID, communityId?.toString()],
                            [Keys.CHATROOM_NAME, chatroomName?.toString()],
                            [Keys.TAGGED_USER_ID, uuid?.toString()],
                            [Keys.TAGGED_USER_NAME, userName?.toString()],
                          ])
                        );
                        const res = replaceLastMention(
                          message,
                          taggedUserName,
                          item?.name,
                          uuid ? `user_profile/${uuid}` : uuid
                        );
                        setMessage(res);
                        setFormattedConversation(res);
                        setUserTaggingList([]);
                        setGroupTags([]);
                        setIsUserTagging(false);
                      }}
                      style={styles.taggableUserView}
                    >
                      {imageUrl ? (
                        <LMChatIcon
                          iconUrl={imageUrl}
                          iconStyle={styles.avatar}
                        />
                      ) : (
                        <LMChatIcon
                          assetPath={require("../../assets/images/default_pic.png")}
                          iconStyle={styles.avatar}
                        />
                      )}
                      <View
                        style={[
                          styles.infoContainer,
                          {
                            borderBottomWidth: Layout.normalize(0.2),
                            gap: isIOS ? Layout.normalize(5) : 0,
                          },
                        ]}
                      >
                        <LMChatTextView
                          textStyle={{
                            ...styles.title,
                            color: isUploadScreen
                              ? STYLES.$COLORS.TERTIARY
                              : STYLES.$COLORS.PRIMARY,
                          }}
                          maxLines={1}
                        >
                          {item?.name}
                        </LMChatTextView>
                        {description ? (
                          <LMChatTextView
                            textStyle={{
                              ...styles.subTitle,
                              color: isUploadScreen
                                ? STYLES.$COLORS.TERTIARY
                                : STYLES.$COLORS.PRIMARY,
                            }}
                            maxLines={1}
                          >
                            {description}
                          </LMChatTextView>
                        ) : null}
                      </View>
                    </Pressable>
                  );
                }}
                extraData={{
                  value: [message, userTaggingList],
                }}
                estimatedItemSize={50}
                keyboardShouldPersistTaps={"handled"}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={1}
                bounces={false}
                ListFooterComponent={renderFooter}
                keyExtractor={(item: any, index) => {
                  return index?.toString();
                }}
              />
            </View>
          ) : null}

          {isReply && !isUploadScreen && (
            <View style={styles.replyBox}>
              <ReplyBox
                isIncluded={false}
                item={replyMessage}
                chatroomName={chatroomName}
              />
              <TouchableOpacity
                onPress={() => {
                  dispatch({ type: SET_IS_REPLY, body: { isReply: false } });
                  dispatch({
                    type: SET_REPLY_MESSAGE,
                    body: { replyMessage: "" },
                  });
                }}
                style={styles.replyBoxClose}
              >
                <LMChatIcon
                  assetPath={require("../../assets/images/close_icon.png")}
                  iconStyle={styles.replyCloseImg}
                />
              </TouchableOpacity>
            </View>
          )}

          {Object.keys(ogTagsState).length !== 0 &&
          showLinkPreview &&
          !closedOnce ? (
            <View
              style={[
                styles.taggableUsersBox,
                {
                  backgroundColor: isUploadScreen ? "black" : "white",
                },
              ]}
            >
              <LinkPreviewInputBox ogTags={ogTagsState} />
              <TouchableOpacity
                onPress={() => {
                  setShowLinkPreview(false);
                  setClosedOnce(true);
                  setClosedPreview(true);
                }}
                style={styles.replyBoxClose}
              >
                <LMChatIcon
                  assetPath={require("../../assets/images/close_icon.png")}
                  iconStyle={styles.replyCloseImg}
                />
              </TouchableOpacity>
            </View>
          ) : null}

          {isEditable ? (
            <View style={styles.replyBox}>
              <ReplyBox
                isIncluded={false}
                item={editConversation}
                chatroomName={chatroomName}
              />
              <TouchableOpacity
                onPress={() => {
                  setIsEditable(false);
                  setMessage("");
                  dispatch({
                    type: SET_EDIT_MESSAGE,
                    body: {
                      editConversation: "",
                    },
                  });
                  dispatch({
                    type: SELECTED_MESSAGES,
                    body: [],
                  });
                }}
                style={styles.replyBoxClose}
              >
                <LMChatIcon
                  assetPath={require("../../assets/images/close_icon.png")}
                  iconStyle={styles.replyCloseImg}
                />
              </TouchableOpacity>
            </View>
          ) : null}

          <View
            style={[
              styles.textInput,
              !(isEditable || isReply) ? styles.inputBoxWithShadow : null,
              {
                backgroundColor: isUploadScreen
                  ? STYLES.$BACKGROUND_COLORS.DARK
                  : STYLES.$BACKGROUND_COLORS.LIGHT,
              },
              (isReply && !isUploadScreen) || isEditable || isUserTagging
                ? {
                    borderWidth: 0,
                    margin: isIOS ? 0 : Layout.normalize(2),
                  }
                : null,
            ]}
          >
            {!!isUploadScreen && !isDoc && !isGif ? (
              <TouchableOpacity
                style={styles.addMoreButton}
                onPress={() => {
                  selectGallery();
                }}
              >
                <LMChatIcon
                  assetPath={require("../../assets/images/addImages3x.png")}
                  iconStyle={styles.emoji}
                />
              </TouchableOpacity>
            ) : !!isUploadScreen && !!isDoc && !isGif ? (
              <TouchableOpacity
                style={styles.addMoreButton}
                onPress={() => {
                  selectDoc();
                }}
              >
                <LMChatIcon
                  assetPath={require("../../assets/images/add_more_docs3x.png")}
                  iconStyle={styles.emoji}
                />
              </TouchableOpacity>
            ) : isUploadScreen ? (
              <View style={styles.paddingHorizontal} />
            ) : null}

            {isDeleteAnimation && LottieView ? (
              <View
                style={[
                  styles.voiceNotesInputParent,
                  styles.voiceRecorderInput,
                  {
                    paddingVertical: 0,
                    marginVertical: 0,
                    marginHorizontal: Layout.normalize(10),
                  },
                ]}
              >
                <View style={styles.alignItems}>
                  <LottieView
                    source={require("../../assets/lottieJSON/delete.json")}
                    style={{ height: 40, width: 40 }}
                    autoPlay
                    // loop
                  />
                </View>
              </View>
            ) : !!voiceNotes?.recordTime && !isVoiceResult ? (
              <View
                style={[
                  styles.voiceNotesInputParent,
                  styles.voiceRecorderInput,
                ]}
              >
                <View style={styles.alignItems}>
                  <Animated.View style={[{ opacity: micIconOpacity }]}>
                    <LMChatIcon
                      assetPath={require("../../assets/images/record_icon3x.png")}
                      iconStyle={styles.emoji}
                    />
                  </Animated.View>
                  <LMChatTextView textStyle={styles.recordTitle}>
                    {voiceNotes.recordTime}
                  </LMChatTextView>
                </View>
                {isRecordingLocked ? (
                  <View style={styles.alignItems}>
                    <TouchableOpacity onPress={handleStopRecord}>
                      <LMChatIcon
                        assetPath={require("../../assets/images/stop_recording_icon3x.png")}
                        iconStyle={styles.emoji}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={clearVoiceRecord}>
                      <LMChatIcon
                        assetPath={require("../../assets/images/cross_circle_icon3x.png")}
                        iconStyle={styles.emoji}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.alignItems}>
                    <LMChatIcon
                      assetPath={require("../../assets/images/left_chevron_icon3x.png")}
                      iconStyle={styles.chevron}
                    />
                    <LMChatTextView textStyle={styles.recordTitle}>
                      {SLIDE_TO_CANCEL}
                    </LMChatTextView>
                  </View>
                )}
              </View>
            ) : isVoiceResult ? (
              <View
                style={[
                  styles.voiceNotesInputParent,
                  styles.voiceRecorderInput,
                ]}
              >
                <View style={styles.alignItems}>
                  {isVoiceNotePlaying ? (
                    <TouchableOpacity
                      onPress={() => {
                        onPausePlay();
                      }}
                    >
                      <LMChatIcon
                        assetPath={require("../../assets/images/pause_icon3x.png")}
                        iconStyle={styles.emoji}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        if (voiceNotesPlayer?.playTime !== "") {
                          onResumePlay();
                        } else {
                          startPlay(voiceNotesLink);
                        }
                      }}
                    >
                      <LMChatIcon
                        assetPath={require("../../assets/images/play_icon3x.png")}
                        iconStyle={styles.emoji}
                      />
                    </TouchableOpacity>
                  )}
                  {isVoiceNotePlaying || voiceNotesPlayer?.playTime ? (
                    <LMChatTextView textStyle={styles.recordTitle}>
                      {voiceNotesPlayer?.playTime}
                    </LMChatTextView>
                  ) : (
                    <LMChatTextView textStyle={styles.recordTitle}>
                      {voiceNotes?.recordTime}
                    </LMChatTextView>
                  )}
                </View>
                <TouchableOpacity
                  onPress={clearVoiceRecord}
                  style={styles.alignItems}
                >
                  <LMChatIcon
                    assetPath={require("../../assets/images/cross_circle_icon3x.png")}
                    iconStyle={styles.emoji}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={[
                  styles.inputParent,
                  isUploadScreen
                    ? {
                        marginHorizontal: Layout.normalize(5),
                      }
                    : { marginHorizontal: Layout.normalize(15) },
                ]}
              >
                {!isUploadScreen &&
                !(
                  chatRequestState === ChatroomChatRequestState.INITIATED ||
                  chatRequestState === null
                ) &&
                !isEditable &&
                !voiceNotes?.recordTime &&
                !isDeleteAnimation ? (
                  GIFPicker ? (
                    <TouchableOpacity
                      style={styles.gifView}
                      onPress={() => GiphyDialog.show()}
                    >
                      <LMChatTextView textStyle={styles.gifText}>
                        {CAPITAL_GIF_TEXT}
                      </LMChatTextView>
                    </TouchableOpacity>
                  ) : null
                ) : null}
                <LMChatTextInput
                  placeholderText={
                    inputBoxStyles?.placeholderText
                      ? inputBoxStyles?.placeholderText
                      : "Type a message"
                  }
                  placeholderTextColor={inputBoxStyles?.placeholderTextColor}
                  plainTextStyle={[
                    inputBoxStyles?.plainTextStyle,
                    {
                      color: isUploadScreen
                        ? STYLES.$BACKGROUND_COLORS.LIGHT
                        : STYLES.$BACKGROUND_COLORS.DARK,
                    },
                  ]}
                  style={
                    [
                      styles.input,
                      inputBoxStyles?.inputTextStyle,
                      {
                        height: Math.max(25, inputHeight),
                        color: isUploadScreen
                          ? STYLES.$BACKGROUND_COLORS.LIGHT
                          : STYLES.$BACKGROUND_COLORS.DARK,
                      },
                    ] as TextStyle
                  }
                  onContentSizeChange={(event) => {
                    setInputHeight(event.nativeEvent.contentSize.height);
                  }}
                  multilineField
                  inputRef={myRef}
                  onType={handleInputChange}
                  autoFocus={false}
                  selectionColor={inputBoxStyles?.selectionColor}
                  partTypes={[
                    {
                      trigger: "@",
                      textStyle: inputBoxStyles?.partsTextStyle, // The mention style in the input
                    },
                  ]}
                  inputText={message}
                  maxLength={
                    chatRequestState === 0 || chatRequestState === null
                      ? MAX_LENGTH
                      : undefined
                  }
                />
              </View>
            )}

            {!isUploadScreen &&
            !(chatRequestState === 0 || chatRequestState === null) &&
            !isEditable &&
            !voiceNotes?.recordTime &&
            !isDeleteAnimation ? (
              <TouchableOpacity
                style={[
                  styles.emojiButton,
                  { marginLeft: Layout.normalize(15) },
                ]}
                onPress={() => {
                  Keyboard.dismiss();
                  setModalVisible(true);
                }}
              >
                <LMChatIcon
                  assetPath={require("../../assets/images/open_files3x.png")}
                  iconStyle={
                    [
                      styles.emoji,
                      inputBoxStyles?.attachmentIconStyles,
                    ] as ImageStyle
                  }
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Send message and send voice notes UI */}

        {/* {
          is message ||
          is voice recorded ||
          is File upload screen ||
          is recording locked ||
          is first DM message
        } */}
        {!!message ||
        isVoiceResult ||
        isUploadScreen ||
        isRecordingLocked ||
        (chatroomType === 10 && chatRequestState === null) ? (
          <TouchableOpacity
            onPressOut={async () => {
              if (
                chatroomType === ChatroomType.DMCHATROOM && // if DM
                chatRequestState === null &&
                isPrivateMember && // isPrivateMember = false when none of the member on both sides is CM.
                !!message
              ) {
                sendDmRequest();
              } else {
                if (isEditable) {
                  onEdit();
                } else {
                  const voiceNote = [
                    {
                      uri: voiceNotesLink,
                      type: VOICE_NOTE_TEXT,
                      name: `${voiceNotes.name}.${isIOS ? "m4a" : "mp3"}`,
                      duration: Math.floor(voiceNotes.recordSecs / 1000),
                    },
                  ];
                  if (isVoiceNoteRecording) {
                    await stopRecord();
                    onSend(message, voiceNote, true);
                  } else if (isVoiceNotePlaying) {
                    await stopPlay();
                    onSend(message, voiceNote, true);
                  } else {
                    onSend(message);
                  }
                }
              }
            }}
            style={styles.sendButton}
          >
            <LMChatIcon
              assetPath={require("../../assets/images/send_button3x.png")}
              iconStyle={
                [styles.send, inputBoxStyles?.sendIconStyles] as ImageStyle
              }
            />
          </TouchableOpacity>
        ) : (
          <View>
            {isRecordingPermission && AudioRecorder && AudioPlayer ? (
              <GestureDetector gesture={composedGesture}>
                <Animated.View>
                  {voiceNotes.recordTime && !isRecordingLocked && (
                    <View
                      style={[styles.lockRecording, styles.inputBoxWithShadow]}
                    >
                      <Animated.View style={lockAnimatedStyles}>
                        <LMChatIcon
                          assetPath={require("../../assets/images/lock_icon3x.png")}
                          iconStyle={styles.lockIconStyle}
                        />
                      </Animated.View>
                      <Animated.View style={upChevronAnimatedStyles}>
                        <LMChatIcon
                          assetPath={require("../../assets/images/up_chevron_icon3x.png")}
                          iconStyle={styles.chevronUpStyle}
                        />
                      </Animated.View>
                    </View>
                  )}

                  <Animated.View style={[styles.sendButton, panStyle]}>
                    <Pressable
                      onPress={() => {
                        setIsVoiceNoteIconPress(true);
                        Vibration.vibrate(0.5 * 100);
                      }}
                      style={[styles.sendButton, { position: "absolute" }]}
                    >
                      <LMChatIcon
                        assetPath={require("../../assets/images/mic_icon3x.png")}
                        iconStyle={
                          [
                            styles.mic,
                            inputBoxStyles?.micIconStyles,
                          ] as ImageStyle
                        }
                      />
                    </Pressable>
                  </Animated.View>
                </Animated.View>
              </GestureDetector>
            ) : AudioRecorder ? (
              <Animated.View style={[styles.sendButton, panStyle]}>
                <Pressable
                  onPress={askPermission}
                  onLongPress={askPermission}
                  style={[styles.sendButton, { position: "absolute" }]}
                >
                  <LMChatIcon
                    assetPath={require("../../assets/images/mic_icon3x.png")}
                    iconStyle={
                      [styles.mic, inputBoxStyles?.micIconStyles] as ImageStyle
                    }
                  />
                </Pressable>
              </Animated.View>
            ) : (
              <TouchableOpacity style={styles.sendButton}>
                <LMChatIcon
                  assetPath={require("../../assets/images/send_button3x.png")}
                  iconStyle={
                    [styles.send, inputBoxStyles?.sendIconStyles] as ImageStyle
                  }
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* More features modal like select Images, Docs etc. */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <Pressable style={styles.centeredView} onPress={handleModalClose}>
          <View style={styles.modalViewParent}>
            <Pressable onPress={() => {}} style={[styles.modalView]}>
              <View style={styles.alignModalElements}>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      setTimeout(() => {
                        handleCamera();
                      }, 50);
                    }}
                    style={styles.cameraStyle}
                  >
                    <LMChatIcon
                      assetPath={require("../../assets/images/camera_icon3x.png")}
                      iconStyle={
                        [
                          styles.emoji,
                          inputBoxStyles?.cameraIconStyles,
                        ] as ImageStyle
                      }
                    />
                  </TouchableOpacity>
                  <LMChatTextView textStyle={styles.iconText}>
                    {CAMERA_TEXT}
                  </LMChatTextView>
                </View>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      setTimeout(() => {
                        handleGallery();
                      }, 500);
                    }}
                    style={styles.imageStyle}
                  >
                    <LMChatIcon
                      assetPath={require("../../assets/images/select_image_icon3x.png")}
                      iconStyle={
                        [
                          styles.emoji,
                          inputBoxStyles?.galleryIconStyles,
                        ] as ImageStyle
                      }
                    />
                  </TouchableOpacity>
                  <LMChatTextView textStyle={styles.iconText}>
                    {PHOTOS_AND_VIDEOS_TEXT}
                  </LMChatTextView>
                </View>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      setTimeout(() => {
                        handleDoc();
                      }, 50);
                    }}
                    style={styles.docStyle}
                  >
                    <LMChatIcon
                      assetPath={require("../../assets/images/select_doc_icon3x.png")}
                      iconStyle={
                        [
                          styles.emoji,
                          inputBoxStyles?.documentIconStyles,
                        ] as ImageStyle
                      }
                    />
                  </TouchableOpacity>
                  <LMChatTextView textStyle={styles.iconText}>
                    {DOCUMENTS_TEXT}
                  </LMChatTextView>
                </View>
                {chatroomType !== 10 ? (
                  <View style={styles.iconContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(false);
                        navigation.navigate(CREATE_POLL_SCREEN, {
                          chatroomID: chatroomID,
                          conversationsLength: conversations.length * 2,
                        });
                      }}
                      style={styles.pollStyle}
                    >
                      <LMChatIcon
                        assetPath={require("../../assets/images/poll_icon3x.png")}
                        iconStyle={
                          [
                            styles.emoji,
                            inputBoxStyles?.pollIconStyles,
                          ] as ImageStyle
                        }
                      />
                    </TouchableOpacity>
                    <LMChatTextView textStyle={styles.iconText}>
                      {POLL_TEXT}
                    </LMChatTextView>
                  </View>
                ) : null}
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* SEND DM request Modal */}
      <SendDMRequestModal
        hideDMSentAlert={hideDMSentAlert}
        DMSentAlertModalVisible={DMSentAlertModalVisible}
        onSend={onSend}
        message={message}
      />
    </View>
  );
};

export default MessageInputBox;
