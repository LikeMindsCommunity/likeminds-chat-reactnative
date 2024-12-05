import { View, Text, Pressable } from "react-native";
import React from "react";
import { styles } from "../InputBox/styles";
import { FlashList } from "@shopify/flash-list";
import { LMChatAnalytics } from "../../analytics/LMChatAnalytics";
import { Events, Keys } from "../../enums";
import { replaceLastMention } from "../../commonFuctions";
import { LMChatIcon, LMChatTextView } from "../../uiComponents";
import Layout from "../../constants/Layout";
import STYLES from "../../constants/Styles";
import { useInputBoxContext } from "../../context/InputBoxContext";

const UserTaggingList = () => {
  const {
    userTaggingList,
    isUserTagging,
    isUploadScreen,
    userTaggingListHeight,
    groupTags,
    chatroomName,
    message,
    taggedUserName,
    setMessage,
    setUserTaggingList,
    setGroupTags,
    setIsUserTagging,
    isIOS,
    handleLoadMore,
    renderFooter,
  } = useInputBoxContext();
  return (
    <View>
      {userTaggingList && isUserTagging ? (
        <View
          style={[
            styles.taggableUsersBox,
            {
              backgroundColor: isUploadScreen ? "black" : "white",
              height: userTaggingListHeight,
            },
          ]}
        >
          <FlashList
            data={[...groupTags, ...userTaggingList]}
            renderItem={({ item, index }: any) => {
              const description = item?.description;
              const imageUrl = item?.imageUrl;
              return (
                <Pressable
                  onPress={() => {
                    const uuid = item?.sdkClientInfo?.uuid;
                    const userName = item?.name;
                    const communityId = item?.sdkClientInfo?.community;
                    LMChatAnalytics.track(
                      Events.USER_TAGS_SOMEONE,
                      new Map<string, string>([
                        [Keys.COMMUNITY_ID, communityId?.toString()],
                        [Keys.CHATROOM_NAME, chatroomName?.toString()],
                        [Keys.TAGGED_USER_ID, uuid?.toString()],
                        [Keys.TAGGED_USER_NAME, userName?.toString()],
                      ])
                    );
                    const res = replaceLastMention(
                      message,
                      taggedUserName,
                      item?.name,
                      uuid ? `user_profile/${uuid}` : uuid
                    );
                    setMessage(res);
                    setUserTaggingList([]);
                    setGroupTags([]);
                    setIsUserTagging(false);
                  }}
                  style={styles.taggableUserView}
                >
                  {imageUrl ? (
                    <LMChatIcon iconUrl={imageUrl} iconStyle={styles.avatar} />
                  ) : (
                    <LMChatIcon
                      assetPath={require("../../assets/images/default_pic.png")}
                      iconStyle={styles.avatar}
                    />
                  )}
                  <View
                    style={[
                      styles.infoContainer,
                      {
                        borderBottomWidth: Layout.normalize(0.2),
                        gap: isIOS ? Layout.normalize(5) : 0,
                      },
                    ]}
                  >
                    <LMChatTextView
                      textStyle={{
                        ...styles.title,
                        color: isUploadScreen
                          ? STYLES.$COLORS.TERTIARY
                          : STYLES.$COLORS.PRIMARY,
                      }}
                      maxLines={1}
                    >
                      {item?.name}
                    </LMChatTextView>
                    {description ? (
                      <LMChatTextView
                        textStyle={{
                          ...styles.subTitle,
                          color: isUploadScreen
                            ? STYLES.$COLORS.TERTIARY
                            : STYLES.$COLORS.PRIMARY,
                        }}
                        maxLines={1}
                      >
                        {description}
                      </LMChatTextView>
                    ) : null}
                  </View>
                </Pressable>
              );
            }}
            extraData={{
              value: [message, userTaggingList],
            }}
            estimatedItemSize={50}
            keyboardShouldPersistTaps={"handled"}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={1}
            bounces={false}
            ListFooterComponent={renderFooter}
            keyExtractor={(item: any, index) => {
              return index?.toString();
            }}
          />
        </View>
      ) : null}
    </View>
  );
};

export default UserTaggingList;
