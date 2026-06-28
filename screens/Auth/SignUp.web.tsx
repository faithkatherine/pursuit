import { useRef, useState } from "react";
import { Alert } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "expo-router";

import { useAuth } from "@mobile/providers/AuthProvider";
import { AuthButton, AuthField, AuthPrompt, GoogleButton } from "components/Auth";
import { AuthWebShell } from "./AuthWebShell.web";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const SignUp = () => {
  const router = useRouter();
  const { signUp, signInWithGoogle, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const authLayoutRef = useRef<{ shake: () => void }>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");
  const shakeError = () => authLayoutRef.current?.shake();

  const onSubmit = async (data: SignUpFormData) => {
    setIsSubmitting(true);
    try {
      const success = await signUp(data.name, data.email, data.password);
      if (!success) shakeError();
    } catch (error) {
      console.error("Sign up error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
      shakeError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const success = await signInWithGoogle();
      if (!success) shakeError();
    } catch (error) {
      console.error("Google sign up error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
      shakeError();
    }
  };

  return (
    <AuthWebShell
      title="Build a plan around what actually feels worth going out for."
      subtitle="Create your account and let Pursuit tune the first recommendations around your neighborhoods and taste."
      panelTitle="Create account"
    >
      <Controller
        control={control}
        name="name"
        rules={{
          required: "Name is required",
          minLength: {
            value: 2,
            message: "Name must be at least 2 characters",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthField
            label="Full Name"
            value={value}
            onChangeText={onChange}
            onBlur={() => {
              onBlur();
              setFocusedField(null);
            }}
            onFocus={() => setFocusedField("name")}
            error={errors.name?.message}
            autoCapitalize="words"
            autoComplete="name"
            focused={focusedField === "name"}
          />
        )}
      />
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
            autoComplete="new-password"
            focused={focusedField === "password"}
          />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        rules={{
          required: "Please confirm your password",
          validate: (value) => value === password || "Passwords do not match",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthField
            label="Confirm Password"
            value={value}
            onChangeText={onChange}
            onBlur={() => {
              onBlur();
              setFocusedField(null);
            }}
            onFocus={() => setFocusedField("confirmPassword")}
            error={errors.confirmPassword?.message}
            secureTextEntry={!showConfirmPassword}
            showPasswordToggle
            onTogglePassword={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            showPassword={showConfirmPassword}
            autoComplete="new-password"
            focused={focusedField === "confirmPassword"}
          />
        )}
      />
      <AuthButton
        onPress={handleSubmit(onSubmit, shakeError)}
        loading={isSubmitting || isLoading}
        text="Sign Up"
        loadingText="Creating account..."
      />
      <GoogleButton onPress={handleGoogleSignUp} />
      <AuthPrompt
        text="Already have an account? "
        linkText="Sign In"
        onPress={() => router.push("/auth/signin")}
      />
    </AuthWebShell>
  );
};
