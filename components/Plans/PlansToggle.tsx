import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import colors from "themes/tokens/colors";
import typography, { fontSizes, fontWeights } from "themes/tokens/typography";

interface PlansToggleProps {
  active: "my-plans" | "group-plans";
  onSelect: (section: "my-plans" | "group-plans") => void;
}

export const PlansToggle: React.FC<PlansToggleProps> = ({
  active,
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
        <Text style={styles.pillText}>My Plans</Text>
      </Pressable>

      <Pressable
        onPress={() => onSelect("group-plans")}
        style={({ pressed }) => [
          styles.pill,
          active === "group-plans" && styles.pillActive,
          pressed && styles.pillPressed,
        ]}
      >
        <Text style={styles.pillText}>Group Plans</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.white02,
    height: 50,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 25,
  },
  pill: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 25,
    height: 40,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  pillActive: {
    backgroundColor: colors.deluge,
  },
  pillPressed: {
    opacity: 0.7,
  },
  pillText: {
    fontSize: fontSizes.base,
    fontFamily: typography.body.fontFamily,
    fontWeight: fontWeights.bold,
    lineHeight: 16,
    color: colors.white,
  },
});
