import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import colors from "themes/tokens/colors";
import { fontSizes, fontWeights } from "themes/tokens/typography";

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tabButton,
        pressed && styles.tabPressed,
      ]}
    >
      <View style={styles.tabContent}>
        <Text
          style={[
            styles.tabText,
            isActive && styles.tabTextActive,
          ]}
        >
          {label}
        </Text>
        {isActive && <View style={styles.activeIndicator} />}
      </View>
    </Pressable>
  );
};

interface GroupPlansTabsProps {
  active: "active" | "draft" | "past";
  onSelect: (tab: "active" | "draft" | "past") => void;
}

export const GroupPlansTabs: React.FC<GroupPlansTabsProps> = ({ active, onSelect }) => {
  const tabs: Array<{ key: "active" | "draft" | "past"; label: string }> = [
    { key: "active", label: "Active" },
    { key: "draft", label: "Draft" },
    { key: "past", label: "Past" },
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
