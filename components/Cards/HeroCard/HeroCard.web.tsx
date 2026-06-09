import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { formatEventDate } from "utils/date";

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

const PURSUIT = {
  purple: "#7C5C9C",
  mist: "#EDE8F5",
  white: "#FFFFFF",
};

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
        colors={[PURSUIT.purple, "#E8B5B0"]}
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
    height: 420,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: PURSUIT.mist,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    padding: 20,
  },
  topRow: {
    flexDirection: "row",
  },
  badge: {
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.9)",
    color: PURSUIT.purple,
    fontFamily: "Work Sans",
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 16,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  date: {
    fontFamily: "Work Sans",
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.78)",
    marginBottom: 6,
  },
  title: {
    fontFamily: "Poppins",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 31,
    color: PURSUIT.white,
  },
  location: {
    marginTop: 6,
    fontFamily: "Work Sans",
    fontSize: 14,
    color: "rgba(255,255,255,0.78)",
  },
  cta: {
    borderRadius: 999,
    backgroundColor: PURSUIT.white,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  ctaText: {
    fontFamily: "Work Sans",
    fontSize: 13,
    fontWeight: "600",
    color: PURSUIT.purple,
  },
});
