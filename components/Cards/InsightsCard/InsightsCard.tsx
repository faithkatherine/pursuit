import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, colorsRGB } from "pursuit/themes/tokens/colors";

export const InsightsCard = () => {
  const { width } = useWindowDimensions();
  return (
    <LinearGradient
      colors={[colors.deluge, colors.roseFog, colors.deluge]}
      locations={[0, 0.5, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.container, { width: width - 27 * 2 }]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 24,
    padding: 20,
    overflow: "hidden",
  },
});
