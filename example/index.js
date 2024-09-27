/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {RealmProvider} from '@realm/react';
import {LoginSchemaRO} from './login/loginSchemaRO';
import messaging, { firebase } from "@react-native-firebase/messaging";

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log(remoteMessage,"heree is messageee")
  let val = await getNotification(remoteMessage);
  return val;
 });
//  messaging().onMessage(async (remoteMessage) => {
//   console.log('firebase ==',remoteMessage)
//   let val = await getNotification(remoteMessage);
//   return val
//  })
//  firebase.messaging().onMessage(()=>{console.log("eerer")});
//  firebase.app().messaging().onMessage(()=>console.log("got itttt"))

const WrappedApp = () => (
  <RealmProvider schema={[LoginSchemaRO]}>
    <App />
  </RealmProvider>
);

AppRegistry.registerComponent(appName, () => WrappedApp);
