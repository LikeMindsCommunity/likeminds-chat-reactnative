import { Platform } from "react-native";
import Layout from "../../constants/Layout";

const isIOS = Platform.OS === "ios" ? true : false;

export default {
  $COLORS: {
    PRIMARY: "hsl(222, 53%, 15%)",
    SECONDARY: "hsl(222, 47%, 31%)",
    TERTIARY: "#ffffff",
    MSG: "#777e8e",
    JOINED_BTN: "#e9ecf1",
    LIGHT_BLUE: "#0276fa",
    SELECTED_BLUE: "#e8f1fa",
    RED: "red",
  },
  $FONT_SIZES: {
    XS: Layout.normalize(10),
    SMALL: Layout.normalize(12),
    REGULAR: Layout.normalize(13),
    MEDIUM: Layout.normalize(14),
    LARGE: Layout.normalize(16),
    XL: Layout.normalize(18),
    XXL: Layout.normalize(20),
  },
  $FONT_WEIGHTS: {
    LIGHT: "200" as "200",
    MEDIUM: "500" as "500",
    BOLD: "700" as "700",
  },
  $FONT_TYPES: {
    LIGHT: isIOS ? "Helvetica" : "Roboto",
    MEDIUM: isIOS ? "Helvetica" : "Roboto",
    SEMI_BOLD: isIOS ? "Helvetica" : "Roboto",
    BOLD: isIOS ? "Helvetica" : "Roboto",
    BLACK: isIOS ? "Helvetica" : "Roboto",
  },
  $BACKGROUND_COLORS: {
    LIGHT: "#ffffff",
    DARK: "#000000",
  },
  $SHADOWS: {
    LIGHT: "0 5px 10px rgba(0, 0, 0, 0.1)",
    MEDIUM: "0 8px 30px rgba(0, 0, 0, 0.3)",
    HEAVY: "0 30px 60px rgba(0, 0, 0, 0.6)",
  },
  $MARGINS: {
    XS: Layout.normalize(5),
    SMALL: Layout.normalize(10),
    MEDIUM: Layout.normalize(15),
    LARGE: Layout.normalize(20),
  },
  $PADDINGS: {
    SMALL: Layout.normalize(10),
    MEDIUM: Layout.normalize(15),
    LARGE: Layout.normalize(20),
  },
  $AVATAR: {
    WIDTH: Layout.normalize(50),
    HEIGHT: Layout.normalize(50),
    BORDER_RADIUS: Layout.normalize(25),
  },
  $ALIGN_ROW: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  $TEXTVIEW_WIDTH: {
    REGULAR: Layout.normalize(240),
  },
  $STATUS_BAR_STYLE: {
    default: "default",
    "dark-content": "dark-content",
    "light-content": "light-content",
  },
};
