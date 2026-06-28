import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@shared/constants/tokens/colors";
import { fontSizes, fontWeights } from "@shared/constants/tokens/typography";
import { radii, spacing } from "@shared/constants/tokens/spacing";

interface CreateGroupPlanButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const CreateGroupPlanButton: React.FC<CreateGroupPlanButtonProps> = ({
  onPress,
  disabled,
  loading,
}) => (
  <Pressable
    style={styles.button}
    onPress={onPress}
    disabled={disabled || loading}
  >
    {loading ? (
      <ActivityIndicator size="small" color={colors.deluge} />
    ) : (
      <>
        <Text style={styles.text}>CREATE A GROUP PLAN</Text>
      </>
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.white65,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.full,
  },
  text: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    lineHeight: 18,
    color: colors.deluge,
    letterSpacing: 0.5,
  },
});
