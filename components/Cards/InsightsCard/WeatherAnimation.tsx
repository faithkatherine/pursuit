import React from "react";
import { View, Text, ViewStyle, UIManager, Platform } from "react-native";
import { getWeatherAnimation } from "utils/weatherAnimations";

/**
 * Map OWM icon codes to weather emojis (used when Lottie native module isn't available).
 */
const iconToEmoji: Record<string, string> = {
  "01d": "\u2600\uFE0F",
  "01n": "\uD83C\uDF19",
  "02d": "\u26C5",
  "02n": "\u2601\uFE0F",
  "03d": "\u2601\uFE0F",
  "03n": "\u2601\uFE0F",
  "04d": "\u2601\uFE0F",
  "04n": "\u2601\uFE0F",
  "09d": "\uD83C\uDF27\uFE0F",
  "09n": "\uD83C\uDF27\uFE0F",
  "10d": "\uD83C\uDF26\uFE0F",
  "10n": "\uD83C\uDF27\uFE0F",
  "11d": "\u26C8\uFE0F",
  "11n": "\u26C8\uFE0F",
  "13d": "\u2744\uFE0F",
  "13n": "\u2744\uFE0F",
  "50d": "\uD83C\uDF2B\uFE0F",
  "50n": "\uD83C\uDF2B\uFE0F",
};

interface WeatherAnimationProps {
  iconCode?: string | null;
  size?: number;
  style?: ViewStyle;
}

/**
 * Check if the Lottie native view is registered.
 * On iOS: UIManager.getViewManagerConfig, on Android: UIManager.hasViewManagerConfig
 */
const isLottieAvailable = (() => {
  const viewName = "LottieAnimationView";
  if (Platform.OS === "ios") {
    return !!UIManager.getViewManagerConfig?.(viewName);
  }
  return !!(UIManager as any).hasViewManagerConfig?.(viewName);
})();

const EmojiFallback: React.FC<{
  iconCode?: string | null;
  size: number;
  style?: ViewStyle;
}> = ({ iconCode, size, style }) => {
  const emoji = iconToEmoji[iconCode ?? "01d"] ?? "\u2600\uFE0F";
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <Text style={{ fontSize: size * 0.55 }}>{emoji}</Text>
    </View>
  );
};

export const WeatherAnimation: React.FC<WeatherAnimationProps> = ({
  iconCode,
  size = 60,
  style,
}) => {
  if (!isLottieAvailable) {
    return <EmojiFallback iconCode={iconCode} size={size} style={style} />;
  }

  // Only require LottieView when we know the native module exists
  const LottieView = require("lottie-react-native").default;
  const source = getWeatherAnimation(iconCode);

  return (
    <LottieView
      source={source}
      autoPlay
      loop
      style={[{ width: size, height: size }, style]}
    />
  );
};
