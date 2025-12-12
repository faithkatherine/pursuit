import { useRouter, useSegments } from "expo-router";
import React, { createContext } from "react";
import { useAuth } from "./AuthProvider";

interface OnboardingContextType {
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>({
  currentStep: 1,
  totalSteps: 4,
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
  const { completeOnboarding: completeOnboardingAuth, skipOnboarding: skipOnboardingAuth } = useAuth();
  const totalSteps = steps.length;

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

  const nextStep = () => {
    if (currentStepConfig.next) {
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
      router.back();
    }
  };

  const skipOnboarding = async () => {
    await skipOnboardingAuth();
    router.replace("/");
  };

  const completeOnboarding = async () => {
    // This would be called from the final confirmation screen with the user's interests
    // For now, just navigate to home - the actual implementation will pass interests
    router.replace("/");
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        totalSteps,
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
