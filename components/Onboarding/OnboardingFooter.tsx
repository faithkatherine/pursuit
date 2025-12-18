import { Button } from "components/Buttons";
import {
  useWindowDimensions,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors, { theme } from "themes/tokens/colors";
import spacing from "themes/tokens/spacing";
import typography from "themes/tokens/typography";
import { OnboardingProgressMarkers } from "./OnboardingProgressMarkers";

interface OnboardingFooterProps {
  currentStep: number;
  totalSteps: number;
  buttonText?: string;
  skipOnboardingMutationLoading?: boolean;
  onNextPress: () => void;
  onSkipAllPress?: () => void;
}
export const OnboardingFooter = ({
  currentStep,
  totalSteps,
  buttonText,
  skipOnboardingMutationLoading,
  onNextPress,
  onSkipAllPress,
}: OnboardingFooterProps) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const buttonWidth = Math.min(width * 0.85, 320);
  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, spacing.lg) },
      ]}
    >
      <Button
        text={buttonText || "Next"}
        style={[styles.button, { width: buttonWidth }]}
        textStyle={styles.buttonText}
        variant="primary"
        onPress={onNextPress}
      />
      {currentStep === 1 && onSkipAllPress && (
        <View style={styles.skipContainer}>
          <Button
            text="Maybe Later"
            style={styles.skipButton}
            textStyle={styles.skipButtonText}
            variant="tertiary"
            onPress={onSkipAllPress}
          />
          {skipOnboardingMutationLoading && (
            <ActivityIndicator size="small" color={colors.black} />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },

  button: {
    height: 60,
    backgroundColor: colors.black,
    borderRadius: 50,
  },
  buttonText: {
    fontFamily: typography.h4.fontFamily,
    fontSize: typography.h4.fontSize,
    color: theme.text.white,
  },
  skipContainer: {
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  skipButton: {
    alignSelf: "center",
    marginTop: spacing.md,
  },
  skipButtonText: {
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    color: theme.text.black,
  },
});
