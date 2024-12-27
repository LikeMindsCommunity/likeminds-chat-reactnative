import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import React, { useState } from "react";
import { LMChatIcon } from "../LMChatIcon";
import { LMChatButtonProps } from "./types";
import { LMChatTextView } from "../LMChatTextView";
import STYLES from "../../constants/Styles";

export const LMChatButton = ({
  text,
  icon,
  onTap,
  placement,
  isActive,
  activeIcon,
  activeText,
  buttonStyle,
  isClickable = false,
}: LMChatButtonProps) => {
  const [active, setActive] = useState(isActive);

  // this function handles the active state of the button
  const activeStateHandler = () => {
    if (isActive !== undefined) {
      setActive(!active);
    }
  };
  return (
    <TouchableOpacity
      disabled={isClickable}
      hitSlop={{ top: 10, bottom: 10 }}
      style={
        StyleSheet.flatten([
          defaultStyles.buttonViewStyle,
          buttonStyle,
        ]) as ViewStyle
      }
      activeOpacity={0.8}
      onPress={(event) => {
        onTap(event);
        activeStateHandler();
      }}
    >
      {/* button view */}
      <View
        style={StyleSheet.flatten([
          {
            flexDirection: placement === "end" ? "row-reverse" : "row",
            alignItems: "center",
            paddingHorizontal: 10
          },
        ])}
      >
        {/* icon view */}
        {icon ? (
          active ? (
            activeIcon ? (
              // this renders the icon in active state
              <LMChatIcon
                width={activeIcon.width}
                height={activeIcon.height}
                iconUrl={activeIcon.iconUrl}
                assetPath={activeIcon.assetPath}
                color={activeIcon.color}
                iconStyle={activeIcon.iconStyle}
                boxFit={activeIcon.boxFit}
                boxStyle={activeIcon.boxStyle}
              />
            ) : null
          ) : (
            // this renders the icon in inactive state
            <LMChatIcon
              width={icon.width}
              height={icon.height}
              iconUrl={icon.iconUrl}
              assetPath={icon.assetPath}
              color={icon.color}
              iconStyle={icon.iconStyle}
              boxFit={icon.boxFit}
              boxStyle={icon.boxStyle}
            />
          )
        ) : null}
        {/* text view */}
        {text ? (
            active ? (
              activeText ? (
                // this renders the text for active state
                <LMChatTextView
                  textStyle={StyleSheet.flatten([
                    defaultStyles.buttonTextStyle,
                    activeText.textStyle,
                  ])}
                  maxLines={activeText.maxLines}
                  selectable={activeText.selectable}
                >
                  {activeText.children}
                </LMChatTextView>
              ) : null
            ) : (
              // this renders the text in inactive state
              <LMChatTextView
                textStyle={StyleSheet.flatten([
                  defaultStyles.buttonTextStyle,
                  text.textStyle,
                ])}
                maxLines={text.maxLines}
                selectable={text.selectable}
              >
                {text.children}
              </LMChatTextView>
            )
          ) : null}
      </View>
    </TouchableOpacity>
  );
};

const defaultStyles = StyleSheet.create({
  buttonViewStyle: {
    backgroundColor: STYLES.$COLORS.PRIMARY,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    borderRadius: 5,
  },
  buttonTextStyle: {
    fontSize: 16,
    color: STYLES.$COLORS.FONT_PRIMARY,
  },
});
