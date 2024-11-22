import {View, Text} from 'react-native';
import React from 'react';
import {
  FileUpload,
  useInputBoxContext,
} from '@likeminds.community/chat-rn-core';

const FileUploadScreen = () => {
  return <FileUpload conversationMetaData={{asdf: 'yayy'}} />;
};

export default FileUploadScreen;
