import { Platform, StyleSheet } from "react-native";
import STYLES from "../../constants/Styles";
import Layout from "../../constants/Layout";

const styles = StyleSheet.create({
  page: { flex: 1, flexDirection: "column", backgroundColor: "black" },
  headingContainer: {
    position: "absolute",
    zIndex: 1,
    top: Platform.OS === "ios" ? Layout.normalize(60) : Layout.normalize(20),
    left: Layout.normalize(10),
    width: "100%",
    right: Layout.normalize(10),
    marginTop: Layout.normalize(10),
  },
  headingItems: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  backBtn: {
    height: Layout.normalize(20),
    width: Layout.normalize(20),
    resizeMode: "contain",
    tintColor: "white",
    padding: Layout.normalize(5),
  },
  cropIcon: {
    height: Layout.normalize(25),
    width: Layout.normalize(25),
    resizeMode: "contain",
    tintColor: "white",
    marginRight: Platform.OS === "ios" ? 0 : Layout.normalize(15),
  },
  mainImage: {
    height: Layout.window.height,
    width: Layout.window.width,
    resizeMode: "contain",
    backgroundColor: "black",
  },
  imageItem: {
    backgroundColor: "black",
    padding: Layout.normalize(5),
    display: "flex",
    flexDirection: "row",
    height: Layout.normalize(50),
  },
  smallImage: {
    height: Layout.normalize(40),
    width: Layout.normalize(40),
    resizeMode: "cover",
  },
  touchableBackButton: {
    padding: Layout.normalize(10),
  },
  selectedFileToView: {
    display: "flex",
    justifyContent: "center",
  },
  bottomBar: { position: "absolute", bottom: Layout.normalize(50), zIndex: 10 },
  bottomListOfImages: {
    height: Layout.normalize(50),
    alignSelf: "flex-end",
    marginHorizontal: Layout.normalize(10),
  },
  video: {
    display: "flex",
    justifyContent: "center",
    width: Layout.window.width,
    height: Layout.window.height - Layout.normalize(125),
  },
  videoPlayer: {
    width: Layout.window.width,
    height: Layout.window.height - Layout.normalize(125),
  },
  videoIcon: {
    height: Layout.normalize(20),
    width: Layout.normalize(20),
    resizeMode: "contain",
    tintColor: "white",
  },
});

export default styles;
