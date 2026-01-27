import colors, { theme } from "themes/tokens/colors";
import { fontSizes, fontWeights, typography } from "themes/tokens/typography";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import GoogleIcon from "assets/icons/google.svg";

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
  loading?: boolean;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "tertiary" | "switch" | "third-party";
  onPress?: () => void;
  disabled?: boolean;
  style?: object;
  textStyle?: object;
  circleDimensions?: CircleDimensions;
  switchProps?: SwitchProps;
}

export const Button: React.FC<ButtonProps> = ({
  text,
  loading,
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
          {loading && <ActivityIndicator size="small" color={colors.white} />}
        </Pressable>
      );
    case "secondary":
      return (
        <Pressable
          onPress={onPress}
          disabled={disabled}
          style={[
            styles.secondary,
            circleDimensions,
            circleDimensions?.borderWidth === 0 && { elevation: 0 },
            style,
          ]}
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
          trackColor={{
            false: colors.white,
            true: colors.black,
          }}
          ios_backgroundColor={colors.aluminium}
          style={[styles.switch, style]}
          testID="button-switch"
        />
      );

    case "third-party":
      return (
        <Pressable style={styles.googleSignInButton} onPress={onPress}>
          <View style={styles.googleIconContainer}>
            <GoogleIcon width={20} height={20} style={styles.googleIcon} />
          </View>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </Pressable>
      );
  }
};

const styles = StyleSheet.create({
  primary: {
    width: "100%",
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
    fontWeight: "700",
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
  googleSignInButton: {
    borderRadius: 25,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.background,
    elevation: 2,
    shadowColor: theme.text.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    height: 56,
  },

  googleIconContainer: {
    marginRight: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  googleIcon: {
    fontSize: 20,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.text.primary,
    fontFamily: typography.button.fontFamily,
  },
});
