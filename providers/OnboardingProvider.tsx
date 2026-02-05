import { useRouter, useSegments } from "expo-router";
import React, { createContext, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { Alert } from "react-native";
import { useMutation } from "@apollo/client";
import { SKIP_ONBOARDING, COMPLETE_ONBOARDING } from "graphql/queries";
import {
  SkipOnboardingMutation,
  CompleteOnboardingMutation,
  CompleteOnboardingMutationVariables,
} from "graphql/generated/graphql";

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
  const [location, setLocation] =
    React.useState<Location.LocationObject | null>(null);
  const [locationName, setLocationName] = React.useState<string | null>(null);
  const [emailPermissionGranted, setEmailPermissionGranted] =
    React.useState<boolean>(false);
  const [notificationPermissionGranted, setNotificationPermissionGranted] =
    React.useState<boolean>(false);

  const [skipOnboardingMutation, { loading: skipOnboardingMutationLoading }] =
    useMutation<SkipOnboardingMutation>(SKIP_ONBOARDING);
  const [
    completeOnboardingMutation,
    {
      loading: completeOnboardingMutationLoading,
      error: completeOnboardingError,
    },
  ] = useMutation<
    CompleteOnboardingMutation,
    CompleteOnboardingMutationVariables
  >(COMPLETE_ONBOARDING);

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
      fetchPolicy: "network-only",
      errorPolicy: "all",
    })
      .then((result) => {
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
    if (!enabled) {
      setLocation(null);
      setLocationName(null);
      return;
    }

    try {
      const result = await Location.requestForegroundPermissionsAsync();
      if (result.status !== "granted") {
        setLocationPermissionGranted(false);
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      // Reverse geocode to get location name
      const [geocode] = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (geocode) {
        const name = [geocode.city, geocode.region || geocode.country]
          .filter(Boolean)
          .join(", ");
        setLocationName(name || null);
        console.log("Location obtained:", {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          name,
        });
      }
    } catch (error) {
      console.error("Failed to get location:", error);
      setLocationPermissionGranted(false);
      Alert.alert(
        "Location Error",
        "Unable to get your location. Please try again later.",
      );
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

  const nextStep = async () => {
    // Final confirmation step - go to home
    if (currentStepConfig.name === "confirmation") {
      router.replace("/");
      return;
    }

    // No next step
    if (!currentStepConfig.next) return;

    // Regular step navigation
    if (currentStepConfig.next !== "confirmation") {
      const nextRoute =
        currentStepConfig.next === "welcome"
          ? "/onboarding/"
          : `/onboarding/${currentStepConfig.next}`;
      router.push(nextRoute);
      return;
    }

    // Complete onboarding mutation
    try {
      const response = await completeOnboardingMutation({
        variables: {
          allowLocationSharing: locationPermissionGranted,
          locationName,
          location: location?.coords
            ? [location.coords.latitude, location.coords.longitude]
            : null,
          allowEmailNotifications: emailPermissionGranted,
          allowPushNotifications: notificationPermissionGranted,
        },
      });
      if (response.data?.completeOnboarding?.ok) {
        if (response.data.completeOnboarding.user) {
          updateUser(response.data.completeOnboarding.user);
        }
        router.push("/onboarding/confirmation");
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
      Alert.alert(
        "Error",
        "There was an issue completing onboarding. Please try again.",
        [
          { text: "Retry", onPress: nextStep },
          { text: "Cancel Onboarding", onPress: () => router.push("/") },
        ],
      );
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
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export default OnboardingProvider;
