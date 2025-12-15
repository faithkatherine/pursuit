import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "providers/AuthProvider";
import colors, { theme } from "themes/tokens/colors";
import { typography } from "themes/tokens/typography";
import { OnboardingLayout } from "components/Onboarding";
import { useOnboarding } from "providers/OnboardingProvider";
import { Layout } from "components/Layout";

interface Interest {
  id: string;
  name: string;
  emoji: string;
  category: string;
}

const INTERESTS: Interest[] = [
  // Adventure & Travel
  { id: "travel", name: "Travel", emoji: "✈️", category: "Adventure" },
  { id: "hiking", name: "Hiking", emoji: "🥾", category: "Adventure" },
  { id: "camping", name: "Camping", emoji: "🏕️", category: "Adventure" },
  {
    id: "scuba-diving",
    name: "Scuba Diving",
    emoji: "🤿",
    category: "Adventure",
  },
  { id: "skydiving", name: "Skydiving", emoji: "🪂", category: "Adventure" },
  {
    id: "rock-climbing",
    name: "Rock Climbing",
    emoji: "🧗",
    category: "Adventure",
  },

  // Arts & Culture
  { id: "photography", name: "Photography", emoji: "📸", category: "Arts" },
  { id: "painting", name: "Painting", emoji: "🎨", category: "Arts" },
  { id: "music", name: "Music", emoji: "🎵", category: "Arts" },
  { id: "theater", name: "Theater", emoji: "🎭", category: "Arts" },
  { id: "museums", name: "Museums", emoji: "🏛️", category: "Arts" },
  { id: "concerts", name: "Concerts", emoji: "🎤", category: "Arts" },

  // Sports & Fitness
  { id: "running", name: "Running", emoji: "🏃", category: "Fitness" },
  { id: "yoga", name: "Yoga", emoji: "🧘", category: "Fitness" },
  { id: "swimming", name: "Swimming", emoji: "🏊", category: "Fitness" },
  { id: "cycling", name: "Cycling", emoji: "🚴", category: "Fitness" },
  {
    id: "martial-arts",
    name: "Martial Arts",
    emoji: "🥋",
    category: "Fitness",
  },
  { id: "surfing", name: "Surfing", emoji: "🏄", category: "Fitness" },

  // Food & Lifestyle
  { id: "cooking", name: "Cooking", emoji: "👨‍🍳", category: "Lifestyle" },
  {
    id: "wine-tasting",
    name: "Wine Tasting",
    emoji: "🍷",
    category: "Lifestyle",
  },
  { id: "coffee", name: "Coffee Culture", emoji: "☕", category: "Lifestyle" },
  { id: "gardening", name: "Gardening", emoji: "🌱", category: "Lifestyle" },
  {
    id: "volunteering",
    name: "Volunteering",
    emoji: "🤝",
    category: "Lifestyle",
  },
  { id: "reading", name: "Reading", emoji: "📚", category: "Lifestyle" },

  // Learning & Skills
  {
    id: "languages",
    name: "Learn Languages",
    emoji: "🗣️",
    category: "Learning",
  },
  { id: "coding", name: "Programming", emoji: "💻", category: "Learning" },
  { id: "writing", name: "Writing", emoji: "✍️", category: "Learning" },
  { id: "dancing", name: "Dancing", emoji: "💃", category: "Learning" },
  {
    id: "instruments",
    name: "Musical Instruments",
    emoji: "🎸",
    category: "Learning",
  },
  { id: "crafting", name: "Arts & Crafts", emoji: "🧵", category: "Learning" },
];

export const InterestSelection: React.FC = () => {
  const router = useRouter();
  const { completeOnboarding } = useAuth();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentStep, totalSteps, nextStep, prevStep } = useOnboarding();
  const { width } = useWindowDimensions();
  const containerWidth = Math.min(width * 0.9, 400);

  const toggleInterest = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleContinue = async () => {
    if (selectedInterests.length === 0) {
      Alert.alert(
        "Select Some Interests",
        "Please select at least one interest to help us personalize your experience."
      );
      return;
    }

    setIsLoading(true);

    try {
      await completeOnboarding(selectedInterests);

      // Navigation will be handled automatically by the auth context
      // But we can also explicitly navigate to ensure it works
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error saving interests:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    try {
      await completeOnboarding([]);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error skipping onboarding:", error);
      router.replace("/(tabs)");
    }
  };

  const groupedInterests = INTERESTS.reduce((acc, interest) => {
    if (!acc[interest.category]) {
      acc[interest.category] = [];
    }
    acc[interest.category].push(interest);
    return acc;
  }, {} as Record<string, Interest[]>);

  return (
    <Layout
      backgroundComponent={
        <LinearGradient
          colors={[colors.purple, colors.deluge]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
        />
      }
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        scrollEventThrottle={16}
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
          <View style={styles.headerSection}>
            <Text style={styles.title}>What interests you?</Text>
            <Text style={styles.subtitle}>
              Select your interests to help us suggest personalized bucket list
              items
            </Text>
          </View>

          <View style={[styles.contentContainer, { width: containerWidth }]}>
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
                      <Text style={styles.interestEmoji}>{interest.emoji}</Text>
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

            <View style={styles.actionSection}>
              <Text style={styles.selectedCount}>
                {selectedInterests.length} interests selected
              </Text>
            </View>
          </View>
        </OnboardingLayout>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
  },
  headerSection: {
    alignItems: "center",
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 12,
    textAlign: "center",
    fontFamily: typography.h1.fontFamily,
  },
  subtitle: {
    fontSize: 16,
    color: colors.white50,
    textAlign: "center",
    fontFamily: typography.body.fontFamily,
    textShadowColor: colors.white02,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  contentContainer: {
    backgroundColor: theme.background,
    borderRadius: 24,
    padding: 24,
    elevation: 20,
    shadowColor: theme.text.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  categorySection: {
    marginBottom: 16,
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
    backgroundColor: theme.background,
    borderWidth: 2,
    borderColor: theme.border,
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 4,
    elevation: 2,
    shadowColor: theme.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  interestItemSelected: {
    borderColor: colors.delugeLight,
    backgroundColor: colors.deluge,
    borderWidth: 2,
    shadowColor: colors.delugeLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
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
    color: theme.text.secondary,
    fontFamily: typography.body.fontFamily,
  },
  interestTextSelected: {
    color: colors.white,
    fontWeight: "700",
  },
  actionSection: {
    alignItems: "center",
    paddingTop: 20,
  },
  selectedCount: {
    fontSize: 16,
    color: theme.text.secondary,
    fontFamily: typography.body.fontFamily,
    marginBottom: 24,
    fontWeight: "600",
  },
});
