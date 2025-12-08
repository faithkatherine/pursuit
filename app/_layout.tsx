import { ApolloProvider } from "@apollo/client";
import { client } from "graphql/client";
import { Stack, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "providers/AuthProvider";
import { useEffect, useState } from "react";
import { Loading } from "components/Layout";
import { SplashScreen } from "components/SplashScreen";
import { getHasSeenGetStarted } from "utils/secureStorage";

function InitialLayout() {
  const { isAuthenticated, isLoading, needsOnboarding } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showSplash, setShowSplash] = useState(true);
  const [hasSeenGetStarted, setHasSeenGetStarted] = useState<boolean | null>(
    null
  );

  // Check if user has seen the get-started screen
  useEffect(() => {
    const checkGetStartedStatus = async () => {
      const hasSeen = await getHasSeenGetStarted();
      setHasSeenGetStarted(hasSeen);
    };
    checkGetStartedStatus();
  }, []);

  useEffect(() => {
    if (isLoading || showSplash || hasSeenGetStarted === null) return;

    if (isAuthenticated && !needsOnboarding) {
      router.replace("/(tabs)");
      return;
    }

    if (isAuthenticated && needsOnboarding) {
      router.replace("/onboarding/interests");
      return;
    }

    // Not authenticated
    if (!isAuthenticated) {
      // If user has already seen get-started, go to sign in
      if (hasSeenGetStarted) {
        router.replace("/auth/signin");
      } else {
        // First time user, show get-started
        router.replace("get-started");
      }
      return;
    }
  }, [
    isAuthenticated,
    isLoading,
    needsOnboarding,
    router,
    showSplash,
    hasSeenGetStarted,
  ]);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (isLoading || hasSeenGetStarted === null) {
    return <Loading />;
  }

  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right",
        animationDuration: 500,
      }}
    >
      <Stack.Screen
        name="get-started"
        options={{
          headerShown: false,
          animation: "fade",
          animationDuration: 1000,
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
          animation: "fade",
          animationDuration: 700,
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
