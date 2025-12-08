import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { useMutation } from "@apollo/client";
import * as AuthSession from "expo-auth-session";
import * as Crypto from "expo-crypto";
import { SIGN_IN, SIGN_UP, GOOGLE_SIGN_IN } from "../graphql/queries";
import {
  storeTokens,
  getTokens,
  storeUserData,
  getUserData,
  clearAllData,
  setHasSeenGetStarted,
  getHasSeenGetStarted,
  setHasAttemptedAuth,
  getHasAttemptedAuth,
} from "../utils/secureStorage";

export interface User {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  avatar?: string;
  hasCompletedOnboarding?: boolean;
  interests?: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  completeOnboarding: (interests: string[]) => Promise<void>;
  needsOnboarding: boolean;
  hasSeenGetStarted: boolean;
  hasAttemptedAuth: boolean;
  markGetStartedSeen: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [hasSeenGetStarted, setHasSeenGetStarted] = useState<boolean>(false);
  const [hasAttemptedAuth, setHasAttemptedAuth] = useState<boolean>(false);

  const [signInMutation] = useMutation(SIGN_IN);
  const [signUpMutation] = useMutation(SIGN_UP);
  const [googleSignInMutation] = useMutation(GOOGLE_SIGN_IN);

  // Google OAuth configuration
  const discovery = AuthSession.useAutoDiscovery("https://accounts.google.com");

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "",
      scopes: ["openid", "profile", "email"],
      responseType: AuthSession.ResponseType.Code,
      redirectUri: AuthSession.makeRedirectUri({
        scheme: "pursuit",
      }),
      prompt: AuthSession.Prompt.SelectAccount,
      usePKCE: true,
    },
    discovery
  );

  // Load user from secure storage on app start
  useEffect(() => {
    loadStoredUser();
  }, []);

  // Handle OAuth response
  useEffect(() => {
    if (response?.type === "success") {
      console.log("🔍 OAuth response received:", response);
      // The response will be handled by the signInWithGoogle function
    } else if (response?.type === "error") {
      console.error("❌ OAuth response error:", response.error);
    }
  }, [response]);

  const loadStoredUser = async () => {
    try {
      const [tokens, storedUser, seenGetStarted, attemptedAuth] =
        await Promise.all([
          getTokens(),
          getUserData<User>(),
          getHasSeenGetStarted(),
          getHasAttemptedAuth(),
        ]);

      if (storedUser && tokens.accessToken) {
        setUser(storedUser);
        setToken(tokens.accessToken);
      }

      setHasSeenGetStarted(seenGetStarted);
      setHasAttemptedAuth(attemptedAuth);
    } catch (error) {
      console.error("Error loading stored user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      const { data } = await signInMutation({
        variables: { email, password },
      });

      if (data?.signIn?.ok && data.signIn.authPayload) {
        const { authPayload } = data.signIn;
        const userData = authPayload.user;

        const user: User = {
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
        };

        // Store tokens securely
        await storeTokens({
          accessToken: authPayload.accessToken,
          sessionToken: authPayload.sessionToken,
          refreshToken: authPayload.refreshToken,
        });

        // Store user data securely
        await storeUserData(user);
        await setHasAttemptedAuth(true);

        setToken(authPayload.accessToken);
        setUser(user);
        setHasAttemptedAuth(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Sign in error:", error);
      Alert.alert("Sign In Failed", "Invalid email or password.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Split name into firstName and lastName
      const nameParts = name.trim().split(" ");
      const firstName = nameParts[0];
      const lastName =
        nameParts.length > 1 ? nameParts.slice(1).join(" ") : undefined;

      const { data } = await signUpMutation({
        variables: { firstName, lastName, email, password },
      });

      if (data?.signUp?.ok && data.signUp.authPayload) {
        const { authPayload } = data.signUp;
        const userData = authPayload.user;

        const user: User = {
          id: userData.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
        };

        // Store tokens securely
        await storeTokens({
          accessToken: authPayload.accessToken,
          sessionToken: authPayload.sessionToken,
          refreshToken: authPayload.refreshToken,
        });

        // Store user data securely
        await storeUserData(user);
        await setHasAttemptedAuth(true);

        setToken(authPayload.accessToken);
        setUser(user);
        setHasAttemptedAuth(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Sign up error:", error);
      Alert.alert(
        "Sign Up Failed",
        "Please check your information and try again."
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Check if OAuth request is ready
      if (!request) {
        Alert.alert("Error", "Google OAuth not ready. Please try again.");
        return false;
      }

      console.log("🔍 OAuth Request Config:", {
        clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        responseType: request.responseType,
        redirectUri: request.redirectUri,
        scopes: request.scopes,
        codeChallenge: request.codeChallenge,
        codeChallengeMethod: request.codeChallengeMethod,
        usePKCE: true,
      });

      console.log(
        "📋 IMPORTANT: Add this redirect URI to your Google Cloud Console:"
      );
      console.log(`   ${request.redirectUri}`);

      // Prompt the user to authenticate with Google
      const result = await promptAsync();
      console.log("🔍 OAuth Result:", result);

      if (result.type === "success") {
        console.log("✅ OAuth success! Processing result...");
        // Extract the authorization code from the response
        const authCode = result.params.code;

        if (!authCode) {
          console.error(
            "❌ No authorization code in result params:",
            result.params
          );
          throw new Error("No authorization code received from Google");
        }

        console.log(
          "✅ Authorization code received:",
          authCode.substring(0, 20) + "..."
        );

        // Check if we have the discovery document
        if (!discovery) {
          throw new Error("Discovery document not available");
        }

        console.log("🔍 Exchanging code for tokens...");

        // Exchange the authorization code for tokens
        const tokenResult = await AuthSession.exchangeCodeAsync(
          {
            clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "",
            code: authCode,
            redirectUri: AuthSession.makeRedirectUri({
              scheme: "pursuit",
            }),
            extraParams: request.codeVerifier
              ? {
                  code_verifier: request.codeVerifier,
                }
              : {},
          },
          discovery
        );

        console.log("🔍 Token Result:", tokenResult);

        if (tokenResult.idToken) {
          console.log("✅ Sending ID token to backend...");

          // Send the ID token to our backend - FIX: use idToken not token
          const { data } = await googleSignInMutation({
            variables: { idToken: tokenResult.idToken },
          });

          console.log("🔍 Backend response:", data);

          // FIX: Access authPayload structure correctly
          if (data?.googleSignIn?.ok && data.googleSignIn.authPayload) {
            const { authPayload } = data.googleSignIn;
            const userData = authPayload.user;

            const user: User = {
              id: userData.id,
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
            };

            console.log("✅ User authenticated:", user.email);

            // Store tokens securely using expo-secure-store
            await storeTokens({
              accessToken: authPayload.accessToken,
              sessionToken: authPayload.sessionToken,
              refreshToken: authPayload.refreshToken,
            });

            // Store user data securely
            await storeUserData(user);
            await setHasAttemptedAuth(true);

            setToken(authPayload.accessToken);
            setUser(user);
            setHasAttemptedAuth(true);

            console.log("✅ Google Sign-In complete!");
            return true;
          } else {
            console.error("❌ Backend did not return valid auth data");
            Alert.alert(
              "Google Sign In Failed",
              "Authentication failed. Please try again."
            );
          }
        } else {
          console.error("❌ No ID token received from Google");
          Alert.alert(
            "Google Sign In Failed",
            "Failed to get authentication token from Google."
          );
        }
      } else if (result.type === "cancel") {
        console.log("ℹ️ User cancelled the login flow");
        return false;
      } else if (result.type === "error") {
        console.error("❌ OAuth error:", result.error);
        Alert.alert(
          "Google Sign In Failed",
          `Error: ${result.error?.message || "Unknown error"}`
        );
        return false;
      } else if (result.type === "dismiss") {
        console.log("ℹ️ OAuth dismissed");
        return false;
      } else {
        console.error("❌ Unknown OAuth result type:", result.type, result);
        Alert.alert("Google Sign In Failed", "Please try again later.");
      }

      return false;
    } catch (error: any) {
      console.error("Google sign in error:", error);
      Alert.alert("Google Sign In Failed", "Please try again later.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      // Clear all secure storage (tokens + user data)
      await clearAllData();
      setUser(null);
      setToken(null);
      // Don't clear hasSeenGetStarted - user has already seen intro
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const completeOnboarding = async (interests: string[]): Promise<void> => {
    if (!user) return;

    try {
      const updatedUser = {
        ...user,
        hasCompletedOnboarding: true,
        interests,
      };

      await storeUserData(updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  const markGetStartedSeen = async (): Promise<void> => {
    try {
      await setHasSeenGetStarted(true);
      setHasSeenGetStarted(true);
    } catch (error) {
      console.error("Error marking GetStarted as seen:", error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
    completeOnboarding,
    needsOnboarding: !!user && !user.hasCompletedOnboarding,
    hasSeenGetStarted,
    hasAttemptedAuth,
    markGetStartedSeen,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
