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
import type { EventCardData } from "components/Cards/EventsCard";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.42;
const CARD_HEIGHT = CARD_WIDTH * 1.35;

interface UpcomingCardProps {
  event: EventCardData;
  onPress: () => void;
}

function getDateParts(dateStr: string) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return { day: "--", month: "---" };
  return {
    day: date.getDate().toString(),
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
  };
}

export const UpcomingCard: React.FC<UpcomingCardProps> = ({
  event,
  onPress,
}) => {
  const { day, month } = getDateParts(event.date);

  return (
    <Pressable
      onPress={onPress}
      testID="upcoming-card"
      style={styles.container}
    >
      <Image
        source={{ uri: event.image }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Date badge - top right */}
      <View style={styles.dateBadge}>
        <Text style={styles.dateBadgeDay}>{day}</Text>
        <Text style={styles.dateBadgeMonth}>{month}</Text>
      </View>

      {/* Gradient overlay + content at bottom */}
      <LinearGradient
        colors={["transparent", "rgba(139,127,188,0.7)", colors.ube]}
        locations={[0.25, 0.6, 1]}
        style={styles.gradient}
      >
        <Text style={styles.eventName} numberOfLines={2}>
          {event.name}
        </Text>
        <Text style={styles.dateRange} numberOfLines={1}>
          {formatEventDate(event.date)}
        </Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  dateBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: "center",
    zIndex: 1,
  },
  dateBadgeDay: {
    fontFamily: typography.h4.fontFamily,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.deluge,
    lineHeight: 22,
  },
  dateBadgeMonth: {
    fontFamily: typography.caption.fontFamily,
    fontSize: 10,
    fontWeight: fontWeights.semibold,
    color: colors.deluge,
    lineHeight: 12,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingBottom: 14,
    paddingTop: 50,
    justifyContent: "flex-end",
  },
  eventName: {
    fontFamily: typography.h4.fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: colors.white,
    marginBottom: 3,
  },
  dateRange: {
    fontFamily: typography.caption.fontFamily,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.white80,
  },
});
