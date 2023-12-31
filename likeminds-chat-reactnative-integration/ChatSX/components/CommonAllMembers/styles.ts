import { Platform, StyleSheet } from "react-native";
import STYLES from "../../constants/Styles";
import Layout from "../../constants/Layout";

export const styles = StyleSheet.create({
  page: {
    backgroundColor: STYLES.$BACKGROUND_COLORS.LIGHT,
    flex: 1,
  },
  itemContainer: {
    flexDirection: "row",
    padding: STYLES.$PADDINGS.MEDIUM,
    alignItems: "center",
    backgroundColor: STYLES.$COLORS.TERTIARY,
  },
  avatar: {
    width: STYLES.$AVATAR.WIDTH,
    height: STYLES.$AVATAR.HEIGHT,
    borderRadius: STYLES.$AVATAR.BORDER_RADIUS,
    marginRight: STYLES.$MARGINS.SMALL,
  },
  smallIcon: {
    width: 15,
    height: 15,
    resizeMode: "contain",
  },
  sendIcon: {
    width: 25,
    height: 25,
    resizeMode: "contain",
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    marginLeft: -3,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: STYLES.$FONT_SIZES.LARGE,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    color: STYLES.$COLORS.FONT_PRIMARY,
  },
  participantsTitle: {
    fontSize: STYLES.$FONT_SIZES.LARGE,
    fontFamily: STYLES.$FONT_TYPES.LIGHT,
    color: STYLES.$COLORS.FONT_PRIMARY,
  },
  headingContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  backBtn: { height: 40, width: 40, resizeMode: "contain" },
  search: { height: 20, width: 20, resizeMode: "contain" },
  chatRoomInfo: { gap: 5 },
  participants: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  input: {
    fontSize: STYLES.$FONT_SIZES.MEDIUM,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    color: STYLES.$COLORS.SECONDARY,
    paddingVertical: 10,
    marginBottom: 2,
    width: Layout.window.width - 150,
  },
  selected: {
    backgroundColor: STYLES.$COLORS.PRIMARY,
    height: 25,
    width: 25,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    position: "absolute",
    right: 5,
    bottom: 0,
  },
  sendBtn: {
    height: 60,
    width: 60,
    borderRadius: 50,
    backgroundColor: STYLES.$COLORS.PRIMARY,
    position: "absolute",
    right: 15,
    bottom: 30,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  messageCustomTitle: {
    color: STYLES.$COLORS.SECONDARY,
    fontSize: STYLES.$FONT_SIZES.MEDIUM,
    fontFamily: STYLES.$FONT_TYPES.LIGHT,
  },
  justifyCenter: {
    flexDirection: "row",
    padding: STYLES.$PADDINGS.MEDIUM,
    justifyContent: "center",
    backgroundColor: STYLES.$COLORS.TERTIARY,
    flex: 1,
  },
});
