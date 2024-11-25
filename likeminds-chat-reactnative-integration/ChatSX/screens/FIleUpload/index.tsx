import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
  BackHandler,
  LogBox,
} from "react-native";
import { Image as CompressedImage } from "react-native-compressor";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import styles from "./styles";
import InputBox from "../../components/InputBox";
import Layout from "../../constants/Layout";
import {
  CLEAR_FILE_UPLOADING_MESSAGES,
  CLEAR_SELECTED_FILES_TO_UPLOAD,
  CLEAR_SELECTED_FILE_TO_VIEW,
  SELECTED_FILE_TO_VIEW,
  SET_FILE_UPLOADING_MESSAGES,
  STATUS_BAR_STYLE,
} from "../../store/types/types";
import { useAppDispatch, useAppSelector } from "../../store";
import STYLES from "../../constants/Styles";
import {
  AUDIO_TEXT,
  FAILED,
  GIF_TEXT,
  IMAGE_TEXT,
  PDF_TEXT,
  SUCCESS,
  VIDEO_TEXT,
  VOICE_NOTE_TEXT,
} from "../../constants/Strings";
import { CognitoIdentityCredentials, S3 } from "aws-sdk";
import AWS from "aws-sdk";
import { BUCKET, POOL_ID, REGION } from "../../awsExports";
import { fetchResourceFromURI, generateGifName } from "../../commonFuctions";
import { IMAGE_CROP_SCREEN } from "../../constants/Screens";
import { Events, Keys } from "../../enums";
import { LMChatAnalytics } from "../../analytics/LMChatAnalytics";
import { Client } from "../../client";
import { CustomisableMethodsContextProvider } from "../../context/CustomisableMethodsContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useChatroomContext } from "../../context/ChatroomContext";
import VideoPlayer from "react-native-media-console";
import { Attachment } from "@likeminds.community/chat-rn/dist/shared/responseModels/Attachment";
interface UploadResource {
  selectedImages: any;
  conversationID: any;
  chatroomID: any;
  selectedFilesToUpload: any;
  uploadingFilesMessages: any;
  isRetry: boolean;
}

interface FileUploadProps {
  handleGallery?: () => void;
  handleCamera?: () => void;
  handleDoc?: () => void;
  onEdit?: () => void;
}

const FileUpload = ({
  handleGallery,
  handleCamera,
  handleDoc,
  onEdit,
}: FileUploadProps) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();
  const { backIconPath, imageCropIcon }: any = route.params;

  const { chatroomType, user } = useChatroomContext();

  const selectedImageBorderColor =
    STYLES.$FILE_UPLOAD_STYLE?.selectedImageBorderColor;

  const myClient = Client.myClient;
  const video = useRef<any>(null);

  const { chatroomID, previousMessage = "" }: any = route?.params;
  const {
    selectedFilesToUpload = [],
    selectedFileToView = {},
    selectedFilesToUploadThumbnails = [],
  }: any = useAppSelector((state) => state.chatroom);
  const { uploadingFilesMessages }: any = useAppSelector(
    (state) => state.upload
  );

  const itemType = !!selectedFileToView?.data?.type
    ? selectedFileToView?.data?.type
    : selectedFileToView?.type?.split("/")[0];

  const docItemType = selectedFileToView?.type?.split("/")[1];

  const isGif = itemType === GIF_TEXT ? true : false;
  const len = selectedFilesToUpload.length;
  const dispatch = useAppDispatch();
  const { chatroomDBDetails }: any = useAppSelector((state) => state.chatroom);

  // Selected header of chatroom screen
  const setInitialHeader = () => {
    navigation.setOptions({
      headerShown: false,
    });
  };

  // this useLayoutEffect sets Headers before other printing UI Layout
  useLayoutEffect(() => {
    setInitialHeader();
  }, [navigation]);

  useEffect(() => {
    function backActionCall() {
      dispatch({
        type: CLEAR_SELECTED_FILES_TO_UPLOAD,
      });
      dispatch({
        type: CLEAR_SELECTED_FILE_TO_VIEW,
      });
      dispatch({
        type: STATUS_BAR_STYLE,
        body: { color: STYLES.$STATUS_BAR_STYLE.default },
      });
      navigation.goBack();
      return true;
    }

    const backHandlerAndroid = BackHandler.addEventListener(
      "hardwareBackPress",
      backActionCall
    );

    return () => backHandlerAndroid.remove();
  }, []);

  AWS.config.update({
    region: REGION, // Replace with your AWS region, e.g., 'us-east-1'
    credentials: new CognitoIdentityCredentials({
      IdentityPoolId: POOL_ID, // Replace with your Identity Pool ID
    }),
  });

  const uploadResource = async ({
    selectedImages,
    conversationID,
    chatroomID,
    selectedFilesToUpload,
    uploadingFilesMessages,
    isRetry,
  }: UploadResource) => {
    LogBox.ignoreLogs(["new NativeEventEmitter"]);
    const s3 = new S3();
    let attachments: Attachment[] = [];
    for (let i = 0; i < selectedImages?.length; i++) {
      const item = selectedImages[i];
      const attachmentType = isRetry ? item?.type : item?.type?.split("/")[0];
      const gifAttachmentType = item?.data?.type;
      const docAttachmentType = isRetry
        ? item?.type
        : item?.type?.split("/")[1];
      const thumbnailURL = item?.thumbnailUrl;
      const gifHeight = item?.data?.images?.fixed_width?.height;
      const gifWidth = item?.data?.images?.fixed_width?.width;
      const name =
        attachmentType === IMAGE_TEXT
          ? item.fileName
          : attachmentType === VIDEO_TEXT
          ? item.fileName
          : gifAttachmentType === GIF_TEXT
          ? generateGifName()
          : docAttachmentType === PDF_TEXT
          ? item.name
          : null;

          const data = `
          files/collabcard/${chatroomID}/conversation/${user?.uuid}/${name}-${conversationID}
          `
          console.log(data)
      console.log(thumbnailURL)
      const path = `files/collabcard/${chatroomID}/conversation/${user?.uuid}/${name}-${conversationID}`;
      const thumbnailUrlPath = `files/collabcard/${chatroomID}/conversation/${user?.uuid}/${thumbnailURL}`
      // const path = `files/collabcard/${chatroomID}/conversation/${conversationID}/${name}`;
      // const thumbnailUrlPath = `files/collabcard/${chatroomID}/conversation/${conversationID}/${thumbnailURL}`;
      let uriFinal: any;

      if (attachmentType === IMAGE_TEXT) {
        const compressedImgURI = await CompressedImage.compress(item.uri, {
          compressionMethod: "auto",
        });
        const compressedImg = await fetchResourceFromURI(compressedImgURI);
        uriFinal = compressedImg;
      } else {
        const img = await fetchResourceFromURI(item.uri ? item.uri : item.url);
        uriFinal = img;
      }

      //for video thumbnail
      let thumbnailUrlImg: any;
      if (
        thumbnailURL &&
        (attachmentType === VIDEO_TEXT || gifAttachmentType === GIF_TEXT)
      ) {
        thumbnailUrlImg = await fetchResourceFromURI(thumbnailURL);
      }

      const params = {
        Bucket: BUCKET,
        Key: path,
        Body: uriFinal,
        ACL: "public-read-write",
        ContentType: item?.type, // Replace with the appropriate content type for your file
      };

      //for video thumbnail
      const thumnnailUrlParams: any = {
        Bucket: BUCKET,
        Key: thumbnailUrlPath,
        Body: thumbnailUrlImg,
        ACL: "public-read-write",
        ContentType: "image/jpeg", // Replace with the appropriate content type for your file
      };

      try {
        let getVideoThumbnailData: any = null;
        if (
          thumbnailURL &&
          (attachmentType === VIDEO_TEXT || gifAttachmentType === GIF_TEXT)
        ) {
          getVideoThumbnailData = await s3.upload(thumnnailUrlParams).promise();
        }

        const data = await s3.upload(params).promise();

        const awsResponse = data.Location;

        if (awsResponse) {
          let fileType = "";
          if (docAttachmentType === PDF_TEXT) {
            fileType = PDF_TEXT;
          } else if (attachmentType === AUDIO_TEXT) {
            fileType = AUDIO_TEXT;
          } else if (attachmentType === VIDEO_TEXT) {
            fileType = VIDEO_TEXT;
          } else if (attachmentType === IMAGE_TEXT) {
            fileType = IMAGE_TEXT;
          } else if (gifAttachmentType === GIF_TEXT) {
            fileType = GIF_TEXT;
          }

          const payload: Attachment = {
            id: conversationID,
            // filesCount: selectedImages?.length,
            index: i + 1,
            meta:
              fileType === VIDEO_TEXT
                ? {
                    size: selectedFilesToUpload[i]?.fileSize,
                    duration: selectedFilesToUpload[i]?.duration,
                  }
                : {
                    size:
                      docAttachmentType === PDF_TEXT
                        ? selectedFilesToUpload[i]?.size
                        : selectedFilesToUpload[i]?.fileSize,
                  },
            name:
              docAttachmentType === PDF_TEXT
                ? selectedFilesToUpload[i]?.name
                : gifAttachmentType === GIF_TEXT
                ? name
                : selectedFilesToUpload[i]?.fileName,
            type: fileType,
            url: awsResponse,
            thumbnailUrl:
              fileType === VIDEO_TEXT || fileType === GIF_TEXT
                ? getVideoThumbnailData?.Location
                : null,
            height: gifHeight ? gifHeight : null,
            width: gifWidth ? gifWidth : null,
            localFilePath: uriFinal,
            awsFolderPath: path,
            thumbnailAWSFolderPath: thumbnailUrlPath,
            thumbnailLocalFilePath: thumbnailUrlImg,
            fileUrl: awsResponse,
            createdAt: conversationID,
            updatedAt: conversationID,
          };

          // const uploadRes = await myClient?.putMultimedia(payload as any);

          LMChatAnalytics.track(
            Events.ATTACHMENT_UPLOADED,
            new Map<string, string>([
              [Keys.CHATROOM_ID, chatroomID?.toString()],
              [Keys.CHATROOM_TYPE, chatroomDBDetails?.type?.toString()],
              [Keys.MESSAGE_ID, conversationID?.toString()],
              [Keys.TYPE, attachmentType],
            ])
          );
          attachments.push(payload);
        }
      } catch (error) {
        dispatch({
          type: SET_FILE_UPLOADING_MESSAGES,
          body: {
            message: {
              ...uploadingFilesMessages[conversationID?.toString()],
              isInProgress: FAILED,
            },
            ID: conversationID,
          },
        });
        const id = conversationID;
        const message = {
          ...uploadingFilesMessages[conversationID?.toString()],
          isInProgress: FAILED,
        };

        await myClient?.saveAttachmentUploadConversation(
          id?.toString(),
          JSON.stringify(message)
        );
        return error;
      }
      dispatch({
        type: CLEAR_SELECTED_FILES_TO_UPLOAD,
      });
      dispatch({
        type: CLEAR_SELECTED_FILE_TO_VIEW,
      });
    }
    dispatch({
      type: CLEAR_FILE_UPLOADING_MESSAGES,
      body: {
        ID: conversationID,
      },
    });
    await myClient?.removeAttactmentUploadConversationByKey(
      conversationID?.toString()
    );
    return attachments;
  };

  const handleFileUpload = async (conversationID: any, isRetry: any) => {
    console.log("fileupload one")
    const res = await uploadResource({
      selectedImages: selectedFilesToUpload,
      conversationID: conversationID,
      chatroomID: chatroomID,
      selectedFilesToUpload,
      uploadingFilesMessages,
      isRetry: isRetry,
    });

    return res;
  };

  return (
    <View style={styles.page}>
      {len > 0 ? (
        <View style={styles.headingContainer}>
          <View style={styles.headingItems}>
            <TouchableOpacity
              style={styles.touchableBackButton}
              onPress={() => {
                dispatch({
                  type: CLEAR_SELECTED_FILES_TO_UPLOAD,
                });
                dispatch({
                  type: CLEAR_SELECTED_FILE_TO_VIEW,
                });
                dispatch({
                  type: STATUS_BAR_STYLE,
                  body: { color: STYLES.$STATUS_BAR_STYLE.default },
                });
                navigation.goBack();
              }}
            >
              {backIconPath ? (
                <Image source={backIconPath} style={styles.backBtn} />
              ) : (
                <Image
                  source={require("../../assets/images/blue_back_arrow3x.png")}
                  style={styles.backBtn}
                />
              )}
            </TouchableOpacity>
            {itemType === IMAGE_TEXT ? (
              <TouchableOpacity
                style={styles.touchableBackButton}
                onPress={() => {
                  navigation.navigate(IMAGE_CROP_SCREEN, {
                    uri: selectedFileToView?.uri,
                    fileName: selectedFileToView?.fileName,
                  });
                }}
              >
                {imageCropIcon ? (
                  <Image source={imageCropIcon} style={styles.cropIcon} />
                ) : (
                  <Image
                    source={require("../../assets/images/crop_icon3x.png")}
                    style={styles.cropIcon}
                  />
                )}
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      ) : null}
      <View style={styles.selectedFileToView}>
        {itemType === IMAGE_TEXT ? (
          <Image
            source={{ uri: selectedFileToView?.uri }}
            style={styles.mainImage}
          />
        ) : itemType === VIDEO_TEXT ? (
          <View style={styles.video}>
            <VideoPlayer
              // @ts-ignore
              source={{ uri: selectedFileToView?.uri }}
              videoStyle={styles.videoPlayer}
              videoRef={video}
              disableBack={true}
              disableVolume={true}
              disableFullscreen={true}
              paused={true}
              showOnStart={true}
            />
          </View>
        ) : docItemType === PDF_TEXT ? (
          <Image
            source={{ uri: selectedFileToView?.thumbnailUrl }}
            style={styles.mainImage}
          />
        ) : isGif ? (
          <View>
            <Image
              source={{ uri: selectedFileToView?.url }}
              style={styles.mainImage}
            />
          </View>
        ) : null}
      </View>

      <View style={styles.bottomBar}>
        {len > 0 ? (
          <CustomisableMethodsContextProvider
            handleGalleryProp={handleGallery}
            handleCameraProp={handleCamera}
            handleDocProp={handleDoc}
            onEditProp={onEdit}
          >
            <InputBox
              isUploadScreen={true}
              isDoc={docItemType === PDF_TEXT ? true : false}
              chatroomID={chatroomID}
              navigation={navigation}
              previousMessage={previousMessage}
              handleFileUpload={handleFileUpload}
              isGif={isGif}
              chatroomType={chatroomType}
            />
          </CustomisableMethodsContextProvider>
        ) : null}

        {!isGif && (
          <ScrollView
            contentContainerStyle={styles.bottomListOfImages}
            horizontal={true}
            bounces={false}
          >
            {len > 0 &&
              selectedFilesToUpload.map((item: any, index: any) => {
                let fileType = item?.type?.split("/")[0];
                return (
                  <Pressable
                    key={item?.uri + index}
                    onPress={() => {
                      dispatch({
                        type: SELECTED_FILE_TO_VIEW,
                        body: { image: item },
                      });
                    }}
                    style={({ pressed }) => [
                      { opacity: pressed ? 0.5 : 1.0 },
                      styles.imageItem,
                      {
                        borderColor:
                          docItemType === PDF_TEXT
                            ? selectedFileToView?.name === item?.name
                              ? selectedImageBorderColor
                                ? selectedImageBorderColor
                                : "red"
                              : "black"
                            : selectedFileToView?.fileName === item?.fileName
                            ? selectedImageBorderColor
                              ? selectedImageBorderColor
                              : "red"
                            : "black",
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <Image
                      source={
                        itemType === VIDEO_TEXT
                          ? {
                              uri:
                                "file://" +
                                selectedFilesToUploadThumbnails[index]?.uri,
                            }
                          : { uri: selectedFilesToUploadThumbnails[index]?.uri }
                      }
                      style={styles.smallImage}
                    />
                    {fileType === VIDEO_TEXT ? (
                      <View
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: Layout.normalize(5),
                        }}
                      >
                        <Image
                          source={require("../../assets/images/video_icon3x.png")}
                          style={styles.videoIcon}
                        />
                      </View>
                    ) : null}
                  </Pressable>
                );
              })}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default FileUpload;
