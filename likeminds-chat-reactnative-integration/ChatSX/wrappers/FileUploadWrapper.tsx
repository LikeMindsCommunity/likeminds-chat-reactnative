import React from "react";
import { ChatroomContextProvider } from "../context";
import FileUploadScreen from "./FileUploadScreen";
import { FileUploadContextProvider } from "../context/FileUploadContext";

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
