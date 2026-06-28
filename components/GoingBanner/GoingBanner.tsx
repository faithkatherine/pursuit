import { Pressable, Text, StyleSheet, View } from "react-native";
import typography, { fontSizes, fontWeights } from "@shared/constants/tokens/typography";
import { spacing, radii } from "@shared/constants/tokens/spacing";
import colors from "@shared/constants/tokens/colors";

export interface GoingBannerProps {
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
  flex?: number;
  fullWidth?: boolean;
  testID?: string;
}

/**
 * Banner component shown when user has marked themselves as going to an event.
 * Tappable to toggle going status off.
 */
export const GoingBanner = ({
  onPress,
  backgroundColor = colors.deluge,
  textColor = colors.white,
  flex,
  fullWidth = false,
  testID,
}: GoingBannerProps) => (
  <Pressable
    style={[
      styles.banner,
      {
        backgroundColor,
        ...(flex && { flex }),
      },
      fullWidth && styles.bannerFull,
    ]}
    onPress={onPress}
    testID={testID}
    accessibilityRole="button"
    accessibilityLabel="You're going. Tap to unmark"
  >
    <View style={styles.content}>
      <Text style={[styles.checkmark, { color: textColor }]}>✓</Text>
      <Text style={[styles.text, { color: textColor }]}>Going</Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  banner: {
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 48,
  },
  bannerFull: {
    width: "100%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: fontWeights.semibold,
  },
  text: {
    ...typography.body,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    lineHeight: 18,
  },
});
