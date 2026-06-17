import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import colors from "themes/tokens/colors";
import { fontSizes, fontWeights } from "themes/tokens/typography";

interface PlansToggleProps {
  active: "my-plans" | "group-plans";
  myPlansCount: number;
  groupPlansCount: number;
  onSelect: (section: "my-plans" | "group-plans") => void;
}

export const PlansToggle: React.FC<PlansToggleProps> = ({
  active,
  myPlansCount,
  groupPlansCount,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => onSelect("my-plans")}
        style={({ pressed }) => [
          styles.pill,
          active === "my-plans" && styles.pillActive,
          pressed && styles.pillPressed,
        ]}
      >
        <Text
          style={[
            styles.pillText,
            active === "my-plans" && styles.pillTextActive,
          ]}
        >
          My Plans ({myPlansCount})
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onSelect("group-plans")}
        style={({ pressed }) => [
          styles.pill,
          active === "group-plans" && styles.pillActive,
          pressed && styles.pillPressed,
        ]}
      >
        <Text
          style={[
            styles.pillText,
            active === "group-plans" && styles.pillTextActive,
          ]}
        >
          Group Plans ({groupPlansCount})
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
  },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: "transparent",
  },
  pillActive: {
    backgroundColor: colors.deluge,
    borderColor: colors.deluge,
  },
  pillPressed: {
    opacity: 0.7,
  },
  pillText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    lineHeight: 19,
    color: colors.aluminium,
  },
  pillTextActive: {
    color: colors.white,
  },
});
