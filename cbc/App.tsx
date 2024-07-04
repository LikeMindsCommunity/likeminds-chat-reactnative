/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useLayoutEffect, useState } from "react";
import { Keyboard, Platform, StatusBar, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { navigationRef } from "./RootNavigation";
import {
  CarouselScreen,
  ChatRoom,
  CreatePollScreen,
  FileUpload,
  ImageCropScreen,
  PollResult,
  VideoPlayer,
  LMOverlayProvider,
  LMChatroomCallbacks,
  LMChatCallbacks,
  NavigateToProfileParams,
  NavigateToGroupDetailsParams,
  RadialGradient,
} from "@likeminds.community/chat-rn-core";
import { myClient } from ".";
import ChatroomTabNavigator from "./src/ChatroomTabNavigator";
import { setStyles } from "./src/styles";
import { ScreenName } from "./src/enums/screenNameEnums";

const Stack = createNativeStackNavigator();

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

    console.log("eventName -- eventProperties", eventName, eventProperties);
    // Override onEventTriggered with custom logic
  }

  navigateToGroupDetails(params: NavigateToGroupDetailsParams) {
    // Override navigateToGroupDetails with custom logic
  }
}

const lmChatInterface = new CustomCallbacks();

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home!</Text>
    </View>
  );
}

function SettingsScreen() {
  const userName = "";
  const userUniqueId = "";
  const chatroomId = "";
  const announcementRoomId = "";
  const profileImageUrl = "";
  const gender: string = "male";

  useEffect(() => {
    setStyles(gender);
  }, []);

  const gradientStyling = {
    colors: gender === "male" ? ["#3BA773", "#0B713F"] : ["#B25647", "#CC8A7A"],
    style: {
      flex: 1,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
    },
  };

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
          component={ChatRoom}
          initialParams={{
            chatroomID: chatroomId,
            isInvited: false,
            announcementRoomId: announcementRoomId,
            gender: gender,
            tabNavigator: ChatroomTabNavigator,
            backIconPath: require("./assets/images/backIcon.png"),
            backgroundImage: "", // add your background image here
          }}
          options={() => {
            if (Object.keys(gradientStyling).length !== 0) {
              return {
                headerBackground: () => (
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <StatusBar
                      translucent
                      backgroundColor="transparent"
                      barStyle="light-content"
                    />
                    <RadialGradient {...gradientStyling} />
                  </View>
                ),
              };
            }
            return {};
          }}
        />
        <Stack.Screen
          options={{ gestureEnabled: Platform.OS === "ios" ? false : true }}
          name={ScreenName.FileUpload}
          component={FileUpload}
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
            backIconPath: require("./assets/images/backIcon.png"),
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
