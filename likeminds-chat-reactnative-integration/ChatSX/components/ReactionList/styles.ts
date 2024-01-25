import { StyleSheet } from "react-native";
import STYLES from "../../constants/Styles";
import Layout from "../../constants/Layout";

export const styles = StyleSheet.create({
  messageParent: {
    margin: Layout.normalize(20),
    marginVertical: Layout.normalize(10),
  },
  message: {
    padding: Layout.normalize(10),
    maxWidth: "80%",
    alignSelf: "flex-end",
    borderRadius: Layout.normalize(15),
    backgroundColor: "#fff",
    minWidth: Layout.normalize(100),
  },

  pollMessage: {
    padding: Layout.normalize(10),
    width: "80%",
    alignSelf: "flex-end",
    borderRadius: Layout.normalize(15),
    backgroundColor: "#fff",
  },
  statusMessage: {
    padding: Layout.normalize(10),
    maxWidth: "80%",
    alignSelf: "center",
    borderRadius: Layout.normalize(15),
    backgroundColor: STYLES.$COLORS.JOINED_BTN,
  },
  replyMessage: {
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
  },
  messageText: {
    fontSize: STYLES.$FONT_SIZES.MEDIUM,
    fontFamily: STYLES.$FONT_TYPES.LIGHT,
    color: STYLES.$COLORS.SECONDARY,
    // maxWidth: '80%',
    // textAlign: 'left',
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
  messageDate: {
    fontSize: Layout.normalize(10),
    color: "#aaa",
    // marginTop: 5,
    textAlign: "right",
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
  },
  deletedMsg: {
    color: STYLES.$COLORS.MSG,
    fontSize: STYLES.$FONT_SIZES.MEDIUM,
    fontFamily: STYLES.$FONT_TYPES.LIGHT,
    fontStyle: "italic",
  },
  reactionReceivedParent: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Layout.normalize(5),
    gap: Layout.normalize(5),
    marginLeft: Layout.normalize(30),
  },
  reactionSentParent: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Layout.normalize(5),
    gap: Layout.normalize(5),
  },
  reaction: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.normalize(3),
    paddingVertical: Layout.normalize(5),
    paddingHorizontal: Layout.normalize(5),
    backgroundColor: STYLES.$COLORS.TERTIARY,
    borderRadius: Layout.normalize(15),
  },
  moreReaction: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.normalize(3),
    paddingVertical: Layout.normalize(5),
    paddingHorizontal: Layout.normalize(10),
    backgroundColor: STYLES.$COLORS.TERTIARY,
    borderRadius: Layout.normalize(15),
  },
  alignMessage: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.normalize(10),
  },
  textCenterAlign: {
    textAlign: "center",
  },
  alignTime: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: Layout.normalize(3),
  },
});
