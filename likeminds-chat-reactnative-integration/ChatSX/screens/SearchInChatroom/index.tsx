import {
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { styles } from "./styles";
import { Client } from "../../client";
import { FlashList } from "@shopify/flash-list";
import Highlighter from "../../components/Highlighter";
import { CHATROOM } from "../../constants/Screens";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatSearchDate } from "../../commonFuctions";
import STYLES from "../../constants/Styles";
import Layout from "../../constants/Layout";

const SearchInChatroom = ({ navigation, route }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmptyResult, setIsEmptyResult] = useState(false);
  const [page, setPage] = useState(1);
  const [searchedConversations, setSearchedConversations] = useState<any>([]);
  const [search, setSearch] = useState("");
  const inputRef = useRef<TextInput>(null);
  const { chatroomId } = route?.params;
  const page_size = 20;

  const setOptions = () => {
    navigation.setOptions({
      title: "",
      headerShadowVisible: false,
    });
  };

  useEffect(() => {
    setOptions();
  }, [search]);

  useEffect(() => {
    // Focus the input box when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const searchConversation = async () => {
    const payload = {
      chatroomId: chatroomId,
      search: search,
      followStatus: true,
      page: 1,
      pageSize: page_size,
    };
    const response = await Client.myClient.searchConversation(payload);
    const conversations = response?.data?.conversations;
    if (conversations && conversations?.length > 0) {
      setIsEmptyResult(false);
      setSearchedConversations(conversations);
    } else if (!search) {
      setSearchedConversations([]);
    } else {
      setSearchedConversations([]);
      setIsEmptyResult(true);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (search || searchedConversations?.length > 0) {
        searchConversation();
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [search]);

  async function updateData(newPage: number) {
    const payload = {
      chatroomId: chatroomId,
      search: search,
      followStatus: true,
      page: newPage,
      pageSize: page_size,
    };
    const response = await Client.myClient.searchConversation(payload);
    return response?.data;
  }

  const loadData = async (newPage: number) => {
    setIsLoading(true);
    const res = await updateData(newPage);
    if (res) {
      setSearchedConversations([
        ...searchedConversations,
        ...res?.conversations,
      ]);
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!isLoading) {
      const arr = searchedConversations;
      if (
        arr?.length % page_size === 0 &&
        arr?.length > 0 &&
        arr?.length === page_size * page
      ) {
        const newPage = page + 1;
        loadData(newPage);
        setPage(newPage);
      }
    }
  };

  const renderFooter = () => {
    return isLoading ? (
      <View style={{ paddingVertical: Layout.normalize(20) }}>
        <ActivityIndicator size="large" color={STYLES.$COLORS.SECONDARY} />
      </View>
    ) : null;
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#f8f8f8",
        marginTop: Platform.OS === "ios" ? -10 : 0,
      }}
    >
      {/* Header */}
      <View style={styles.headingContainer}>
        <TouchableOpacity
          onPress={() => {
            setSearch("");
            navigation.goBack();
          }}
        >
          <Image
            source={require("../../assets/images/back_arrow3x.png")}
            style={styles.backBtn}
          />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            style={[styles.input]}
            placeholder={"Search..."}
            placeholderTextColor="#aaa"
            ref={inputRef}
          />
        </View>

        {search && (
          <TouchableOpacity
            onPress={() => {
              setSearch("");
              setSearchedConversations([]);
            }}
          >
            <Image
              source={require("../../assets/images/cross_icon3x.png")}
              style={styles.closeIcon}
            />
          </TouchableOpacity>
        )}
      </View>

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
                  style={styles.avatar}
                />
                <View style={styles.infoContainer}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      // style={
                      //   [
                      //     styles.title,
                      //     userNameStyles?.color && {
                      //       color: userNameStyles?.color,
                      //     },
                      //     userNameStyles?.fontSize && {
                      //       fontSize: userNameStyles?.fontSize,
                      //     },
                      //     userNameStyles?.fontFamily && {
                      //       fontFamily: userNameStyles?.fontFamily,
                      //     },
                      //   ] as TextStyle
                      // }
                      numberOfLines={1}
                      style={{
                        fontSize: 16,
                        color: "black",
                        fontWeight: "600",
                        flexGrow: 1,
                      }}
                    >
                      {item?.member.name}
                    </Text>
                    <Text style={{ color: STYLES.$COLORS.MSG, fontSize: 12 }}>
                      {formatSearchDate(item?.createdAt)}
                    </Text>
                  </View>

                  <Highlighter
                    // style={
                    //   [
                    //     styles.title,
                    //     userNameStyles?.color && {
                    //       color: userNameStyles?.color,
                    //     },
                    //     userNameStyles?.fontSize && {
                    //       fontSize: userNameStyles?.fontSize,
                    //     },
                    //     userNameStyles?.fontFamily && {
                    //       fontFamily: userNameStyles?.fontFamily,
                    //     },
                    //   ] as TextStyle
                    // }
                    // numberOfLines={1}
                    highlightStyle={{ color: "black", fontWeight: "600" }}
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
          keyExtractor={(item: any) => item?.id?.toString()}
        />
      ) : (
        <View style={styles.nothing}>
          <View style={[styles.justifyCenter]}>
            <Image
              style={styles.nothingImg}
              source={require("../../assets/images/nothing3x.png")}
            />
            <Text style={styles.title}>{"No result found"}</Text>
            <Text style={styles.secondaryTitle}>
              {"Try changing search query"}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SearchInChatroom;
