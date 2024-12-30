import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Credentials } from './credentials';
import { useQuery, useRealm } from '@realm/react';
import { LoginSchemaRO } from './loginSchemaRO';
import { UpdateMode } from 'realm';
import { STYLES } from '@likeminds.community/chat-rn-core';
import LMChatAIButton from '@likeminds.community/chat-rn-core/ChatSX/components/LMChatAIButton';

interface ChildProps {
  myClient?: any;
  callbackClass?: any;
  isTrue: boolean;
  setTrue: any
}

const FetchKeyInputScreen: React.FC<ChildProps> = ({isTrue, setTrue, myClient, callbackClass }) => {
  const [userUniqueID, setUserUniqueID] = useState('');
  const [userName, setUserName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const realm = useRealm();

  const saveLoginData = () => {
    realm.write(() => {
      realm.create(
        LoginSchemaRO,
        {
          id: 'LoginSchema',
          userUniqueID: userUniqueID,
          userName: userName,
          apiKey: apiKey,
        },
        UpdateMode.All,
      );
    });
  };

  const handleButtonPress = async () => {
    if(userName && apiKey && userUniqueID) {
      saveLoginData();
      Credentials.setCredentials(userName, userUniqueID, apiKey);
      setTrue(true);
    }
  }


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Api Key"
        placeholderTextColor={'grey'}
        value={apiKey}
        onChangeText={text => setApiKey(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="User unique ID"
        placeholderTextColor={'grey'}
        value={userUniqueID}
        onChangeText={text => setUserUniqueID(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="User Name"
        value={userName}
        onChangeText={text => setUserName(text)}
        placeholderTextColor={'grey'}
      />
      <TouchableOpacity
        style={{
          backgroundColor:
            userUniqueID && userName && apiKey
              ? STYLES.$COLORS.SECONDARY
              : STYLES.$COLORS.JOINED_BTN,
          padding: 10,
          borderRadius: 10,
        }}
        onPress={
          userUniqueID && userName && apiKey ? handleButtonPress : () => { }
        }>
        <Text
          style={{
            color: STYLES.$COLORS.TERTIARY,
            fontSize: STYLES.$FONT_SIZES.XL,
            fontFamily: STYLES.$FONT_TYPES.LIGHT,
          }}>
          Submit
        </Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: 'black',
  },
});

export default FetchKeyInputScreen;
