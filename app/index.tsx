import { Redirect } from "expo-router";
import { useAuth } from "providers/AuthProvider";

export default function Index() {
  const { isAuthenticated, needsOnboarding } = useAuth();

  // If authenticated, go to protected area (tabs or onboarding)
  if (isAuthenticated) {
    if (needsOnboarding) {
      return <Redirect href="/onboarding/" />;
    }
    return <Redirect href="/(protected)/(tabs)/" />;
  }

  // Not authenticated, go to sign in
  return <Redirect href="/auth/signin" />;
}
