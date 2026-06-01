import { Pressable, Text, StyleSheet } from "react-native";
import typography, { fontSizes, fontWeights } from "themes/tokens/typography";
import { spacing, radii } from "themes/tokens/spacing";

export interface CTAButtonProps {
  variant: "primary" | "outlined";
  onPress: () => void;
  disabled?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  textColor: string;
  children: string;
  flex?: number;
  fullWidth?: boolean;
  testID?: string;
}

export const CTAButton = ({
  variant,
  onPress,
  disabled = false,
  backgroundColor,
  borderColor,
  textColor,
  children,
  flex,
  fullWidth = false,
  testID,
}: CTAButtonProps) => (
  <Pressable
    style={[
      styles.button,
      variant === "primary" && styles.buttonPrimary,
      variant === "outlined" && styles.buttonOutlined,
      fullWidth && styles.buttonFull,
      {
        ...(backgroundColor && { backgroundColor }),
        ...(borderColor && { borderColor }),
        ...(flex && { flex }),
      },
    ]}
    onPress={onPress}
    disabled={disabled}
    testID={testID}
    accessibilityRole="button"
    accessibilityLabel={children}
  >
    <Text style={[styles.buttonText, { color: textColor }]}>{children}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 48,
  },
  buttonPrimary: {
    flex: 1,
  },
  buttonOutlined: {
    flex: 1,
    borderWidth: 1.5,
  },
  buttonFull: {
    width: "100%",
  },
  buttonText: {
    ...typography.body,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    lineHeight: 18,
  },
});
