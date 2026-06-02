import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  Animated,
  PanResponder,
  ActivityIndicator,
} from "react-native";
import Svg, { Path } from "react-native-svg";

import { Button } from "components/Buttons";
import HeartIcon from "assets/icons/heart.svg";
import { colors } from "themes/tokens/colors";
import { typography, fontWeights, fontSizes } from "themes/tokens/typography";
import { radii } from "themes/tokens/spacing";
import { ExploreCard } from "components/Cards/ExploreCard";
import type { ExploreCardData } from "components/Cards/ExploreCard";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 300;

interface SwipeStackProps {
  events: ExploreCardData[];
  onSave?: (eventId: string) => Promise<void>;
  onUnsave?: (eventId: string) => Promise<void>;
  getSavedState?: (eventId: string) => boolean;
}

/**
 * SwipeStack - Tinder-style card swiper for group plan voting
 * Preserving this component for future Group Plans feature (Priority 5)
 */
export const SwipeStack: React.FC<SwipeStackProps> = ({
  events,
  onSave,
  onUnsave,
  getSavedState,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const [saving, setSaving] = useState(false);

  const currentEvent =
    currentIndex < events.length ? events[currentIndex] : null;
  const isCurrentSaved = currentEvent
    ? (getSavedState?.(currentEvent.id) ?? currentEvent.isSaved ?? false)
    : false;

  const handleSave = useCallback(async () => {
    if (!currentEvent || saving) return;
    setSaving(true);
    try {
      if (isCurrentSaved) {
        await onUnsave?.(currentEvent.id);
      } else {
        await onSave?.(currentEvent.id);
      }
    } catch (error) {
      // silent
    } finally {
      setSaving(false);
    }
  }, [currentEvent, isCurrentSaved, saving, onSave, onUnsave]);

  // --- Swipe animation ---
  const position = useRef(new Animated.ValueXY()).current;

  const resetPosition = useCallback(() => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
      friction: 5,
    }).start();
  }, [position]);

  const swipeCard = useCallback(
    (direction: "left" | "right") => {
      // Swipe left → next card, swipe right → previous card
      if (direction === "right" && currentIndexRef.current <= 0) {
        resetPosition();
        return;
      }

      const toX =
        direction === "left" ? -SCREEN_WIDTH - 100 : SCREEN_WIDTH + 100;
      Animated.timing(position, {
        toValue: { x: toX, y: 0 },
        duration: SWIPE_OUT_DURATION,
        useNativeDriver: false,
      }).start(() => {
        position.setValue({ x: 0, y: 0 });
        setCurrentIndex((prev) => {
          const next = direction === "left" ? prev + 1 : Math.max(0, prev - 1);
          currentIndexRef.current = next;
          return next;
        });
      });
    },
    [position, resetPosition],
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
      onMoveShouldSetPanResponderCapture: (_, gesture) =>
        Math.abs(gesture.dx) > 10,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: 0 });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -SWIPE_THRESHOLD) {
          swipeCard("left");
        } else if (gesture.dx > SWIPE_THRESHOLD) {
          swipeCard("right");
        } else {
          resetPosition();
        }
      },
    }),
  ).current;

  // Interpolated styles for top card
  const cardRotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ["-6deg", "0deg", "6deg"],
  });

  const cardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: [0.7, 1, 0.7],
  });

  // Next card scales up as the top card is swiped away
  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: [1, 0.96, 1],
    extrapolate: "clamp",
  });

  const nextCardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: [1, 0.85, 1],
    extrapolate: "clamp",
  });

  if (currentIndex >= events.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No more events</Text>
        <Text style={styles.emptySubtext}>Check back soon for more</Text>
        <Pressable
          style={styles.resetButton}
          onPress={() => {
            setCurrentIndex(0);
            currentIndexRef.current = 0;
          }}
        >
          <Text style={styles.resetButtonText}>Start over</Text>
        </Pressable>
      </View>
    );
  }

  // Render up to 3 stacked cards (bottom to top)
  const visibleCards = events.slice(currentIndex, currentIndex + 3).reverse();

  return (
    <View style={styles.container}>
      <View style={styles.cardArea}>
        {visibleCards.map((event, reverseIdx) => {
          const stackIndex = visibleCards.length - 1 - reverseIdx;
          const isTop = stackIndex === 0;

          if (isTop) {
            return (
              <Animated.View
                key={event.id}
                style={[
                  styles.cardWrapper,
                  {
                    transform: [
                      { translateX: position.x },
                      { rotate: cardRotate },
                    ],
                    opacity: cardOpacity,
                  },
                ]}
                {...panResponder.panHandlers}
              >
                <ExploreCard event={event} onPress={() => {}} />
              </Animated.View>
            );
          }

          // Second card — peeks out behind, reacts to drag
          if (stackIndex === 1) {
            return (
              <Animated.View
                key={event.id}
                style={[
                  styles.cardWrapper,
                  {
                    transform: [
                      { scale: nextCardScale },
                      { translateY: -18 },
                      { translateX: 6 },
                      { rotate: "2deg" },
                    ],
                    opacity: nextCardOpacity,
                  },
                ]}
              >
                <ExploreCard event={event} onPress={() => {}} />
              </Animated.View>
            );
          }

          // Third card — peeks out further
          return (
            <View
              key={event.id}
              style={[
                styles.cardWrapper,
                {
                  transform: [
                    { scale: 0.92 },
                    { translateY: -34 },
                    { translateX: 12 },
                    { rotate: "4deg" },
                  ],
                  opacity: 0.6,
                },
              ]}
            >
              <ExploreCard event={event} onPress={() => {}} />
            </View>
          );
        })}
      </View>

      {/* Action bar */}
      <View style={styles.actionBar}>
        {/* Undo — go back */}
        <Button
          variant="secondary"
          icon={
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12.5 8c-2.65 0-5.05 1-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"
                fill={currentIndex > 0 ? colors.thunder : colors.aluminium}
              />
            </Svg>
          }
          onPress={() => {
            if (currentIndex > 0) swipeCard("right");
          }}
          disabled={currentIndex <= 0}
          style={[
            styles.actionButtonStyle,
            {
              width: 52,
              height: 52,
              borderRadius: radii.full,
              borderWidth: 1.5,
              backgroundColor: colors.white,
            },
          ]}
        />

        {/* Save / favorite */}
        <Button
          variant="secondary"
          icon={
            saving ? (
              <ActivityIndicator size="small" color={colors.deluge} />
            ) : (
              <HeartIcon
                width={22}
                height={22}
                stroke={colors.deluge}
                fill={isCurrentSaved ? colors.deluge : "none"}
              />
            )
          }
          onPress={handleSave}
          style={[
            styles.actionButtonStyle,
            {
              width: 60,
              height: 60,
              borderRadius: radii.full,
              borderWidth: 1.5,
              backgroundColor: colors.white,
            },
          ]}
        />

        {/* Forward — next card */}
        <Button
          variant="secondary"
          icon={
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d="M13.025 1l-2.847 2.828 6.176 6.176H0v3.992h16.354l-6.176 6.176L13.025 23 24 12z"
                fill={colors.white}
              />
            </Svg>
          }
          onPress={() => swipeCard("left")}
          style={[
            styles.actionButtonStyle,
            {
              width: 52,
              height: 52,
              borderRadius: radii.full,
              borderWidth: 0,
              elevation: 0,
              backgroundColor: colors.deluge,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  cardArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
    marginBottom: 20,
  },
  cardWrapper: {
    position: "absolute",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: fontWeights.semibold,
    color: colors.thunder,
    fontFamily: typography.h4.fontFamily,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.aluminium,
    fontFamily: typography.body.fontFamily,
  },
  resetButton: {
    marginTop: 16,
    backgroundColor: colors.deluge,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: radii.xl,
  },
  resetButtonText: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    paddingBottom: 32,
  },
  actionButtonStyle: {
    padding: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
});
