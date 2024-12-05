/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */


import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from './RootNavigation';
import messaging, { firebase } from "@react-native-firebase/messaging";
import notifee, { EventType } from "@notifee/react-native";
import {
  CarouselScreen,
  CreatePollScreen,
  FileUpload,
  ImageCropScreen,
  PollResult,
  VideoPlayer,
  ExploreFeed,
  HomeFeed,
  LMOverlayProvider,
  LMChatCallbacks,
  LMChatroomCallbacks,
  NavigateToProfileParams,
  NavigateToGroupDetailsParams,
  STYLES,
  ContextProvider,
  ReportScreen,
  ImageScreen,
  ViewParticipants,
  AddParticipants,
  DmAllMembers,
  initMyClient,
  SearchInChatroom,
  getNotification,
  Token,
  getRoute,
  LMChatAIBotInitiaitionScreen,
} from '@likeminds.community/chat-rn-core';
import ChatroomScreenWrapper from './screens/Chatroom/ChatroomScreenWrapper';
import { setStyles } from './styles';
import {
  ADD_PARTICIPANTS,
  DM_ALL_MEMBERS,
  EXPLORE_FEED,
  IMAGE_SCREEN,
  REPORT,
  VIEW_PARTICIPANTS,
} from '@likeminds.community/chat-rn-core/ChatSX/constants/Screens';
import FileUploadScreen from './screens/FileUpload';
import FileUploadScreenWrapper from './screens/FileUpload/FileUploadWrapper';
import { useQuery } from '@realm/react';
import { Credentials } from './login/credentials';
import { LoginSchemaRO } from './login/loginSchemaRO';
import FetchKeyInputScreen from './login';
import {
  ConversationState,
  InitUserWithUuid,
} from '@likeminds.community/chat-rn';
import SearchInChatroomScreen from './screens/SearchInChatroom';
import { ScreenName } from './src/enums/screenNameEnums';
import { LMCoreCallbacks } from '@likeminds.community/chat-rn-core/ChatSX/setupChat';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LMChatBotOverlayProvider } from '@likeminds.community/chat-rn-core/ChatSX/lmOverlayProvider';
import HomeScreen from './screens/HomeScreen';
// import { LMChatBotOverlayProvider } from '@likeminds.community/chat-rn-core/ChatSX/lmOverlayProvider';

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
    // Override onEventTriggered with custom logic
  }

  navigateToGroupDetails(params: NavigateToGroupDetailsParams) {
    // Override navigateToGroupDetails with custom logic
  }
}

const lmChatInterface = new CustomCallbacks();

function App(): React.JSX.Element {
  const [myClient, setMyClient] = useState<any>();
  const [isTrue, setIsTrue] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [userUniqueID, setUserUniqueID] = useState("");
  const [userName, setUserName] = useState("");
  const loginSchemaArray: any = useQuery(LoginSchemaRO);

  useLayoutEffect(() => {
    const userSchema = async () => {
      const loginSchema = loginSchemaArray[0];
      if (loginSchema) {
        setUserName(loginSchema?.userName ?? "");
        setUserUniqueID(loginSchema?.userUniqueID ?? "");
        setApiKey(loginSchema?.apiKey ?? "")

        Credentials.setCredentials(
          loginSchema?.userName,
          loginSchema?.userUniqueID,
          loginSchema?.apiKey
        )
      }
    };
    userSchema();
  }, []);

  useEffect(() => {
    async function generateClient() {
      const res: any = initMyClient([
        ConversationState.MEMBER_LEFT_SECRET_CHATROOM,
      ]);
      setMyClient(res);
    }

    generateClient();
  }, []);

  useEffect(() => {
    if (isTrue) {
      setApiKey(Credentials.apiKey);
      setUserName(Credentials.username);
      setUserUniqueID(Credentials.userUniqueId);
    }
  },[isTrue])


  useEffect(() => {
    const filterStateMessage = [ConversationState.MEMBER_LEFT_SECRET_CHATROOM]; // give type of conversation to be filtered using ConversationState enum

    // proivde apiKey below to initMyClient
    const res: any = initMyClient(filterStateMessage); // pass api key as first param and filterStateMessage array as second
    setMyClient(res);
  }, []);

  useEffect(() => {
    setStyles();
  }, []);

  const callbackClass = new LMCoreCallbacks(
    (accessToken: string, refreshToken: string) => {
      // when accessToken is expired then flow comes here
    },
    async function () {
      // here client should call the initiateApi and return accessToken and refreshToken
      const payload: InitUserWithUuid = {
        userName: userName,
        uuid: userUniqueID,
        apiKey: apiKey,
        isGuest: false,
      };
      const initiateUserResponse = await myClient?.initiateUser(payload);
      const accessToken = initiateUserResponse?.accessToken;
      const refreshToken = initiateUserResponse?.refreshToken;
      return {
        accessToken,
        refreshToken,
      };
    },
  );


  // useEffect(() => {
  //   setApiKey("2a540606-6e83-4fcc-946e-ea479bb3c6a8");
  //   setUserName("myDevice");
  //   setUserUniqueID("myDevice")
  // }, [])


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef} independent={true}>
        {
          apiKey && userName && userUniqueID ?  
          <>
            {Platform.OS === 'ios' ? (
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}>
                <LMOverlayProvider
                  myClient={myClient}
                  userName={userName}
                  userUniqueId={userUniqueID}
                  apiKey={apiKey}
                  profileImageUrl={profileImageUrl}
                  lmChatInterface={lmChatInterface}
                  callbackClass={callbackClass}>
                  <Stack.Navigator>
                    <Stack.Screen name={'Homefeed'} component={HomeFeed} />
                    <Stack.Screen
                      name="SearchInChatroom"
                      component={SearchInChatroomScreen}
                      options={{
                        gestureEnabled: Platform.OS === 'ios' ? false : true,
                        headerShown: false,
                      }}
                    />
                    <Stack.Screen
                      name={'ExploreFeed'}
                      component={ExploreFeed}
                      initialParams={{
                        backIconPath: '',
                        filterIconPath: '',
                        participantsIconPath: '',
                        totalMessagesIconPath: '',
                        joinButtonPath: '',
                        joinedButtonPath: '',
                      }}
                    />
                    <Stack.Screen
                      name={ScreenName.Chatroom}
                      component={ChatroomScreenWrapper}
                      options={{
                        gestureEnabled: Platform.OS === 'ios' ? false : true,
                      }}
                    />
                    <Stack.Screen
                      options={{
                        gestureEnabled: Platform.OS === 'ios' ? false : true,
                      }}
                      name={ScreenName.FileUpload}
                      component={FileUploadScreenWrapper}
                      initialParams={{
                        backIconPath: '', // add your back icon path here
                        imageCropIcon: '', // add your image crop icon path here
                      }}
                    />
                    <Stack.Screen
                      name={ScreenName.VideoPlayer}
                      component={VideoPlayer}
                    />
                    <Stack.Screen
                      options={{ gestureEnabled: false }}
                      name={ScreenName.CarouselScreen}
                      component={CarouselScreen}
                      initialParams={{
                        backIconPath: '', // add your back icon path here
                      }}
                    />
                    <Stack.Screen
                      options={{ gestureEnabled: false }}
                      name={ScreenName.PollResult}
                      component={PollResult}
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
                    <Stack.Screen name={REPORT} component={ReportScreen} />
                    <Stack.Screen name={IMAGE_SCREEN} component={ImageScreen} />
                    <Stack.Screen
                      name={VIEW_PARTICIPANTS}
                      component={ViewParticipants}
                    />
                    <Stack.Screen
                      name={ADD_PARTICIPANTS}
                      component={AddParticipants}
                    />
                    <Stack.Screen
                      name={DM_ALL_MEMBERS}
                      component={DmAllMembers}
                    />
                  </Stack.Navigator>
                </LMOverlayProvider>
              </KeyboardAvoidingView>
            ) : (
              <LMChatBotOverlayProvider
                myClient={myClient}
                lmChatInterface={lmChatInterface}
                callbackClass={callbackClass}>
                <Stack.Navigator>
                  <Stack.Screen name='name' component={HomeScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="ChatBotInitiateScreen" component={LMChatAIBotInitiaitionScreen} options={{ headerShown: false }} />
                  <Stack.Screen name="Chatroom" component={ChatroomScreenWrapper} />
                </Stack.Navigator>
              </LMChatBotOverlayProvider>
            )}
          </> :
          <FetchKeyInputScreen isTrue={isTrue} setTrue={setIsTrue} />
        }
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
