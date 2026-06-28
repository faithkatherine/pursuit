import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Layout } from "components/Layout";
import { useOnboarding } from "@mobile/providers/OnboardingProvider";
import colors from "@shared/constants/tokens/colors";
import typography, { fontSizes, fontWeights } from "@shared/constants/tokens/typography";
import { radii, spacing } from "@shared/constants/tokens/spacing";

type PreferenceKey = "location" | "email" | "notifications";

const preferenceCopy: Record<
  PreferenceKey,
  { title: string; body: string; eyebrow: string }
> = {
  location: {
    eyebrow: "Neighborhoods",
    title: "Use location",
    body: "Shape recommendations around the city areas you actually move through.",
  },
  email: {
    eyebrow: "Editorial",
    title: "Receive email updates",
    body: "Get a tight weekly edit of events worth planning around.",
  },
  notifications: {
    eyebrow: "Timing",
    title: "Receive notifications",
    body: "Useful reminders for saved plans and booked events.",
  },
};

export const Prefernces = () => {
  const {
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    locationPermissionGranted,
    emailPermissionGranted,
    notificationPermissionGranted,
    toggleEmailPermission,
    toggleLocationPermission,
    toggleNotificationPermission,
  } = useOnboarding();

  const preferences = [
    {
      key: "location" as const,
      enabled: locationPermissionGranted,
      toggle: toggleLocationPermission,
    },
    {
      key: "email" as const,
      enabled: emailPermissionGranted,
      toggle: toggleEmailPermission,
    },
    {
      key: "notifications" as const,
      enabled: notificationPermissionGranted,
      toggle: toggleNotificationPermission,
    },
  ];

  return (
    <Layout backgroundColor={colors.background}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.kicker}>
            Step {currentStep} of {totalSteps}
          </Text>
          <Text style={styles.title}>Set the rhythm.</Text>
          <Text style={styles.subtitle}>
            Choose how Pursuit should surface timely plans while keeping the web
            experience quiet and useful.
          </Text>
        </View>

        <View style={styles.preferenceGrid}>
          {preferences.map(({ key, enabled, toggle }) => {
            const copy = preferenceCopy[key];
            return (
              <Pressable
                key={key}
                style={[styles.preferenceCard, enabled && styles.preferenceCardOn]}
                onPress={() => toggle(!enabled)}
              >
                <Text style={styles.cardEyebrow}>{copy.eyebrow}</Text>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{copy.title}</Text>
                  <View style={[styles.toggle, enabled && styles.toggleOn]}>
                    <View style={[styles.knob, enabled && styles.knobOn]} />
                  </View>
                </View>
                <Text style={styles.cardBody}>{copy.body}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.secondaryButton} onPress={prevStep}>
            <Text style={styles.secondaryButtonText}>Back</Text>
          </Pressable>
          <View style={styles.progressRail}>
            <View
              style={[
                styles.progressFill,
                { width: `${(currentStep / totalSteps) * 100}%` },
              ]}
            />
          </View>
          <Pressable style={styles.primaryButton} onPress={nextStep}>
            <Text style={styles.primaryButtonText}>Continue</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  content: {
    width: "100%",
    maxWidth: 1200,
    marginHorizontal: "auto",
    paddingTop: 56,
    paddingBottom: 72,
  },
  header: {
    maxWidth: 720,
    marginBottom: 28,
  },
  kicker: {
    fontFamily: typography.caption.fontFamily,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: colors.deluge,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  title: {
    fontFamily: typography.h1.fontFamily,
    fontSize: 44,
    fontWeight: fontWeights.heavy,
    lineHeight: 50,
    color: colors.thunder,
  },
  subtitle: {
    marginTop: 10,
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.base,
    lineHeight: 24,
    color: colors.graniteGray,
  },
  preferenceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 22,
  },
  preferenceCard: {
    flexGrow: 1,
    width: "31%",
    minWidth: 280,
    gap: 14,
    padding: 22,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.white,
  },
  preferenceCardOn: {
    borderColor: colors.deluge,
    backgroundColor: colors.mistLavender,
  },
  cardEyebrow: {
    fontFamily: typography.caption.fontFamily,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: colors.deluge,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.base,
  },
  cardTitle: {
    fontFamily: typography.h4.fontFamily,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.thunder,
  },
  cardBody: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    lineHeight: 21,
    color: colors.graniteGray,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: radii.full,
    padding: 3,
    backgroundColor: colors.surfaceContainerHighest,
  },
  toggleOn: {
    backgroundColor: colors.deluge,
  },
  knob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.white,
  },
  knobOn: {
    marginLeft: 20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.base,
    marginTop: 28,
  },
  progressRail: {
    flex: 1,
    height: 6,
    borderRadius: radii.full,
    overflow: "hidden",
    backgroundColor: colors.surfaceContainer,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.deluge,
  },
  primaryButton: {
    borderRadius: radii.full,
    backgroundColor: colors.deluge,
    paddingHorizontal: 22,
    paddingVertical: 13,
  },
  primaryButtonText: {
    fontFamily: typography.button.fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
  secondaryButton: {
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.deluge,
    paddingHorizontal: 22,
    paddingVertical: 13,
  },
  secondaryButtonText: {
    fontFamily: typography.button.fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.deluge,
  },
});
