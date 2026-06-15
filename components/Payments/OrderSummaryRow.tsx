import React from "react";
import { View, Text, StyleSheet } from "react-native";

import colors from "themes/tokens/colors";
import typography, { fontSizes, fontWeights } from "themes/tokens/typography";

interface OrderSummaryRowProps {
  label: string;
  amount: number;
  isTotal?: boolean;
  isDiscount?: boolean;
}

const formatKES = (amount: number): string =>
  new Intl.NumberFormat("en-KE", {
    maximumFractionDigits: 0,
  }).format(amount);

export const OrderSummaryRow = ({
  label,
  amount,
  isTotal = false,
  isDiscount = false,
}: OrderSummaryRowProps) => {
  const amountText = `${isDiscount ? "- " : ""}KES ${formatKES(amount)}`;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, isTotal && styles.totalLabel]}>{label}</Text>
      <Text
        style={[
          styles.amount,
          isTotal && styles.totalAmount,
          isDiscount && styles.discountAmount,
        ]}
      >
        {amountText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    flex: 1,
    ...typography.bodySmall,
    lineHeight: 20,
    color: colors.onSurfaceVariant,
  },
  amount: {
    ...typography.bodySmall,
    lineHeight: 20,
    color: colors.onSurfaceVariant,
  },
  totalLabel: {
    ...typography.h4,
    fontSize: fontSizes.lg,
    lineHeight: 24,
    fontWeight: fontWeights.bold,
    color: colors.onSurface,
  },
  totalAmount: {
    ...typography.h3,
    fontSize: fontSizes.xl,
    lineHeight: 28,
    fontWeight: fontWeights.bold,
    color: colors.primary,
  },
  discountAmount: {
    color: colors.tertiary,
  },
});
