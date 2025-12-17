import { Layout } from "components/Layout";
import { OnboardingLayout } from "components/Onboarding";
import { useOnboarding } from "providers/OnboardingProvider";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import BeginJourneyIcon from "assets/icons/begin_journey.svg";
import colors from "themes/tokens/colors";
import typography from "themes/tokens/typography";

export const Confirmation = () => {
  const { currentStep, totalSteps, prevStep, completeOnboarding } =
    useOnboarding();
  const { width, height } = useWindowDimensions();
  const iconHeight = height * 0.5;

  return (
    <Layout backgroundColor={colors.shilo}>
      <OnboardingLayout
        currentStep={currentStep}
        totalSteps={totalSteps}
        buttonText="Begin Your Journey"
        onBackPress={prevStep}
        onNextPress={completeOnboarding}
      >
        <View style={styles.container}>
          <Text style={styles.title}>
            You're all set! Let's begin your personalized adventures.
          </Text>
          <BeginJourneyIcon width="100%" height={iconHeight} />
        </View>
      </OnboardingLayout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: typography.h2.fontFamily,
    fontSize: typography.h2.fontSize,
    color: colors.black,
    textAlign: "center",
    marginBottom: 24,
  },
});
