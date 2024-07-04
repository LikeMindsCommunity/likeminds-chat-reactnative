/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Keyboard, Platform, Text, View } from "react-native";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { navigationRef } from "./RootNavigation";
import {
  CarouselScreen,
  CreatePollScreen,
  ImageCropScreen,
  PollResult,
  VideoPlayer,
  LMOverlayProvider,
  LMChatCallbacks,
  LMChatroomCallbacks,
  NavigateToProfileParams,
  NavigateToGroupDetailsParams,
  getNotification,
  getRoute,
  SearchInChatroom
} from "@likeminds.community/chat-rn-core";
import { myClient } from ".";
import { setStyles } from "./src/styles";
import { ScreenName } from "./src/enums/screenNameEnums";
import ChatroomScreenWrapper from "./screens/Chatroom/ChatroomScreenWrapper";
import FileUploadScreenWrapper from "./screens/FileUpload/FileUploadWrapper";
import {
  announcementRoomId,
  backIconPath,
  chatroomId,
  gender,
  profileImageUrl,
  userName,
  userUniqueId,
} from "./src/userAndCommunityInfo";
import messaging from "@react-native-firebase/messaging";
import notifee, { EventType } from "@notifee/react-native";

const Stack = createNativeStackNavigator();

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home!</Text>
    </View>
  );
}

// Override callBacks with custom logic
class CustomCallbacks implements LMChatCallbacks, LMChatroomCallbacks {
  navigateToProfile(params: NavigateToProfileParams) {
    // Override navigateToProfile with custom logic
  }

  navigateToHomePage() {
    // Override navigateToHomePage with custom logic
  }

  onEventTriggered(eventName: string, eventProperties?: Map<string, string>) {
    // Bugfender.log("eventName -- eventProperties", eventName, eventProperties);
    // Override onEventTriggered with custom logic
  }

  navigateToGroupDetails(params: NavigateToGroupDetailsParams) {
    // Override navigateToGroupDetails with custom logic
  }
}

const lmChatInterface = new CustomCallbacks();

function SettingsScreen() {
  useEffect(() => {
    setStyles(gender);
  }, []);

  {
    /* Logic to handle foreground notification to be written by the client, below is the sample code */
  }
  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async (remoteMessage) => {
  //     const val = await getNotification(remoteMessage);
  //     return val;
  //   });

  //   notifee.onForegroundEvent(async ({ type, detail }) => {
  //     if (detail?.notification?.data?.route != undefined) {
  //       const navigation = navigationRef?.current;
  //       let currentRoute = navigation?.getCurrentRoute();
  //       let routes = await getRoute(detail?.notification?.data?.route);

  //       if (type === EventType.PRESS) {
  //         if (!!navigation) {
  //           if ((currentRoute?.name as any) === routes?.route) {
  //             if (
  //               JSON.stringify(routes?.params) !==
  //               JSON.stringify(currentRoute?.params)
  //             ) {
  //               const popAction = StackActions.pop(1);
  //               navigation.dispatch(popAction);
  //               setTimeout(() => {
  //                 navigation.navigate(
  //                   routes?.route as never,
  //                   routes?.params as never
  //                 );
  //               }, 1000);
  //             }
  //           } else {
  //             navigation.navigate(
  //               routes?.route as never,
  //               routes?.params as never
  //             ); //navigate(CHATROOM, {chatroomID: 69285});
  //           }
  //         }
  //       }
  //     }
  //   });

  //   return unsubscribe;
  // }, []);

  return (
    <LMOverlayProvider
      myClient={myClient}
      userName={userName}
      userUniqueId={userUniqueId}
      profileImageUrl={profileImageUrl}
      lmChatInterface={lmChatInterface}
    >
      <Stack.Navigator>
        <Stack.Screen
          name={ScreenName.ChatRoom}
          component={ChatroomScreenWrapper}
          initialParams={{
            chatroomID: chatroomId,
            announcementRoomId: announcementRoomId,
          }}
        />
        <Stack.Screen
          options={{ gestureEnabled: Platform.OS === "ios" ? false : true }}
          name={ScreenName.FileUpload}
          component={FileUploadScreenWrapper}
        />
        <Stack.Screen
          name="SearchInChatroom"
          component={SearchInChatroom}
          options={{
            gestureEnabled: Platform.OS === "ios" ? false : true,
            headerShown: false,
          }}
        />
        <Stack.Screen name={"VideoPlayer"} component={VideoPlayer} />
        <Stack.Screen
          options={{ gestureEnabled: false }}
          name={ScreenName.CarouselScreen}
          component={CarouselScreen}
        />
        <Stack.Screen
          options={{ gestureEnabled: false }}
          name={ScreenName.PollResult}
          component={PollResult}
          initialParams={{
            backIconPath: backIconPath,
          }}
        />
        <Stack.Screen
          name={ScreenName.CreatePollScreen}
          component={CreatePollScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name={ScreenName.ImageCropScreen}
          component={ImageCropScreen}
        />
      </Stack.Navigator>
    </LMOverlayProvider>
  );
}

const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  const [isKeyBoardFocused, setIsKeyBoardFocused] = useState(false);
  useLayoutEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyBoardFocused(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyBoardFocused(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  return (
    <NavigationContainer ref={navigationRef} independent={true}>
      <Tab.Navigator
        screenOptions={() => ({
          headerShown: false,
          tabBarStyle: {
            display:
              Platform.OS !== "ios"
                ? isKeyBoardFocused
                  ? "none"
                  : "flex"
                : "flex",
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
