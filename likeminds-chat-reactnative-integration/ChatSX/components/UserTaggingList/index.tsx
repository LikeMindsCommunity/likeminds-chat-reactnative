import { View, Text, Pressable ,StyleSheet} from "react-native";
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

const UserTaggingList = ({
  onUserTaggingClickedProp,
}: {
  onUserTaggingClickedProp?: ({
    uuid,
    userName,
    communityId,
    mentionUsername,
  }: {
    uuid: string;
    userName: string;
    communityId: string;
    mentionUsername: string;
  }) => void;
}) => {
  const {
    userTaggingList,
    isUserTagging,
    isUploadScreen,
    userTaggingListHeight,
    groupTags,
    message,
    handleLoadMore,
    renderFooter,
    onUserTaggingClicked,
    inputBoxStyles,
  } = useInputBoxContext();
  const userTaggingListStyles = inputBoxStyles?.userTaggingListStyles;

  return (
    <View>
      {userTaggingList && isUserTagging ? (
        <View
          style={StyleSheet.flatten([
            styles.taggableUsersBox,
            userTaggingListStyles?.taggableUsersBox,
            {
              backgroundColor: isUploadScreen ? "black" : "white",
              height: userTaggingListHeight,
            },
          ])}
        >
          <FlashList
            data={[...groupTags, ...userTaggingList]}
            renderItem={({ item }: any) => {
              const description = item?.description;
              const imageUrl = item?.imageUrl;

              return (
                <Pressable
                  onPress={() => {
                    const uuid = item?.sdkClientInfo?.uuid;
                    const userName = item?.name;
                    const communityId = item?.sdkClientInfo?.community;

                    if (onUserTaggingClickedProp) {
                      onUserTaggingClickedProp({
                        uuid,
                        userName,
                        communityId,
                        mentionUsername: item?.name,
                      });
                    } else {
                      onUserTaggingClicked({
                        uuid,
                        userName,
                        communityId,
                        mentionUsername: item?.name,
                      });
                    }
                  }}
                  style={StyleSheet.flatten([
                    styles.taggableUserView,
                    userTaggingListStyles?.taggableUserView,
                  ])}
                >
                  <LMChatIcon
                    iconUrl={imageUrl}
                    assetPath={
                      imageUrl
                        ? undefined
                        : userTaggingListStyles?.avatar?.assetPath ??
                          require("../../assets/images/default_pic.png")
                    }
                    height={userTaggingListStyles?.avatar?.height ?? 40}
                    width={userTaggingListStyles?.avatar?.width ?? 40}
                    iconStyle={StyleSheet.flatten([
                      styles.avatar,
                      userTaggingListStyles?.avatar?.iconStyle,
                    ])}
                  />
                  <View
                    style={StyleSheet.flatten([
                      styles.infoContainer,
                      userTaggingListStyles?.infoContainer,
                      {
                        borderBottomWidth: Layout.normalize(0.2),
                        gap: Layout.normalize(5),
                      },
                    ])}
                  >
                    <LMChatTextView
                      textStyle={StyleSheet.flatten([
                        styles.title,
                        userTaggingListStyles?.title,
                        {
                          color: isUploadScreen
                            ? userTaggingListStyles?.title
                                ?.color || "gray"
                            : "black",
                        },
                      ])}
                      maxLines={1}
                    >
                      {item?.name}
                    </LMChatTextView>
                    {description ? (
                      <LMChatTextView
                        textStyle={StyleSheet.flatten([
                          styles.subTitle,
                          userTaggingListStyles?.subTitle,
                          {
                            color: isUploadScreen
                              ? userTaggingListStyles?.subTitle
                                  ?.color || "gray"
                              : "black",
                          },
                        ])}
                        maxLines={1}
                      >
                        {description}
                      </LMChatTextView>
                    ) : null}
                  </View>
                </Pressable>
              );
            }}
            extraData={{ value: [message, userTaggingList] }}
            estimatedItemSize={50}
            keyboardShouldPersistTaps={"handled"}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={1}
            bounces={false}
            ListFooterComponent={renderFooter}
            keyExtractor={(item: any, index) => index?.toString()}
          />
        </View>
      ) : null}
    </View>
  );
};

export default UserTaggingList;