import React from "react";
import { StyleSheet } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";
import colors from "../tokens/colors";

interface PurpleRadialGradientProps {
  width: number;
  height: number;
}

/**
 * Purple-themed radial gradient background
 * Used for screens like Interest Selection
 * Features deep purple tones with vibrant accents
 */
export const PurpleRadialGradient: React.FC<PurpleRadialGradientProps> = ({
  width,
  height,
}) => (
  <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
    <Defs>
      {/* Main center radial gradient - deep purple */}
      <RadialGradient
        id="purpleCenterGradient"
        cx="50%"
        cy="30%"
        rx="80%"
        ry="70%"
        fx="50%"
        fy="30%"
      >
        <Stop offset="0%" stopColor={colors.purple} stopOpacity="1" />
        <Stop offset="40%" stopColor={colors.deluge} stopOpacity="0.9" />
        <Stop offset="70%" stopColor={colors.delugeLight} stopOpacity="0.7" />
        <Stop offset="100%" stopColor={colors.ube} stopOpacity="0.5" />
      </RadialGradient>

      {/* Bottom accent gradient - lighter purple */}
      <RadialGradient
        id="bottomAccentGradient"
        cx="30%"
        cy="90%"
        rx="70%"
        ry="50%"
        fx="30%"
        fy="90%"
      >
        <Stop offset="0%" stopColor={colors.delugeLight} stopOpacity="0.8" />
        <Stop offset="50%" stopColor={colors.ube} stopOpacity="0.5" />
        <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
      </RadialGradient>

      {/* Top right accent - vibrant purple */}
      <RadialGradient
        id="topRightAccent"
        cx="85%"
        cy="15%"
        rx="45%"
        ry="40%"
        fx="85%"
        fy="15%"
      >
        <Stop offset="0%" stopColor={colors.lightPurple} stopOpacity="0.6" />
        <Stop offset="60%" stopColor={colors.deluge} stopOpacity="0.3" />
        <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
      </RadialGradient>
    </Defs>

    {/* Base background - deep deluge purple */}
    <Rect x="0" y="0" width="100%" height="100%" fill={colors.deluge} />

    {/* Layer the radial gradients */}
    <Rect
      x="0"
      y="0"
      width="100%"
      height="100%"
      fill="url(#purpleCenterGradient)"
    />
    <Rect
      x="0"
      y="0"
      width="100%"
      height="100%"
      fill="url(#bottomAccentGradient)"
    />
    <Rect x="0" y="0" width="100%" height="100%" fill="url(#topRightAccent)" />
  </Svg>
);
