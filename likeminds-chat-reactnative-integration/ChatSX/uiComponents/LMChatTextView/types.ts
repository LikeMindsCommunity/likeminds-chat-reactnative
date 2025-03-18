import React from "react";
import {
  TextStyle,
  NativeSyntheticEvent,
  TextLayoutEventData,
} from "react-native";

export interface LMChatTextViewProps {
  maxLines?: number; // this defines the maximum lines to be displayed
  textStyle?: TextStyle; // this represents ths style of the text
  selectable?: boolean; // this represents the selection behaviour of the text
  onTextLayout?: (event: NativeSyntheticEvent<TextLayoutEventData>) => void; // callback function executed on change of text layout,
  children?: React.ReactNode;
}
