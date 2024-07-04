/**
 * @format
 */
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import {
  initMyClient,
  getNotification,
} from "@likeminds.community/chat-rn-core";
import { ConversationState } from "@likeminds.community/chat-rn";
import messaging from "@react-native-firebase/messaging";

{
  /* Logic to handle background notification to be written by the client, below is the sample code */
}
// messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//   let val = await getNotification(remoteMessage);
//   return val;
// });

const filterStateMessage = []; // give type of conversation to be filtered using ConversationState enum

// proivde apiKey below to initMyClient
const myClient = initMyClient("", filterStateMessage); // pass api key as first param and filterStateMessage array as second param

AppRegistry.registerComponent(appName, () => App);

export { myClient };
