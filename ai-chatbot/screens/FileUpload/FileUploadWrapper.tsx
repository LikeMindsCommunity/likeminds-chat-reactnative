import React from 'react';
import FileUploadScreen from '.';
import {ChatroomContextProvider} from '@likeminds.community/chat-rn-core/ChatSX/context';
import { FileUploadContextProvider } from '@likeminds.community/chat-rn-core/ChatSX/context/FileUploadContext';

function FileUploadScreenWrapper() {
  return (
    <ChatroomContextProvider>
      <FileUploadContextProvider>
        <FileUploadScreen />
      </FileUploadContextProvider>
    </ChatroomContextProvider>
  );
}

export default FileUploadScreenWrapper;
