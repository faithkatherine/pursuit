import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { Button } from "components/Buttons";
import colors from "themes/tokens/colors";
import typography from "themes/tokens/typography";

interface SwitchCardProps {
  title: string;
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
}

export const SwitchCard: React.FC<SwitchCardProps> = ({
  title,
  isEnabled,
  onToggle,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.glassOverlay} />
      <BlurView
        intensity={Platform.OS === "ios" ? 40 : 100}
        tint="light"
        style={styles.blurContainer}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Button variant="switch" switchProps={{ isEnabled, onToggle }} />
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 60,
    borderRadius: 16,
    overflow: "visible",
    shadowColor: colors.black87,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },

  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      Platform.OS === "android" ? "rgba(219, 211, 219, 0.53)" : colors.white50,
    borderRadius: 16,
  },

  blurContainer: {
    flex: 1,
    height: 60,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: colors.white65,
    backgroundColor:
      Platform.OS === "android" ? "rgba(219, 211, 219, 0.65)" : "transparent",
  },

  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor:
      Platform.OS === "android"
        ? "rgba(255, 255, 255, 0.25)"
        : "rgba(255, 255, 255, 0.1)",
  },
  title: {
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    fontWeight: "600",
    color: colors.thunder,
    letterSpacing: 0.3,
  },
});
