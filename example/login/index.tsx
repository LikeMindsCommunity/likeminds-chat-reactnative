import React, {useEffect, useState} from 'react';
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
import {Credentials} from './credentials';
import {useRealm} from '@realm/react';
import {LoginSchemaRO} from './loginSchemaRO';
import {UpdateMode} from 'realm';
import {STYLES} from '@likeminds.community/chat-rn-core';

interface ChildProps {
  isTrue: boolean;
  setIsTrue: (isTrue: boolean) => void;
}

const FetchKeyInputScreen: React.FC<ChildProps> = ({isTrue, setIsTrue}) => {
  const [userUniqueID, setUserUniqueID] = useState('');
  const [userName, setUserName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const realm = useRealm();

  const handleAddNotes = (
    userUniqueID: string,
    userName: string,
    apiKey: string,
  ) => {
    Credentials.setCredentials(userName, userUniqueID, apiKey);
  };

  useEffect(() => {
    if (userUniqueID && userName && apiKey && isButtonClicked) {
      return setIsTrue(!isTrue);
    }
  }, [isButtonClicked]);

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

  const handleButtonPress = () => {
    // Perform some action when the button is pressed
    // You can access the input values from input1 and input2 variables
    handleAddNotes(userUniqueID, userName, apiKey);

    saveLoginData();

    userUniqueID && userName && apiKey
      ? setIsButtonClicked(true)
      : setIsButtonClicked(false);

    if (userUniqueID && userName && apiKey) {
      Keyboard.dismiss();
    }
  };

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
          userUniqueID && userName && apiKey ? handleButtonPress : () => {}
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
