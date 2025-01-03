import { View, Text } from "react-native";
import React from "react";
import { useInputBoxContext } from "../../context/InputBoxContext";
import { styles } from "../InputBox/styles";
import STYLES from "../../constants/Styles";
import Layout from "../../constants/Layout";

const TextInputWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isReply, isUserTagging, isIOS, isUploadScreen, isEditable } =
    useInputBoxContext();
  return (
    <View
      style={[
        styles.textInput,
        !(isEditable || isReply) ? styles.inputBoxWithShadow : null,
        {
          backgroundColor: isUploadScreen
            ? STYLES.$BACKGROUND_COLORS.DARK
            : STYLES.$BACKGROUND_COLORS.LIGHT,
        },
        (isReply && !isUploadScreen) || isEditable || isUserTagging
          ? {
              borderWidth: 0,
            }
          : null,
      ]}
    >
      {children}
    </View>
  );
};

export default TextInputWrapper;
