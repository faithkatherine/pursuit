import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Layout } from "components/Layout";
import { useOnboarding } from "@mobile/providers/OnboardingProvider";
import { getGroupedInterests } from "@shared/utils/interests";
import colors from "@shared/constants/tokens/colors";
import typography, { fontSizes, fontWeights } from "@shared/constants/tokens/typography";
import { radii, spacing } from "@shared/constants/tokens/spacing";

export const InterestSelection = () => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const { currentStep, totalSteps, nextStep, prevStep, skipOnboarding } =
    useOnboarding();
  const groupedInterests = useMemo(() => getGroupedInterests(), []);

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((current) =>
      current.includes(interestId)
        ? current.filter((id) => id !== interestId)
        : [...current, interestId],
    );
  };

  const canContinue = selectedInterests.length >= 3;

  return (
    <Layout backgroundColor={colors.background}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>
              Step {currentStep} of {totalSteps}
            </Text>
            <Text style={styles.title}>Tune your cultural guide.</Text>
            <Text style={styles.subtitle}>
              Pick at least three interests so Pursuit can shape your first
              discover feed.
            </Text>
          </View>
          <Pressable style={styles.skipButton} onPress={skipOnboarding}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        <View style={styles.sheet}>
          {Object.entries(groupedInterests).map(([category, interests]) => (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <View style={styles.interestGrid}>
                {interests.map((interest) => {
                  const selected = selectedInterests.includes(interest.id);
                  return (
                    <Pressable
                      key={interest.id}
                      style={[
                        styles.interestPill,
                        selected && styles.interestPillSelected,
                      ]}
                      onPress={() => toggleInterest(interest.id)}
                    >
                      <Text style={styles.interestEmoji}>{interest.emoji}</Text>
                      <Text
                        style={[
                          styles.interestText,
                          selected && styles.interestTextSelected,
                        ]}
                      >
                        {interest.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}

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
            <Pressable
              style={[
                styles.primaryButton,
                !canContinue && styles.primaryButtonDisabled,
              ]}
              onPress={() => {
                // TODO: Pass selected interests to COMPLETE_ONBOARDING when the provider accepts them.
                if (canContinue) nextStep();
              }}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
            </Pressable>
          </View>
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
    paddingTop: 44,
    paddingBottom: 72,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing["2xl"],
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
    maxWidth: 680,
    fontFamily: typography.h1.fontFamily,
    fontSize: 44,
    fontWeight: fontWeights.heavy,
    lineHeight: 50,
    color: colors.thunder,
  },
  subtitle: {
    maxWidth: 620,
    marginTop: 10,
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.base,
    lineHeight: 24,
    color: colors.graniteGray,
  },
  skipButton: {
    borderRadius: radii.full,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  skipText: {
    fontFamily: typography.label.fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.deluge,
  },
  sheet: {
    gap: 26,
    padding: 28,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.white,
  },
  categorySection: {
    gap: 12,
  },
  categoryTitle: {
    fontFamily: typography.h4.fontFamily,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.thunder,
  },
  interestGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  interestPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLow,
  },
  interestPillSelected: {
    borderColor: colors.deluge,
    backgroundColor: colors.deluge,
  },
  interestEmoji: {
    fontSize: 18,
  },
  interestText: {
    fontFamily: typography.label.fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.thunder,
  },
  interestTextSelected: {
    color: colors.white,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.base,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceContainer,
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
  primaryButtonDisabled: {
    backgroundColor: colors.aluminium,
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
