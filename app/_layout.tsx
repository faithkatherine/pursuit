import { ApolloProvider } from "@apollo/client";
import { useApolloClientDevTools } from "@dev-plugins/apollo-client";
import { client } from "graphql/client";
import { StatusBar } from "expo-status-bar";
import { Slot, SplashScreen } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "providers/AuthProvider";
import { reconcileLocation, useLocationSync } from "hooks/useLocation";
import { useEffect, useState, useCallback } from "react";
import { Platform } from "react-native";
import { SplashScreen as CustomSplashScreen } from "components/SplashScreen";
import { Loading } from "components/Layout";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const { isLoading: authIsLoading, isAuthenticated, user } = useAuth();
  const isWeb = Platform.OS === "web";
  const [isReconciled, setIsReconciled] = useState(isWeb);
  const [shouldSync, setShouldSync] = useState(false);
  useLocationSync(isWeb ? null : user, shouldSync); // Background sync - fire and forget, no need to track completion
  const [appIsReady, setAppIsReady] = useState(false);
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  // Run location reconciliation after user profile is available
  useEffect(() => {
    if (isWeb) {
      setIsReconciled(true);
      setShouldSync(false);
      return;
    }

    if (!user || !user.profile || isReconciled) return;

    console.log("🔄 Starting reconciliation for:", user.email);
    reconcileLocation(user, client).then((result) => {
      console.log("✅ Reconciliation complete:", result);
      setShouldSync(result.shouldSync);
      setIsReconciled(true);
    });
  }, [user, isReconciled, isWeb]);

  useEffect(() => {
    async function prepare() {
      try {
        // Load any resources or data here
        // For now, we'll just mark the app as ready
        if (!isWeb) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // Hide the native splash screen
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const handleCustomSplashFinish = useCallback(() => {
    setShowCustomSplash(false);
  }, []);

  useEffect(() => {
    if (appIsReady) {
      onLayoutRootView();
    }
  }, [appIsReady, onLayoutRootView]);

  // Show custom splash while app resources are loading
  if (!appIsReady || (!isWeb && showCustomSplash)) {
    return <CustomSplashScreen onFinish={handleCustomSplashFinish} />;
  }

  // Show loading while auth is initializing
  if (authIsLoading) {
    return <Loading />;
  }

  // Gate router on reconciliation completion
  // This ensures backend state is correct before home mounts and fires getHome
  if (isAuthenticated && !isReconciled) {
    console.log("⏳ Blocking home - waiting for reconciliation");
    return <Loading />;
  }

  console.log("✅ Rendering home - reconciliation complete");
  return <Slot />;
}

export default function RootLayout() {
  useApolloClientDevTools(client);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" translucent />
      <ApolloProvider client={client}>
        <AuthProvider>
          <RootLayoutContent />
        </AuthProvider>
      </ApolloProvider>
    </SafeAreaProvider>
  );
}
