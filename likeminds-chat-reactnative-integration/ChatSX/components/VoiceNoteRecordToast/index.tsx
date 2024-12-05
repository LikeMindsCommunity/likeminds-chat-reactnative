import { View, Text } from "react-native";
import React from "react";
import { styles } from "../InputBox/styles";
import { LMChatTextView } from "../../uiComponents";
import { TAP_AND_HOLD } from "../../constants/Strings";
import { useInputBoxContext } from "../../context/InputBoxContext";

const VoiceNoteRecordToast = () => {
  const { isVoiceNoteIconPress, isKeyBoardFocused, isIOS } =
    useInputBoxContext();
  return (
    <View>
      {/* shows message how we record voice note */}
      {isVoiceNoteIconPress && (
        <View
          style={[
            styles.tapAndHold,
            {
              bottom: isKeyBoardFocused ? (isIOS ? 65 : 110) : isIOS ? 80 : 70,
            },
          ]}
        >
          <LMChatTextView textStyle={styles.tapAndHoldStyle}>
            {TAP_AND_HOLD}
          </LMChatTextView>
        </View>
      )}
    </View>
  );
};

export default VoiceNoteRecordToast;
