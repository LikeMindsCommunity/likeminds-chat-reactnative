/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
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
} from 'likeminds_chat_reactnative_integration';
import {RealmProvider} from '@realm/react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {UserSchemaRO} from './UserSchema';
import {Provider as ReduxProvider} from 'react-redux';
import {myClient} from '.';
import {store} from 'likeminds_chat_reactnative_integration';
// import {LMChatProvider} from './LMChatProvider';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  console.log('myClientgenerated', myClient);

  return (
    <ReduxProvider store={store}>
      <LMChatProvider myClient={myClient}>
        <NavigationContainer ref={navigationRef} independent={true}>
          <Stack.Navigator>
            <Stack.Screen
              name="ChatRoom"
              component={ChatRoom}
              initialParams={{
                chatroomID: '87584',
                isInvited: false,
                myClient: myClient,
              }}
            />
            <Stack.Screen
              options={{gestureEnabled: Platform.OS === 'ios' ? false : true}}
              name={'FileUpload'}
              component={FileUpload}
            />
            {/* <Stack.Screen name={VIDEO_PLAYER} component={VideoPlayer} /> */}
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
              // options={{headerShown: false, gestureEnabled: false}}
              name={'CreatePollScreen'}
              component={CreatePollScreen}
            />
            {/* <Stack.Screen
              options={{headerShown: false}}
              name={'ImageCropScreen'}
              component={ImageCropScreen}
            /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </LMChatProvider>
    </ReduxProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
