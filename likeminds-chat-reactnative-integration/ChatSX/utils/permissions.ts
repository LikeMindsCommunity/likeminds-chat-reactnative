import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";
import { atLeastAndroid13 } from "../commonFuctions";
import {
  App_Permission_For_Storage,
  App_Permission_To_Read_Files,
  Ask_Me_Later,
  Cancel,
  Ok,
  Open_Settings,
  Storage_Permission,
} from "../constants/Strings";

// function checks if we have access of storage in Android.
export async function requestStoragePermission() {
  if (Platform.OS === "android") {
    const OSVersion = Platform.constants.Release;

    if (Number(OSVersion) < 13) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: Storage_Permission,
            message: App_Permission_For_Storage,
            buttonNeutral: Ask_Me_Later,
            buttonNegative: Cancel,
            buttonPositive: Ok,
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          Alert.alert(Storage_Permission, App_Permission_To_Read_Files, [
            { text: Cancel, style: "cancel" },
            { text: Open_Settings, onPress: Linking.openSettings },
          ]);
        } else {
          return false;
        }
      } catch (err) {
        return false;
      }
    } else {
      try {
        const grantedImageStorage = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        ]);
        if (
          grantedImageStorage["android.permission.READ_MEDIA_IMAGES"] &&
          grantedImageStorage["android.permission.READ_MEDIA_VIDEO"] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          return true;
        } else if (
          grantedImageStorage["android.permission.READ_MEDIA_IMAGES"] ===
            PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
          grantedImageStorage["android.permission.READ_MEDIA_VIDEO"] ===
            PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
        ) {
          Alert.alert(Storage_Permission, App_Permission_To_Read_Files, [
            { text: Cancel, style: "cancel" },
            { text: Open_Settings, onPress: Linking.openSettings },
          ]);
          return false;
        } else {
          return false;
        }
      } catch (err) {
        return false;
      }
    }
  }
}

export async function requestCameraPermission() {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message: "App needs permission to access your camera",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          "Camera Permission Required",
          "App needs access to your camera to capture photos. Please go to app settings and grant permission.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: Linking.openSettings },
          ]
        );
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }
}

export async function requestAudioRecordPermission() {
  if (Platform.OS === "android") {
    try {
      const isAtLeastAndroid13 = atLeastAndroid13();
      const permissions = isAtLeastAndroid13
        ? [
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
          ]
        : [
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          ];
      const grants = await PermissionsAndroid.requestMultiple(permissions);

      if (isAtLeastAndroid13) {
        if (
          grants["android.permission.READ_MEDIA_AUDIO"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants["android.permission.RECORD_AUDIO"] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          return true;
        } else if (
          grants["android.permission.READ_MEDIA_AUDIO"] ===
          PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
        ) {
          Alert.alert(
            "Read Storage Permission Required",
            "App needs read access to your storage. Please go to app settings and grant permission.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Open Settings", onPress: Linking.openSettings },
            ]
          );
        } else if (
          grants["android.permission.RECORD_AUDIO"] ===
          PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
        ) {
          Alert.alert(
            "Microphone Permission Required",
            "App needs microphone access to record audio. Please go to app settings and grant permission.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Open Settings", onPress: Linking.openSettings },
            ]
          );
        } else {
          return false;
        }
      } else {
        if (
          grants["android.permission.WRITE_EXTERNAL_STORAGE"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants["android.permission.READ_EXTERNAL_STORAGE"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants["android.permission.RECORD_AUDIO"] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          return true;
        } else if (
          grants["android.permission.WRITE_EXTERNAL_STORAGE"] ===
          PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
        ) {
          Alert.alert(
            "Write Storage Permission Required",
            "App needs write access to your storage. Please go to app settings and grant permission.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Open Settings", onPress: Linking.openSettings },
            ]
          );
        } else if (
          grants["android.permission.READ_EXTERNAL_STORAGE"] ===
          PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
        ) {
          Alert.alert(
            "Read Storage Permission Required",
            "App needs read access to your storage. Please go to app settings and grant permission.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Open Settings", onPress: Linking.openSettings },
            ]
          );
        } else if (
          grants["android.permission.RECORD_AUDIO"] ===
          PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
        ) {
          Alert.alert(
            "Microphone Permission Required",
            "App needs microphone access to record audio. Please go to app settings and grant permission.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Open Settings", onPress: Linking.openSettings },
            ]
          );
        } else {
          return false;
        }
      }
    } catch (err) {
      return;
    }
  }
}
