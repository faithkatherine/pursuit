import { View, Text, StyleSheet } from "react-native";
import typography, { fontSizes, fontWeights } from "@shared/constants/tokens/typography";
import { spacing, radii } from "@shared/constants/tokens/spacing";
import colors from "@shared/constants/tokens/colors";
import HeartIcon from "assets/icons/heart.svg";

export interface SavedIndicatorProps {
  iconSize: number;
  iconColor: string;
  showBackground?: boolean;
  backgroundColor?: string;
  textColor?: string;
  testID?: string;
}

export const SavedIndicator = ({
  iconSize,
  iconColor,
  showBackground = false,
  backgroundColor,
  textColor,
  testID,
}: SavedIndicatorProps) => (
  <View
    style={[
      showBackground ? styles.confirmation : styles.indicator,
      showBackground && backgroundColor && { backgroundColor },
    ]}
    testID={testID}
    accessible
    accessibilityRole="text"
    accessibilityLabel="Saved to plans"
  >
    <HeartIcon
      width={iconSize}
      height={iconSize}
      fill={iconColor}
      color={iconColor}
    />
    <Text
      style={[
        showBackground ? styles.confirmationText : styles.indicatorText,
        {
          color: textColor || (showBackground ? iconColor : colors.graniteGray),
        },
      ]}
    >
      Saved to plans
    </Text>
  </View>
);

const styles = StyleSheet.create({
  indicator: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 4,
  },
  indicatorText: {
    ...typography.body,
    fontSize: 11,
  },
  confirmation: {
    flexDirection: "row",
    gap: spacing.xs,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: radii.lg,
    minHeight: 48,
  },
  confirmationText: {
    ...typography.body,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
  },
});
