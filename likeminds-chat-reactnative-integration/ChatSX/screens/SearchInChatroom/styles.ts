import { StyleSheet } from "react-native";
import STYLES from "../../constants/Styles";
import Layout from "../../constants/Layout";

export const styles = StyleSheet.create({
  page: {
    backgroundColor: STYLES.$BACKGROUND_COLORS.LIGHT,
    flex: 1,
  },
  avatar: {
    width: STYLES.$AVATAR.WIDTH,
    height: STYLES.$AVATAR.HEIGHT,
    borderRadius: STYLES.$AVATAR.BORDER_RADIUS,
    marginRight: STYLES.$MARGINS.SMALL,
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
  secondaryTitle: {
    fontSize: STYLES.$FONT_SIZES.MEDIUM,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    color: STYLES.$COLORS.MSG,
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
    paddingHorizontal: 15,
  },
  backBtn: {
    height: Layout.normalize(40),
    width: Layout.normalize(40),
    resizeMode: "contain",
    tintColor: "black",
  },
  closeIcon: {
    height: Layout.normalize(18),
    width: Layout.normalize(18),
    resizeMode: "contain",
    tintColor: "black",
  },
  input: {
    fontSize: STYLES.$FONT_SIZES.MEDIUM,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    color: STYLES.$COLORS.SECONDARY,
    paddingVertical: Layout.normalize(10),
    marginBottom: Layout.normalize(2),
    width: Layout.window.width - Layout.normalize(150),
  },
  participants: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Layout.normalize(15),
    paddingVertical: Layout.normalize(10),
  },
  nothingImg: {
    height: Layout.normalize(100),
    width: Layout.normalize(100),
    resizeMode: "contain",
  },
  nothing: { display: "flex", flexGrow: 1 },
  justifyCenter: {
    padding: STYLES.$PADDINGS.MEDIUM,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    gap: Layout.normalize(10),
  },
});
