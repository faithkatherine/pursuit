import colors, { theme } from "themes/tokens/colors";
import { fontSizes, typography } from "themes/tokens/typography";
import { radii } from "themes/tokens/spacing";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import GoogleIcon from "assets/icons/google.svg";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";

interface ButtonProps {
  text?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "third-party"
    | "gradient"
    | "chips"
    | "save"
    | "back";
  onPress?: () => void;
  disabled?: boolean;
  style?: object;
  textStyle?: object;
  /** secondary only: renders as a transparent ghost/text button (replaces old "tertiary" variant) */
  ghost?: boolean;
  /** chips only */
  selected?: boolean;
  /** save & back variants only: indicates saved state for save button */
  isSaved?: boolean;
  /** save & back variants only: for accessibility or custom styling */
  size?: "sm" | "md" | "lg";
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
  ghost,
  selected,
  isSaved,
  size = "md",
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
      return ghost ? (
        <Pressable
          onPress={onPress}
          disabled={disabled}
          style={[style]}
          testID="button-secondary-ghost"
        >
          {text && (
            <Text style={[styles.ghostButtonText, textStyle]}>{text}</Text>
          )}
          {icon && icon}
        </Pressable>
      ) : (
        <Pressable
          onPress={onPress}
          disabled={disabled}
          style={[styles.secondary, style]}
          testID="button-secondary"
        >
          {text && (
            <Text style={[styles.secondaryButtonText, textStyle]}>{text}</Text>
          )}
          {icon && icon}
        </Pressable>
      );

    case "third-party":
      return (
        <Pressable
          style={[styles.thirdPartyButton, style]}
          onPress={onPress}
          testID="button-third-party"
        >
          {icon ? (
            <View style={styles.thirdPartyIconContainer}>{icon}</View>
          ) : (
            <View style={styles.thirdPartyIconContainer}>
              <GoogleIcon width={20} height={20} />
            </View>
          )}
          <Text style={[styles.thirdPartyButtonText, textStyle]}>
            {text ?? "Continue with Google"}
          </Text>
        </Pressable>
      );

    case "gradient":
      return (
        <AnimatedGradientButton
          onPress={onPress}
          disabled={disabled}
          text={text}
          textStyle={textStyle}
          icon={icon}
          loading={loading}
          style={style}
        />
      );

    case "chips":
      return (
        <Pressable
          onPress={onPress}
          style={[
            styles.filterChip,
            selected ? styles.filterChipSelected : styles.filterChipUnselected,
          ]}
          testID="button-chips"
        >
          <Text
            style={[
              styles.filterChipText,
              selected
                ? styles.filterChipTextSelected
                : styles.filterChipTextUnselected,
            ]}
          >
            {text}
          </Text>
        </Pressable>
      );

    case "save":
      return (
        <Pressable
          onPress={onPress}
          disabled={disabled || loading}
          style={[
            styles.iconButtonBase,
            size === "sm" && styles.iconButtonSm,
            size === "md" && styles.iconButtonMd,
            size === "lg" && styles.iconButtonLg,
            style,
          ]}
          testID="button-save"
        >
          {icon && icon}
          {loading && <ActivityIndicator size="small" color={colors.white} />}
        </Pressable>
      );

    case "back":
      return (
        <Pressable
          onPress={onPress}
          disabled={disabled}
          style={[
            styles.iconButtonBase,
            size === "sm" && styles.iconButtonSm,
            size === "md" && styles.iconButtonMd,
            size === "lg" && styles.iconButtonLg,
            style,
          ]}
          testID="button-back"
        >
          {icon && icon}
        </Pressable>
      );
  }
};

const AnimatedGradientButton: React.FC<{
  onPress?: () => void;
  disabled?: boolean;
  text?: string;
  textStyle?: object;
  icon?: React.ReactNode;
  loading?: boolean;
  style?: object;
}> = ({ onPress, disabled, text, textStyle, icon, loading, style }) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [rotation]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  return (
    <View style={[styles.gradientWrapper, style]}>
      <Animated.View
        style={[styles.gradientRotating, { transform: [{ rotate: spin }] }]}
      >
        <LinearGradient
          colors={[colors.shilo, colors.ube, colors.deluge]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={[
            "rgba(234, 192, 197, 0.8)",
            "transparent",
            "rgba(139, 127, 188, 0.8)",
          ]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={styles.gradientInner}
        testID="button-gradient"
      >
        {text && <Text style={[styles.gradientText, textStyle]}>{text}</Text>}
        {icon && icon}
        {loading && <ActivityIndicator size="small" color={colors.deluge} />}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  primary: {
    width: "100%",
    backgroundColor: colors.deluge,
    borderRadius: radii.md,
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
    borderRadius: radii.md,
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
  ghostButtonText: {
    fontFamily: typography.h3.fontFamily,
    fontSize: typography.h3.fontSize,
    color: colors.white,
    fontWeight: "500",
  },
  thirdPartyButton: {
    borderRadius: radii.full,
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
  thirdPartyIconContainer: {
    marginRight: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  thirdPartyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.text.primary,
    fontFamily: typography.button.fontFamily,
  },
  gradientWrapper: {
    width: "100%",
    borderRadius: radii.full,
    padding: 2,
    alignSelf: "center",
    overflow: "hidden",
  },
  gradientRotating: {
    position: "absolute",
    top: "-50%",
    left: "-25%",
    width: "150%",
    height: "200%",
  },
  gradientInner: {
    backgroundColor: colors.white,
    borderRadius: radii.full,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  gradientText: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.lg,
    color: colors.black,
    fontWeight: "600",
    textAlign: "center",
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.xl,
  },
  filterChipSelected: {
    backgroundColor: colors.thunder,
  },
  filterChipUnselected: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.25)",
  },
  filterChipText: {
    fontFamily: typography.caption.fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: "500",
  },
  filterChipTextSelected: {
    color: colors.white,
  },
  filterChipTextUnselected: {
    color: colors.thunder,
  },
  iconButtonBase: {
    borderRadius: radii.full,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonSm: {
    width: 32,
    height: 32,
  },
  iconButtonMd: {
    width: 40,
    height: 40,
  },
  iconButtonLg: {
    width: 48,
    height: 48,
  },
});
