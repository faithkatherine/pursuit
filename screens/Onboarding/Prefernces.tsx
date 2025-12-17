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
import typography from "themes/tokens/typography";
import { BlushPurpleRadialGradient } from "themes/gradients";

export const Prefernces = () => {
  const {
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    locationPermissionGranted,
    notificationPermissionGranted,
    toggleLocationPermission,
    toggleNotificationPermission,
  } = useOnboarding();
  const { height, width } = useWindowDimensions();
  const illustrationHeight = height * 0.3;
  const buttonWidth = Math.min(width * 0.9, 320);

  return (
    <Layout
      backgroundComponent={
        <BlushPurpleRadialGradient width={width} height={height} />
      }
    >
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
              isEnabled={locationPermissionGranted}
              onToggle={toggleLocationPermission}
            />
            <SwitchCard
              title="Receive Email Updates"
              isEnabled={notificationPermissionGranted}
              onToggle={toggleNotificationPermission}
            />
            <SwitchCard
              title="Receive Notifications"
              isEnabled={notificationPermissionGranted}
              onToggle={toggleNotificationPermission}
            />

            <Button
              variant="primary"
              text="CONNECT YOUR CALENDAR"
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
    width: "100%",
    marginTop: 20,
    gap: 28,
  },
  connectButton: {
    width: "100%",
    backgroundColor: colors.deluge,
    height: 60,
    borderRadius: 16,
    shadowColor: colors.black87,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
  },
  connectButtonText: {
    color: colors.white,
    fontFamily: typography.h4.fontFamily,
    fontSize: typography.h4.fontSize,
    fontWeight: typography.h4.fontWeight as any,
    textTransform: "uppercase",
  },
});
