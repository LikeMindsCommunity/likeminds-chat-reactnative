import {
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import React from "react";
import { styles } from "../../screens/ChatRoom/styles";
import {
  ChatroomContextValues,
  useChatroomContext,
} from "../../context/ChatroomContext";
import Layout from "../../constants/Layout";

const MessageReactionModal = () => {
  const {
    position,
    reactionArr,
    isReact,

    setIsReact,
    setIsOpen,
    handleReactionModalClose,
    sendReaction,
  }: ChatroomContextValues = useChatroomContext();

  if (!isReact) return <></>

  return (
    <Pressable
      style={{ ...styles.reactionCenteredView, height: Layout.window.height, width: Layout.window.width }}
      onPress={() => {
        setIsReact(false);
      }}
    >
      <View>
        <Pressable
          onPress={() => { }}
          style={[
            styles.reactionModalView,
            {
              top:
                position.y > Layout.window.height / 1.2 // if long press is at the bottom portion
                  ? Platform.OS === "ios"
                    ? position.y - Layout.normalize(250)
                    : position.y - Layout.normalize(180)
                  : Platform.OS == "ios"
                    ? position.y - Layout.normalize(120)
                    : position.y - Layout.normalize(60),
            },
          ]}
        >
          {reactionArr?.map((val: any, index: any) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  sendReaction(val, false);
                }}
                key={val + index}
                style={styles.reactionFiltersView}
              >
                <Text style={styles.filterText}>{val}</Text>
              </TouchableOpacity>
            );
          })}
          <Pressable
            style={[
              {
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 10,
                marginTop: 8,
              },
            ]}
            onPress={() => {
              setIsOpen(true);
              setIsReact(false);
            }}
          >
            <Image
              style={{
                height: 25,
                width: 25,
                resizeMode: "contain",
              }}
              source={require("../../assets/images/add_more_emojis3x.png")}
            />
          </Pressable>
        </Pressable>
      </View>
    </Pressable>
  );
};

export default MessageReactionModal;
