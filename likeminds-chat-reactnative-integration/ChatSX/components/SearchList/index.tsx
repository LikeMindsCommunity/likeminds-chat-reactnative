import { View, Text, Image } from "react-native";
import React from "react";
import { FlashList } from "@shopify/flash-list";
import { TouchableOpacity } from "react-native-gesture-handler";
import { styles } from "../../screens/SearchInChatroom/styles";
import STYLES from "../../constants/Styles";
import { useSearchInChatroomContext } from "../../context/SearchInChatroomContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { CHATROOM } from "../../constants/Screens";
import Highlighter from "../Highlighter";
import { formatSearchDate } from "../../commonFuctions";
import { useAppSelector } from "../../store";

const SearchList = () => {
  const {
    search,
    searchedConversations,
    chatroomId,
    isEmptyResult,
    handleLoadMore,
    renderFooter,
  } = useSearchInChatroomContext();

  const searchInChatroomStyles = STYLES.$SEARCH_IN_CHATROOM;
  const userImageStyles = searchInChatroomStyles?.userImageStyles;
  const userNameStyles = searchInChatroomStyles?.userNameStyles;
  const timeStampStyles = searchInChatroomStyles?.timeStampStyles;
  const searchedHighlightedTextStyle =
    searchInChatroomStyles?.searchedHighlightedTextStyle;
  const searchedNonHighlightedTextStyle =
    searchInChatroomStyles?.searchedNonHighlightedTextStyle;

  const navigation = useNavigation<StackNavigationProp<any>>();
  const { user } = useAppSelector((state) => state.homefeed);
  return (
    <>
      {!isEmptyResult ? (
        <FlashList
          data={searchedConversations}
          estimatedItemSize={15}
          renderItem={({ item }: any) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.pop(1);
                  navigation.navigate(CHATROOM, {
                    isNavigationToSearchedConversation: true,
                    searchedConversation: item,
                    chatroomID: chatroomId,
                  });
                }}
                key={item?.id}
                style={styles.participants}
              >
                <Image
                  source={
                    item?.member.imageUrl
                      ? { uri: item?.member.imageUrl }
                      : require("../../assets/images/default_pic.png")
                  }
                  style={[
                    styles.avatar,
                    userImageStyles ? userImageStyles : null,
                  ]}
                />
                <View style={styles.infoContainer}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      numberOfLines={1}
                      style={[
                        {
                          fontSize: 16,
                          color: "black",
                          fontWeight: "600",
                          flexGrow: 1,
                        },
                        userNameStyles ? userNameStyles : null,
                      ]}
                    >
                      {item?.member?.sdkClientInfo?.uuid ===
                      user?.sdkClientInfo?.uuid
                        ? "You"
                        : item?.member.name}
                    </Text>
                    <Text
                      style={[
                        { color: STYLES.$COLORS.MSG, fontSize: 12 },
                        timeStampStyles ? timeStampStyles : null,
                      ]}
                    >
                      {formatSearchDate(item?.createdAt)}
                    </Text>
                  </View>

                  <Highlighter
                    highlightStyle={[
                      { color: "black", fontWeight: "600" },
                      searchedHighlightedTextStyle
                        ? searchedHighlightedTextStyle
                        : null,
                    ]}
                    style={[
                      { color: STYLES.$COLORS.MSG },
                      searchedNonHighlightedTextStyle
                        ? searchedNonHighlightedTextStyle
                        : null,
                    ]}
                    searchWords={[search]}
                    textToHighlight={item?.answer}
                  />
                </View>
              </TouchableOpacity>
            );
          }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
          keyboardShouldPersistTaps="always"
          keyExtractor={(item: any) => item?.id?.toString()}
        />
      ) : (
        <View style={styles.nothing}>
          <View style={[styles.justifyCenter]}>
            <Image
              style={styles.nothingImg}
              source={require("../../assets/images/nothing3x.png")}
            />
            <Text style={styles.title}>{"No results found"}</Text>
            <Text style={styles.secondaryTitle}>
              {"Try changing search query"}
            </Text>
          </View>
        </View>
      )}
    </>
  );
};

export default SearchList;
