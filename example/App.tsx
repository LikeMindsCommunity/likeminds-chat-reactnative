/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {navigationRef} from './RootNavigation';
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
} from '@likeminds.community/chat-rn-core';
import ChatroomScreenWrapper from './screens/Chatroom/ChatroomScreenWrapper';
import {setStyles} from './styles';
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
import {useQuery} from '@realm/react';
import {Credentials} from './login/credentials';
import {LoginSchemaRO} from './login/loginSchemaRO';
import FetchKeyInputScreen from './login';
import {ConversationState} from '@likeminds.community/chat-rn';

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
  const chatroomId = '';
  const profileImageUrl = '';
  const [users, setUsers] = useState<any>();
  const [apiKey, setApiKey] = useState(
    Credentials?.apiKey?.length > 0 ? Credentials?.apiKey : users?.apiKey,
  );
  const [userUniqueID, setUserUniqueID] = useState(
    Credentials?.userUniqueId?.length > 0
      ? Credentials.userUniqueId
      : users?.userUniqueID,
  );
  const [userName, setUserName] = useState(
    Credentials?.username?.length > 0 ? Credentials?.username : users?.userName,
  );
  const [myClient, setMyClient] = useState();
  const [isTrue, setIsTrue] = useState(true);
  const loginSchemaArray: any = useQuery(LoginSchemaRO);

  useEffect(() => {
    const userSchema = async () => {
      const loginSchema = loginSchemaArray[0];
      if (loginSchema) {
        Credentials.setCredentials(
          loginSchema?.userName,
          loginSchema?.userUniqueID,
          loginSchema?.apiKey,
        );
        setUsers(loginSchema);
      }
    };
    userSchema();
  }, [isTrue]);

  useEffect(() => {
    setUserName(
      Credentials?.username?.length > 0
        ? Credentials?.username
        : users?.userName,
    );
    setUserUniqueID(
      Credentials?.userUniqueId?.length > 0
        ? Credentials.userUniqueId
        : users?.userUniqueID,
    );
    setApiKey(
      Credentials?.apiKey?.length > 0 ? Credentials?.apiKey : users?.apiKey,
    );
  }, [users, isTrue]);

  useEffect(() => {
    if (apiKey) {
      const filterStateMessage = [
        ConversationState.MEMBER_LEFT_SECRET_CHATROOM,
      ]; // give type of conversation to be filtered using ConversationState enum

      // proivde apiKey below to initMyClient
      const res: any = initMyClient(apiKey, filterStateMessage); // pass api key as first param and filterStateMessage array as second
      setMyClient(res);
    }
  }, [isTrue, apiKey]);

  // const themeStyles = {
  //   fontTypes: {
  //     LIGHT: 'SofiaPro-Light',
  //     MEDIUM: 'SofiaPro-Medium',
  //     SEMI_BOLD: 'SofiaPro-SemiBold',
  //     BOLD: 'SofiaPro-Bold',
  //     BLACK: 'SofiaPro-Black',
  //   },
  // };

  const themeStyles = {
    // fontColor: 'black',
    // primaryColor: '#B7D340',
    // secondaryColor: '#B7D340',
    // lightBackgroundColor: 'hsl(161, 67%, 91%)',
    fontTypes: {
      LIGHT: 'SofiaPro-Light',
      MEDIUM: 'SofiaPro-Medium',
      SEMI_BOLD: 'SofiaPro-SemiBold',
      BOLD: 'SofiaPro-Bold',
      BLACK: 'SofiaPro-Black',
    },
  };

  useEffect(() => {
    STYLES.setTheme(themeStyles);
  }, []);

  return (
    <>
      {userName && userUniqueID && apiKey && myClient ? (
        <>
          {Platform.OS === 'ios' ? (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{flex: 1}}>
              <LMOverlayProvider
                myClient={myClient}
                userName={userName}
                userUniqueId={userUniqueID}
                profileImageUrl={profileImageUrl}
                lmChatInterface={lmChatInterface}>
                <NavigationContainer ref={navigationRef} independent={true}>
                  <Stack.Navigator initialRouteName={'Homefeed'}>
                    <Stack.Screen name={'Homefeed'} component={HomeFeed} />
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
                      name="Chatroom"
                      component={ChatroomScreenWrapper}
                      options={{
                        gestureEnabled: Platform.OS === 'ios' ? false : true,
                      }}
                      // initialParams={{
                      //   chatroomID: chatroomId,
                      //   isInvited: false,
                      // }}
                    />
                    <Stack.Screen
                      options={{
                        gestureEnabled: Platform.OS === 'ios' ? false : true,
                      }}
                      name={'FileUpload'}
                      component={FileUploadScreenWrapper}
                      initialParams={{
                        backIconPath: '', // add your back icon path here
                        imageCropIcon: '', // add your image crop icon path here
                      }}
                    />
                    <Stack.Screen
                      name={'VideoPlayer'}
                      component={VideoPlayer}
                    />
                    <Stack.Screen
                      options={{gestureEnabled: false}}
                      name={'CarouselScreen'}
                      component={CarouselScreen}
                      initialParams={{
                        backIconPath: '', // add your back icon path here
                      }}
                    />
                    <Stack.Screen
                      options={{gestureEnabled: false}}
                      name={'PollResult'}
                      component={PollResult}
                    />
                    <Stack.Screen
                      name={'CreatePollScreen'}
                      component={CreatePollScreen}
                    />
                    <Stack.Screen
                      options={{headerShown: false}}
                      name={'ImageCropScreen'}
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
                </NavigationContainer>
              </LMOverlayProvider>
            </KeyboardAvoidingView>
          ) : (
            <LMOverlayProvider
              myClient={myClient}
              userName={userName}
              userUniqueId={userUniqueID}
              profileImageUrl={profileImageUrl}
              lmChatInterface={lmChatInterface}>
              <NavigationContainer ref={navigationRef} independent={true}>
                <Stack.Navigator initialRouteName={'Homefeed'}>
                  <Stack.Screen name={'Homefeed'} component={HomeFeed} />
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
                    name="Chatroom"
                    component={ChatroomScreenWrapper}
                    options={{
                      gestureEnabled: Platform.OS === 'ios' ? false : true,
                    }}
                    // initialParams={{
                    //   chatroomID: chatroomId,
                    //   isInvited: false,
                    // }}
                  />
                  <Stack.Screen
                    options={{
                      gestureEnabled: Platform.OS === 'ios' ? false : true,
                    }}
                    name={'FileUpload'}
                    component={FileUploadScreenWrapper}
                    initialParams={{
                      backIconPath: '', // add your back icon path here
                      imageCropIcon: '', // add your image crop icon path here
                    }}
                  />
                  <Stack.Screen name={'VideoPlayer'} component={VideoPlayer} />
                  <Stack.Screen
                    options={{gestureEnabled: false}}
                    name={'CarouselScreen'}
                    component={CarouselScreen}
                    initialParams={{
                      backIconPath: '', // add your back icon path here
                    }}
                  />
                  <Stack.Screen
                    options={{gestureEnabled: false}}
                    name={'PollResult'}
                    component={PollResult}
                  />
                  <Stack.Screen
                    name={'CreatePollScreen'}
                    component={CreatePollScreen}
                  />
                  <Stack.Screen
                    options={{headerShown: false}}
                    name={'ImageCropScreen'}
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
              </NavigationContainer>
            </LMOverlayProvider>
          )}
        </>
      ) : !userName && !userUniqueID && !apiKey ? (
        <FetchKeyInputScreen isTrue={isTrue} setIsTrue={setIsTrue} />
      ) : null}
    </>
  );
}

export default App;
