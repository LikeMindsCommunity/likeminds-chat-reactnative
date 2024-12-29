import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  ImageStyle,
} from "react-native";
import React from "react";
import { styles } from "../../components/InputBox/styles";
import { LMChatIcon, LMChatTextView } from "../../uiComponents";
import {
  CAMERA_TEXT,
  DOCUMENTS_TEXT,
  PHOTOS_AND_VIDEOS_TEXT,
  POLL_TEXT,
} from "../../constants/Strings";
import { CREATE_POLL_SCREEN } from "../../constants/Screens";
import { useInputBoxContext } from "../../context/InputBoxContext";

interface SelectFilesModalProps {
  handleGalleryProp?: () => void;
  handleDocumentProp?: () => void;
  handleCameraProp?: () => void;
  handlePollProp?: () => void;
  handleModalCloseProp?: () => void;
}

const SelectFilesModal = ({
  handleGalleryProp,
  handleDocumentProp,
  handleCameraProp,
  handlePollProp,
  handleModalCloseProp,
}: SelectFilesModalProps) => {
  const {
    modalVisible,
    setModalVisible,
    handleModalClose,
    handleCamera,
    inputBoxStyles,
    handleGallery,
    handleDoc,
    chatroomType,
    chatroomID,
    conversations,
    navigation,
  } = useInputBoxContext();

  return (
    <>
      {/* More features modal like select Images, Docs etc. */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <Pressable
          style={styles.centeredView}
          onPress={
            handleModalCloseProp ? handleModalCloseProp : handleModalClose
          }
        >
          <View style={styles.modalViewParent}>
            <Pressable onPress={() => {}} style={[styles.modalView]}>
              <View style={styles.alignModalElements}>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      setTimeout(() => {
                        if (handleCameraProp) {
                          handleCameraProp();
                        } else {
                          handleCamera();
                        }
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
                        if (handleGalleryProp) {
                          handleGalleryProp();
                        } else {
                          handleGallery();
                        }
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
                        if (handleDocumentProp) {
                          handleDocumentProp();
                        } else {
                          handleDoc();
                        }
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
                        if (handlePollProp) {
                          handlePollProp();
                        } else {
                          navigation.navigate(CREATE_POLL_SCREEN, {
                            chatroomID: chatroomID,
                            conversationsLength: conversations.length * 2,
                          });
                        }
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
    </>
  );
};

export default SelectFilesModal;
