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
    width: Layout.normalize(15),
    height: Layout.normalize(15),
    resizeMode: "contain",
  },
  sendIcon: {
    width: Layout.normalize(25),
    height: Layout.normalize(25),
    resizeMode: "contain",
  },
  icon: {
    width: Layout.normalize(30),
    height: Layout.normalize(30),
    resizeMode: "contain",
    marginLeft: Layout.normalize(-3),
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
    gap: Layout.normalize(15),
  },
  backBtn: {
    height: Layout.normalize(40),
    width: Layout.normalize(40),
    resizeMode: "contain",
  },
  search: {
    height: Layout.normalize(20),
    width: Layout.normalize(20),
    resizeMode: "contain",
  },
  chatRoomInfo: { gap: Layout.normalize(5) },
  participants: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Layout.normalize(15),
    paddingVertical: Layout.normalize(10),
  },
  input: {
    fontSize: STYLES.$FONT_SIZES.MEDIUM,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    color: STYLES.$COLORS.SECONDARY,
    paddingVertical: Layout.normalize(10),
    marginBottom: Layout.normalize(2),
    width: Layout.window.width - 150,
  },
  selected: {
    backgroundColor: STYLES.$COLORS.PRIMARY,
    height: Layout.normalize(25),
    width: Layout.normalize(25),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Layout.normalize(15),
    position: "absolute",
    right: Layout.normalize(5),
    bottom: 0,
  },
  sendBtn: {
    height: Layout.normalize(60),
    width: Layout.normalize(60),
    borderRadius: Layout.normalize(50),
    backgroundColor: STYLES.$COLORS.PRIMARY,
    position: "absolute",
    right: Layout.normalize(15),
    bottom: Layout.normalize(30),
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
