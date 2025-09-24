import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@apollo/client";
import { SIGN_IN, SIGN_UP } from "../graphql/queries";

export interface User {
  id: string;
  name: string;
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
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  completeOnboarding: (interests: string[]) => Promise<void>;
  needsOnboarding: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

const STORAGE_KEY = "pursuit_auth_user";
const TOKEN_KEY = "pursuit_auth_token";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const [signInMutation] = useMutation(SIGN_IN);
  const [signUpMutation] = useMutation(SIGN_UP);

  // Load user from AsyncStorage on app start
  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
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

      if (data?.signIn) {
        const { user: userData, token: authToken } = data.signIn;
        const user: User = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
        };

        // Store token and user data
        await AsyncStorage.setItem(TOKEN_KEY, authToken);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));

        setToken(authToken);
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

      const { data } = await signUpMutation({
        variables: { name, email, password },
      });

      if (data?.signUp) {
        const { user: userData, token: authToken } = data.signUp;
        const user: User = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar,
        };

        // Store token and user data
        await AsyncStorage.setItem(TOKEN_KEY, authToken);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));

        setToken(authToken);
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

  const signOut = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      await AsyncStorage.removeItem(TOKEN_KEY);
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

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
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
