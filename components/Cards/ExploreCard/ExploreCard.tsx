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
import { formatEventDate } from "utils/date";
import LocationIcon from "assets/icons/location.svg";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_HORIZONTAL_PADDING = 32;
const CARD_WIDTH = SCREEN_WIDTH - CARD_HORIZONTAL_PADDING * 2;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.62;

export interface ExploreCardData {
  id: string;
  name: string;
  date: string;
  image?: string | null;
  locationName?: string | null;
  isFree?: boolean | null;
  isSaved?: boolean | null;
  category?: Array<{ id: string; name: string; icon: string } | null> | null;
}

interface ExploreCardProps {
  event: ExploreCardData;
  onPress: () => void;
}

export const ExploreCard: React.FC<ExploreCardProps> = ({ event, onPress }) => {
  const categoryName = event.category?.[0]?.name;

  return (
    <Pressable onPress={onPress} testID="explore-card" style={styles.card}>
      {/* Background image or placeholder */}
      {event.image ? (
        <Image
          source={{ uri: event.image }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      ) : (
        <View style={[StyleSheet.absoluteFillObject, styles.placeholder]}>
          <Text style={styles.placeholderEmoji}>
            {event.category?.[0]?.icon || "🎉"}
          </Text>
        </View>
      )}

      {/* Top row: category + date badge */}
      <View style={styles.topRow}>
        {categoryName && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{categoryName}</Text>
          </View>
        )}
        <View style={styles.dateBadge}>
          <Text style={styles.dateBadgeText}>
            {formatEventDate(event.date, { month: "short", day: "numeric" })}
          </Text>
        </View>
      </View>

      {/* Bottom gradient + content */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.55)", "rgba(0,0,0,0.85)"]}
        locations={[0.3, 0.6, 1]}
        style={styles.gradient}
      >
        {/* Location label */}
        {event.locationName && (
          <View style={styles.locationRow}>
            <LocationIcon width={14} height={14} stroke={colors.white80} />
            <Text style={styles.locationText} numberOfLines={1}>
              {event.locationName}
            </Text>
          </View>
        )}

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {event.name}
        </Text>

        {/* Meta row */}
        <View style={styles.metaRow}>
          <Text style={styles.dateText}>
            {formatEventDate(event.date)}
          </Text>
          {event.isFree && (
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>Free</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </Pressable>
  );
};

export const EXPLORE_CARD_WIDTH = CARD_WIDTH;
export const EXPLORE_CARD_HEIGHT = CARD_HEIGHT;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: colors.prim,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  placeholder: {
    backgroundColor: colors.deluge,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderEmoji: {
    fontSize: 64,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
    zIndex: 1,
  },
  categoryBadge: {
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryBadgeText: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
  dateBadge: {
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  dateBadgeText: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.thunder,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 80,
    justifyContent: "flex-end",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  locationText: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.white80,
  },
  title: {
    fontFamily: typography.h2.fontFamily,
    fontSize: fontSizes["2xl"],
    fontWeight: fontWeights.bold,
    color: colors.white,
    lineHeight: 34,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dateText: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.white65,
  },
  freeBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  freeBadgeText: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
});
