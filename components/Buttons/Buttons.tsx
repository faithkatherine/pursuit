import colors from "themes/tokens/colors";
import { fontSizes, fontWeights, typography } from "themes/tokens/typography";
import { Pressable, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface CircleDimensions {
  width?: number;
  height?: number;
  borderRadius?: number;
  backgroundColor?: string;
}

interface ButtonProps {
  text?: string;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "tertiary";
  onPress?: () => void;
  disabled?: boolean;
  style?: object;
  circleDimensions?: CircleDimensions;
}

export const Button: React.FC<ButtonProps> = ({
  text,
  icon,
  variant = "primary",
  onPress,
  disabled,
  style,
  circleDimensions,
}) => {
  switch (variant) {
    case "primary":
      return (
        <Pressable
          onPress={onPress}
          disabled={disabled}
          style={[styles.primary, style]}
          testID="button-primary"
        >
          {text && <Text style={styles.primaryButtonText}>{text}</Text>}
          {icon && icon}
        </Pressable>
      );
    case "secondary":
      return (
        <Pressable
          onPress={onPress}
          disabled={disabled}
          style={[styles.secondary, circleDimensions, style]}
          testID="button-secondary"
        >
          {text && <Text style={styles.secondaryButtonText}>{text}</Text>}
          {icon && icon}
        </Pressable>
      );
  }
};

const styles = StyleSheet.create({
  primary: {
    backgroundColor: colors.deluge,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.deluge,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryButtonText: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.lg,
    color: colors.white,
    fontWeight: "600",
    textAlign: "center",
  },
  secondary: {
    backgroundColor: colors.silverSand,
    borderWidth: 1,
    borderColor: colors.aluminium,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  secondaryButtonText: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.thunder,
    textAlign: "center",
    fontWeight: "500",
  },
});
