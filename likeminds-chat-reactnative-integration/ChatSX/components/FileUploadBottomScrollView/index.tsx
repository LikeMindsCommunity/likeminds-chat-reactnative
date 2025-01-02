import { View, Text, ScrollView, Pressable, Image } from "react-native";
import React from "react";
import styles from "../../screens/FIleUpload/styles";
import { SELECTED_FILE_TO_VIEW } from "../../store/types/types";
import { PDF_TEXT, VIDEO_TEXT } from "../../constants/Strings";
import Layout from "../../constants/Layout";
import { useFileUploadContext } from "../../context/FileUploadContext";
import { useAppDispatch } from "../../store";

const FileUploadBottomScrollView = () => {
  const {
    itemType,
    selectedFileToView,
    len,
    docItemType,
    isGif,
    selectedFilesToUpload,
    selectedImageBorderColor,
    selectedFilesToUploadThumbnails,
  } = useFileUploadContext();
  const dispatch = useAppDispatch();
  return (
    <View style={{position:'absolute', bottom: 0}}>
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
  );
};

export default FileUploadBottomScrollView;
