/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {KeyboardAvoidingView, Platform, StatusBar, View} from 'react-native';
import {
  NavigationContainer,
  createNavigationContainerRef,
  StackActions,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {navigationRef} from './RootNavigation';
import {
  CarouselScreen,
  ChatRoom,
  CreatePollScreen,
  FileUpload,
  ImageCropScreen,
  LMChatProvider,
  PollResult,
  VideoPlayer,
  LMOverlayProvider,
  RadialGradient,
} from 'likeminds_chat_reactnative_integration';
import {myClient} from '.';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const userName = '';
  const userUniqueId = '';
  const chatroomId = '';
  const announcementRoomId = '';
  const cohortId = '';

  // themeStyling
  // const themeStyles = {
  //   hue: 10,
  //   fontColor: 'black',
  //   primaryColor: 'green',
  //   secondaryColor: 'green',
  //   lightBackgroundColor: '#d7f7ed',
  // };

  // styling for reactionList
  // const reactionListStyles = {
  //   reactionSize: 0,
  //   reactionLeftItemStroke: 'pink',
  //   reactionRightItemStroke: 'yellow',
  //   reactionItemBorderRadius: 5,
  //   gap: 5,
  // };

  // styling for chatBubble
  // const chatBubbleStyles = {
  //   borderRadius: 5,
  //   sentMessageBackgroundColor: 'yellow',
  //   receivedMessageBackgroundColor: 'pink',
  //   selectedBackgroundColor: 'grey',
  //   selectedMessageBackgroundColor: 'purple',
  //   textStyles: {
  //     fontSize: 10,
  //     fontStyle: 'italic',
  //     fontFamily: 'SofiaPro-SemiBold',
  //   },
  //   linkTextColor: 'red',
  //   taggingTextColor: 'yellow',
  //   stateMessagesBackgroundColor: 'pink',
  //   stateMessagesTextStyles: {
  //     fontSize: 10,
  //     fontStyle: 'italic',
  //     fontFamily: 'SofiaPro-SemiBold',
  //   },
  // };

  // styling for inputBox
  // const inputBoxStyles = {
  //   placeholderTextColor: '#aaa',
  //   selectionColor: '#aaa',
  //   partsTextStyle: {
  //     color: '#007AFF',
  //   },
  //   sendIconStyles: {
  //     width: 22,
  //     height: 22,
  //     resizeMode: 'contain',
  //     marginLeft: 5,
  //   },
  //   attachmentIconStyles: {
  //     width: 22,
  //     height: 22,
  //     resizeMode: 'contain',
  //   },
  //   micIconStyles: {
  //     width: 22,
  //     height: 22,
  //     resizeMode: 'contain',
  //   },
  //   cameraIconStyles: {
  //     width: 22,
  //     height: 22,
  //     resizeMode: 'contain',
  //   },
  //   galleryIconStyles: {
  //     width: 22,
  //     height: 22,
  //     resizeMode: 'contain',
  //   },
  //   documentIconStyles: {
  //     width: 22,
  //     height: 22,
  //     resizeMode: 'contain',
  //   },
  //   pollIconStyles: {
  //     width: 22,
  //     height: 22,
  //     resizeMode: 'contain',
  //   },
  // };

  const gradientStyling = {
    colors: ['#3BA773', '#0B713F'],
    style: {flex: 1},
  };

  return (
    <LMOverlayProvider
      myClient={myClient}
      userName={userName}
      userUniqueId={userUniqueId}
      cohortId={cohortId}
      // chatBubbleStyles={chatBubbleStyles}
      // reactionListStyles={reactionListStyles}
      // inputBoxStyles={inputBoxStyles}
      // themeStyles={themeStyles}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <NavigationContainer ref={navigationRef} independent={true}>
          <Stack.Navigator>
            <Stack.Screen
              name="ChatRoom"
              component={ChatRoom}
              initialParams={{
                chatroomID: chatroomId,
                announcementRoomId: announcementRoomId,
              }}
              options={() => {
                if (Object.keys(gradientStyling).length !== 0) {
                  return {
                    headerBackground: () => (
                      <View style={{flex: 1}}>
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
              options={{gestureEnabled: Platform.OS === 'ios' ? false : true}}
              name={'FileUpload'}
              component={FileUpload}
            />
            <Stack.Screen name={'VideoPlayer'} component={VideoPlayer} />
            <Stack.Screen
              options={{gestureEnabled: false}}
              name={'CarouselScreen'}
              component={CarouselScreen}
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
          </Stack.Navigator>
        </NavigationContainer>
      </KeyboardAvoidingView>
    </LMOverlayProvider>
  );
}

export default App;
