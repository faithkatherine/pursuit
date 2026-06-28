import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "@shared/constants/tokens/colors";
import { fontSizes } from "@shared/constants/tokens/typography";
import { spacing, radii } from "@shared/constants/tokens/spacing";

interface StatTileProps {
  /** Label text displayed above the value */
  label: string;
  /** Value text displayed below the label */
  value: string | number;
  /** Background color for the tile */
  backgroundColor: string;
  /** Text color for the label */
  labelColor: string;
  /** Text color for the value */
  valueColor: string;
  /** Optional test ID for testing */
  testID?: string;
}

export const StatTile: React.FC<StatTileProps> = ({
  label,
  value,
  backgroundColor,
  labelColor,
  valueColor,
  testID,
}) => {
  return (
    <View style={[styles.tile, { backgroundColor }]} testID={testID}>
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 72,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: "400" as any,
    lineHeight: 18,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  value: {
    fontSize: fontSizes.lg,
    fontWeight: "500" as any,
    lineHeight: 24,
    textAlign: "center",
  },
});
