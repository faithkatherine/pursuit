import { ApolloProvider } from "@apollo/client";
import { client } from "graphql/client";
import { Slot, SplashScreen } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "providers/AuthProvider";
import { useEffect, useState, useCallback } from "react";
import { SplashScreen as CustomSplashScreen } from "components/SplashScreen";
import { Loading } from "components/Layout";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const { isLoading: authIsLoading } = useAuth();
  const [appIsReady, setAppIsReady] = useState(false);
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        // Load any resources or data here
        // For now, we'll just mark the app as ready
        await new Promise((resolve) => setTimeout(resolve, 100));
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
  if (!appIsReady || showCustomSplash) {
    return <CustomSplashScreen onFinish={handleCustomSplashFinish} />;
  }

  // Show loading while auth is initializing
  if (authIsLoading) {
    return <Loading />;
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ApolloProvider client={client}>
        <AuthProvider>
          <RootLayoutContent />
        </AuthProvider>
      </ApolloProvider>
    </SafeAreaProvider>
  );
}
