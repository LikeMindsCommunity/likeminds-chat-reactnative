import { View, Text, Image, TouchableOpacity, BackHandler } from "react-native";
import React, { useEffect, useRef } from "react";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import Layout from "../../constants/Layout";
import {
  GIF_TEXT,
  IMAGE_TEXT,
  PHOTOS_TEXT,
  PHOTO_TEXT,
  VIDEOS_TEXT,
  VIDEO_TEXT,
} from "../../constants/Strings";
import styles from "./styles";
import STYLES from "../../constants/Styles";
import { STATUS_BAR_STYLE } from "../../store/types/types";
import { DocumentType } from "../../enums";
import { useAppDispatch } from "../../store";
import RNVideoPlayer from "../../optionalDependecies/RNVideo";

const CarouselScreen = ({ navigation, route }: any) => {
  const video = useRef<any>(null);
  const dispatch = useAppDispatch();
  const { index, dataObject, backIconPath } = route.params;
  const data = dataObject?.attachments;
  let imageCount = 0;
  let videoCount = 0;
  let pdfCount = 0;
  let gifCount = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].type == DocumentType.VIDEO) {
      videoCount++;
    } else if (data[i].type == DocumentType.IMAGE) {
      imageCount++;
    } else if (data[i].type == DocumentType.GIF_TEXT) {
      gifCount++;
    } else {
      pdfCount++;
    }
  }
  const userName = dataObject?.member?.name;
  const date = dataObject?.date;
  const time = dataObject?.createdAt;

  const carouselScreenStyles = STYLES.$CAROUSEL_SCREEN_STYLE;
  const headerTitle = carouselScreenStyles?.headerTitle;
  const headerSubtitle = carouselScreenStyles?.headerSubtitle;

  let countText = "";

  if (imageCount > 0 && videoCount > 0) {
    countText = `${imageCount} ${
      imageCount > 1 ? PHOTOS_TEXT : PHOTO_TEXT
    }, ${videoCount} ${videoCount > 1 ? VIDEOS_TEXT : VIDEO_TEXT}`;
  } else if (imageCount > 0) {
    countText = `${imageCount > 1 ? `${imageCount} ${PHOTOS_TEXT}` : ""}`;
  } else if (videoCount > 0) {
    countText = `${videoCount > 1 ? `${videoCount} ${VIDEOS_TEXT}` : ""}`;
  } else if (gifCount > 0) {
    countText = `${gifCount > 1 ? `${gifCount} ${GIF_TEXT}` : ""}`;
  }

  const setInitialHeader = () => {
    navigation.setOptions({
      headerShown: false,
    });
  };

  useEffect(() => {
    setInitialHeader();
  }, []);

  useEffect(() => {
    function backActionCall() {
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

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <View style={styles.header}>
        <View style={styles.headingContainer}>
          <View style={styles.headerElement}>
            <TouchableOpacity
              style={{ padding: Layout.normalize(10) }}
              onPress={() => {
                navigation.goBack();
                dispatch({
                  type: STATUS_BAR_STYLE,
                  body: { color: STYLES.$STATUS_BAR_STYLE.default },
                });
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
            <View style={styles.chatRoomInfo}>
              <Text
                style={{
                  color: headerTitle?.color
                    ? headerTitle?.color
                    : STYLES.$COLORS.TERTIARY,
                  fontSize: headerTitle?.fontSize
                    ? headerTitle?.fontSize
                    : STYLES.$FONT_SIZES.LARGE,
                  fontFamily: headerTitle?.fontFamily
                    ? headerTitle?.fontFamily
                    : STYLES.$FONT_TYPES.BOLD,
                }}
              >
                {userName}
              </Text>
              <Text
                style={{
                  color: headerSubtitle?.color
                    ? headerSubtitle?.color
                    : STYLES.$COLORS.TERTIARY,
                  fontSize: headerSubtitle?.fontSize
                    ? headerSubtitle?.fontSize
                    : STYLES.$FONT_SIZES.SMALL,
                  fontFamily: headerSubtitle?.fontFamily
                    ? headerSubtitle?.fontFamily
                    : STYLES.$FONT_TYPES.MEDIUM,
                }}
              >
                {`${countText ? `${countText} • ` : ""}${date}, ${time}`}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <SwiperFlatList
        data={data}
        index={index}
        renderItem={({ item, index }) => {
          return (
            <View
              key={item + index}
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            >
              {item?.type === IMAGE_TEXT ? (
                <Image style={styles.image} source={{ uri: item?.url }} />
              ) : item?.type === VIDEO_TEXT && RNVideoPlayer ? (
                <View style={styles.video}>
                  <RNVideoPlayer
                    // @ts-ignore
                    source={{ uri: item?.url }}
                    videoStyle={styles.videoPlayer}
                    videoRef={video}
                    disableVolume={true}
                    disableBack={true}
                    disableFullscreen={true}
                    paused={true}
                    showOnStart={true}
                  />
                </View>
              ) : item?.type === GIF_TEXT ? (
                <Image style={styles.image} source={{ uri: item?.url }} />
              ) : null}
            </View>
          );
        }}
      />
    </View>
  );
};

export default CarouselScreen;
