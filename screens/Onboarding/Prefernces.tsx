import { Text } from "react-native";
import { OnboardingLayout } from "components/Onboarding/OnboardingLayout";

export const Prefernces = () => {
  return (
    <OnboardingLayout
      currentStep={2}
      totalSteps={3}
      buttonText="Next"
      onNextPress={() => console.log("Next pressed")}
    >
      <Text>Location Screen</Text>
    </OnboardingLayout>
  );
};
