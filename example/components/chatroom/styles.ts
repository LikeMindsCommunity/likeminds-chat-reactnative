import {StyleSheet, PixelRatio} from 'react-native';
import Styles from 'likeminds_chat_reactnative_ui/components/constants/Styles';
import Layout from '../linkPreviewInputBox/Layout';

const pixelRatio = PixelRatio.get();

export const styles = StyleSheet.create({
  textInput: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    borderRadius: 30,
    width: Layout.window.width - 75,
  },
  input: {
    flexGrow: 1,
    fontSize: Styles.$FONT_SIZES.XL,
    fontFamily: Styles.$FONT_TYPES.LIGHT,
    maxHeight: 120,
    padding: 0,
    marginBottom: 2,
    overflow: 'scroll',
  },
  taggableUsersBox: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    width: '100%',
    position: 'relative',
    backgroundColor: 'white',
    borderColor: Styles.$COLORS.MSG,
    overflow: 'hidden',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: Styles.$AVATAR.BORDER_RADIUS,
    marginRight: Styles.$MARGINS.SMALL,
  },
  taggableUserView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 10,
  },
  infoContainer: {
    flex: 1,
    paddingVertical: 15,
    borderBottomColor: Styles.$COLORS.MSG,
  },
  title: {
    fontSize: Styles.$FONT_SIZES.LARGE,
    fontFamily: Styles.$FONT_TYPES.MEDIUM,
    color: Styles.$COLORS.PRIMARY,
  },
  inputParent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingLeft: 0,
    width: '70%',
  },
  replyBoxParent: {
    backgroundColor: 'white',
    borderBottom: 'none',
    borderBottomWidth: 0,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderColor: Styles.$COLORS.MSG,
    overflow: 'hidden',
  },
  subTitle: {
    fontSize: Styles.$FONT_SIZES.MEDIUM,
    fontFamily: Styles.$FONT_TYPES.LIGHT,
    color: Styles.$COLORS.MSG,
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 5,
    margin: 5,
  },
  replyBoxClose: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: Styles.$COLORS.SELECTED_BLUE,
    padding: 5,
    borderRadius: 10,
  },
  replyCloseImg: {height: 7, width: 7, resizeMode: 'contain'},
  send: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginLeft: 5,
  },
  sendButton: {
    height: 50,
    width: 50,
    backgroundColor: Styles.$COLORS.SECONDARY,
    borderRadius: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  lockRecording: {
    backgroundColor: 'white',
    height: 150,
    width: 50,
    borderRadius: 50,
    position: 'absolute',
    bottom: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  inputBoxWithShadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  emojiButton: {
    padding: 10,
    backgroundColor: 'red',
  },
  emoji: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  attachmentIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    position: 'relative',
    right: 20,
  },
  chevron: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
  mic: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  lockIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginTop: 20,
  },
  upChevron: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    marginTop: 20,
  },
  centeredView: {
    flexGrow: 1,
    marginTop: 20,
  },
  modalViewParent: {
    position: 'absolute',
    bottom: 27 * pixelRatio,
    flexGrow: 1,
    width: Layout.window.width,
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  alignModalElements: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
    flexWrap: 'wrap',
    marginHorizontal: 20,
  },
  iconContainer: {alignItems: 'center', margin: 5 * pixelRatio, gap: 5},
  cameraStyle: {backgroundColor: '#06C3AF', padding: 15, borderRadius: 50},
  imageStyle: {backgroundColor: '#555feb', padding: 15, borderRadius: 50},
  docStyle: {backgroundColor: '#e55e69', padding: 15, borderRadius: 50},
  pollStyle: {backgroundColor: '#4098f7', padding: 15, borderRadius: 50},
  iconText: {
    fontSize: Styles.$FONT_SIZES.SMALL,
    fontFamily: Styles.$FONT_TYPES.LIGHT,
    color: Styles.$COLORS.PRIMARY,
  },
});
