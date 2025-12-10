import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert, Platform } from "react-native";
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const [signInMutation] = useMutation(SIGN_IN);
  const [signUpMutation] = useMutation(SIGN_UP);
  const [googleSignInMutation] = useMutation(GOOGLE_SIGN_IN);

  // Google OAuth configuration
  const discovery = AuthSession.useAutoDiscovery("https://accounts.google.com");

  // Use platform-specific client IDs
  const clientId = React.useMemo(() => {
    if (Platform.OS === "ios") {
      return process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "";
    } else if (Platform.OS === "android") {
      return process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || "";
    }
    return process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "";
  }, []);

  // For iOS native client, use reverse domain redirect URI
  const redirectUri = React.useMemo(() => {
    if (Platform.OS === "ios") {
      // iOS uses reverse domain notation from client ID
      return "com.googleusercontent.apps.924582733350-h1v2t6aufre40fsgslfkausj4piiedvt:/oauth2redirect/google";
    }
    // For Android and web, use standard redirect
    return AuthSession.makeRedirectUri({
      scheme: "pursuit",
    });
  }, []);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: clientId,
      scopes: ["openid", "profile", "email"],
      responseType: AuthSession.ResponseType.Code,
      redirectUri: redirectUri,
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
      // The response will be handled by the signInWithGoogle function
    } else if (response?.type === "error") {
      console.error("OAuth response error:", response.error);
    }
  }, [response]);

  const loadStoredUser = async () => {
    try {
      const [tokens, storedUser] = await Promise.all([
        getTokens(),
        getUserData<User>(),
      ]);

      if (storedUser && tokens.accessToken) {
        setUser(storedUser);
        setToken(tokens.accessToken);
      }
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

        setToken(authPayload.accessToken);
        setUser(user);
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

        setToken(authPayload.accessToken);
        setUser(user);
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

      // Prompt the user to authenticate with Google
      const result = await promptAsync();

      if (result.type === "success") {
        // Extract the authorization code from the response
        const authCode = result.params.code;

        if (!authCode) {
          console.error(
            "No authorization code in result params:",
            result.params
          );
          throw new Error("No authorization code received from Google");
        }

        // Check if we have the discovery document
        if (!discovery) {
          throw new Error("Discovery document not available");
        }

        // Exchange the authorization code for tokens
        const tokenResult = await AuthSession.exchangeCodeAsync(
          {
            clientId: clientId,
            code: authCode,
            redirectUri: redirectUri,
            extraParams: request.codeVerifier
              ? {
                  code_verifier: request.codeVerifier,
                }
              : {},
          },
          discovery
        );

        if (tokenResult.idToken) {
          // Send the ID token to our backend - FIX: use idToken not token
          const { data } = await googleSignInMutation({
            variables: { idToken: tokenResult.idToken },
          });

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

            // Store tokens securely using expo-secure-store
            await storeTokens({
              accessToken: authPayload.accessToken,
              sessionToken: authPayload.sessionToken,
              refreshToken: authPayload.refreshToken,
            });

            // Store user data securely
            await storeUserData(user);

            setToken(authPayload.accessToken);
            setUser(user);

            return true;
          } else {
            console.error("Backend did not return valid auth data");
            Alert.alert(
              "Google Sign In Failed",
              "Authentication failed. Please try again."
            );
          }
        } else {
          console.error(" No ID token received from Google");
          Alert.alert(
            "Google Sign In Failed",
            "Failed to get authentication token from Google."
          );
        }
      } else if (result.type === "cancel") {
        return false;
      } else if (result.type === "error") {
        console.error("OAuth error:", result.error);
        Alert.alert(
          "Google Sign In Failed",
          `Error: ${result.error?.message || "Unknown error"}`
        );
        return false;
      } else if (result.type === "dismiss") {
        return false;
      } else {
        console.error(" Unknown OAuth result type:", result.type, result);
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
