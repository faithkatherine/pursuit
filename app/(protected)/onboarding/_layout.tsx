import { Stack } from "expo-router";
import OnboardingProvider from "providers/OnboardingProvider";

const OnboardingLayout = () => {
  return (
    <OnboardingProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="preferences" />
        <Stack.Screen name="interests" />
        <Stack.Screen name="confirmation" />
      </Stack>
    </OnboardingProvider>
  );
};

export default OnboardingLayout;
