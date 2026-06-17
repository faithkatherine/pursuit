import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import colors from "themes/tokens/colors";
import { fontSizes, fontWeights } from "themes/tokens/typography";

interface PlansTabsProps {
  active: "upcoming" | "past" | "saved";
  counts: {
    upcoming: number;
    past: number;
    saved: number;
  };
  onSelect: (tab: "upcoming" | "past" | "saved") => void;
}

export const PlansTabs: React.FC<PlansTabsProps> = ({
  active,
  counts,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Pressable
          onPress={() => onSelect("upcoming")}
          style={({ pressed }) => [
            styles.tab,
            pressed && styles.tabPressed,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              active === "upcoming" && styles.tabTextActive,
            ]}
          >
            Upcoming · {counts.upcoming}
          </Text>
          {active === "upcoming" && <View style={styles.activeIndicator} />}
        </Pressable>

        <Pressable
          onPress={() => onSelect("past")}
          style={({ pressed }) => [
            styles.tab,
            pressed && styles.tabPressed,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              active === "past" && styles.tabTextActive,
            ]}
          >
            Past · {counts.past}
          </Text>
          {active === "past" && <View style={styles.activeIndicator} />}
        </Pressable>

        <Pressable
          onPress={() => onSelect("saved")}
          style={({ pressed }) => [
            styles.tab,
            pressed && styles.tabPressed,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              active === "saved" && styles.tabTextActive,
            ]}
          >
            Saved · {counts.saved}
          </Text>
          {active === "saved" && <View style={styles.activeIndicator} />}
        </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  scrollContent: {
    flexDirection: "row",
    gap: 32,
    paddingHorizontal: 0,
  },
  tab: {
    paddingBottom: 12,
    position: "relative",
  },
  tabPressed: {
    opacity: 0.6,
  },
  tabText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    lineHeight: 19,
    color: colors.aluminium,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: colors.deluge,
  },
  activeIndicator: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.deluge,
  },
});
