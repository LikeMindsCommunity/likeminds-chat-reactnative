import { View, Text, SafeAreaView } from "react-native";
import React, { Children } from "react";
import styles from "../../screens/FIleUpload/styles";
import { useFileUploadContext } from "../../context/FileUploadContext";

const FileUploadMessageInput = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const { len } = useFileUploadContext();
  return (
    <SafeAreaView>{len > 0 ? <>{children}</> : null}</SafeAreaView>
  );
};

export default FileUploadMessageInput;
