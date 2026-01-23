import React, { useRef } from "react";
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Pressable,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ShakeAnimatedView, ShakeAnimatedViewRef } from "components/Animations";
import colors, { theme } from "themes/tokens/colors";
import { typography } from "themes/tokens/typography";

import ItineraryIcon from "assets/icons/itinerary.svg";
import Svg, { Path } from "react-native-svg";
import ShowPasswordIcon from "assets/icons/show_password.svg";
import HidePasswordIcon from "assets/icons/hide_password.svg";
import { Button } from "components/Buttons";

interface AuthLayoutProps {
  children: React.ReactNode;
  heroTitle: string;
  heroSubtitle: string;
}

export const AuthLayout = React.forwardRef<
  { shake: () => void },
  AuthLayoutProps
>(({ children, heroTitle, heroSubtitle }, ref) => {
  const shakeViewRef = useRef<ShakeAnimatedViewRef>(null);
  const insets = useSafeAreaInsets();

  React.useImperativeHandle(ref, () => ({
    shake: () => shakeViewRef.current?.shake(),
  }));

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingTop: insets.top + 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroContainer}>
          <Text style={styles.heroTitle}>{heroTitle}</Text>
          <Text style={styles.heroSubtitle}>{heroSubtitle}</Text>
          <ItineraryIcon width={60} height={60} />
        </View>
        <View style={styles.envelopeContainer}>
          <Svg
            width="100%"
            height={120}
            viewBox="0 0 400 100"
            preserveAspectRatio="none"
            style={styles.flapSvg}
          >
            <Path
              d="M 0 100 C 0 92, 5 88, 15 82 L 190 3 C 195 0, 205 0, 210 3 L 385 82 C 395 88, 400 92, 400 100"
              fill={theme.background}
              stroke="transparent"
              strokeWidth={0}
            />
          </Svg>

          <ShakeAnimatedView ref={shakeViewRef} style={styles.formContainer}>
            <View style={styles.form}>{children}</View>
          </ShakeAnimatedView>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
});

interface AuthFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  onFocus?: () => void;
  error?: string;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  showPassword?: boolean;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "words";
  autoComplete?: "email" | "name" | "password" | "new-password" | "username";
  focused?: boolean;
}

export const AuthField: React.FC<AuthFieldProps> = ({
  label,
  value,
  onChangeText,
  onBlur,
  onFocus,
  error,
  secureTextEntry,
  showPasswordToggle,
  onTogglePassword,
  showPassword,
  keyboardType = "default",
  autoCapitalize = "none",
  autoComplete,
  focused,
}) => {
  const hasValue = value.length > 0;

  return (
    <View>
      <View
        style={[
          styles.inputContainer,
          focused && styles.inputContainerFocused,
          error && styles.inputContainerError,
        ]}
      >
        <Text
          style={[
            styles.floatingLabel,
            styles.floatingLabelActive,
            (focused || hasValue) && styles.floatingLabelFocused,
            error && styles.floatingLabelError,
          ]}
        >
          {label}
        </Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, showPasswordToggle && styles.inputWithToggle]}
            onBlur={onBlur}
            onFocus={onFocus}
            onChangeText={onChangeText}
            value={value}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoComplete={autoComplete}
          />
          {showPasswordToggle && (
            <Pressable onPress={onTogglePassword}>
              <Text>
                {showPassword ? (
                  <HidePasswordIcon width={24} height={24} />
                ) : (
                  <ShowPasswordIcon width={24} height={24} />
                )}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={styles.error}>{error}</Text>
        </View>
      )}
    </View>
  );
};

interface AuthButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  text: string;
  loadingText: string;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  onPress,
  disabled,
  loading,
  text,
  loadingText,
}) => {
  return (
    <Button
      variant="primary"
      text={text}
      onPress={onPress}
      disabled={disabled || loading}
      style={styles.authButton}
    />
  );
};

interface GoogleButtonProps {
  onPress?: () => void;
}

export const GoogleButton: React.FC<GoogleButtonProps> = ({ onPress }) => {
  return (
    <>
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      <Button variant="third-party" onPress={onPress} />
    </>
  );
};

interface AuthPromptProps {
  text: string;
  linkText: string;
  onPress: () => void;
}

export const AuthPrompt: React.FC<AuthPromptProps> = ({
  text,
  linkText,
  onPress,
}) => {
  return (
    <View style={styles.authPrompt}>
      <Text style={styles.authPromptText}>{text}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.authPromptLink}>{linkText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  heroContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: "700",
    color: colors.white,
    textAlign: "center",
    marginBottom: 8,
    fontFamily: typography.h2.fontFamily,
  },
  heroSubtitle: {
    fontSize: typography.body.fontSize,
    fontWeight: "500",
    color: theme.text.secondary,
    textAlign: "center",
    marginBottom: 8,
    fontFamily: typography.body.fontFamily,
  },

  envelopeContainer: {
    width: "100%",
    alignItems: "center",
  },
  flapSvg: {
    width: "100%",
    height: 80,
  },

  formContainer: {
    backgroundColor: theme.background,
    borderRadius: 32,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: "8%",
    paddingTop: 12,
    minHeight: "50%",
    width: "100%",
  },
  form: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 24,
    justifyContent: "flex-start",
  },

  inputContainer: {
    backgroundColor: theme.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: 12,
    paddingVertical: 4,
    height: 55,
    elevation: 2,
    shadowColor: theme.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    justifyContent: "center",
  },

  inputContainerFocused: {
    borderColor: theme.secondary,
    borderWidth: 2,
    elevation: 4,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    transform: [{ scale: 1.02 }],
  },
  inputContainerError: {
    borderColor: theme.warning,
    borderWidth: 2,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  floatingLabel: {
    position: "absolute",
    left: 18,
    top: -10,
    fontSize: 12,
    color: colors.aluminium,
    backgroundColor: theme.background,
    paddingHorizontal: 4,
    fontFamily: typography.label.fontFamily,
    fontWeight: "600",
    zIndex: 1,
  },
  floatingLabelActive: {
    fontSize: 12,
    fontWeight: "700",
  },
  floatingLabelFocused: {
    color: theme.secondary,
  },
  floatingLabelError: {
    color: theme.warning,
  },
  input: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "transparent",
    fontFamily: typography.body.fontFamily,
    color: theme.text.black,
    paddingVertical: 12,
    paddingHorizontal: 0,
    minHeight: 24,
  },
  inputWithToggle: {
    marginRight: 8,
  },

  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 4,
  },
  errorEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  error: {
    color: theme.warning,
    fontSize: 14,
    fontWeight: "500",
    fontFamily: typography.caption.fontFamily,
    flex: 1,
  },

  authButton: {
    borderRadius: 25,
    elevation: 4,
    shadowColor: theme.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    overflow: "hidden",
  },
  authButtonDisabled: {
    elevation: 2,
    shadowOpacity: 0.1,
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.border,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: theme.text.muted,
    fontFamily: typography.caption.fontFamily,
  },

  authPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    paddingVertical: 8,
  },
  authPromptText: {
    fontSize: 16,
    color: theme.text.secondary,
    fontFamily: typography.body.fontFamily,
  },
  authPromptLink: {
    fontSize: 16,
    color: theme.secondary,
    fontWeight: "700",
    fontFamily: typography.body.fontFamily,
    textDecorationLine: "underline",
  },
});
