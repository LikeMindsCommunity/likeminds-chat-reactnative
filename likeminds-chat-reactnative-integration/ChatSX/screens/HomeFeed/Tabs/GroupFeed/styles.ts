import { StyleSheet } from "react-native";
import STYLES from "../../../../constants/Styles";
import Layout from "../../../../constants/Layout";

const styles = StyleSheet.create({
  page: {
    backgroundColor: STYLES.$BACKGROUND_COLORS.LIGHT,
    flex: 1,
  },
  avatar: {
    width: Layout.normalize(36),
    height: Layout.normalize(36),
    borderRadius: STYLES.$AVATAR.BORDER_RADIUS,
    marginRight: STYLES.$MARGINS.SMALL,
  },
});

export default styles;
