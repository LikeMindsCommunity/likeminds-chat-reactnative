
import {
  View,
  Modal,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { LMChatIcon, LMChatTextView } from "../../uiComponents";
import {
  CAMERA_TEXT,
  DOCUMENTS_TEXT,
  PHOTOS_AND_VIDEOS_TEXT,
  POLL_TEXT,
} from "../../constants/Strings";
import { CREATE_POLL_SCREEN } from "../../constants/Screens";
import { useInputBoxContext } from "../../context/InputBoxContext";
import { ChatroomType } from "../../enums";
import { styles } from "../../components/InputBox/styles";

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
    handleGallery,
    handleDoc,
    chatroomType,
    chatroomID,
    conversations,
    navigation,
    isUserChatbot,
    canUserCreatePoll,
    inputBoxStyles, // Centralized styles
  } = useInputBoxContext();
console.log(inputBoxStyles?.selectFilesModalStyles?.cameraIconStyles,"log1");
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(!modalVisible)}
    >
      <Pressable
        style={StyleSheet.flatten([
          styles.centeredView,
          inputBoxStyles?.selectFilesModalStyles?.centeredView,
        ])}
        onPress={handleModalCloseProp ? handleModalCloseProp : handleModalClose}
      >
        <View
          style={StyleSheet.flatten([
            styles.modalViewParent,
            inputBoxStyles?.selectFilesModalStyles?.modalViewParent,
          ])}
        >
          <Pressable
            onPress={() => {}}
            style={StyleSheet.flatten([
              styles.modalView,
              inputBoxStyles?.selectFilesModalStyles?.modalView,
            ])}
          >
            <View
              style={StyleSheet.flatten([
                styles.alignModalElements,
                inputBoxStyles?.selectFilesModalStyles?.alignModalElements,
              ])}
            >
              {/* Camera */}
              <View
                style={StyleSheet.flatten([
                  styles.iconContainer,
                  inputBoxStyles?.selectFilesModalStyles?.iconContainer,
                ])}
              >
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    setTimeout(() => {
                      handleCameraProp ? handleCameraProp() : handleCamera();
                    }, 50);
                  }}
                  style={styles.cameraStyle}
                >
                  <LMChatIcon

                    assetPath={inputBoxStyles?.selectFilesModalStyles?.cameraIconStyles?.assetPath ?? require("../../assets/images/camera_icon3x.png")}
                    iconStyle={StyleSheet.flatten([
                      styles.emoji,
                      //inputBoxStyles?.selectFilesModalStyles?.cameraIconStyles,
                    ])}
                    height={50}
                    width={50}
                  />
                </TouchableOpacity>
                <LMChatTextView textStyle={styles.iconText}>
                  {CAMERA_TEXT}
                </LMChatTextView>
              </View>

              {/* Gallery */}
              <View
                style={StyleSheet.flatten([
                  styles.iconContainer,
                  inputBoxStyles?.selectFilesModalStyles?.iconContainer,
                ])}
              >
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    setTimeout(() => {
                      handleGalleryProp
                        ? handleGalleryProp()
                        : handleGallery();
                    }, 500);
                  }}
                  style={styles.imageStyle}
                >
                  <LMChatIcon
                    assetPath={inputBoxStyles?.selectFilesModalStyles?.galleryIconStyles?.assetPath ?? require("../../assets/images/select_image_icon3x.png")}
                    iconStyle={StyleSheet.flatten([
                      styles.emoji,
                      inputBoxStyles?.selectFilesModalStyles?.galleryIconStyles,
                    ])}
                  />
                </TouchableOpacity>
                <LMChatTextView textStyle={styles.iconText}>
                  {PHOTOS_AND_VIDEOS_TEXT}
                </LMChatTextView>
              </View>

              {/* Document */}
              {chatroomType !== ChatroomType.DMCHATROOM || !isUserChatbot ? (
                <View
                  style={StyleSheet.flatten([
                    styles.iconContainer,
                    inputBoxStyles?.selectFilesModalStyles?.iconContainer,
                  ])}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      setTimeout(() => {
                        handleDocumentProp
                          ? handleDocumentProp()
                          : handleDoc();
                      }, 50);
                    }}
                    style={styles.docStyle}
                  >
                    <LMChatIcon
                      assetPath={inputBoxStyles?.selectFilesModalStyles?.documentIconStyles?.assetPath ?? require("../../assets/images/select_doc_icon3x.png")}
                      iconStyle={StyleSheet.flatten([
                        styles.emoji,
                        inputBoxStyles?.selectFilesModalStyles
                          ?.documentIconStyles,
                      ])}
                    />
                  </TouchableOpacity>
                  <LMChatTextView textStyle={styles.iconText}>
                    {DOCUMENTS_TEXT}
                  </LMChatTextView>
                </View>
              ) : null}

              {/* Poll */}
              {chatroomType !== ChatroomType.DMCHATROOM && canUserCreatePoll ? (
                <View
                  style={StyleSheet.flatten([
                    styles.iconContainer,
                    inputBoxStyles?.selectFilesModalStyles?.iconContainer,
                  ])}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      handlePollProp
                        ? handlePollProp()
                        : navigation.navigate(CREATE_POLL_SCREEN, {
                            chatroomID: chatroomID,
                            conversationsLength: conversations.length * 2,
                          });
                    }}
                    style={styles.pollStyle}
                  >
                    <LMChatIcon
                      assetPath={inputBoxStyles?.selectFilesModalStyles?.pollIconStyles?.assetPath ?? require("../../assets/images/poll_icon3x.png")}
                      iconStyle={StyleSheet.flatten([
                        styles.emoji,
                        inputBoxStyles?.selectFilesModalStyles?.pollIconStyles,
                      ])}
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
  );
};

export default SelectFilesModal;
