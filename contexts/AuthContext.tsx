import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from AsyncStorage on app start
  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
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

      // Mock authentication - replace with actual API call
      if (email && password.length >= 6) {
        const mockUser: User = {
          id: "1",
          name:
            email.split("@")[0].charAt(0).toUpperCase() +
            email.split("@")[0].slice(1),
          email: email,
          avatar: "https://randomuser.me/api/portraits/women/10.jpg",
        };

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
        setUser(mockUser);
        return true;
      } else {
        Alert.alert("Sign In Failed", "Please check your email and password.");
        return false;
      }
    } catch (error) {
      console.error("Sign in error:", error);
      Alert.alert("Sign In Failed", "An error occurred during sign in.");
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

      // Mock registration - replace with actual API call
      if (name && email && password.length >= 6) {
        const mockUser: User = {
          id: Date.now().toString(),
          name: name,
          email: email,
          avatar: "https://randomuser.me/api/portraits/women/10.jpg",
        };

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
        setUser(mockUser);
        return true;
      } else {
        Alert.alert(
          "Sign Up Failed",
          "Please fill in all fields and ensure password is at least 6 characters."
        );
        return false;
      }
    } catch (error) {
      console.error("Sign up error:", error);
      Alert.alert("Sign Up Failed", "An error occurred during sign up.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setUser(null);
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
