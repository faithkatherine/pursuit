import colors from "pursuit/themes/tokens/colors";
import {
  fontSizes,
  fontWeights,
  typography,
} from "pursuit/themes/tokens/typography";
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
    backgroundColor: colors.white02,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "center",
  },
  primaryButtonText: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.white,
    fontWeight: "600",
  },
  secondary: {
    backgroundColor: colors.white50,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonText: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.lg,
    color: colors.black,
    textAlign: "center",
  },
});
