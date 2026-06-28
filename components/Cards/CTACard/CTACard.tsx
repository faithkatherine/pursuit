import { useRef, useEffect, useState } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ChevronIcon from "assets/icons/chevron.svg";
import TravelIcon from "assets/icons/travel_explore.svg";

import colors from "@shared/constants/tokens/colors";
import typography, { fontWeights } from "@shared/constants/tokens/typography";
import { radii } from "@shared/constants/tokens/spacing";

type TripData = {
  id: string;
  name: string;
  startDate: string;
  events: Array<{ id: string }>;
} | null;

type SavedEventData = {
  id: string;
  name: string;
  locationName?: string | null;
  date: string;
} | null;

interface CTACardProps {
  type: "trip" | "saved-event";
  tripData?: TripData;
  eventData?: SavedEventData;
  onPress: () => void;
}

const TRIP_INTERACTION_KEY = "@pursuit/trip-cta-last-interaction";

export const CTACard: React.FC<CTACardProps> = ({
  type,
  tripData,
  eventData,
  onPress,
}) => {
  const [shouldShowShimmer, setShouldShowShimmer] = useState(false);
  const hasShimmered = useRef(false);
  const chevronOffset = useSharedValue(0);
  const pulseOpacity = useSharedValue(1);
  const titleOpacity = useSharedValue(1);
  const subtitleOpacity = useSharedValue(1);

  // --- Trip CTA Logic ---
  const tripState = !tripData
    ? "no-trip"
    : tripData.events.length === 0
      ? "incomplete"
      : (() => {
          const now = new Date();
          const start = new Date(tripData.startDate);
          const daysAway = Math.ceil(
            (start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
          );
          return daysAway <= 7 ? "booked-soon" : "booked-far";
        })();

  const daysAway = tripData
    ? Math.ceil(
        (new Date(tripData.startDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  const tripCopy = (() => {
    switch (tripState) {
      case "no-trip":
        return {
          label: "PLAN A TRIP",
          content: "Where will you go next?",
        };
      case "incomplete":
        return {
          label: "FINISH PLANNING",
          content: `${tripData!.name} · ${new Date(tripData!.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
        };
      case "booked-soon":
        return {
          label: "YOUR TRIP",
          content: `${tripData!.name} · ${daysAway} day${daysAway === 1 ? "" : "s"} away`,
        };
      case "booked-far":
        return {
          label: "YOUR TRIP",
          content: `${tripData!.name} · ${daysAway} day${daysAway === 1 ? "" : "s"} away`,
        };
    }
  })();

  // --- Saved Event CTA Logic ---
  const hoursUntil = eventData
    ? Math.ceil(
        (new Date(eventData.date).getTime() - new Date().getTime()) /
          (1000 * 60 * 60),
      )
    : null;

  const eventState =
    hoursUntil !== null
      ? hoursUntil <= 4
        ? "within-4h"
        : hoursUntil <= 24
          ? "within-24h"
          : hoursUntil <= 168
            ? "within-7d"
            : "beyond-7d"
      : null;

  const eventCopy = (() => {
    if (!eventData || !hoursUntil) return null;
    const eventDate = new Date(eventData.date);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (eventState) {
      case "within-4h":
        return {
          label: `NEXT UP · IN ${hoursUntil} HOUR${hoursUntil === 1 ? "" : "S"}`,
          content: eventData.name,
          venue: eventData.locationName || "Event",
        };
      case "within-24h":
        const isToday = eventDate.toDateString() === now.toDateString();
        const isTomorrow = eventDate.toDateString() === tomorrow.toDateString();
        return {
          label: `COMING UP · ${(isToday ? "TODAY" : isTomorrow ? "TOMORROW" : "SOON").toUpperCase()}`,
          content: eventData.name,
          venue: eventData.locationName || "Event",
        };
      case "within-7d":
        const dayName = eventDate.toLocaleDateString("en-US", {
          weekday: "long",
        });
        return {
          label: `COMING UP · ${dayName.toUpperCase()}`,
          content: eventData.name,
          venue: eventData.locationName || "Event",
        };
      case "beyond-7d":
        const dateStr = eventDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        return {
          label: `SAVED · ${dateStr.toUpperCase()}`,
          content: eventData.name,
          venue: eventData.locationName || "Event",
        };
      default:
        return null;
    }
  })();

  const copy = type === "trip" ? tripCopy : eventCopy;
  if (!copy) return null;

  // --- Shimmer Animation (Trip CTA only) ---
  useEffect(() => {
    if (type === "trip") {
      const checkShimmer = async () => {
        try {
          const lastInteraction =
            await AsyncStorage.getItem(TRIP_INTERACTION_KEY);
          const shouldShow =
            !hasShimmered.current &&
            (!lastInteraction ||
              Date.now() - parseInt(lastInteraction, 10) >
                7 * 24 * 60 * 60 * 1000);
          setShouldShowShimmer(shouldShow);
          if (shouldShow) {
            hasShimmered.current = true;
          }
        } catch {
          // Ignore
        }
      };
      checkShimmer();
    }
  }, [type]);

  const shimmerProgress = useSharedValue(0);

  useEffect(() => {
    if (shouldShowShimmer) {
      shimmerProgress.value = withSequence(
        withTiming(1, { duration: 800, easing: Easing.ease }),
        withTiming(0, { duration: 0 }),
      );
    }
  }, [shouldShowShimmer]);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmerProgress.value,
    transform: [{ translateX: shimmerProgress.value * 60 }],
  }));

  // --- Pulse Animation (Saved Event within 4h only) ---
  useEffect(() => {
    if (type === "saved-event" && eventState === "within-4h") {
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.7, {
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      );
    } else {
      pulseOpacity.value = 1;
    }
  }, [type, eventState]);

  const pulseTitleStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  // --- Chevron Nudge ---
  const handlePressIn = () => {
    chevronOffset.value = withTiming(4, {
      duration: 150,
      easing: Easing.out(Easing.ease),
    });
  };

  const handlePressOut = () => {
    chevronOffset.value = withTiming(0, {
      duration: 150,
      easing: Easing.out(Easing.ease),
    });
  };

  const handlePress = async () => {
    if (type === "trip") {
      try {
        await AsyncStorage.setItem(TRIP_INTERACTION_KEY, Date.now().toString());
      } catch {
        // Ignore
      }
    }
    onPress();
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: chevronOffset.value }],
  }));

  // --- Cross-fade on state change (Trip CTA only) ---
  const prevTripState = useRef(tripState);

  useEffect(() => {
    if (type === "trip" && prevTripState.current !== tripState) {
      titleOpacity.value = withSequence(
        withTiming(0, { duration: 100 }),
        withTiming(1, { duration: 100 }),
      );
      subtitleOpacity.value = withSequence(
        withTiming(0, { duration: 100 }),
        withTiming(1, { duration: 100 }),
      );
      prevTripState.current = tripState;
    }
  }, [type, tripState]);

  const labelAnimStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
  }));

  const contentAnimStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  // --- Styling ---
  const isTripCTA = type === "trip";
  const isUrgent = type === "saved-event" && eventState === "within-4h";

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={styles.container}
    >
      {isTripCTA ? (
        <LinearGradient
          colors={[colors.careysPink, colors.mustardCream]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <View style={[styles.iconBox, styles.tripIconBox]}>
            <TravelIcon width={36} height={36} fill={colors.deluge} />
            {shouldShowShimmer && (
              <Animated.View style={[styles.shimmer, shimmerStyle]}>
                <LinearGradient
                  colors={["transparent", colors.white80, "transparent"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.shimmerGradient}
                />
              </Animated.View>
            )}
          </View>
          <View style={styles.content}>
            <Animated.Text style={[styles.label, labelAnimStyle]}>
              {copy.label}
            </Animated.Text>
            <Animated.Text style={[styles.contentText, contentAnimStyle]}>
              {copy.content}
            </Animated.Text>
          </View>
          <Animated.View style={chevronStyle}>
            <ChevronIcon
              width={24}
              height={24}
              stroke={colors.black87}
              strokeWidth={32}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Animated.View>
        </LinearGradient>
      ) : (
        <View style={[styles.gradient, styles.eventGradient]}>
          <View style={styles.eventAccent} />
          <View style={styles.content}>
            <Animated.Text
              style={[
                styles.label,
                styles.eventLabel,
                isUrgent && styles.urgentLabel,
                isUrgent && pulseTitleStyle,
              ]}
            >
              {copy.label}
            </Animated.Text>
            <Text style={[styles.contentText, styles.eventContent]}>
              {copy.content}
            </Text>
          </View>
          <Animated.View style={chevronStyle}>
            <ChevronIcon
              width={24}
              height={24}
              stroke={colors.black87}
              strokeWidth={32}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Animated.View>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: radii.lg,
    overflow: "hidden",
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 64,
  },
  eventGradient: {
    backgroundColor: colors.ghostWhite,
    paddingLeft: 16,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  tripIconBox: {
    backgroundColor: colors.white65,
  },
  eventAccent: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.deluge,
    marginRight: 4,
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: -60,
    width: 60,
    height: "100%",
  },
  shimmerGradient: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    paddingHorizontal: 4,
    justifyContent: "center",
  },
  label: {
    fontFamily: typography.caption.fontFamily,
    fontSize: 12,
    fontWeight: fontWeights.semibold,
    color: colors.leather,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  eventLabel: {
    fontSize: 11,
  },
  urgentLabel: {
    color: colors.lightPurple,
  },
  contentText: {
    fontFamily: typography.body.fontFamily,
    fontSize: 16,
    fontWeight: fontWeights.regular,
    color: colors.thunder,
    lineHeight: 20,
  },
  eventContent: {
    fontSize: 15,
    color: colors.black,
  },
});
