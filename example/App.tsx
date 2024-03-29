/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
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
} from '@likeminds.community/chat-rn-core';
import {myClient} from '.';
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
  const userName = '';
  const userUniqueId = '';
  const chatroomId = '';
  const profileImageUrl = '';

  useEffect(() => {
    setStyles();
  }, []);

  return (
    <>
      {Platform.OS === 'ios' ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <LMOverlayProvider
            myClient={myClient}
            userName={userName}
            userUniqueId={userUniqueId}
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
                <Stack.Screen name={DM_ALL_MEMBERS} component={DmAllMembers} />
              </Stack.Navigator>
            </NavigationContainer>
          </LMOverlayProvider>
        </KeyboardAvoidingView>
      ) : (
        <LMOverlayProvider
          myClient={myClient}
          userName={userName}
          userUniqueId={userUniqueId}
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
                options={{gestureEnabled: Platform.OS === 'ios' ? false : true}}
                // initialParams={{
                //   chatroomID: chatroomId,
                //   isInvited: false,
                // }}
              />
              <Stack.Screen
                options={{gestureEnabled: Platform.OS === 'ios' ? false : true}}
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
              <Stack.Screen name={DM_ALL_MEMBERS} component={DmAllMembers} />
            </Stack.Navigator>
          </NavigationContainer>
        </LMOverlayProvider>
      )}
    </>
  );
}

export default App;
