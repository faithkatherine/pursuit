import { Platform, View, StyleSheet } from "react-native";
import colors from "themes/tokens/colors";
import spacing from "themes/tokens/spacing";
import { OnboardingFooter } from "./OnboardingFooter";
import { OnboardingHeader } from "./OnboardingHeader";
import { OnboardingProgressMarkers } from "./OnboardingProgressMarkers";

interface OnboardingLayoutProps {
  currentStep: number;
  totalSteps: number;
  buttonText?: string;
  showBackButton?: boolean;
  skipOnboardingMutationLoading?: boolean;
  submitLoading?: boolean;
  children: React.ReactNode;
  onBackPress?: () => void;
  onSkipPress?: () => void;
  onNextPress: () => void;
  onSkipAllPress?: () => void;
}

export const OnboardingLayout = ({
  currentStep,
  totalSteps,
  buttonText,
  showBackButton,
  submitLoading,
  skipOnboardingMutationLoading,
  children,
  onBackPress,
  onSkipPress,
  onNextPress,
  onSkipAllPress,
}: OnboardingLayoutProps) => {
  const isWeb = Platform.OS === "web";

  return (
    <View style={[styles.container, isWeb && styles.webContainer]}>
      <OnboardingHeader
        showBackButton={showBackButton}
        onBackPress={onBackPress}
        onSkipPress={onSkipPress}
      />

      <View style={[styles.content, isWeb && styles.webContent]}>
        {children}
      </View>

      <View style={[styles.footerSection, isWeb && styles.webFooterSection]}>
        <OnboardingProgressMarkers
          currentStep={currentStep}
          totalSteps={totalSteps}
        />

        <OnboardingFooter
          currentStep={currentStep}
          totalSteps={totalSteps}
          buttonText={buttonText}
          onNextPress={onNextPress}
          onSkipAllPress={onSkipAllPress}
          skipOnboardingMutationLoading={skipOnboardingMutationLoading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webContainer: {
    width: "100%",
    maxWidth: 900,
    marginHorizontal: "auto",
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  webContent: {
    paddingHorizontal: 32,
  },
  footerSection: {
    gap: spacing.md,
    paddingBottom: spacing.xs,
  },
  webFooterSection: {
    paddingBottom: spacing.xl,
  },
});

export default OnboardingLayout;
