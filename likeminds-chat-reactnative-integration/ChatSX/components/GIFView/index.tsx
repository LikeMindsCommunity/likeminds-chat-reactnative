import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import Layout from "../../constants/Layout";
import { CAPITAL_GIF_TEXT, FAILED, SUCCESS } from "../../constants/Strings";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { styles } from "../AttachmentConversations/styles";
import STYLES from "../../constants/Styles";
import { useMessageContext } from "../../context/MessageContext";
import { useChatroomContext } from "../../context/ChatroomContext";
import { useAppDispatch, useAppSelector } from "../../store";
import { CAROUSEL_SCREEN } from "../../constants/Screens";
import {
  LONG_PRESSED,
  SELECTED_MESSAGES,
  SET_POSITION,
  STATUS_BAR_STYLE,
} from "../../store/types/types";

const GIFView = () => {
  const [isGifPlaying, setIsGifPlaying] = useState(false);
  const [isGifLoading, setIsGifLoading] = useState(false);
  const { isIncluded, item, handleLongPress, showRetry, setShowRetry, setRetryUploadInProgress, retryUploadInProgress
   } = useMessageContext();
  const { navigation, handleFileUpload, onRetryButtonClicked } = useChatroomContext();
  const dispatch = useAppDispatch();
  const { selectedMessages, stateArr, isLongPress }: any = useAppSelector(
    (state) => state.chatroom
  );

  const chatBubbleStyles = STYLES.$CHAT_BUBBLE_STYLE;
  const firstAttachment = item?.attachments[0];

  //styling props
  const selectedMessageBackgroundColor =
    chatBubbleStyles?.selectedMessageBackgroundColor;

  const SELECTED_BACKGROUND_COLOR = selectedMessageBackgroundColor
    ? selectedMessageBackgroundColor
    : STYLES.$COLORS.SELECTED_BLUE;

  // to play and stop gif after 2s
  const playGif = () => {
    setIsGifPlaying(true);
    setTimeout(() => {
      setIsGifPlaying(false);
    }, 2000);
  };

  // handle gif on press
  const handleOnPress = (event: any, url?: string, index?: number) => {
    const { pageX, pageY } = event.nativeEvent;
    dispatch({
      type: SET_POSITION,
      body: { pageX: pageX, pageY: pageY },
    });
    let isStateIncluded = stateArr.includes(item?.state);
    if (isLongPress) {
      if (isIncluded) {
        const filterdMessages = selectedMessages.filter(
          (val: any) => val?.id !== item?.id && !stateArr.includes(val?.state)
        );
        if (filterdMessages.length > 0) {
          dispatch({
            type: SELECTED_MESSAGES,
            body: [...filterdMessages],
          });
        } else {
          dispatch({
            type: SELECTED_MESSAGES,
            body: [...filterdMessages],
          });
          dispatch({ type: LONG_PRESSED, body: false });
        }
      } else {
        if (!isStateIncluded) {
          dispatch({
            type: SELECTED_MESSAGES,
            body: [...selectedMessages, item],
          });
        }
      }
    } else {
      playGif();
    }
  };
  return (
    <View
      style={
        isIncluded
          ? {
              backgroundColor: SELECTED_BACKGROUND_COLOR,
              opacity: 0.7,
            }
          : null
      }
    >
      {!isGifPlaying && !item?.isInProgress ? (
        <TouchableOpacity
          onPress={handleOnPress}
          onLongPress={handleLongPress}
          style={[
            {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: Layout.normalize(150),
              position: "absolute",
              width: "100%",
              zIndex: 1,
            },
          ]}
        >
          <View
            style={{
              backgroundColor: "black",
              opacity: 0.9,
              padding: Layout.normalize(10),
              borderRadius: Layout.normalize(50),
            }}
          >
            <Text style={{ color: "white" }}>{CAPITAL_GIF_TEXT}</Text>
          </View>
        </TouchableOpacity>
      ) : null}

      {isGifPlaying ? (
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate(CAROUSEL_SCREEN, {
              dataObject: item,
              index: 0,
            });
            dispatch({
              type: STATUS_BAR_STYLE,
              body: { color: STYLES.$STATUS_BAR_STYLE["light-content"] },
            });
          }}
        >
          <Image
          source={{
            uri: firstAttachment?.url,
          }}
          onLoadStart={() => setIsGifLoading(true)}
          onLoadEnd={() => setIsGifLoading(false)}
          style={styles.singleImg}
          /> 
          {isGifLoading && <ActivityIndicator style={{
            position: 'absolute', zIndex: 10, alignSelf: 'center', top: '40%'
          }} size="large" color={STYLES.$COLORS.SECONDARY} />}
        </TouchableWithoutFeedback>
      ) : (
        <Image
          source={{
            uri: firstAttachment?.thumbnailUrl,
          }}
          style={styles.singleImg}
        />
      )}

      {((item?.isInProgress) === SUCCESS && !showRetry) || retryUploadInProgress ? (
        <View style={styles.uploadingIndicator}>
          <ActivityIndicator size="large" color={STYLES.$COLORS.SECONDARY} />
        </View>
      ) : showRetry ? (
        <View style={styles.uploadingIndicator}>
          <Pressable
            onPress={() => {
              onRetryButtonClicked(item, setShowRetry, setRetryUploadInProgress, retryUploadInProgress);
            }}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.5 : 1,
              },
              styles.retryButton,
            ]}
          >
            <Image
              style={styles.retryIcon}
              source={require("../../assets/images/retry_file_upload3x.png")}
            />
            <Text style={styles.retryText}>RETRY</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};

export default GIFView;
