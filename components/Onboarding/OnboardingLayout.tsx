import { View, StyleSheet } from "react-native";
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
  skipOnboardingMutationLoading,
  children,
  onBackPress,
  onSkipPress,
  onNextPress,
  onSkipAllPress,
}: OnboardingLayoutProps) => {
  return (
    <View style={styles.container}>
      <OnboardingHeader
        showBackButton={showBackButton}
        onBackPress={onBackPress}
        onSkipPress={onSkipPress}
      />

      <View style={styles.content}>{children}</View>

      <View style={styles.footerSection}>
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
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  footerSection: {
    gap: spacing.md,
    paddingBottom: spacing.xs,
  },
});

export default OnboardingLayout;
