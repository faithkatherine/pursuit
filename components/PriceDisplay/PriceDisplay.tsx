import { View, Text, StyleSheet } from "react-native";
import typography, { fontSizes, fontWeights } from "themes/tokens/typography";
import { spacing } from "themes/tokens/spacing";

export interface PriceDisplayProps {
  price: number | null | undefined;
  isFree: boolean;
  color: string;
  testID?: string;
}

export const PriceDisplay = ({
  price,
  isFree,
  color,
  testID,
}: PriceDisplayProps) => (
  <View
    style={styles.container}
    testID={testID}
    accessible
    accessibilityRole="text"
    accessibilityLabel={
      isFree || price === 0 ? "Free" : `KES ${price?.toLocaleString()}`
    }
  >
    <Text style={[styles.text, { color }]}>
      {isFree || price === 0 ? "Free" : `KES ${price?.toLocaleString()}`}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
  },
  text: {
    ...typography.h3,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    lineHeight: 28,
  },
});
