import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import colors from "@shared/constants/tokens/colors";
import { fontSizes, fontWeights } from "@shared/constants/tokens/typography";

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tabButton, pressed && styles.tabPressed]}
    >
      <View style={styles.tabContent}>
        <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
          {label}
        </Text>
        {isActive && <View style={styles.activeIndicator} />}
      </View>
    </Pressable>
  );
};

interface PlansTabsProps {
  active: "upcoming" | "past" | "saved";
  onSelect: (tab: "upcoming" | "past" | "saved") => void;
}

export const PlansTabs: React.FC<PlansTabsProps> = ({ active, onSelect }) => {
  const tabs: Array<{ key: "upcoming" | "past" | "saved"; label: string }> = [
    { key: "upcoming", label: "Upcoming" },
    { key: "past", label: "Past" },
    { key: "saved", label: "Saved" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabsRow}>
        {tabs.map((tab) => (
          <TabButton
            key={tab.key}
            label={tab.label}
            isActive={active === tab.key}
            onPress={() => onSelect(tab.key)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
  },
  tabsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  tabButton: {
    flex: 1,
  },
  tabContent: {
    paddingBottom: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  tabPressed: {
    opacity: 0.6,
  },
  tabText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    lineHeight: 19,
    color: colors.white,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tabTextActive: {
    color: colors.black,
  },
  activeIndicator: {
    height: 2,
    width: "100%",
    backgroundColor: colors.black,
    position: "absolute",
    bottom: 0,
  },
});
