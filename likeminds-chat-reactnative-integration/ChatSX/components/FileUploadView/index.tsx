import { View, Text, Image } from "react-native";
import React from "react";
import styles from "../../screens/FIleUpload/styles";
import { IMAGE_TEXT, PDF_TEXT, VIDEO_TEXT } from "../../constants/Strings";
import { useFileUploadContext } from "../../context/FileUploadContext";
import RNVideoPlayer from "../../optionalDependecies/RNVideo";

const FileUploadView = () => {
  const { itemType, selectedFileToView, video, docItemType, isGif } =
    useFileUploadContext();
  return (
    <View style={{...styles.selectedFileToView, flex: 1
    }}>
      {itemType === IMAGE_TEXT ? (
        <Image
          source={{ uri: selectedFileToView?.uri }}
          style={styles.mainImage}
        />
      ) : itemType === VIDEO_TEXT && RNVideoPlayer ? (
        <View style={styles.video}>
          <RNVideoPlayer
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
  );
};

export default FileUploadView;
