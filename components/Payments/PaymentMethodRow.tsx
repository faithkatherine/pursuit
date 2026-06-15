import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "themes/tokens/colors";
import typography, { fontSizes, fontWeights } from "themes/tokens/typography";
import { radii, spacing } from "themes/tokens/spacing";

interface PaymentMethodRowProps {
  sublabel: string;
}

export const PaymentMethodRow = ({ sublabel }: PaymentMethodRowProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="cellphone" size={22} color={colors.primary} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>M-Pesa</Text>
        <Text style={styles.sublabel}>{sublabel}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    padding: spacing.base,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.white,
  },
  iconContainer: {
    width: 40,
    height: 40,
    marginRight: spacing.md,
    borderRadius: radii.full,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  label: {
    ...typography.labelLarge,
    fontSize: fontSizes.base,
    lineHeight: 22,
    fontWeight: fontWeights.semibold,
    color: colors.onSurface,
  },
  sublabel: {
    ...typography.bodySmall,
    marginTop: 2,
    lineHeight: 20,
    color: colors.onSurfaceVariant,
  },
});
