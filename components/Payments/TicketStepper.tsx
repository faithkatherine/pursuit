import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "themes/tokens/colors";
import typography, { fontSizes, fontWeights } from "themes/tokens/typography";
import { radii, spacing } from "themes/tokens/spacing";

interface TicketStepperProps {
  tierId: number;
  tierName: string;
  description?: string;
  price: number;
  quantity: number;
  available: number;
  onIncrement: (tierId: number) => void;
  onDecrement: (tierId: number) => void;
  maxQuantity?: number;
}

const formatKES = (amount: number): string =>
  new Intl.NumberFormat("en-KE", {
    maximumFractionDigits: 0,
  }).format(amount);

export const TicketStepper = ({
  tierId,
  tierName,
  description,
  price,
  quantity,
  available,
  onIncrement,
  onDecrement,
  maxQuantity = 10,
}: TicketStepperProps) => {
  const quantityLimit = Math.min(available, maxQuantity);
  const canDecrement = quantity > 0;
  const canIncrement = quantity < quantityLimit;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.tierName}>{tierName}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
        <Text style={styles.price}>KES {formatKES(price)} each</Text>
      </View>

      <View style={styles.stepper}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${tierName} ticket`}
          disabled={!canDecrement}
          onPress={() => onDecrement(tierId)}
          style={[styles.stepperButton, styles.decrementButton, !canDecrement && styles.disabledButton]}
        >
          <MaterialCommunityIcons name="minus" size={18} color={colors.onSurface} />
        </Pressable>

        <Text style={styles.quantity}>{quantity}</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Add ${tierName} ticket`}
          disabled={!canIncrement}
          onPress={() => onIncrement(tierId)}
          style={[styles.stepperButton, styles.incrementButton, !canIncrement && styles.disabledButton]}
        >
          <MaterialCommunityIcons name="plus" size={18} color={colors.white} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.base,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outlineVariant,
  },
  content: {
    flex: 1,
    paddingRight: spacing.md,
  },
  tierName: {
    ...typography.labelLarge,
    fontSize: fontSizes.base,
    lineHeight: 22,
    fontWeight: fontWeights.semibold,
    color: colors.onSurface,
  },
  description: {
    ...typography.bodySmall,
    marginTop: spacing.xs,
    lineHeight: 20,
    color: colors.onSurfaceVariant,
  },
  price: {
    ...typography.bodySmall,
    marginTop: spacing.xs,
    lineHeight: 20,
    color: colors.onSurfaceVariant,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepperButton: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    alignItems: "center",
    justifyContent: "center",
  },
  decrementButton: {
    backgroundColor: colors.surfaceContainer,
  },
  incrementButton: {
    backgroundColor: colors.primary,
  },
  disabledButton: {
    opacity: 0.3,
  },
  quantity: {
    minWidth: 32,
    ...typography.h4,
    fontSize: fontSizes.lg,
    lineHeight: 24,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    textAlign: "center",
  },
});
