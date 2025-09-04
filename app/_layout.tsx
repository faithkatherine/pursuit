import { ApolloProvider } from "@apollo/client";
import { client } from "graphql/client";
import { Stack, useRouter, useSegments } from "expo-router";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { AuthProvider, useAuth } from "contexts/AuthContext";
import { useEffect } from "react";

function InitialLayout() {
  const { isAuthenticated, isLoading, needsOnboarding } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return; // Don't do anything while loading

    const inAuthGroup = segments[0] === "auth";
    const inOnboardingGroup = segments[0] === "onboarding";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to sign in if not authenticated and not in auth group
      router.replace("/auth/signin");
    } else if (isAuthenticated && inAuthGroup) {
      // Check if user needs onboarding after successful auth
      if (needsOnboarding) {
        router.replace("/onboarding/interests");
      } else {
        router.replace("/(tabs)");
      }
    } else if (isAuthenticated && needsOnboarding && !inOnboardingGroup) {
      // Redirect to onboarding if user is authenticated but hasn't completed onboarding
      router.replace("/onboarding/interests");
    } else if (isAuthenticated && !needsOnboarding && inOnboardingGroup) {
      // Redirect to main app if user has completed onboarding
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, needsOnboarding, segments, router]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen
        name="auth/signin"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="auth/signup"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="onboarding/interests"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          header() {
            return <View style={styles.header}></View>;
          },
          headerShown: true,
          headerTitle: "",
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 70,
    backgroundColor: "transparent",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
});
