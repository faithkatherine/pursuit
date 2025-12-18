import { Stack, Redirect } from "expo-router";
import { useAuth } from "providers/AuthProvider";
import { useEffect, useState } from "react";
import { getHasSeenGetStarted } from "utils/secureStorage";
import { Loading } from "components/Layout";
import e from "express";

export default function AuthLayout() {
  const { isAuthenticated, needsOnboarding } = useAuth();
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

  if (hasSeenGetStarted === null) {
    return <Loading />;
  }

  // Redirect if already authenticated
  if (isAuthenticated && !needsOnboarding) {
    return <Redirect href="/" />;
  }

  if (isAuthenticated && needsOnboarding) {
    return <Redirect href="/onboarding/" />;
  }

  // Redirect first-time users to get-started
  if (!hasSeenGetStarted) {
    return <Redirect href="/get-started" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        animationDuration: 700,
      }}
    >
      <Stack.Screen name="signin" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
