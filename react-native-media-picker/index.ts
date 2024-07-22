import { NativeModules } from 'react-native';

const { MediaPicker } = NativeModules;

export const pickImage = () => {
  return MediaPicker.pickImage();
};

export const pickVideo = () => {
  return MediaPicker.pickVideo();
};