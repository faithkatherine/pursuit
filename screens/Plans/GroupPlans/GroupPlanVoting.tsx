import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import {
  useGroupPlanByShareToken,
  useCreateVoterSession,
  useCastVote,
} from "hooks/useGroupPlans";
import { useVoterSession } from "providers/VoterSessionProvider";
import { colors } from "themes/tokens/colors";
import { typography } from "themes/tokens/typography";
import { spacing } from "themes/tokens/spacing";
import { Layout } from "components/Layout/Layout";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

export default function GroupPlanVoting() {
  const { shareToken } = useLocalSearchParams<{ shareToken: string }>();
  const router = useRouter();
  const { sessionToken } = useVoterSession();
  const { groupPlan, loading, refetch } = useGroupPlanByShareToken(shareToken);
  const { createSession, loading: creatingSession } = useCreateVoterSession();
  const { castVote } = useCastVote();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [votedEvents, setVotedEvents] = useState<Set<string>>(new Set());
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [voterName, setVoterName] = useState("");

  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

  const bucketEvents = groupPlan?.bucketEvents || [];
  const currentEvent = bucketEvents[currentIndex];
  const mySession = groupPlan?.myVoterSession;
  const hasCompleted = mySession?.hasCompletedStack || false;

  // Check if user needs to create a session
  useEffect(() => {
    if (groupPlan && !sessionToken) {
      setShowNamePrompt(true);
    }
  }, [groupPlan, sessionToken]);

  const handleCreateSession = async () => {
    if (!shareToken) return;
    try {
      await createSession(shareToken, voterName);
      setShowNamePrompt(false);
    } catch (error) {
      Alert.alert("Error", "Failed to join voting session");
    }
  };

  const handleVote = async (direction: "INTERESTED" | "SKIP") => {
    if (!currentEvent) return;

    try {
      await castVote(currentEvent.id, direction);
      setVotedEvents((prev) => new Set(prev).add(currentEvent.id));

      // Move to next card
      if (currentIndex < bucketEvents.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Completed all votes
        refetch();
      }

      // Reset animation
      translateX.value = withSpring(0);
      rotate.value = withSpring(0);
    } catch (error) {
      Alert.alert("Error", "Failed to cast vote");
    }
  };

  const panGesture = Gesture.Pan()
    .onChange((event) => {
      translateX.value = event.translationX;
      rotate.value = interpolate(
        event.translationX,
        [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
        [-15, 0, 15],
      );
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        const direction = event.translationX > 0 ? "INTERESTED" : "SKIP";
        translateX.value = withSpring(
          event.translationX > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH,
        );
        runOnJS(handleVote)(direction);
      } else {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotate.value}deg` },
      ],
      opacity: interpolate(
        Math.abs(translateX.value),
        [0, SWIPE_THRESHOLD],
        [1, 0.8],
      ),
    };
  });

  if (loading) {
    return (
      <Layout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.deluge} />
        </View>
      </Layout>
    );
  }

  if (!groupPlan) {
    return (
      <Layout>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Group plan not found</Text>
        </View>
      </Layout>
    );
  }

  if (showNamePrompt) {
    return (
      <Layout>
        <View style={styles.promptContainer}>
          <Ionicons name="people" size={64} color={colors.deluge} />
          <Text style={styles.promptTitle}>{groupPlan.displayName}</Text>
          <Text style={styles.promptSubtitle}>Join the voting!</Text>

          <TextInput
            style={styles.nameInput}
            placeholder="Your name (optional)"
            value={voterName}
            onChangeText={setVoterName}
            autoCapitalize="words"
          />

          <TouchableOpacity
            style={styles.joinButton}
            onPress={handleCreateSession}
            disabled={creatingSession}
          >
            {creatingSession ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.joinButtonText}>Start Voting</Text>
            )}
          </TouchableOpacity>
        </View>
      </Layout>
    );
  }

  if (hasCompleted) {
    return (
      <Layout>
        <View style={styles.completedContainer}>
          <Ionicons name="checkmark-circle" size={80} color={colors.forest} />
          <Text style={styles.completedTitle}>All Done!</Text>
          <Text style={styles.completedSubtitle}>
            You've voted on all {bucketEvents.length} events
          </Text>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Layout>
    );
  }

  if (!currentEvent) {
    return (
      <Layout>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No events to vote on</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} color={colors.thunder} />
          </TouchableOpacity>
          <View style={styles.progress}>
            <Text style={styles.progressText}>
              {currentIndex + 1} / {bucketEvents.length}
            </Text>
          </View>
          <View style={{ width: 28 }} />
        </View>

        {/* Card stack */}
        <View style={styles.cardContainer}>
          {/* Next card (background) */}
          {bucketEvents[currentIndex + 1] && (
            <View style={[styles.card, styles.nextCard]}>
              {bucketEvents[currentIndex + 1].event?.image && (
                <Image
                  source={{ uri: bucketEvents[currentIndex + 1].event.image }}
                  style={styles.cardImage}
                />
              )}
            </View>
          )}

          {/* Current card */}
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.card, cardStyle]}>
              {currentEvent.event?.image && (
                <Image
                  source={{ uri: currentEvent.event.image }}
                  style={styles.cardImage}
                />
              )}

              <LinearGradient
                colors={["transparent", colors.thunder + "dd"]}
                style={styles.cardOverlay}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.eventName}>
                    {currentEvent.event?.name}
                  </Text>
                  {currentEvent.event?.description && (
                    <Text style={styles.eventDescription} numberOfLines={3}>
                      {currentEvent.event.description}
                    </Text>
                  )}
                  <View style={styles.eventMeta}>
                    {currentEvent.event?.locationName && (
                      <View style={styles.metaItem}>
                        <Ionicons
                          name="location"
                          size={16}
                          color={colors.white}
                        />
                        <Text style={styles.metaText}>
                          {currentEvent.event.locationName}
                        </Text>
                      </View>
                    )}
                    {currentEvent.event?.price !== undefined && (
                      <View style={styles.metaItem}>
                        <Ionicons
                          name="pricetag"
                          size={16}
                          color={colors.white}
                        />
                        <Text style={styles.metaText}>
                          {currentEvent.event.price === 0
                            ? "Free"
                            : `KES ${currentEvent.event.price}`}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </LinearGradient>

              {/* Swipe indicators */}
              <Animated.View
                style={[
                  styles.swipeIndicator,
                  styles.skipIndicator,
                  useAnimatedStyle(() => ({
                    opacity: interpolate(
                      translateX.value,
                      [-SWIPE_THRESHOLD, 0],
                      [1, 0],
                    ),
                  })),
                ]}
              >
                <Text style={styles.indicatorText}>SKIP</Text>
              </Animated.View>

              <Animated.View
                style={[
                  styles.swipeIndicator,
                  styles.interestedIndicator,
                  useAnimatedStyle(() => ({
                    opacity: interpolate(
                      translateX.value,
                      [0, SWIPE_THRESHOLD],
                      [0, 1],
                    ),
                  })),
                ]}
              >
                <Text style={styles.indicatorText}>INTERESTED</Text>
              </Animated.View>
            </Animated.View>
          </GestureDetector>
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.skipButton]}
            onPress={() => handleVote("SKIP")}
          >
            <Ionicons name="close" size={32} color={colors.aluminium} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.interestedButton]}
            onPress={() => handleVote("INTERESTED")}
          >
            <Ionicons name="heart" size={32} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ghostWhite,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  errorText: {
    ...typography.body,
    color: colors.aluminium,
  },
  promptContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    gap: spacing.lg,
  },
  promptTitle: {
    ...typography.h2,
    color: colors.thunder,
    textAlign: "center",
  },
  promptSubtitle: {
    ...typography.body,
    color: colors.aluminium,
    textAlign: "center",
  },
  nameInput: {
    ...typography.body,
    width: "100%",
    borderWidth: 1,
    borderColor: colors.aluminium + "40",
    borderRadius: 12,
    padding: spacing.md,
    backgroundColor: colors.white,
  },
  joinButton: {
    width: "100%",
    backgroundColor: colors.deluge,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: "center",
  },
  joinButtonText: {
    //...typography.buttonText,
    color: colors.white,
  },
  completedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
    gap: spacing.lg,
  },
  completedTitle: {
    ...typography.h2,
    color: colors.thunder,
  },
  completedSubtitle: {
    ...typography.body,
    color: colors.aluminium,
    textAlign: "center",
  },
  secondaryButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.deluge + "20",
  },
  secondaryButtonText: {
    //...typography.buttonText,
    color: colors.deluge,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
  },
  progress: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.deluge + "20",
    borderRadius: 16,
  },
  progressText: {
    ...typography.caption,
    fontWeight: "600",
    color: colors.deluge,
  },
  cardContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  card: {
    width: SCREEN_WIDTH - spacing.xl * 2,
    height: "100%",
    maxHeight: 600,
    borderRadius: 24,
    backgroundColor: colors.white,
    overflow: "hidden",
    shadowColor: colors.thunder,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  nextCard: {
    position: "absolute",
    opacity: 0.5,
    transform: [{ scale: 0.95 }],
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
  },
  cardContent: {
    gap: spacing.sm,
  },
  eventName: {
    ...typography.h2,
    color: colors.white,
  },
  eventDescription: {
    ...typography.body,
    color: colors.white + "cc",
  },
  eventMeta: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    ...typography.caption,
    color: colors.white,
  },
  swipeIndicator: {
    position: "absolute",
    top: 40,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
    borderWidth: 3,
  },
  skipIndicator: {
    left: 20,
    borderColor: colors.aluminium,
    transform: [{ rotate: "-15deg" }],
  },
  interestedIndicator: {
    right: 20,
    borderColor: colors.deluge,
    transform: [{ rotate: "15deg" }],
  },
  indicatorText: {
    ...typography.h3,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xl * 2,
    paddingVertical: spacing.xl,
  },
  actionButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.thunder,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skipButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.aluminium + "40",
  },
  interestedButton: {
    backgroundColor: colors.deluge,
  },
});
