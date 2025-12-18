import { Layout } from "components/Layout";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import colors, { theme } from "themes/tokens/colors";
import TravelIcon from "assets/icons/travel_explore.svg";
import typography from "themes/tokens/typography";
import spacing, { layoutSpacing } from "themes/tokens/spacing";
import { useOnboarding } from "providers/OnboardingProvider";
import { OnboardingLayout } from "components/Onboarding";

const WelcomeScreen = () => {
  const { height } = useWindowDimensions();

  // Responsive dimensions
  const illustrationHeight = height * 0.5; // 50% of screen height

  const {
    currentStep,
    nextStep,
    skipOnboarding,
    skipOnboardingMutationLoading,
  } = useOnboarding();

  return (
    <Layout backgroundColor={colors.shilo}>
      <OnboardingLayout
        currentStep={currentStep}
        totalSteps={4}
        buttonText="Start Onboarding"
        showBackButton={currentStep > 1}
        onNextPress={nextStep}
        skipOnboardingMutationLoading={skipOnboardingMutationLoading}
        onSkipAllPress={skipOnboarding}
      >
        <View style={styles.container}>
          <TravelIcon width="100%" height={illustrationHeight} />
          <View style={styles.textContainer}>
            <Text style={styles.text}>
              Personalize your travel experience with tailored recommendations.
            </Text>
          </View>
        </View>
      </OnboardingLayout>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  textContainer: {
    marginTop: spacing.lg,
    justifyContent: "center",
  },
  text: {
    fontFamily: typography.h2.fontFamily,
    fontSize: typography.h2.fontSize,
    color: theme.text.black,
    textAlign: "center",
    marginHorizontal: layoutSpacing.screenPaddingHorizontal,
  },
});

export default WelcomeScreen;
