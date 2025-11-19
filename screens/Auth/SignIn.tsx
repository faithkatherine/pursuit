import { useForm, Controller } from "react-hook-form";
import { TouchableOpacity, Alert, Text, View, StyleSheet } from "react-native";
import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "providers/AuthProvider";
import { theme } from "themes/tokens/colors";
import {
  AuthLayout,
  AuthField,
  AuthButton,
  GoogleButton,
  AuthPrompt,
} from "components/Auth";

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
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const shakeError = () => {
    authLayoutRef.current?.shake();
  };

  const onSubmit = async (data: SignInFormData) => {
    setIsSubmitting(true);

    try {
      const success = await signIn(data.email, data.password);
      if (success) {
        // Navigation will be handled by the auth state change in the root layout
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

  const onError = () => {
    shakeError();
  };

  const handleGoogleSignIn = async () => {
    try {
      const success = await signInWithGoogle();
      if (!success) {
        shakeError();
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
      shakeError();
    }
  };

  return (
    <AuthLayout
      ref={authLayoutRef}
      heroTitle="Welcome Back🌟"
      heroSubtitle="Continue your adventure"
    >
      <View style={styles.form}>
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
              autoComplete="password"
              focused={focusedField === "password"}
            />
          )}
        />

        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <AuthButton
          onPress={handleSubmit(onSubmit, onError)}
          loading={isSubmitting || isLoading}
          text="🚀 Sign In"
          loadingText="✨ Signing In..."
        />

        <GoogleButton onPress={handleGoogleSignIn} />

        <AuthPrompt
          text="Don't have an account? "
          linkText="Sign Up"
          onPress={() => router.push("/auth/signup")}
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
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 24,
    paddingVertical: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: theme.secondary,
    fontWeight: "600",
  },
});
