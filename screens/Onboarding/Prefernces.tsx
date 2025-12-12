import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { OnboardingLayout } from "components/Onboarding/OnboardingLayout";
import { useOnboarding } from "providers/OnboardingProvider";
import { Layout } from "components/Layout";
import colors from "themes/tokens/colors";
import ScheduleEventsIcon from "assets/icons/schedule_events.svg";
import { useForm } from "react-hook-form";
import { Button } from "components/Buttons";
import { Switch } from "react-native-gesture-handler";
import { SwitchCard } from "components/Cards/SwitchCard/SwitchCard";
import { connect } from "http2";

export const Prefernces = () => {
  const { currentStep, totalSteps, nextStep, prevStep } = useOnboarding();
  const { height, width } = useWindowDimensions();
  const illustrationHeight = height * 0.4;
  const buttonWidth = Math.min(width * 0.9, 320);

  return (
    <Layout backgroundColor={colors.lightBlue}>
      <OnboardingLayout
        currentStep={currentStep}
        totalSteps={totalSteps}
        buttonText="Continue"
        showBackButton={true}
        onBackPress={prevStep}
        onNextPress={nextStep}
        onSkipPress={nextStep}
      >
        <View style={styles.container}>
          <ScheduleEventsIcon width="100%" height={illustrationHeight} />
          <View style={styles.switchContainer}>
            <SwitchCard
              title="Use Location"
              isEnabled={true}
              onToggle={() => {}}
            />
            <SwitchCard
              title="Receive Notifications"
              isEnabled={true}
              onToggle={() => {}}
            />

            <Button
              variant="primary"
              text="Connect your calendar"
              style={[styles.connectButton, {}]}
              textStyle={styles.connectButtonText}
            />
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
    marginHorizontal: 27,
  },
  switchContainer: {
    marginTop: 20,
    gap: 24,
  },
  connectButton: {
    backgroundColor: colors.careysPink,
    height: 60,
  },
  connectButtonText: {
    color: colors.black,
  },
});
