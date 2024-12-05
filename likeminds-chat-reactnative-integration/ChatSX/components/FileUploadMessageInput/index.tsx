import { View, Text } from "react-native";
import React, { Children } from "react";
import styles from "../../screens/FIleUpload/styles";
import { useFileUploadContext } from "../../context/FileUploadContext";

const FileUploadMessageInput = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { len } = useFileUploadContext();
  return (
    <View style={styles.bottomBar}>{len > 0 ? <>{children}</> : null}</View>
  );
};

export default FileUploadMessageInput;
