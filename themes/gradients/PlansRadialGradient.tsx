import React from "react";
import { StyleSheet } from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import colors from "../tokens/colors";

interface PlansRadialGradientProps {
  width: number;
  height: number;
}

export const PlansRadialGradient: React.FC<PlansRadialGradientProps> = ({
  width,
  height,
}) => (
  <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
    <Defs>
      <RadialGradient
        id="plansTopLeftPinkGradient"
        cx="0%"
        cy="0%"
        rx="95%"
        ry="80%"
        fx="0%"
        fy="0%"
      >
        <Stop offset="0%" stopColor={colors.frenchPink} stopOpacity="1" />
        <Stop offset="44%" stopColor={colors.roseFog} stopOpacity="0.82" />
        <Stop offset="70%" stopColor={colors.frenchPink} stopOpacity="0.34" />
        <Stop offset="100%" stopColor={colors.frenchPink} stopOpacity="0" />
      </RadialGradient>

      <RadialGradient
        id="plansTopRightPurpleGradient"
        cx="100%"
        cy="0%"
        rx="95%"
        ry="80%"
        fx="100%"
        fy="0%"
      >
        <Stop offset="0%" stopColor={colors.delugeLight} stopOpacity="1" />
        <Stop offset="42%" stopColor={colors.ube} stopOpacity="0.82" />
        <Stop offset="68%" stopColor={colors.delugeLight} stopOpacity="0.42" />
        <Stop offset="100%" stopColor={colors.delugeLight} stopOpacity="0" />
      </RadialGradient>

      <RadialGradient
        id="plansCenterBlendGradient"
        cx="50%"
        cy="34%"
        rx="72%"
        ry="58%"
        fx="50%"
        fy="34%"
      >
        <Stop offset="0%" stopColor={colors.roseFog} stopOpacity="0.48" />
        <Stop offset="52%" stopColor={colors.ube} stopOpacity="0.28" />
        <Stop offset="100%" stopColor={colors.ube} stopOpacity="0" />
      </RadialGradient>
    </Defs>

    <Rect x="0" y="0" width="100%" height="100%" fill={colors.deluge} />
    <Rect
      x="0"
      y="0"
      width="100%"
      height="100%"
      fill="url(#plansTopLeftPinkGradient)"
    />
    <Rect
      x="0"
      y="0"
      width="100%"
      height="100%"
      fill="url(#plansTopRightPurpleGradient)"
    />
    <Rect
      x="0"
      y="0"
      width="100%"
      height="100%"
      fill="url(#plansCenterBlendGradient)"
    />
  </Svg>
);
