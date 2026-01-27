import { useRouter, useSegments } from "expo-router";
import React, { createContext, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { Alert } from "react-native";
import { useMutation } from "@apollo/client";
import { SKIP_ONBOARDING } from "graphql/queries";
import { SkipOnboardingMutation } from "graphql/generated/graphql";

interface OnboardingContextType {
  currentStep: number;
  totalSteps: number;
  locationPermissionGranted: boolean;
  emailPermissionGranted: boolean;
  notificationPermissionGranted: boolean;
  skipOnboardingMutationLoading: boolean;
  toggleLocationPermission: (enabled: boolean) => void;
  toggleNotificationPermission: (enabled: boolean) => void;
  toggleEmailPermission: (enabled: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>({
  currentStep: 1,
  totalSteps: 4,
  emailPermissionGranted: false,
  locationPermissionGranted: false,
  notificationPermissionGranted: false,
  skipOnboardingMutationLoading: false,
  toggleLocationPermission: () => {},
  toggleNotificationPermission: () => {},
  toggleEmailPermission: () => {},
  nextStep: () => {},
  prevStep: () => {},
  skipOnboarding: () => {},
  completeOnboarding: () => {},
});

type StepName = "welcome" | "preferences" | "interests" | "confirmation";

interface OnboardingStep {
  name: StepName;
  next?: StepName;
  prev?: StepName;
  skippable?: boolean;
}

const steps: OnboardingStep[] = [
  { name: "welcome", next: "preferences", skippable: true },
  { name: "preferences", next: "interests", prev: "welcome", skippable: true },
  {
    name: "interests",
    next: "confirmation",
    prev: "preferences",
    skippable: false,
  },
  { name: "confirmation", prev: "interests", skippable: false },
];

export const useOnboarding = () => {
  const context = React.useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};

const OnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const segments = useSegments();
  const totalSteps = steps.length;
  const { updateUser } = useAuth();
  const [locationPermissionGranted, setLocationPermissionGranted] =
    React.useState<boolean>(false);
  const [emailPermissionGranted, setEmailPermissionGranted] =
    React.useState<boolean>(false);
  const [notificationPermissionGranted, setNotificationPermissionGranted] =
    React.useState<boolean>(false);

  const [skipOnboardingMutation, { loading: skipOnboardingMutationLoading }] =
    useMutation<SkipOnboardingMutation>(SKIP_ONBOARDING);

  // Derive current step from route segments
  const getCurrentStepName = (): StepName => {
    const segment = segments[segments.length - 1];

    // Map route segments to step names
    if (segment === "index" || !segment || segment === "onboarding") {
      return "welcome";
    }

    const validSteps: StepName[] = [
      "welcome",
      "preferences",
      "interests",
      "confirmation",
    ];
    if (validSteps.includes(segment as StepName)) {
      return segment as StepName;
    }

    return "welcome";
  };

  const currentStepName = getCurrentStepName();
  const currentStepIndex = steps.findIndex((s) => s.name === currentStepName);

  const safeStepIndex = currentStepIndex >= 0 ? currentStepIndex : 0;
  const currentStepConfig = steps[safeStepIndex];
  const currentStep = safeStepIndex + 1;

  const skipOnboarding = async () => {
    await skipOnboardingMutation({
      errorPolicy: "all",
    })
      .then((result) => {
        console.log("Skip onboarding full result:", result);
        console.log("Skip onboarding data:", result.data);

        if (result.data?.skipOnboarding?.ok) {
          if (result.data?.skipOnboarding?.user) {
            updateUser(result.data.skipOnboarding.user);
          }
          router.replace("/");
        } else {
          console.warn("Skip onboarding failed - ok was false or undefined");
        }
      })
      .catch((error) => {
        console.error("Error skipping onboarding:", error);
        Alert.alert(
          "Error",
          "There was an issue skipping onboarding. Please try again later.",
        );
      });
  };

  const toggleLocationPermission = async (enabled: boolean) => {
    setLocationPermissionGranted(enabled);
    if (enabled) {
      try {
        const result = await Location.requestForegroundPermissionsAsync();
        if (result.status !== "granted") {
          setLocationPermissionGranted(false);
        }
      } catch (error) {
        console.error("Failed to request location permission:", error);
        setLocationPermissionGranted(false);
        Alert.alert(
          "Permission Error",
          "Unable to request location permission. Please try again later.",
        );
      }
    }
  };

  const toggleNotificationPermission = async (enabled: boolean) => {
    setNotificationPermissionGranted(enabled);
    if (enabled) {
      try {
        const result = await Notifications.requestPermissionsAsync();
        if (result.status !== "granted") {
          setNotificationPermissionGranted(false);
        }
      } catch (error) {
        console.error("Failed to request notification permission:", error);
        setNotificationPermissionGranted(false);
        Alert.alert(
          "Permission Error",
          "Unable to request notification permission. Please try again later.",
        );
      }
    }
  };

  const toggleEmailPermission = (enabled: boolean) => {
    setEmailPermissionGranted(enabled);
  };

  const nextStep = () => {
    if (currentStepConfig.next ) {
      const nextRoute =
        currentStepConfig.next === "welcome"
          ? "/onboarding/"
          : `/onboarding/${currentStepConfig.next}`;
      router.push(nextRoute);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStepConfig.prev) {
      const prevRoute =
        currentStepConfig.prev === "welcome"
          ? "/onboarding/"
          : `/onboarding/${currentStepConfig.prev}`;
      router.push(prevRoute);
    }
  };

  const completeOnboarding = async () => {
    router.replace("/");
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        totalSteps,
        locationPermissionGranted,
        emailPermissionGranted,
        notificationPermissionGranted,
        skipOnboardingMutationLoading,
        toggleLocationPermission,
        toggleNotificationPermission,
        toggleEmailPermission,
        nextStep,
        prevStep,
        skipOnboarding,
        completeOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export default OnboardingProvider;
