import React from "react";
import { LinearGradient } from "react-native-linear-gradient";
import { RadialGradientProps } from "./types";

export const RadialGradient = ({
  colors,
  style,
  children,
}: RadialGradientProps) => {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0.5, y: 0.5 }}
      end={{ x: 1, y: 1 }}
      style={style}
    >
      {children}
    </LinearGradient>
  );
};
