import { useForm, Controller } from "react-hook-form";
import { Alert, View, StyleSheet } from "react-native";
import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "providers/AuthProvider";
import {
  AuthLayout,
  AuthField,
  AuthButton,
  GoogleButton,
  AuthPrompt,
} from "components/Auth";

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

  const shakeError = () => {
    authLayoutRef.current?.shake();
  };

  const onSubmit = async (data: SignUpFormData) => {
    setIsSubmitting(true);

    try {
      const success = await signUp(data.name, data.email, data.password);
      if (success) {
        // Navigation will be handled by the auth state change in the root layout
      } else {
        shakeError();
      }
    } catch (error) {
      console.error("Sign up error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
      shakeError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = () => {
    shakeError();
  };

  const handleGoogleSignUp = async () => {
    try {
      const success = await signInWithGoogle();
      if (!success) {
        shakeError();
      }
    } catch (error) {
      console.error("Google sign up error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
      shakeError();
    }
  };

  return (
    <AuthLayout
      ref={authLayoutRef}
      heroTitle="Join the Adventure"
      heroSubtitle="Start tracking your bucket list"
    >
      <View style={styles.form}>
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
              showPasswordToggle={true}
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
              showPasswordToggle={true}
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
          onPress={handleSubmit(onSubmit, onError)}
          loading={isSubmitting || isLoading}
          text="🚀 Sign Up"
          loadingText="✨ Creating Account..."
        />

        <GoogleButton onPress={handleGoogleSignUp} />

        <AuthPrompt
          text="Already have an account? "
          linkText="Sign In"
          onPress={() => router.push("/auth/signin")}
        />
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  form: {
    flex: 1,
    justifyContent: "space-between",
  },
});
