import { Stack, Redirect, useSegments } from "expo-router";
import { Platform } from "react-native";
import { useAuth } from "@mobile/providers/AuthProvider";
import { Loading } from "components/Layout";

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading, needsOnboarding } = useAuth();
  const segments = useSegments();
  const isWeb = Platform.OS === "web";

  if (isLoading) {
    return <Loading />;
  }

  // Check if we're currently in the onboarding flow
  const inOnboarding = segments.includes("onboarding");

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/auth/signin" />;
  }

  // Redirect to onboarding if needed (but not if already there)
  if (needsOnboarding && !inOnboarding) {
    return <Redirect href="/onboarding/" />;
  }

  // Redirect to home if onboarding is complete but user is still on onboarding screens
  if (!needsOnboarding && inOnboarding) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="onboarding"
        options={{
          animation: "none",
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="explore"
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="events/[eventId]"
        options={{
          headerShown: false,
          presentation: isWeb ? "card" : "fullScreenModal",
          animation: isWeb ? "none" : "slide_from_bottom",
          gestureEnabled: !isWeb,
          contentStyle: { backgroundColor: isWeb ? "#FFFFFF" : "transparent" },
        }}
      />
    </Stack>
  );
}
