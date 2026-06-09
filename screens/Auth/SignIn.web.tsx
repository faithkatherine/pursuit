import { useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "expo-router";

import { useAuth } from "providers/AuthProvider";
import { AuthButton, AuthField, AuthPrompt, GoogleButton } from "components/Auth";
import { AuthWebShell } from "./AuthWebShell.web";
import colors from "themes/tokens/colors";
import typography, { fontSizes, fontWeights } from "themes/tokens/typography";

interface SignInFormData {
  email: string;
  password: string;
}

export const SignIn = () => {
  const router = useRouter();
  const { signIn, signInWithGoogle, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const authLayoutRef = useRef<{ shake: () => void }>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    defaultValues: { email: "", password: "" },
  });

  const shakeError = () => authLayoutRef.current?.shake();

  const onSubmit = async (data: SignInFormData) => {
    setIsSubmitting(true);
    try {
      const success = await signIn(data.email, data.password);
      if (success) {
        router.replace("/(protected)/(tabs)/");
      } else {
        shakeError();
      }
    } catch (error) {
      console.error("Sign in error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
      shakeError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const success = await signInWithGoogle();
      if (!success) shakeError();
    } catch (error) {
      console.error("Google sign in error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
      shakeError();
    }
  };

  return (
    <AuthWebShell
      title="The city, edited for your week."
      subtitle="Sign in to pick up saved plans, tickets, and the cultural guide shaped around your taste."
      panelTitle="Welcome back"
    >
      <Controller
        control={control}
        name="email"
        rules={{
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email address",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthField
            label="Email Address"
            value={value}
            onChangeText={onChange}
            onBlur={() => {
              onBlur();
              setFocusedField(null);
            }}
            onFocus={() => setFocusedField("email")}
            error={errors.email?.message}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            focused={focusedField === "email"}
          />
        )}
      />

      <View>
        <Controller
          control={control}
          name="password"
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <AuthField
              label="Password"
              value={value}
              onChangeText={onChange}
              onBlur={() => {
                onBlur();
                setFocusedField(null);
              }}
              onFocus={() => setFocusedField("password")}
              error={errors.password?.message}
              secureTextEntry={!showPassword}
              showPasswordToggle
              onTogglePassword={() => setShowPassword(!showPassword)}
              showPassword={showPassword}
              autoComplete="password"
              focused={focusedField === "password"}
            />
          )}
        />
        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <AuthButton
        onPress={handleSubmit(onSubmit, shakeError)}
        loading={isSubmitting || isLoading}
        text="Sign In"
        loadingText="Signing in..."
      />
      <GoogleButton onPress={handleGoogleSignIn} />
      <AuthPrompt
        text="Don't have an account? "
        linkText="Sign Up"
        onPress={() => router.push("/auth/signup")}
      />
    </AuthWebShell>
  );
};

const styles = StyleSheet.create({
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  forgotPasswordText: {
    fontFamily: typography.label.fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.deluge,
  },
});
