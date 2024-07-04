import { Alert, Platform } from "react-native";
import { getUniqueId } from "react-native-device-info";
import { validateRegisterDeviceRequest } from "./registerDeviceApi";
import messaging from "@react-native-firebase/messaging";

export const pushAPI = async (fcmToken: string, accessToken: string) => {
  const deviceID = await getUniqueId();

  try {
    const payload = {
      token: fcmToken,
      deviceId: deviceID,
      xPlatformCode: Platform.OS === "ios" ? "ios" : "an",
    };
    await validateRegisterDeviceRequest(payload, accessToken);
  } catch (error) {
    Alert.alert(`${error}`);
  }
};

export const fetchFCMToken = async () => {
  const fcmToken = await messaging().getToken();
  return fcmToken;
};

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  return enabled;
}

export const token = async () => {
  const isPermissionEnabled = await requestUserPermission();
  if (isPermissionEnabled) {
    let fcmToken = await fetchFCMToken();
    return fcmToken;
  }
};
