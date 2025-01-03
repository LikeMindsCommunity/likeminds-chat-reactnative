import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import styles from "../../screens/FIleUpload/styles";
import {
  CLEAR_SELECTED_FILE_TO_VIEW,
  CLEAR_SELECTED_FILES_TO_UPLOAD,
  STATUS_BAR_STYLE,
} from "../../store/types/types";
import STYLES from "../../constants/Styles";
import { IMAGE_TEXT } from "../../constants/Strings";
import { IMAGE_CROP_SCREEN } from "../../constants/Screens";
import { useFileUploadContext } from "../../context/FileUploadContext";
import { useAppDispatch } from "../../store";
import { useNavigation } from "@react-navigation/native";

const FileUploadHeader = () => {
  const { len, backIconPath, itemType, selectedFileToView, imageCropIcon } =
    useFileUploadContext();
  const dispatch = useAppDispatch();
  const navigation: any = useNavigation();
  return (
    <>
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
    </>
  );
};

export default FileUploadHeader;
