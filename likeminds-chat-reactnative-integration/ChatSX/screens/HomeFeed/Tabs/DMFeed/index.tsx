import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import HomeFeedItem from "../../../../components/HomeFeedItem";
import { useAppSelector } from "../../../../store";
import styles from "./styles";
import { DM_ALL_MEMBERS } from "../../../../constants/Screens";
import {
  DM_INFO,
  NEW_MESSAGE_BTN_TEXT,
  NO_DM,
  NO_DM_TEXT,
} from "../../../../constants/Strings";
import { FlashList } from "@shopify/flash-list";
import LinearGradient from "react-native-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import Layout from "../../../../constants/Layout";
import {
  DmFeedContextProvider,
  useDmFeedContext,
} from "../../../../context/DmFeedContextProvider";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

interface Props {
  navigation: any;
}

const DMFeed = () => {
  return (
    <DmFeedContextProvider>
      <DMFeedComponent />
    </DmFeedContextProvider>
  );
};

const DMFeedComponent = () => {
  const {
    dmFeedChatrooms,
    shimmerIsLoading,
    showDM,
    showList,
    renderFooter,
    handleLoadMore,
  } = useDmFeedContext();
  const user = useAppSelector((state) => state.homefeed.user);
  const navigation = useNavigation<StackNavigationProp<any>>();
  return (
    <View style={styles.page}>
      {dmFeedChatrooms?.length === 0 ? (
        <View style={styles.nothingDM}>
          <View style={[styles.justifyCenter]}>
            <Image
              style={styles.nothingImg}
              source={require("../../../../assets/images/nothing3x.png")}
            />
            <Text style={styles.title}>{NO_DM}</Text>
            <Text style={styles.subTitle}>{NO_DM_TEXT}</Text>

            <Pressable
              onPress={() => {
                navigation.navigate(DM_ALL_MEMBERS, { showList: showList });
              }}
              style={({ pressed }) => [
                { opacity: pressed ? 0.5 : 1.0 },
                styles.nothingFab,
              ]}
            >
              <Image
                style={styles.fabImg}
                source={require("../../../../assets/images/new_message_icon3x.png")}
              />
              <Text style={styles.text}>{NEW_MESSAGE_BTN_TEXT}</Text>
            </Pressable>
          </View>

          <Text
            style={[
              styles.subTitle,
              {
                marginBottom: Layout.normalize(30),
                paddingHorizontal: Layout.normalize(10),
              },
            ]}
          >
            {DM_INFO}
          </Text>
        </View>
      ) : shimmerIsLoading ? (
        <>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: Layout.normalize(50),
            }}
          >
            <View
              style={{
                width: "20%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ShimmerPlaceHolder
                style={{
                  width: Layout.normalize(50),
                  alignItmes: "center",
                  justifyContent: "center",
                  borderRadius: Layout.normalize(50),
                  height: Layout.normalize(50),
                }}
              />
            </View>
            <View style={{ width: "100%" }}>
              <ShimmerPlaceHolder style={{ width: "70%" }} />
              <ShimmerPlaceHolder
                style={{ marginTop: Layout.normalize(10), width: "50%" }}
              />
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: Layout.normalize(50),
            }}
          >
            <View
              style={{
                width: "20%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ShimmerPlaceHolder
                style={{
                  width: Layout.normalize(50),
                  alignItmes: "center",
                  justifyContent: "center",
                  borderRadius: Layout.normalize(50),
                  height: Layout.normalize(50),
                }}
              />
            </View>
            <View style={{ width: "100%" }}>
              <ShimmerPlaceHolder style={{ width: "70%" }} />
              <ShimmerPlaceHolder
                style={{ marginTop: Layout.normalize(10), width: "50%" }}
              />
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: Layout.normalize(50),
            }}
          >
            <View
              style={{
                width: "20%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ShimmerPlaceHolder
                style={{
                  width: Layout.normalize(50),
                  alignItmes: "center",
                  justifyContent: "center",
                  borderRadius: Layout.normalize(50),
                  height: Layout.normalize(50),
                }}
              />
            </View>
            <View style={{ width: "100%" }}>
              <ShimmerPlaceHolder style={{ width: "70%" }} />
              <ShimmerPlaceHolder
                style={{ marginTop: Layout.normalize(10), width: "50%" }}
              />
            </View>
          </View>
        </>
      ) : (
        <FlashList
          data={dmFeedChatrooms}
          extraData={{
            value: [user, dmFeedChatrooms],
          }}
          estimatedItemSize={15}
          renderItem={({ item }: any) => {
            const userTitle =
              user?.id == item?.chatroomWithUserId
                ? item?.member?.name
                : item?.chatroomWithUser?.name;
            const deletedBy =
              item?.lastConversation?.deletedByUserId !== null
                ? item?.lastConversation?.deletedByUserId
                : item?.lastConversation?.deletedBy;
            const homeFeedProps = {
              title: userTitle,
              avatar: item?.chatroomImageUrl!,
              lastMessage: item?.lastConversation?.answer !=null ? item?.lastConversation?.answer : item?.lastSeenConversation?.answer,
              lastMessageUser: item?.lastConversation?.member?.name !=null ? item?.lastConversation?.member?.name : item?.lastSeenConversation?.member?.name,
              time: item?.lastConversation?.createdAt !=null ? item?.lastConversation?.createdAt : item?.lastSeenConversation?.createdAt,
              unreadCount: item?.unseenCount!,
              pinned: false,
              lastConversation: item?.lastConversation != null ? item?.lastConversation : item?.lastSeenConversation,
              lastConversationMember: item?.lastConversation?.member?.name != null ? item?.lastConversation?.member?.name :item?.lastSeenConversation?.member?.name ,
              chatroomID: item?.id!,
              isSecret: item?.isSecret,
              deletedBy: item?.lastConversation == null ? item?.lastSeenConversation?.deletedByUserId !== null
              ? item?.lastSeenConversation?.deletedByUserId
              : item?.lastSeenConversation?.deletedBy : deletedBy,
              conversationDeletor:
                item?.lastConversation?.deletedByMember?.sdkClientInfo?.uuid != null ? item?.lastConversation?.deletedByMember?.sdkClientInfo?.uuid : 
                item?.lastSeenConversation?.deletedByMember?.sdkClientInfo?.uuid,
              conversationCreator:
                item?.lastConversation?.member?.sdkClientInfo?.uuid != null ? item?.lastConversation?.member?.sdkClientInfo?.uuid :item?.lastSeenConversation?.member?.sdkClientInfo?.uuid,
              conversationDeletorName:
                item?.lastConversation?.deletedByMember?.name != null ? item?.lastConversation?.deletedByMember?.name : item?.lastSeenConversation?.deletedByMember?.name ,
              inviteReceiver: item?.inviteReceiver,
              chatroomType: item?.type,
              muteStatus: item?.muteStatus,
              item
            };
            return <HomeFeedItem {...homeFeedProps} />;
          }}
          onLoad={handleLoadMore}
          ListFooterComponent={renderFooter}
          keyExtractor={(item: any) => item?.id?.toString()}
        />
      )}
      {showDM && dmFeedChatrooms?.length > 0 ? (
        <Pressable
          onPress={() => {
            navigation.navigate(DM_ALL_MEMBERS, { showList: showList });
          }}
          style={({ pressed }) => [
            { opacity: pressed ? 0.5 : 1.0 },
            styles.fab,
          ]}
        >
          <Image
            style={styles.fabImg}
            source={require("../../../../assets/images/new_message_icon3x.png")}
          />
          <Text style={styles.text}>{NEW_MESSAGE_BTN_TEXT}</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

export default DMFeed;
