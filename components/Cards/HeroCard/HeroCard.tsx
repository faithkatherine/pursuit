import React from "react";
import {
  Text,
  Image,
  View,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "themes/tokens/colors";
import typography, { fontSizes, fontWeights } from "themes/tokens/typography";
import { Button } from "components/Buttons/Buttons";
import { formatEventDate } from "utils/date";

export interface HeroCardData {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  coverImage?: string | null;
  eventCount?: number | null;
}

interface HeroCardProps {
  trip: HeroCardData;
  onPress: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_HORIZONTAL_MARGIN = 20;
const CARD_WIDTH = SCREEN_WIDTH - CARD_HORIZONTAL_MARGIN * 2;
const IMAGE_HEIGHT = CARD_WIDTH * 0.55;

function getNightCount(startDate: string, endDate: string): number | null {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
  const diff = Math.round(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diff > 0 ? diff : null;
}

function formatDateRange(startDate: string, endDate: string): string {
  const start = formatEventDate(startDate, { month: "short", day: "numeric" });
  const end = formatEventDate(endDate, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${start} – ${end}`;
}

export const HeroCard: React.FC<HeroCardProps> = ({ trip, onPress }) => {
  const nights = getNightCount(trip.startDate, trip.endDate);

  const tags: string[] = [];
  if (trip.destination) tags.push(trip.destination);
  if (nights) tags.push(`${nights} nights`);
  if (trip.eventCount != null && trip.eventCount > 0)
    tags.push(
      `${trip.eventCount} ${trip.eventCount === 1 ? "event" : "events"}`,
    );

  return (
    <Pressable onPress={onPress} testID="hero-card" style={styles.container}>
      {trip.coverImage ? (
        <Image
          source={{ uri: trip.coverImage }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <LinearGradient
          colors={[colors.deluge, colors.ube]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.image}
        />
      )}

      {/* Bottom gradient overlay */}
      <LinearGradient
        colors={["transparent", "rgba(30,30,46,0.6)", "rgba(30,30,46,0.92)"]}
        locations={[0.0, 0.4, 1]}
        style={styles.gradient}
      >
        <Text style={styles.tripName} numberOfLines={1}>
          {trip.name}
        </Text>

        <Text style={styles.dateRange}>
          {formatDateRange(trip.startDate, trip.endDate)}
        </Text>

        {/* Tags row */}
        {tags.length > 0 && (
          <View style={styles.tagsRow}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </LinearGradient>

      {/* View Details button */}
      <View style={styles.bottomSection}>
        <Button
          variant="primary"
          text="View Details"
          onPress={onPress}
          style={styles.ctaButton}
          textStyle={styles.ctaButtonText}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: colors.midnightBlue,
    marginHorizontal: CARD_HORIZONTAL_MARGIN,
  },
  image: {
    width: "100%",
    height: IMAGE_HEIGHT,
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: IMAGE_HEIGHT,
    paddingHorizontal: 20,
    paddingBottom: 16,
    justifyContent: "flex-end",
  },
  tripName: {
    fontFamily: typography.h3.fontFamily,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.white,
    marginBottom: 4,
  },
  dateRange: {
    fontFamily: typography.caption.fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: "rgba(255,255,255,0.75)",
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontFamily: typography.caption.fontFamily,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.white,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.midnightBlue,
  },
  ctaButton: {
    backgroundColor: colors.white,
    borderRadius: 28,
    paddingVertical: 14,
    shadowColor: "transparent",
  },
  ctaButtonText: {
    color: colors.midnightBlue,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
  },
});
