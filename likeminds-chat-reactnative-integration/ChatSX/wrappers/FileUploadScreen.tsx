import { View, Text } from "react-native";
import React from "react";
import FileUploadHeader from "../components/FileUploadHeader";
import FileUploadView from "../components/FileUploadView";
import FileUploadMessageInput from "../components/FileUploadMessageInput";
import { InputBoxContextProvider } from "../context/InputBoxContext";
import MessageInputBox from "../components/InputBox";
import styles from "../screens/FIleUpload/styles";
import { PDF_TEXT } from "../constants/Strings";
import { useFileUploadContext } from "../context/FileUploadContext";
import { useChatroomContext } from "../context/ChatroomContext";
import FileUploadBottomScrollView from "../components/FileUploadBottomScrollView";

const FileUploadScreen = () => {
  const { chatroomType } = useChatroomContext();
  const { docItemType, chatroomID, previousMessage, handleFileUpload, isGif } =
    useFileUploadContext();
  return (
    <View style={styles.page}>
      <FileUploadHeader />
      <FileUploadView />
      <FileUploadMessageInput>
        <InputBoxContextProvider
          isUploadScreen={true}
          isDoc={docItemType === PDF_TEXT ? true : false}
          chatroomID={chatroomID}
          previousMessage={previousMessage}
          handleFileUpload={handleFileUpload}
          isGif={isGif}
          chatroomType={chatroomType}
        >
          <MessageInputBox />
        </InputBoxContextProvider>
      </FileUploadMessageInput>
      <FileUploadBottomScrollView />
    </View>
  );
};

export default FileUploadScreen;
