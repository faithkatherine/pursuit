import colors from "themes/tokens/colors";
import { fontSizes, fontWeights, typography } from "themes/tokens/typography";
import { Pressable, StyleSheet, Switch, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface CircleDimensions {
  width?: number;
  height?: number;
  borderRadius?: number;
  borderWidth?: number;
  backgroundColor?: string;
}

interface SwitchProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

interface ButtonProps {
  text?: string;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "tertiary" | "switch";
  onPress?: () => void;
  disabled?: boolean;
  style?: object;
  textStyle?: object;
  circleDimensions?: CircleDimensions;
  switchProps?: SwitchProps;
}

export const Button: React.FC<ButtonProps> = ({
  text,
  icon,
  variant = "primary",
  onPress,
  disabled,
  style,
  textStyle,
  circleDimensions,
  switchProps,
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
          {text && (
            <Text style={[styles.primaryButtonText, textStyle]}>{text}</Text>
          )}
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

    case "tertiary":
      return (
        <Pressable
          onPress={onPress}
          disabled={disabled}
          style={[style]}
          testID="button-tertiary"
        >
          {text && (
            <Text style={[styles.tertiaryButtonText, textStyle]}>{text}</Text>
          )}
        </Pressable>
      );

    case "switch":
      return (
        <Switch
          value={switchProps?.isEnabled}
          onValueChange={switchProps?.onToggle}
          thumbColor={
            switchProps?.isEnabled ? colors.white : colors.graniteGray
          }
          trackColor={{ false: colors.white, true: colors.black }}
          ios_backgroundColor={colors.aluminium}
          style={[styles.switch, style]}
          testID="button-switch"
        />
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
  tertiaryButtonText: {
    fontFamily: typography.h3.fontFamily,
    fontSize: typography.h3.fontSize,
    color: colors.white,
    fontWeight: "500",
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
});
