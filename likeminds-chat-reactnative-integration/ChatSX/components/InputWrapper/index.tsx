import { View, Text } from "react-native";
import React, { Children } from "react";
import { useInputBoxContext } from "../../context/InputBoxContext";
import { styles } from "../InputBox/styles";

const InputWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isUploadScreen, inputBoxStyles, marginValue } = useInputBoxContext();
  return (
    <View
      style={[
        styles.inputContainer,
        !isUploadScreen
          ? {
              marginBottom: inputBoxStyles?.messageInputMarginBottom
                ? inputBoxStyles?.messageInputMarginBottom
                : marginValue,
            }
          : null,
      ]}
    >
      {children}
    </View>
  );
};

export default InputWrapper;
