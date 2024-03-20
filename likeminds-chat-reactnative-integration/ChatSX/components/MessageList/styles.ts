import { Platform, StyleSheet } from "react-native";
import STYLES from "../../constants/Styles";
import Layout from "../../constants/Layout";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  headingContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.normalize(20),
    marginTop: Platform.OS === "ios" ? Layout.normalize(-5) : 0,
  },
  arrowButton: {
    position: "absolute",
    bottom: Layout.normalize(20),
    right: Layout.normalize(15),
    backgroundColor: "white",
    padding: Layout.normalize(10),
    borderRadius: Layout.normalize(60),
    marginBottom: Layout.normalize(60),
    zIndex: 1,
  },
  arrowButtonImage: {
    height: Layout.normalize(15),
    width: Layout.normalize(15),
  },
  selectedHeadingContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.normalize(25),
  },
  backBtn: {
    height: Layout.normalize(40),
    width: Layout.normalize(40),
    borderRadius: Layout.normalize(10),
    resizeMode: "contain",
  },
  selectedBackBtn: {
    height: Layout.normalize(20),
    width: Layout.normalize(20),
    resizeMode: "contain",
  },
  threeDots: {
    height: Layout.normalize(20),
    width: Layout.normalize(30),
    resizeMode: "contain",
  },
  editIcon: {
    height: Layout.normalize(25),
    width: Layout.normalize(30),
    resizeMode: "contain",
  },
  chatRoomInfo: {
    gap: Layout.normalize(5),
  },
  chatRoomTopicInfo: {
    gap: Layout.normalize(5),
    width: "60%",
    marginLeft: Layout.normalize(10),
    marginTop: Layout.normalize(-10),
  },
  inputContainer: {
    flexDirection: "row",
    flexGrow: 1,
  },
  emojiButton: {
    padding: Layout.normalize(10),
  },
  emoji: {
    width: Layout.normalize(22),
    height: Layout.normalize(22),
    resizeMode: "contain",
    tintColor: STYLES.$COLORS.SECONDARY,
  },
  input: {
    flex: 1,
    padding: Layout.normalize(10),
    fontSize: Layout.normalize(16),
  },
  disabledInput: {
    marginVertical:
      Platform.OS === "android" ? Layout.normalize(10) : Layout.normalize(20),
    marginHorizontal: Layout.normalize(10),
    paddingVertical: Layout.normalize(10),
    minHeight: Layout.normalize(50),
    paddingHorizontal: Layout.normalize(20),
    backgroundColor: "#f2f2f2",
    borderRadius: Layout.normalize(25),
    justifyContent: "center",
    borderColor: STYLES.$COLORS.MSG,
    borderWidth: Layout.normalize(1),
  },
  disabledInputText: {
    fontSize: STYLES.$FONT_SIZES.MEDIUM,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    color: STYLES.$COLORS.MSG,
  },
  sendButton: {
    padding: Layout.normalize(10),
    backgroundColor: "#4caf50",
    borderRadius: Layout.normalize(5),
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: Layout.normalize(16),
  },
  emojiPicker: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    padding: Layout.normalize(10),
  },

  centeredView: {
    flex: 1,
  },
  emojiCenteredView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalView: {
    position: "absolute",
    right: Layout.normalize(10),
    marginLeft: Layout.normalize(10),
    marginTop:
      Platform.OS === "ios" ? Layout.normalize(45) : Layout.normalize(10),
    backgroundColor: "white",
    borderRadius: Layout.normalize(8),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: Layout.normalize(2),
    },
    padding: Layout.normalize(5),
    shadowOpacity: Layout.normalize(0.25),
    shadowRadius: Layout.normalize(4),
    elevation: Layout.normalize(5),
  },
  reactionCenteredView: {
    flex: 1,
    alignItems: "center",
  },
  reactionModalView: {
    marginTop:
      Platform.OS === "ios" ? Layout.normalize(45) : Layout.normalize(10),
    backgroundColor: "white",
    borderRadius: Layout.normalize(8),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: Layout.normalize(2),
    },
    padding: Layout.normalize(5),
    shadowOpacity: Layout.normalize(0.25),
    shadowRadius: Layout.normalize(4),
    elevation: Layout.normalize(5),
    display: "flex",
    flexDirection: "row",
  },
  emojiModalView: {},
  reactionFiltersView: {
    paddingHorizontal: Layout.normalize(10),
    paddingVertical: Layout.normalize(10),
  },
  filtersView: {
    paddingHorizontal: Layout.normalize(10),
    paddingVertical: Layout.normalize(20),
  },

  filterText: {
    fontSize: STYLES.$FONT_SIZES.LARGE,
    fontFamily: STYLES.$FONT_TYPES.LIGHT,
    color: STYLES.$COLORS.FONT_PRIMARY,
  },
  statusMessage: {
    padding: Layout.normalize(10),
    maxWidth: "80%",
    alignSelf: "center",
    borderRadius: Layout.normalize(15),
    backgroundColor: STYLES.$COLORS.JOINED_BTN,
  },
  joinBtnContainer: {
    backgroundColor: STYLES.$COLORS.SECONDARY,
    borderRadius: Layout.normalize(10),
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    padding: Layout.normalize(10),
    gap: Layout.normalize(5),
  },
  join: {
    color: STYLES.$COLORS.TERTIARY,
    fontSize: STYLES.$FONT_SIZES.LARGE,
    fontFamily: STYLES.$FONT_TYPES.SEMI_BOLD,
  },
  icon: {
    width: Layout.normalize(30),
    height: Layout.normalize(25),
    resizeMode: "contain",
    borderRadius: STYLES.$AVATAR.BORDER_RADIUS,
  },
  inviteText: {
    fontSize: STYLES.$FONT_SIZES.MEDIUM,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    color: STYLES.$COLORS.MSG,
    lineHeight: Layout.normalize(20),
  },
  inviteBtnText: {
    fontSize: STYLES.$FONT_SIZES.MEDIUM,
    fontFamily: STYLES.$FONT_TYPES.MEDIUM,
    color: STYLES.$COLORS.FONT_PRIMARY,
  },
  avatar: {
    width: Layout.normalize(40),
    height: Layout.normalize(40),
    borderRadius: STYLES.$AVATAR.BORDER_RADIUS,
    marginRight: STYLES.$MARGINS.SMALL,
  },
  chatroomTopicAvatar: {
    width: Layout.normalize(50),
    height: Layout.normalize(50),
    borderRadius: STYLES.$AVATAR.BORDER_RADIUS,
  },
  chatroomTopicAttachment: {
    width: Layout.normalize(50),
    height: Layout.normalize(50),
    marginRight: STYLES.$MARGINS.LARGE,
  },
  chatroomTopicIcon: {
    height: Layout.normalize(15),
    width: Layout.normalize(15),
    resizeMode: "contain",
    marginRight: Layout.normalize(5),
  },
  alignRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.normalize(5),
  },
  chatroomTopic: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.normalize(5),
    backgroundColor: "white",
    paddingLeft: Layout.normalize(15),
    paddingBottom: Layout.normalize(10),
    paddingTop: Layout.normalize(10),
    borderTopWidth: Layout.normalize(0.5),
    borderTopColor: "gray",
  },
  chatroomTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  profile: {
    width: Layout.normalize(45),
    height: Layout.normalize(45),
    borderRadius: STYLES.$AVATAR.BORDER_RADIUS,
    justifyContent: "center",
    alignItems: "center",
    padding: Layout.normalize(5),
  },
  headerRight: {
    marginTop: Platform.OS === "ios" ? Layout.normalize(-5) : 0,
  },
  requestMessageTextButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.normalize(15),
    flexGrow: 1,
  },
  dmRequestView: {
    paddingHorizontal: Layout.normalize(20),
    paddingVertical: Layout.normalize(15),
    backgroundColor: STYLES.$COLORS.TERTIARY,
    marginTop: Layout.normalize(10),
  },
  dmRequestButtonBox: {
    marginTop: Layout.normalize(30),
    gap: Layout.normalize(20),
  },
  alignCenter: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
  },
  attachment_msg: {
    color: STYLES.$COLORS.FONT_PRIMARY,
    fontSize: STYLES.$FONT_SIZES.MEDIUM,
    fontFamily: STYLES.$FONT_TYPES.LIGHT,
    marginRight: Layout.normalize(5),
    alignSelf: "flex-end",
    marginBottom:
      Platform.OS === "android" ? Layout.normalize(-3) : Layout.normalize(-1),
    lineHeight: Layout.normalize(18),
  },
  gif_attachment_msg: {
    color: STYLES.$COLORS.FONT_PRIMARY,
    fontSize: STYLES.$FONT_SIZES.MEDIUM,
    fontFamily: STYLES.$FONT_TYPES.LIGHT,
    marginRight: Layout.normalize(5),
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
  },
  sub_attachment_msg: {
    marginLeft: Layout.normalize(5),
  },
  deletedMessage: {
    color: STYLES.$COLORS.FONT_PRIMARY,
    fontSize: STYLES.$FONT_SIZES.MEDIUM,
    fontFamily: STYLES.$FONT_TYPES.LIGHT,
    fontStyle: "italic",
    width: "85%",
  },
  gifView: {
    backgroundColor: STYLES.$COLORS.MSG,
    paddingHorizontal: Layout.normalize(5),
    paddingVertical: Layout.normalize(3),
    borderRadius: Layout.normalize(5),
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Layout.normalize(-2),
  },
  gifText: {
    fontFamily: STYLES.$FONT_TYPES.LIGHT,
    fontSize: STYLES.$FONT_SIZES.XS,
    color: "white",
    marginTop: Layout.normalize(1),
  },
});
