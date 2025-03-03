import { View, Vibration } from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { SET_IS_REPLY, SET_REPLY_MESSAGE } from "../../store/types/types";
import { useAppDispatch } from "../../store";
import STYLES from "../../constants/Styles";
import { SwipeableParams } from "./model";
import { LMChatAnalytics } from "../../analytics/LMChatAnalytics";
import { Events, Keys } from "../../enums";
import { getConversationType } from "../../utils/analyticsUtils";

const Swipeable = ({
  onFocusKeyboard,
  item,
  isStateIncluded,
  children,
}: SwipeableParams) => {
  const [isReplyBoxOpen, setIsReplyBoxOpen] = useState(false);
  const pressed = useSharedValue(false);
  const x = useSharedValue(0);
  const dispatch = useAppDispatch();

  // to open reply box after swipe
  useEffect(() => {
    if (isReplyBoxOpen) {
      const replyMessage = { ...item };
      pressed.value = false;
      Vibration.vibrate(0.5 * 100);
      dispatch({
        type: SET_REPLY_MESSAGE,
        body: { replyMessage: replyMessage },
      });
      dispatch({ type: SET_IS_REPLY, body: { isReply: true } });
      onFocusKeyboard();
      x.value = withSpring(0);
      const memberId = replyMessage?.member?.id?.toString();
      const memberState = replyMessage?.member?.state?.toString();
      LMChatAnalytics.track(
        Events.MESSAGE_REPLY,
        new Map<string | undefined, string | undefined>([
          [Keys.TYPE, getConversationType(replyMessage)],
          [Keys.CHATROOM_ID, replyMessage?.chatroomId?.toString()],
          [Keys.REPLIED_TO_MEMBER_ID, memberId],
          [Keys.REPLIED_TO_MEMBER_STATE, memberState],
          [Keys.REPLIED_TO_MESSAGE_ID, replyMessage?.id],
        ])
      );
    }
  }, [isReplyBoxOpen]);

  // draggle mic panGesture styles
  const panStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      transform: [
        {
          translateX: x.value,
        },
      ],
    };
  }, [x]);

  // this method handles onUpdate callback of pan gesture
  const onUpdatePanGesture = (
    event: GestureUpdateEvent<PanGestureHandlerEventPayload>
  ) => {
    "worklet";
    if (event.translationX >= 75) {
      setIsReplyBoxOpen(true);
    } else if (event.translationX > 0) {
      x.value = event.translationX;
    }

    if (event.translationX > 50) {
      pressed.value = true;
    }
  };

  // this method handles onEnd callback of pan gesture
  const onEndPanGesture = () => {
    "worklet";
    x.value = withTiming(0);
    pressed.value = false;
    setIsReplyBoxOpen(false);
  };

  // draggable message pan gesture on x-axis
  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .enabled(!isStateIncluded && item?.deletedBy == null && !(item?.id?.includes && item?.id?.includes("-")))
    .activeOffsetX([-10, 10])
    .onStart((event) => {
      const deltaX = event.translationX;

      if (deltaX > 0) {
        x.value = deltaX;
      }
    })
    .onUpdate(onUpdatePanGesture)
    .onEnd(onEndPanGesture)
    .onFinalize(() => {
      "worklet";
      pressed.value = false;
      setIsReplyBoxOpen(false);
    });

  const REPLY_ICON_VIEW_BACKGROUND_COLOR = STYLES.$COLORS.MSG;
  const replyIconViewStyle = useAnimatedStyle(() => {
    return {
      height: pressed.value ? 35 : 0,
      width: pressed.value ? 35 : 0,
      borderRadius: pressed.value ? 30 : 0,
      backgroundColor: REPLY_ICON_VIEW_BACKGROUND_COLOR,
      position: "absolute",
      left: pressed.value ? x.value - 50 : 10,
      transform: [{ scale: withTiming(pressed.value ? 1 : 0) }],
    };
  }, [x]);

  const replyIconStyle = useAnimatedStyle(() => {
    return {
      height: 20,
      width: 20,
      resizeMode: "contain",
      tintColor: "white",
      transform: [{ scale: withTiming(pressed.value ? 1 : 0) }],
    };
  }, [x]);
  return (
    <View>
      <GestureDetector gesture={panGesture}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Animated.View
            style={[
              {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
              replyIconViewStyle,
            ]}
          >
            <Animated.Image
              source={require("../../assets/images/reply_icon3x.png")}
              style={[replyIconStyle]}
            />
          </Animated.View>
          <Animated.View style={panStyle}>{children}</Animated.View>
        </View>
      </GestureDetector>
    </View>
  );
};

export default Swipeable;
