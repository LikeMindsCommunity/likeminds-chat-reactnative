import React, { useState, useLayoutEffect, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
  AppState,
  Linking,
} from "react-native";
import { getNameInitials } from "../../commonFuctions";
import STYLES from "../../constants/Styles";
import { useAppDispatch, useAppSelector } from "../../store";
import { getMemberState, initAPI } from "../../store/actions/homefeed";
import styles from "./styles";
import { UPDATE_FILE_UPLOADING_OBJECT } from "../../store/types/types";
import { getUniqueId } from "react-native-device-info";
import { fetchFCMToken, requestUserPermission } from "../../notifications";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import GroupFeed from "./Tabs/GroupFeed";
import DMFeed from "./Tabs/DMFeed";
import { FAILED, USER_SCHEMA_RO } from "../../constants/Strings";
import { DM_FEED, GROUP_FEED } from "../../constants/Screens";
import { useIsFocused } from "@react-navigation/native";
import { parseDeepLink } from "../../components/ParseDeepLink";
import { DeepLinkRequest } from "../../components/ParseDeepLink/models";
import { LMChatAnalytics } from "../../analytics/LMChatAnalytics";
import { Events, Keys } from "../../enums";
import { Credentials } from "../../credentials";
import { Client } from "../../client";
import Layout from "../../constants/Layout";
import { Themes } from "../../enums/Themes";

interface Props {
  navigation: any;
  theme: Themes
}

const Tab = createMaterialTopTabNavigator();

const HomeFeed = ({ navigation, theme }: Props) => {
  const myClient = Client.myClient;
  const [isLoading, setIsLoading] = useState(false);
  const [communityId, setCommunityId] = useState("");
  const [invitePage, setInvitePage] = useState(1);
  const [FCMToken, setFCMToken] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [hideDMTab, setHideDMTab] = useState(true);
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();

  const {
    myChatrooms,
    unseenCount,
    totalCount,
    page,
    invitedChatrooms,
    community,
  } = useAppSelector((state) => state.homefeed);
  const user = useAppSelector((state) => state.homefeed.user);
  const { uploadingFilesMessages } = useAppSelector((state) => state.upload);

  const INITIAL_SYNC_PAGE = 1;

  const headerTitle = useMemo(() => {
    switch (theme) {
      case Themes.COMMUNITY:
        return "Community"
      case Themes.COMMUNITY_HYBRID:
        return "Community"
      case Themes.NETWORKING:
        return "Networking"
    }
  }, [])

  const chatrooms = [...invitedChatrooms, ...myChatrooms];
  const setOptions = () => {
    navigation.setOptions({
      title: "",
      headerShadowVisible: false,
      headerLeft: () => (
        <TouchableOpacity>
          <Text
            style={{
              color: STYLES.$COLORS.FONT_PRIMARY,
              fontSize: STYLES.$FONT_SIZES.XL,
              fontFamily: STYLES.$FONT_TYPES.BOLD,
            }}
          >
            {headerTitle}
          </Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{
            width: Layout.normalize(35),
            height: Layout.normalize(35),
            borderRadius: STYLES.$AVATAR.BORDER_RADIUS,
            backgroundColor: user?.imageUrl ? "white" : "purple",
            justifyContent: "center",
            alignItems: "center",
            padding: Layout.normalize(5),
            paddingTop:
              Platform.OS === "ios" ? Layout.normalize(5) : Layout.normalize(3),
          }}
        >
          {user?.imageUrl ? (
            <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
          ) : (
            <Text
              style={{
                color: STYLES.$COLORS.TERTIARY,
                fontSize: STYLES.$FONT_SIZES.LARGE,
                fontFamily: STYLES.$FONT_TYPES.SEMI_BOLD,
                paddingTop:
                  Platform.OS === "ios"
                    ? Layout.normalize(3)
                    : Platform.OS === "android"
                      ? 0
                      : 0,
              }}
            >
              {user?.name ? getNameInitials(user?.name) : ""}
            </Text>
          )}
        </TouchableOpacity>
      ),
    });
  };

  //push API to receive firebase notifications
  const pushAPI = async (fcmToken: any, accessToken: any) => {
    const deviceID = await getUniqueId();
    try {
      const payload = {
        token: fcmToken,
        xDeviceId: deviceID,
        xPlatformCode: Platform.OS === "ios" ? "ios" : "an",
      };
      await myClient.registerDevice(payload);
    } catch (error) {
      Alert.alert(`${error}`);
    }
  };

  async function fetchData() {
    //this line of code is for the sample app only, pass your uuid instead of this.

    const UUID = Credentials.userUniqueId;
    const userName = Credentials.username;

    const payload = {
      uuid: UUID, // uuid
      userName: userName, // user name
      isGuest: false,
    };

    const res: any = await dispatch(initAPI(payload) as any);

    if (res) {
      setCommunityId(res?.community?.id);
      setAccessToken(res?.accessToken);
      await dispatch(getMemberState() as any);
      LMChatAnalytics.track(
        Events.COMMUNITY_TAB_CLICKED,
        new Map<string, string>([[Keys.USER_ID, res?.user?.id]])
      );
    }

    return res;
  }

  useLayoutEffect(() => {
    async function fetchCheckDMTab() {
      const response = await myClient.checkDMTab();

      if (response?.success) {
        setHideDMTab(response?.data?.hideDmTab);
      }
    }

    fetchCheckDMTab();
  }, []);

  useEffect(() => {
    const listener = Linking.addEventListener("url", ({ url }) => {
      const uuid = Credentials.userUniqueId;
      const userName = Credentials.username;

      const exampleRequest: DeepLinkRequest = {
        uri: url,
        uuid: uuid, // uuid
        userName: userName, // user name
        isGuest: false,
      };

      // Example usage to call parseDeepLink() method

      parseDeepLink(exampleRequest, (response) => {
        // Parsed response
      });
    });

    return () => {
      listener.remove();
    };
  }, []);

  useEffect(() => {
    const token = async () => {
      const isPermissionEnabled = await requestUserPermission();
      if (isPermissionEnabled) {
        const fcmToken = await fetchFCMToken();
        if (fcmToken) {
          setFCMToken(fcmToken);
        }
      }
    };
    token();
  }, []);

  useEffect(() => {
    const func = async () => {
      const res: any = await myClient?.getAllAttachmentUploadConversations();
      if (res) {
        const len = res.length;
        if (len > 0) {
          for (let i = 0; i < len; i++) {
            const data = res[i];
            const uploadingFilesMessagesSavedObject = JSON.parse(data?.value);
            dispatch({
              type: UPDATE_FILE_UPLOADING_OBJECT,
              body: {
                message: {
                  ...uploadingFilesMessagesSavedObject,
                  isInProgress: FAILED,
                },
                ID: data?.key,
              },
            });
          }
        }
      }
    };

    func();
  }, []);

  useEffect(() => {
    const timeSetter = async () => {
      const timeStampStored = await myClient?.getTimeStamp();
      if (timeStampStored.length === 0) {
        await myClient?.initiateTimeStamp();
      }
    };
    timeSetter();
  }, []);

  useEffect(() => {
    if (FCMToken && accessToken) {
      pushAPI(FCMToken, accessToken);
    }
  }, [FCMToken, accessToken]);

  useEffect(() => {
    if (user) {
      setOptions();
    }
  }, [user]);

  const renderLabel = ({ route }: any) => (
    <Text style={styles.font}>{route.title}</Text>
  );

  if (theme == Themes.COMMUNITY) {
    return (
      <View style={styles.page}>
        <GroupFeed />
      </View>
    )
  }

  if (theme == Themes.NETWORKING) {
    return (
      <View style={styles.page}>
        <DMFeed />
      </View>
    )
  }

  if (theme == Themes.COMMUNITY_HYBRID) {
    return (
      <View style={styles.page}>
        {hideDMTab === false ? (
          <Tab.Navigator
            screenOptions={{
              tabBarLabelStyle: styles.font,
              tabBarIndicatorStyle: { backgroundColor: STYLES.$COLORS.PRIMARY },
            }}
          >
            <Tab.Screen
              name={GROUP_FEED}
              options={{
                tabBarLabel: ({ focused }) => (
                  <Text
                    style={[
                      styles.font,
                      {
                        color: focused
                          ? STYLES.$COLORS.PRIMARY
                          : STYLES.$COLORS.MSG,
                      },
                    ]}
                  >
                    Groups
                  </Text>
                ),
              }}
              component={GroupFeed}
            />
            <Tab.Screen
              name={DM_FEED}
              options={{
                tabBarLabel: ({ focused }) => (
                  <Text
                    style={[
                      styles.font,
                      {
                        color: focused
                          ? STYLES.$COLORS.PRIMARY
                          : STYLES.$COLORS.MSG,
                      },
                    ]}
                  >
                    DMs
                  </Text>
                ),
              }}
              component={DMFeed}
            />
          </Tab.Navigator>
        ) : hideDMTab === true ? (
          <GroupFeed />
        ) : null}
      </View>
    );
  }

  return null

};

export default HomeFeed;
