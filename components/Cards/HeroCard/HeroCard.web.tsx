import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { formatEventDate } from "utils/date";
import { colors } from "themes/tokens/colors";
import { webTypography } from "themes/tokens/typography";

// ─── Layout constants ──────────────────────────────────────────────────────
const MAX_CONTENT_WIDTH = 1200;
const CONTENT_PADDING_H = 24;
const BREAKPOINT_TABLET = 768;
const BREAKPOINT_DESKTOP = 1024;
const HERO_HEIGHT = 390;
const CARD_RADIUS = 12;
const OVERLAY_PADDING = 24;
const CONTENT_GAP = 16;
const BADGE_RADIUS = 999;
const BADGE_PADDING_H = 12;
const BADGE_PADDING_V = 6;
const BADGE_FONT_SIZE = 12;
const DATE_FONT_SIZE = 13;
const TITLE_FONT_SIZE = 28;
const TITLE_LINE_HEIGHT = 35;
const LOCATION_FONT_SIZE = 14;
const CTA_PADDING_H = 16;
const CTA_PADDING_V = 9;
// ──────────────────────────────────────────────────────────────────────────

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

const formatDate = (date: string): string => {
  const formatted = formatEventDate(date, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  return typeof formatted === "string" ? formatted : formatted.formattedDate;
};

export const HeroCard: React.FC<HeroCardProps> = ({
  trip,
  onPress,
  isEditorsPick = false,
}) => (
  <Pressable onPress={onPress} testID="hero-card" style={styles.container}>
    {trip.coverImage ? (
      <Image source={{ uri: trip.coverImage }} style={styles.image} resizeMode="cover" />
    ) : (
      <LinearGradient
        colors={[colors.pursuitPurple, colors.pursuitRose]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.image}
      />
    )}

    <LinearGradient
      colors={["transparent", "rgba(26,26,46,0.72)", "rgba(26,26,46,0.94)"]}
      locations={[0, 0.58, 1]}
      style={styles.overlay}
    >
      <View style={styles.topRow}>
        <Text style={styles.badge}>{isEditorsPick ? "Editor's Pick" : "Featured"}</Text>
      </View>
      <View style={styles.bottomRow}>
        <View style={styles.copy}>
          <Text style={styles.date}>{formatDate(trip.startDate)}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {trip.name}
          </Text>
          <Text style={styles.location} numberOfLines={1}>
            {trip.destination}
          </Text>
        </View>
        <View style={styles.cta}>
          <Text style={styles.ctaText}>Book Now</Text>
        </View>
      </View>
    </LinearGradient>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: HERO_HEIGHT,
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    backgroundColor: colors.pursuitMist,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    padding: OVERLAY_PADDING,
  },
  topRow: {
    flexDirection: "row",
  },
  badge: {
    overflow: "hidden",
    borderRadius: BADGE_RADIUS,
    backgroundColor: "rgba(255,255,255,0.9)",
    color: colors.pursuitPurple,
    fontFamily: webTypography.label.fontFamily,
    fontSize: BADGE_FONT_SIZE,
    fontWeight: webTypography.label.fontWeight,
    paddingHorizontal: BADGE_PADDING_H,
    paddingVertical: BADGE_PADDING_V,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: CONTENT_GAP,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  date: {
    fontFamily: webTypography.label.fontFamily,
    fontSize: DATE_FONT_SIZE,
    fontWeight: webTypography.label.fontWeight,
    color: "rgba(255,255,255,0.78)",
    marginBottom: BADGE_PADDING_V,
  },
  title: {
    fontFamily: webTypography.heading.fontFamily,
    fontSize: TITLE_FONT_SIZE,
    fontWeight: webTypography.heading.fontWeight,
    lineHeight: TITLE_LINE_HEIGHT,
    color: colors.white,
  },
  location: {
    marginTop: BADGE_PADDING_V,
    fontFamily: webTypography.body.fontFamily,
    fontSize: LOCATION_FONT_SIZE,
    color: "rgba(255,255,255,0.78)",
  },
  cta: {
    borderRadius: BADGE_RADIUS,
    backgroundColor: colors.white,
    paddingHorizontal: CTA_PADDING_H,
    paddingVertical: CTA_PADDING_V,
  },
  ctaText: {
    fontFamily: webTypography.label.fontFamily,
    fontSize: DATE_FONT_SIZE,
    fontWeight: webTypography.label.fontWeight,
    color: colors.pursuitPurple,
  },
});
