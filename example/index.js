/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {RealmProvider} from '@realm/react';
import {LoginSchemaRO} from './login/loginSchemaRO';
import messaging, { firebase } from "@react-native-firebase/messaging";
import { getNotification, getRoute } from '@likeminds.community/chat-rn-core';
import { navigationRef } from './RootNavigation';
import notifee, { EventType } from "@notifee/react-native";
import { StackActions } from '@react-navigation/native';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  getNotification(remoteMessage)
});

notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (detail?.notification?.data?.route != undefined) {
    const navigation = navigationRef?.current;
    let currentRoute = navigation?.getCurrentRoute();
    let routes = await getRoute(detail?.notification?.data?.route);

    if (type === EventType.PRESS) {
      if (!!navigation) {
        if ((currentRoute?.name) === routes?.route) {
          if (
            JSON.stringify(routes?.params) !==
            JSON.stringify(currentRoute?.params)
          ) {
            const popAction = StackActions.pop(1);
            navigation.dispatch(popAction);
            setTimeout(() => {
              navigation.navigate(
                routes?.route,
                routes?.params
              );
            }, 1000);
          }
        } else {
          navigation.navigate(
            routes?.route,
            routes?.params
          );
        }
      } else {
        if ((currentRoute?.name) === routes?.route) {
          if (
            JSON.stringify(routes?.params) !==
            JSON.stringify(currentRoute?.params)
          ) {
            const popAction = StackActions.pop(1);
            navigationRef.dispatch(popAction);
            setTimeout(() => {
              navigationRef.dispatch(StackActions.push(
                routes?.route,
                routes?.params
              ))
            },5000)
          }
        } else {
          setTimeout(() => {
            navigationRef.dispatch(StackActions.push(
              routes?.route,
              routes?.params
            ))
          },5000)
        }
      }
    }
  }
})

const WrappedApp = () => (
  <RealmProvider schema={[LoginSchemaRO]}>
    <App />
  </RealmProvider>
);

AppRegistry.registerComponent(appName, () => WrappedApp);
