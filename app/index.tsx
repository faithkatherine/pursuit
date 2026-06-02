import { Redirect } from "expo-router";
import { useAuth } from "providers/AuthProvider";

export default function Index() {
  const { isAuthenticated, needsOnboarding } = useAuth();

  if (isAuthenticated) {
    if (needsOnboarding) {
      return <Redirect href="/onboarding/" />;
    }

    return <Redirect href="/(protected)/(tabs)/" />;
  }

  return <Redirect href="/auth/signin" />;
}
