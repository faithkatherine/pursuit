import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors } from "themes/tokens/colors";
import { typography, fontSizes, fontWeights } from "themes/tokens/typography";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WeatherAnimation } from "./WeatherAnimation";

interface WeatherData {
  city?: string | null;
  condition?: string | null;
  temperature?: number | null;
  icon?: string | null;
}

interface InsightsCardProps {
  shouldShowTopInset: boolean;
  greeting: string;
  subtitle: string;
  neighborhoodName?: string;
  cityName?: string;
  weather?: WeatherData | null;
  onChipPress?: () => void;
}

export const InsightsCard: React.FC<InsightsCardProps> = ({
  weather,
  greeting,
  subtitle,
  neighborhoodName,
  cityName,
  shouldShowTopInset = true,
  onChipPress,
}) => {
  const insets = useSafeAreaInsets();
  const tempDisplay = weather?.temperature
    ? `${Math.round(weather.temperature)}\u00B0`
    : "";
  const locationLabel = neighborhoodName || cityName || "Nairobi";

  return (
    <View
      style={[
        styles.container,
        { paddingTop: shouldShowTopInset ? insets.top + 8 : 8 },
      ]}
    >
      <View style={styles.row}>
        {/* Left: greeting + subtitle */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {/* Right: weather + location chip */}
        {weather && (
          <Pressable onPress={onChipPress} style={styles.chip} hitSlop={8}>
            <View style={styles.chipContent}>
              <WeatherAnimation iconCode={weather.icon} size={30} />
              <Text style={styles.chipText}>
                {tempDisplay} {"\u00B7"} {locationLabel} {"\u25BE"}
              </Text>
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 18,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greetingContainer: {
    flexShrink: 1,
    gap: 2,
  },
  greeting: {
    fontFamily: typography.h3.fontFamily,
    fontSize: fontSizes["2xl"],
    fontWeight: fontWeights.bold,
    color: colors.black,
    maxWidth: 200,
  },
  subtitle: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.black,
    opacity: 0.55,
  },
  chip: {
    backgroundColor: "rgba(255,255,255,0.35)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 22,
    marginLeft: 8,
  },
  chipContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  chipText: {
    fontFamily: typography.caption.fontFamily,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.black,
  },
});
