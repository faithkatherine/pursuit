import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@shared/constants/tokens/colors";
import Svg, { Path } from "react-native-svg";

interface EventExploreCardProps {
  event: {
    id: string;
    name: string;
    date: string;
    image?: string | null;
    locationName?: string | null;
    tagline?: string | null;
    isFree?: boolean | null;
    price?: number | null;
    ticketPrice?: number | null;
    isFeatured?: boolean;
    goingCount?: number | null;
  };
  onPress: () => void;
  isFeatured?: boolean;
}

const PinIcon = () => (
  <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
      fill={colors.onSurfaceVariant}
    />
  </Svg>
);

const TicketIcon = ({ color }: { color: string }) => (
  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.89-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-2-1.46c-1.19.69-2 1.99-2 3.46s.81 2.77 2 3.46V18H4v-2.54c1.19-.69 2-1.99 2-3.46 0-1.48-.8-2.77-1.99-3.46L4 6h16v2.54z"
      fill={color}
    />
  </Svg>
);

const getDateParts = (date: string) => {
  const eventDate = new Date(date);

  if (Number.isNaN(eventDate.getTime())) {
    return {
      month: "---",
      day: "--",
    };
  }

  return {
    month: eventDate
      .toLocaleDateString("en-US", { month: "short" })
      .toUpperCase(),
    day: eventDate.getDate().toString().padStart(2, "0"),
  };
};

export const EventExploreCard: React.FC<EventExploreCardProps> = ({
  event,
  onPress,
  isFeatured = false,
}) => {
  const { month, day } = getDateParts(event.date);
  const imageHeight = isFeatured ? 220 : 160;
  const priceColor = event.isFree ? colors.success : colors.primary;
  const price = event.ticketPrice ?? event.price;
  const priceLabel = event.isFree
    ? "Free"
    : price
      ? `From KES ${price.toLocaleString()}`
      : "Paid";

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.imageShadow}>
        <View style={[styles.imageSection, { height: imageHeight }]}>
          {event.image ? (
            <Image
              source={{ uri: event.image }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={[
                colors.primaryFixed,
                colors.surfaceContainerLow,
                colors.primary,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.placeholder}
            />
          )}
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.dateText}>
          {month} {day}
        </Text>

        {event.locationName && (
          <View style={styles.locationRow}>
            <PinIcon />
            <Text style={styles.locationText} numberOfLines={1}>
              {event.locationName}
            </Text>
          </View>
        )}

        <Text style={styles.title} numberOfLines={3}>
          {event.name}
        </Text>

        <View style={styles.priceRow}>
          <TicketIcon color={priceColor} />
          <Text style={[styles.priceText, { color: priceColor }]}>
            {priceLabel}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 18,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 5,
  },
  imageShadow: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 1,
  },
  imageSection: {
    width: "100%",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.surfaceContainer,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    width: "100%",
    height: "100%",
  },
  content: {
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 16,
  },
  dateText: {
    fontFamily: "Manrope",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    color: colors.primary,
    lineHeight: 16,
    letterSpacing: 0,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
  },
  locationText: {
    fontFamily: "Manrope",
    fontSize: 11,
    fontWeight: "700",
    color: colors.onSurfaceVariant,
    lineHeight: 14,
  },
  title: {
    fontFamily: "PlusJakartaSans-Bold",
    fontSize: 15,
    fontWeight: "700",
    color: colors.onSurface,
    lineHeight: 19,
    letterSpacing: 0,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  priceText: {
    fontFamily: "Manrope",
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 14,
  },
});
