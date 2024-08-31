import { StyleSheet } from "react-native";
import STYLES from "../../constants/Styles";
import Layout from "../../constants/Layout";

export const styles = StyleSheet.create({
  linkPreview: {
    padding: Layout.normalize(10),
    width: "80%",
    alignSelf: "flex-end",
    borderRadius: Layout.normalize(15),
    backgroundColor: "#fff",
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: STYLES.$COLORS.TERTIARY,
    borderBottomRightRadius: 0,
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: STYLES.$COLORS.TERTIARY,
    borderBottomLeftRadius: 0,
    marginLeft: Layout.normalize(30),
  },
  messageText: {
    fontSize: STYLES.$FONT_SIZES.SMALL,
    fontFamily: STYLES.$FONT_TYPES.LIGHT,
    color: STYLES.$COLORS.FONT_PRIMARY,
    maxWidth: Layout.window.width - 150,
  },
  messageDate: {
    fontSize: Layout.normalize(10),
    color: "#aaa",
    textAlign: "right",
  },
  linkPreviewBox: {
    maxHeight: Layout.normalize(350),
    backgroundColor: STYLES.$COLORS.JOINED_BTN,
    borderRadius: Layout.normalize(5),
    overflow: "hidden",
    marginBottom: STYLES.$MARGINS.XS,
  },
  linkPreviewIcon: {
    height: Layout.normalize(250),
    resizeMode: "cover",
  },
  displayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.normalize(10),
  },
  alignTime: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: Layout.normalize(3),
  },
  messageInfo: {
    color: "green",
    fontSize: STYLES.$FONT_SIZES.MEDIUM,
    fontFamily: STYLES.$FONT_TYPES.BOLD,
    marginBottom: STYLES.$MARGINS.XS,
  },
  messageCustomTitle: {
    color: STYLES.$COLORS.MSG,
    fontSize: STYLES.$FONT_SIZES.SMALL,
    fontFamily: STYLES.$FONT_TYPES.LIGHT,
  },
  linkPreviewTitle: {
    color: "black",
    fontSize: STYLES.$FONT_SIZES.MEDIUM,
    fontFamily: STYLES.$FONT_TYPES.BOLD,
    overflow: "hidden",
    marginLeft: Layout.normalize(10),
    marginRight: Layout.normalize(10),
    marginTop: Layout.normalize(10),
  },
  linkPreviewMessageText: {
    fontSize: STYLES.$FONT_SIZES.SMALL,
    fontFamily: STYLES.$FONT_TYPES.LIGHT,
    color: STYLES.$COLORS.FONT_PRIMARY,
    maxWidth: Layout.window.width - 150,
    marginLeft: Layout.normalize(10),
    marginRight: Layout.normalize(10),
    marginBottom: Layout.normalize(10),
  },
  messageParent: {
    margin: Layout.normalize(20),
    marginVertical: Layout.normalize(10),
  },
  typeSent: {
    position: "absolute",
    bottom: 0,
    right: Layout.normalize(-10),
    borderColor: "transparent",
    borderWidth: Layout.normalize(10),
    borderBottomColor: STYLES.$COLORS.TERTIARY,
    borderLeftColor: STYLES.$COLORS.TERTIARY,
  },
  typeReceived: {
    position: "absolute",
    bottom: 0,
    left: Layout.normalize(-10),
    borderColor: "transparent",
    borderWidth: Layout.normalize(10),
    borderBottomColor: STYLES.$COLORS.TERTIARY,
    borderRightColor: STYLES.$COLORS.TERTIARY,
    marginLeft: Layout.normalize(30),
  },
  chatroomTopicAvatar: {
    width: Layout.normalize(40),
    height: Layout.normalize(40),
    borderRadius: STYLES.$AVATAR.BORDER_RADIUS,
    position: "absolute",
    bottom: 0,
    left: Layout.normalize(-45),
    top: Layout.normalize(-30),
  },
});
