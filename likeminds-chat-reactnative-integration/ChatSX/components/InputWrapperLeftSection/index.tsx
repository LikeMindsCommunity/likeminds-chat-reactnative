import { View, Text } from "react-native";
import React, { Children } from "react";
import { useInputBoxContext } from "../../context/InputBoxContext";
import { styles } from "../InputBox/styles";

const InputWrapperLeftSection = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const { isReply, isUserTagging, isUploadScreen, isEditable, ogTagsState } =
    useInputBoxContext();
  return (
    <View
      style={
        (isReply && !isUploadScreen) ||
        isUserTagging ||
        isEditable ||
        Object.keys(ogTagsState || {}).length !== 0
          ? [
              styles.replyBoxParent,
              {
                borderTopWidth:
                  isReply && !isUploadScreen && !isUserTagging ? 0 : 0,
                borderTopLeftRadius:
                  isReply && !isUploadScreen && !isUserTagging ? 10 : 20,
                borderTopRightRadius:
                  isReply && !isUploadScreen && !isUserTagging ? 10 : 20,
                backgroundColor: isUploadScreen ? "black" : "white",
              },
            ]
          : null
      }
    >
      {children}
    </View>
  );
};

export default InputWrapperLeftSection;
