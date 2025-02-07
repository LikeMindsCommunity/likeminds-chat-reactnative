import { View, Text } from "react-native";
import React from "react";
import FileUploadHeader from "@likeminds.community/chat-rn-core/ChatSX/components/FileUploadHeader";
import FileUploadView from "@likeminds.community/chat-rn-core/ChatSX/components/FileUploadView";
import FileUploadMessageInput from "@likeminds.community/chat-rn-core/ChatSX/components/FileUploadMessageInput";
import { InputBoxContextProvider } from "@likeminds.community/chat-rn-core/ChatSX/context/InputBoxContext";
import MessageInputBox from "@likeminds.community/chat-rn-core/ChatSX/components/InputBox";
import styles from "@likeminds.community/chat-rn-core/ChatSX/screens/FIleUpload/styles";
import { PDF_TEXT } from "@likeminds.community/chat-rn-core/ChatSX/constants/Strings";
import { useFileUploadContext } from "@likeminds.community/chat-rn-core/ChatSX/context/FileUploadContext";
import { useChatroomContext } from "@likeminds.community/chat-rn-core/ChatSX/context/ChatroomContext";
import FileUploadBottomScrollView from "@likeminds.community/chat-rn-core/ChatSX/components/FileUploadBottomScrollView";

const FileUploadScreen = () => {
  const { chatroomType } = useChatroomContext();
  const { docItemType, chatroomID, previousMessage, handleFileUpload, isGif, chatroomDBDetails } =
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
          isPrivateMember={chatroomDBDetails.isPrivateMember}
          chatRequestState={chatroomDBDetails.chatRequestState}
        >
          <MessageInputBox />
        </InputBoxContextProvider>
      </FileUploadMessageInput>
      <FileUploadBottomScrollView />
    </View>
  );
};

export default FileUploadScreen;
