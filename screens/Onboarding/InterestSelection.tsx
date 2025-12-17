import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import colors, { theme } from "themes/tokens/colors";
import { typography } from "themes/tokens/typography";
import { PurpleRadialGradient } from "themes/gradients";
import { useOnboarding } from "providers/OnboardingProvider";
import { getGroupedInterests } from "utils/interests";
import {
  OnboardingHeader,
  OnboardingFooter,
  OnboardingProgressMarkers,
} from "components/Onboarding";
import { Layout } from "components/Layout";

export const InterestSelection: React.FC = () => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const { currentStep, totalSteps, nextStep, prevStep } = useOnboarding();
  const { width, height } = useWindowDimensions();

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  const groupedInterests = getGroupedInterests();

  return (
    <Layout
      backgroundComponent={
        <PurpleRadialGradient width={width} height={height} />
      }
    >
      <View style={styles.container}>
        <OnboardingHeader
          showBackButton={true}
          onBackPress={prevStep}
          onSkipPress={nextStep}
        />

        <View style={styles.headerSection}>
          <Text style={styles.title}>What interests you?</Text>
          <Text style={styles.subtitle}>
            Select your interests to help us suggest personalized bucket list
            items
          </Text>
        </View>

        {/* Glassmorphism sheet with interests and footer */}
        <View style={styles.modalContainer}>
          <View style={styles.glassOverlay} />
          <BlurView
            intensity={Platform.OS === "ios" ? 50 : 90}
            tint="light"
            style={styles.blurContainer}
          >
            <View style={styles.dragHandle} />

            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              decelerationRate="fast"
              scrollEventThrottle={16}
            >
              {Object.entries(groupedInterests).map(([category, interests]) => (
                <View key={category} style={styles.categorySection}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  <View style={styles.interestsGrid}>
                    {interests.map((interest) => (
                      <TouchableOpacity
                        key={interest.id}
                        style={[
                          styles.interestItem,
                          selectedInterests.includes(interest.id) &&
                            styles.interestItemSelected,
                        ]}
                        onPress={() => toggleInterest(interest.id)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.interestEmoji}>
                          {interest.emoji}
                        </Text>
                        <Text
                          style={[
                            styles.interestText,
                            selectedInterests.includes(interest.id) &&
                              styles.interestTextSelected,
                          ]}
                        >
                          {interest.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Footer inside glassmorphism */}
            <View style={styles.footerContainer}>
              <OnboardingProgressMarkers
                currentStep={currentStep}
                totalSteps={totalSteps}
              />
              <OnboardingFooter
                currentStep={currentStep}
                totalSteps={totalSteps}
                buttonText="Submit"
                onNextPress={nextStep}
              />
            </View>
          </BlurView>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
  },
  headerSection: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: colors.white,
    marginTop: 8,
    marginBottom: 12,
    textAlign: "center",
    fontFamily: typography.h1.fontFamily,
  },
  subtitle: {
    fontSize: 16,
    color: colors.white80,
    textAlign: "center",
    fontFamily: typography.body.fontFamily,
    textShadowColor: colors.white02,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  modalContainer: {
    flex: 1,
    marginTop: 8,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "visible",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 16,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white65,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  blurContainer: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderColor: colors.white80,
    backgroundColor:
      Platform.OS === "android" ? "rgba(255, 255, 255, 0.85)" : "transparent",
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: colors.silverSand,
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.text.primary,
    fontFamily: typography.h2.fontFamily,
    marginBottom: 12,
  },
  interestsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  interestItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.silverSand,
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 4,
    elevation: 2,
    shadowColor: theme.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  interestItemSelected: {
    borderColor: colors.delugeLight,
    backgroundColor: colors.deluge,
    borderWidth: 2,
    shadowColor: colors.delugeLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ scale: 1.02 }],
  },
  interestEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  interestText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.text.primary,
    fontFamily: typography.body.fontFamily,
  },
  interestTextSelected: {
    color: colors.white,
    fontWeight: "700",
  },
  footerContainer: {
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.silverSand,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
});
