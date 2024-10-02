/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {RealmProvider} from '@realm/react';
import {LoginSchemaRO} from './login/loginSchemaRO';
import messaging, { firebase } from "@react-native-firebase/messaging";
import { getNotification } from '@likeminds.community/chat-rn-core';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  getNotification(remoteMessage)
 });

const WrappedApp = () => (
  <RealmProvider schema={[LoginSchemaRO]}>
    <App />
  </RealmProvider>
);

AppRegistry.registerComponent(appName, () => WrappedApp);
