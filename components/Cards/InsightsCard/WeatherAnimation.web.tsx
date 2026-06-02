import React from "react";
import { View, Text, ViewStyle } from "react-native";

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

export const WeatherAnimation: React.FC<WeatherAnimationProps> = ({
  iconCode,
  size = 60,
  style,
}) => {
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
