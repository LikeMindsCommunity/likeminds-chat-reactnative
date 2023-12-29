import React, { createContext, useContext, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { RealmProvider } from "@realm/react";
import { UserSchemaRO } from "./db/schemas/UserSchema";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAppDispatch } from "./store";
import { Credentials } from "./credentials";
import {
  INIT_API_SUCCESS,
  PROFILE_DATA_SUCCESS,
  STORE_MY_CLIENT,
} from "./store/types/types";
import notifee from "@notifee/react-native";
import { getRoute } from "./notifications/routes";
import * as RootNavigation from "./RootNavigation";
import { setupPlayer } from "./audio";
import { LMChatClient } from "@likeminds.community/chat-rn";

interface LMProviderProps {
  myClient: LMChatClient;
  children: React.ReactNode;
}

// Create a context for LMChatProvider
const LMChatContext = createContext<LMChatClient | undefined>(undefined);

// Create a hook to use the LMChatContext
export const useLMChat = () => {
  const context = useContext(LMChatContext);
  if (!context) {
    throw new Error("useLMChat must be used within an LMChatProvider");
  }
  return context;
};

export const LMChatProvider = ({
  myClient,
  children,
}: LMProviderProps): JSX.Element => {
  //To navigate onPress notification while android app is in background state / quit state.
  useEffect(() => {
    async function bootstrap() {
      const initialNotification = await notifee.getInitialNotification();

      if (initialNotification) {
        const routes = getRoute(initialNotification?.notification?.data?.route);
        setTimeout(() => {
          RootNavigation.navigate(routes.route, routes.params);
        }, 1000);
      }
    }
    bootstrap();
  }, []);

  // to initialise track player
  useEffect(() => {
    async function setup() {
      await setupPlayer();
    }
    setup();
  }, []);

  // to get dispatch
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("myClient", myClient);

    // storing myClient followed by community details
    const callInitApi = async () => {
      const payload = {
        uuid: "ajhdhjasd", // uuid
        userName: "jhashjsa", // user name
        isGuest: false,
      };

      const response = await myClient?.initiateUser(payload);

      console.log("response", response);

      dispatch({
        type: INIT_API_SUCCESS,
        body: { community: response?.data?.community },
      });
      console.log("1234");

      const response1 = await myClient?.getMemberState();
      console.log("response1343543", response1);

      dispatch({
        type: PROFILE_DATA_SUCCESS,
        body: {
          member: response1?.data?.member,
          memberRights: response1?.data?.memberRights,
        },
      });
    };
    callInitApi();
  }, []);

  return (
    <LMChatContext.Provider value={myClient}>
      <RealmProvider schema={[UserSchemaRO]}>
        <GestureHandlerRootView style={styles.flexStyling}>
          <View style={styles.flexStyling}>{children}</View>
        </GestureHandlerRootView>
      </RealmProvider>
    </LMChatContext.Provider>
  );
};

const styles = StyleSheet.create({
  flexStyling: {
    flex: 1,
  },
});
