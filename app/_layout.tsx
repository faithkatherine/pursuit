import { ApolloProvider } from "@apollo/client";
import { client } from "graphql/client";
import { Stack, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "providers/AuthProvider";
import { useEffect } from "react";
import { Loading } from "components/Layout";

function InitialLayout() {
  const {
    isAuthenticated,
    isLoading,
    needsOnboarding,
    hasSeenGetStarted,
    hasAttemptedAuth,
  } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && !needsOnboarding) {
      router.replace("/(tabs)");
      return;
    }

    if (isAuthenticated && needsOnboarding) {
      if (!hasSeenGetStarted) {
        router.replace("/get-started");
      } else {
        router.replace("/onboarding/interests");
      }
      return;
    }

    if (!isAuthenticated) {
      if (!hasSeenGetStarted || !hasAttemptedAuth) {
        router.replace("/get-started");
      } else {
        router.replace("/auth/signin");
      }
      return;
    }
  }, [
    isAuthenticated,
    isLoading,
    needsOnboarding,
    hasSeenGetStarted,
    hasAttemptedAuth,
    router,
  ]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="get-started"
        options={{
          headerShown: false,
          contentStyle: {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        }}
      />
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
    <SafeAreaProvider>
      <ApolloProvider client={client}>
        <AuthProvider>
          <InitialLayout />
        </AuthProvider>
      </ApolloProvider>
    </SafeAreaProvider>
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
