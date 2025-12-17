import React from "react";
import { StyleSheet } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Rect } from "react-native-svg";
import colors from "../tokens/colors";

interface BlushPurpleRadialGradientProps {
  width: number;
  height: number;
}

/**
 * Blush and purple-themed radial gradient background
 * Used for screens like Preferences
 * Features soft purple center with warm blush/pink accents
 */
export const BlushPurpleRadialGradient: React.FC<
  BlushPurpleRadialGradientProps
> = ({ width, height }) => (
  <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
    <Defs>
      {/* Main center radial gradient - purple tones */}
      <RadialGradient
        id="blushCenterGradient"
        cx="50%"
        cy="35%"
        rx="70%"
        ry="60%"
        fx="50%"
        fy="35%"
      >
        <Stop offset="0%" stopColor={colors.deluge} stopOpacity="0.8" />
        <Stop offset="30%" stopColor={colors.ube} stopOpacity="0.6" />
        <Stop offset="60%" stopColor={colors.delugeLight} stopOpacity="0.4" />
        <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
      </RadialGradient>

      {/* Secondary radial gradient - blush/pink tones */}
      <RadialGradient
        id="blushGradient"
        cx="70%"
        cy="80%"
        rx="60%"
        ry="50%"
        fx="70%"
        fy="80%"
      >
        <Stop offset="0%" stopColor={colors.bareBlush} stopOpacity="0.7" />
        <Stop offset="40%" stopColor={colors.careysPink} stopOpacity="0.5" />
        <Stop offset="70%" stopColor={colors.roseFog} stopOpacity="0.3" />
        <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
      </RadialGradient>

      {/* Soft purple accent */}
      <RadialGradient
        id="blushAccentGradient"
        cx="20%"
        cy="60%"
        rx="40%"
        ry="40%"
        fx="20%"
        fy="60%"
      >
        <Stop offset="0%" stopColor={colors.ube} stopOpacity="0.5" />
        <Stop offset="50%" stopColor={colors.delugeLight} stopOpacity="0.25" />
        <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
      </RadialGradient>
    </Defs>

    {/* Base background - light blush/lavender */}
    <Rect x="0" y="0" width="100%" height="100%" fill={colors.prim} />

    {/* Layer the radial gradients */}
    <Rect
      x="0"
      y="0"
      width="100%"
      height="100%"
      fill="url(#blushCenterGradient)"
    />
    <Rect x="0" y="0" width="100%" height="100%" fill="url(#blushGradient)" />
    <Rect
      x="0"
      y="0"
      width="100%"
      height="100%"
      fill="url(#blushAccentGradient)"
    />
  </Svg>
);
