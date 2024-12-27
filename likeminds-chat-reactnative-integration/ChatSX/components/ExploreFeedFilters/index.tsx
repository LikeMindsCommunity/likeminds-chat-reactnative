import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  TextStyle,
} from "react-native";
import { styles } from "./styles";
import { Events, Keys } from "../../enums";
import { LMChatAnalytics } from "../../analytics/LMChatAnalytics";
import { useExploreFeedContext } from "../../context/ExploreFeedContext";
import STYLES from "../../constants/Styles";

const ExploreFeedFilters = ({ filterIconPath }: any) => {
  const [modalVisible, setModalVisible] = useState(false);

  const {
    chats,
    pinnedChatroomsCount,
    filterState,
    isPinned,
    exploreChatrooms,

    setIsPinned,
    setFilterState,
    setChats,
  } = useExploreFeedContext();

  const filterHeader = STYLES.$EXPLORE_CHATROOM_STYLE?.filterHeader;

  const handleModalClose = () => {
    setModalVisible(false);
  };
  const arr = [
    "Newest",
    "Recently active",
    "Most messages",
    "Most participants",
  ];

  const handleIsPinned = (val) => {
    if (val) {
      const pinnedChats = chats.filter((item: any) =>
        item?.isPinned ? item : null
      );
      setChats(pinnedChats);
      setIsPinned(val);
    } else {
      setChats(exploreChatrooms);
      setIsPinned(val);
    }
  };

  return (
    <View>
      <View style={styles.alignHeader}>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(!modalVisible);
          }}
          style={styles.itemContainer}
        >
          <Text
            style={
              [
                styles.titleText,
                filterHeader?.color && {
                  color: filterHeader?.color,
                },
                filterHeader?.fontSize && {
                  fontSize: filterHeader?.fontSize,
                },
                filterHeader?.fontFamily && {
                  fontFamily: filterHeader?.fontFamily,
                },
              ] as TextStyle[]
            }
          >
            {arr[filterState]}
          </Text>
          <Image
            source={
              filterIconPath
                ? filterIconPath
                : require("../../assets/images/down_arrow3x.png")
            }
            style={styles.icon}
          />
        </TouchableOpacity>

        {isPinned ? (
          <TouchableOpacity
            onPress={() => {
              handleIsPinned(false);
            }}
            style={styles.cancelPinnedBtn}
          >
            <View style={styles.cancelPinIconParent}>
              <Image
                source={require("../../assets/images/pin_icon_blue3x.png")}
                style={styles.cancelPinIcon}
              />
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={styles.titleText}>Pinned</Text>
              <Image
                source={require("../../assets/images/cross_icon3x.png")}
                style={styles.icon}
              />
            </View>
          </TouchableOpacity>
        ) : pinnedChatroomsCount > 3 ? (
          <TouchableOpacity
            onPress={() => {
              setIsPinned(true);
              LMChatAnalytics.track(
                Events.PINNED_CHATROOM_VIEWED,
                new Map<string, string>([[Keys.SOURCE, "overflow_menu"]])
              );
            }}
          >
            <Image
              source={require("../../assets/images/pin_icon_grey3x.png")}
              style={styles.pinIcon}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <Pressable style={styles.centeredView} onPress={handleModalClose}>
          <View>
            <Pressable onPress={() => {}} style={[styles.modalView]}>
              {arr.map((val, index) => (
                <TouchableOpacity
                  onPress={() => {
                    setFilterState(index);
                  }}
                  key={val + index}
                  style={styles.filtersView}
                >
                  <Text style={styles.filterText}>{val}</Text>
                </TouchableOpacity>
              ))}
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default ExploreFeedFilters;
