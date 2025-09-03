import { useForm, Controller } from "react-hook-form";
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import colors, { theme } from "pursuit/themes/tokens/colors";
import { typography } from "pursuit/themes/tokens/typography";
import { Button } from "pursuit/components/Buttons/Buttons";
import { useAuth } from "pursuit/contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const SignUp = () => {
  const router = useRouter();
  const { signUp, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

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
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
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

  return (
    <LinearGradient
      colors={[colors.prim, colors.white]}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animated.View
            style={[
              styles.formContainer,
              { transform: [{ translateX: shakeAnim }] },
            ]}
          >
            <View style={styles.header}>
              <Text style={styles.welcomeText}>Join the Adventure! 🌟</Text>
              <Text style={styles.subtitle}>
                Create your account to start tracking your bucket list
              </Text>
            </View>

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
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>👤 Full Name</Text>
                    <TextInput
                      style={[styles.input, errors.name && styles.inputError]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Your full name"
                      placeholderTextColor={colors.aluminium}
                      autoCapitalize="words"
                      autoComplete="name"
                    />
                    {errors.name && (
                      <Text style={styles.error}>{errors.name.message}</Text>
                    )}
                  </View>
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
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>📧 Email Address</Text>
                    <TextInput
                      style={[styles.input, errors.email && styles.inputError]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="your@email.com"
                      placeholderTextColor={colors.aluminium}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                    {errors.email && (
                      <Text style={styles.error}>{errors.email.message}</Text>
                    )}
                  </View>
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
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>🔐 Password</Text>
                    <TextInput
                      style={[
                        styles.input,
                        errors.password && styles.inputError,
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Create a strong password"
                      placeholderTextColor={colors.aluminium}
                      secureTextEntry
                      autoComplete="new-password"
                    />
                    {errors.password && (
                      <Text style={styles.error}>
                        {errors.password.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                rules={{
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>🔒 Confirm Password</Text>
                    <TextInput
                      style={[
                        styles.input,
                        errors.confirmPassword && styles.inputError,
                      ]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Confirm your password"
                      placeholderTextColor={colors.aluminium}
                      secureTextEntry
                      autoComplete="new-password"
                    />
                    {errors.confirmPassword && (
                      <Text style={styles.error}>
                        {errors.confirmPassword.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <View style={styles.buttonContainer}>
                <Button
                  text={
                    isSubmitting || isLoading
                      ? "✨ Creating Account..."
                      : "🚀 Sign Up"
                  }
                  variant="primary"
                  onPress={handleSubmit(onSubmit, onError)}
                  disabled={isSubmitting || isLoading}
                  style={styles.signUpButton}
                />
              </View>

              <View style={styles.signInPrompt}>
                <Text style={styles.signInText}>Already have an account? </Text>
                <Text
                  style={styles.signInLink}
                  onPress={() => router.push("/auth/signin")}
                >
                  Sign In
                </Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
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
    justifyContent: "center",
    padding: 20,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 32,
    elevation: 8,
    shadowColor: colors.thunder,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.text.primary,
    marginBottom: 8,
    textAlign: "center",
    fontFamily: typography.h2.fontFamily,
  },
  subtitle: {
    fontSize: 16,
    color: theme.text.secondary,
    textAlign: "center",
    fontStyle: "italic",
    fontFamily: typography.body.fontFamily,
    lineHeight: 22,
  },
  form: {
    width: "100%",
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.text.primary,
    marginBottom: 8,
    fontFamily: typography.label.fontFamily,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.silverSand,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: colors.thunder,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    fontFamily: typography.body.fontFamily,
  },
  inputError: {
    borderColor: colors.shilo,
    borderWidth: 2,
  },
  error: {
    color: colors.shilo,
    fontSize: 14,
    marginTop: 6,
    fontWeight: "500",
    fontFamily: typography.caption.fontFamily,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  signUpButton: {
    backgroundColor: colors.deluge,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    elevation: 4,
    shadowColor: colors.deluge,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    alignSelf: "stretch",
  },
  signInPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signInText: {
    fontSize: 16,
    color: theme.text.secondary,
    fontFamily: typography.body.fontFamily,
  },
  signInLink: {
    fontSize: 16,
    color: colors.deluge,
    fontWeight: "600",
    fontFamily: typography.body.fontFamily,
  },
});
