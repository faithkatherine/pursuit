import { Stack, Redirect, useSegments } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useAuth } from "providers/AuthProvider";
import { Loading } from "components/Layout";

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading, needsOnboarding } = useAuth();
  const segments = useSegments();

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

const styles = StyleSheet.create({
  header: {
    height: 70,
    backgroundColor: "transparent",
  },
});
