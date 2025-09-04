import React, { useState, useRef } from "react";
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ShakeAnimatedView, ShakeAnimatedViewRef } from "components/Animations";
import colors, { theme } from "themes/tokens/colors";
import { typography } from "themes/tokens/typography";
import GoogleIcon from "assets/icons/google.svg";

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

  React.useImperativeHandle(ref, () => ({
    shake: () => shakeViewRef.current?.shake(),
  }));

  return (
    <LinearGradient
      colors={[colors.deluge, colors.careysPink, colors.roseFog]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>{heroTitle}</Text>
            <Text style={styles.heroSubtitle}>{heroSubtitle}</Text>
          </View>

          <ShakeAnimatedView ref={shakeViewRef} style={styles.formContainer}>
            <View style={styles.form}>{children}</View>
          </ShakeAnimatedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
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
    <View style={styles.fieldContainer}>
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
            <Pressable onPress={onTogglePassword} style={styles.eyeButton}>
              <Text style={styles.eyeIcon}>{showPassword ? "👁️" : "🙈"}</Text>
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
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[
          styles.authButton,
          (disabled || loading) && styles.authButtonDisabled,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={
            disabled || loading
              ? [colors.aluminium, colors.silverSand]
              : [colors.deluge, colors.delugeLight]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.authButtonGradient}
        >
          <Text style={styles.authButtonText}>
            {loading ? loadingText : text}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
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

      <TouchableOpacity
        style={styles.googleSignInButton}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.googleButtonContent}>
          <View style={styles.googleIconContainer}>
            <GoogleIcon width={20} height={20} style={styles.googleIcon} />
          </View>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </View>
      </TouchableOpacity>
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
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  heroSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.white,
    marginBottom: 8,
    textAlign: "center",
    fontFamily: typography.h1.fontFamily,
    textShadowColor: colors.black,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 18,
    color: colors.white50,
    textAlign: "center",
    fontFamily: typography.body.fontFamily,
    textShadowColor: colors.white02,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  formContainer: {
    backgroundColor: theme.background,
    borderRadius: 32,
    padding: "8%",
    minHeight: "50%",
    elevation: 20,
    shadowColor: theme.text.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  form: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    backgroundColor: theme.background,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.border,
    position: "relative",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 4,
    minHeight: 60,
    elevation: 2,
    shadowColor: theme.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    justifyContent: "center",
  },

  inputContainerFocused: {
    borderColor: theme.secondary,
    borderWidth: 3,
    elevation: 6,
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
    color: theme.text.primary,
    paddingVertical: 12,
    paddingHorizontal: 0,
    minHeight: 24,
  },
  inputWithToggle: {
    marginRight: 8,
  },
  eyeButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 32,
    minHeight: 32,
  },

  eyeIcon: {
    fontSize: 20,
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
  buttonContainer: {
    marginBottom: 24,
  },
  authButton: {
    borderRadius: 25,
    elevation: 8,
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
  authButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  authButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.background,
    fontFamily: typography.button.fontFamily,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
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
  googleSignInButton: {
    borderRadius: 25,
    borderWidth: 2,
    borderColor: theme.border,
    backgroundColor: theme.background,
    marginBottom: 24,
    elevation: 4,
    shadowColor: theme.text.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  googleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 56,
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
