import {View, Text, Image, TextInput} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  STYLES,
  useSearchInChatroomContext,
} from '@likeminds.community/chat-rn-core';
import {styles} from '@likeminds.community/chat-rn-core/ChatSX/screens/SearchInChatroom/styles';

const CustomSearchHeader = () => {
  const {search, setSearch, setSearchedConversations, inputRef} =
    useSearchInChatroomContext();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const searchInChatroomStyles = STYLES.$SEARCH_IN_CHATROOM;
  const backArrowColor = searchInChatroomStyles?.backArrowColor;
  const crossIconColor = searchInChatroomStyles?.crossIconColor;
  const searchPlaceholderTextColor =
    searchInChatroomStyles?.searchPlaceholderTextColor;
  const searchText = searchInChatroomStyles?.searchText;

  return (
    <View style={styles.headingContainer}>
      <TouchableOpacity
        onPress={() => {
          setSearch('');
          navigation.goBack();
        }}>
        {/* <Image
          source={require('../../assets/images/normal_back_arrow3x.png')}
          style={[
            styles.backBtn,
            {tintColor: 'yellow'}
          ]}
        /> */}
      </TouchableOpacity>
      <View style={{flex: 1}}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          style={[styles.input, searchText ? searchText : null]}
          placeholder={'Search...'}
          placeholderTextColor={
            searchPlaceholderTextColor ? searchPlaceholderTextColor : '#aaa'
          }
          ref={inputRef}
        />
      </View>

      {search && (
        <TouchableOpacity
          onPress={() => {
            setSearch('');
            setSearchedConversations([]);
          }}>
          {/* <Image
            source={require('../../assets/images/cross_icon3x.png')}
            style={[
              styles.closeIcon,
              crossIconColor ? {tintColor: crossIconColor} : null,
            ]}
          /> */}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CustomSearchHeader;
