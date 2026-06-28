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
import colors from "@shared/constants/tokens/colors";
import typography, {
  fontSizes,
  fontWeights,
  letterSpacing,
} from "@shared/constants/tokens/typography";
import { radii } from "@shared/constants/tokens/spacing";
import { Button } from "components/Buttons/Buttons";
import { formatEventDate } from "@shared/utils/date";

export interface HeroCardData {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  coverImage?: string | null;
  eventCount?: number | null;
  curatorNote?: string | null;
  curatorName?: string | null;
}

interface HeroCardProps {
  trip: HeroCardData;
  onPress: () => void;
  isEditorsPick?: boolean;
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
  const startFormatted = formatEventDate(startDate, {
    month: "short",
    day: "numeric",
  });
  const startText =
    typeof startFormatted === "string"
      ? startFormatted
      : startFormatted.formattedDate;

  const endFormatted = formatEventDate(endDate, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const endText =
    typeof endFormatted === "string"
      ? endFormatted
      : endFormatted.formattedDate;

  return `${startText} \u2013 ${endText}`;
}

export const HeroCard: React.FC<HeroCardProps> = ({
  trip,
  onPress,
  isEditorsPick = false,
}) => {
  const nights = getNightCount(trip.startDate, trip.endDate);
  const hasCuratorNote = isEditorsPick && !!trip.curatorNote;
  const imageHeight = hasCuratorNote ? CARD_WIDTH * 0.62 : IMAGE_HEIGHT;

  // Trip tags: destination + nights + event count
  // Editor's pick tags: destination only
  const tags: string[] = [];
  if (trip.destination) tags.push(trip.destination);
  if (!isEditorsPick) {
    if (nights) tags.push(`${nights} nights`);
    if (trip.eventCount != null && trip.eventCount > 0)
      tags.push(
        `${trip.eventCount} ${trip.eventCount === 1 ? "event" : "events"}`,
      );
  }

  return (
    <Pressable onPress={onPress} testID="hero-card" style={styles.container}>
      {trip.coverImage ? (
        <Image
          source={{ uri: trip.coverImage }}
          style={[styles.image, { height: imageHeight }]}
          resizeMode="cover"
        />
      ) : (
        <LinearGradient
          colors={[colors.deluge, colors.ube]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.image, { height: imageHeight }]}
        />
      )}

      {/* Badge — only shown for Editor's Pick */}
      {isEditorsPick && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>EDITOR'S PICK</Text>
        </View>
      )}

      {/* Bottom gradient overlay */}
      <LinearGradient
        colors={["transparent", "rgba(30,30,46,0.6)", "rgba(30,30,46,0.92)"]}
        locations={[0.0, 0.4, 1]}
        style={[styles.gradient, { height: imageHeight }]}
      >
        <Text style={styles.tripName} numberOfLines={1}>
          {trip.name}
        </Text>

        <Text style={styles.dateRange}>
          {formatDateRange(trip.startDate, trip.endDate)}
        </Text>

        {/* Curator note — serif italic with smart quotes */}
        {hasCuratorNote && (
          <Text style={styles.curatorNote} numberOfLines={2}>
            {"\u201C"}
            {trip.curatorNote}
            {"\u201D"} {"\u2014"} {trip.curatorName || "Pursuit team"}
          </Text>
        )}

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

      {/* View Details — trip only */}
      {!isEditorsPick && (
        <View style={styles.bottomSection}>
          <Button
            variant="primary"
            text="View Details"
            onPress={onPress}
            style={styles.ctaButton}
            textStyle={styles.ctaButtonText}
          />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    borderRadius: radii.xl,
    overflow: "hidden",
    backgroundColor: colors.midnightBlue,
    marginHorizontal: CARD_HORIZONTAL_MARGIN,
  },
  image: {
    width: "100%",
  },
  badge: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.xl,
    zIndex: 2,
  },
  badgeText: {
    fontFamily: typography.caption.fontFamily,
    fontSize: 10,
    fontWeight: fontWeights.semibold,
    color: colors.white,
    letterSpacing: letterSpacing.wider * 10,
    textTransform: "uppercase",
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
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
    marginBottom: 8,
  },
  curatorNote: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    fontStyle: "italic",
    color: "rgba(255,255,255,0.85)",
    lineHeight: 20,
    marginBottom: 10,
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
    borderRadius: radii.xl,
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
    borderRadius: radii.full,
    paddingVertical: 14,
    shadowColor: "transparent",
  },
  ctaButtonText: {
    color: colors.midnightBlue,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
  },
});
