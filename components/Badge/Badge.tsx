import { View, Text, StyleSheet } from "react-native";
import typography, { fontWeights } from "@shared/constants/tokens/typography";
import { spacing, radii } from "@shared/constants/tokens/spacing";
import colors from "@shared/constants/tokens/colors";

export interface BadgeProps {
  text: string;
  backgroundColor: string;
  textColor?: string;
  testID?: string;
}

export const Badge = ({
  text,
  backgroundColor,
  textColor = colors.white,
  testID,
}: BadgeProps) => (
  <View
    style={[styles.container, { backgroundColor }]}
    testID={testID}
    accessible
    accessibilityRole="text"
    accessibilityLabel={text}
  >
    <Text style={[styles.text, { color: textColor }]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.md,
    minWidth: 50,
  },
  text: {
    ...typography.body,
    fontSize: 11,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.5,
    lineHeight: 16,
  },
});
