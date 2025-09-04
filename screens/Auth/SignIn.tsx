import { useForm, Controller } from "react-hook-form";
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useRef } from "react";
import { ShakeAnimatedView, ShakeAnimatedViewRef } from "components/Animations";
import { useRouter } from 'expo-router';
import colors, { theme } from "themes/tokens/colors";
import { typography } from "themes/tokens/typography";
import { Button } from "components/Buttons";
import { useAuth } from "contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient";

interface SignInFormData {
  email: string;
  password: string;
}

export const SignIn = () => {
  const router = useRouter();
  const { signIn, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shakeViewRef = useRef<ShakeAnimatedViewRef>(null);

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
    shakeViewRef.current?.shake();
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
      console.error('Sign in error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <ShakeAnimatedView ref={shakeViewRef} style={styles.formContainer}>
            <View style={styles.header}>
              <Text style={styles.welcomeText}>Welcome Back! ✨</Text>
              <Text style={styles.subtitle}>Sign in to continue your journey</Text>
            </View>

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
                      <Text style={styles.error}>
                        {errors.email.message}
                      </Text>
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
                      style={[styles.input, errors.password && styles.inputError]}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Enter your password"
                      placeholderTextColor={colors.aluminium}
                      secureTextEntry
                      autoComplete="password"
                    />
                    {errors.password && (
                      <Text style={styles.error}>
                        {errors.password.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <View style={styles.buttonContainer}>
                <Button
                  text={isSubmitting || isLoading ? "✨ Signing In..." : "🚀 Sign In"}
                  variant="primary"
                  onPress={handleSubmit(onSubmit, onError)}
                  disabled={isSubmitting || isLoading}
                  style={styles.signInButton}
                />
              </View>

              <View style={styles.signUpPrompt}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <Text 
                  style={styles.signUpLink}
                  onPress={() => router.push('/auth/signup')}
                >
                  Sign Up
                </Text>
              </View>
            </View>
          </ShakeAnimatedView>
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
    justifyContent: 'center',
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
  },
  form: {
    width: '100%',
  },
  fieldContainer: {
    marginBottom: 24,
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
  signInButton: {
    backgroundColor: colors.deluge,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    elevation: 4,
    shadowColor: colors.deluge,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    alignSelf: 'stretch',
  },
  signUpPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 16,
    color: theme.text.secondary,
    fontFamily: typography.body.fontFamily,
  },
  signUpLink: {
    fontSize: 16,
    color: colors.deluge,
    fontWeight: "600",
    fontFamily: typography.body.fontFamily,
  },
});