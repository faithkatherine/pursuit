import React from "react";
import { Text, Image, View, StyleSheet, Pressable } from "react-native";
import colors, { theme } from "themes/tokens/colors";
import typography, { fontSizes, fontWeights } from "themes/tokens/typography";
import { Event } from "graphql/types";
import DateIcon from "assets/icons/date.svg";
import LocationIcon from "assets/icons/location.svg";
import ClockIcon from "assets/icons/clock.svg";

interface EventsCardProps {
  event: Event;
  onPress: () => void;
}
export const EventsCard: React.FC<EventsCardProps> = ({ event, onPress }) => {
  return (
    <Pressable onPress={onPress} testID="events-card" style={styles.container}>
      <Image
        source={{ uri: event.image }}
        testID="events-card-image"
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.date}>{event.date}</Text>
        <Text style={styles.location}>{event.location}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: colors.white,
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
  },
  image: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    width: 150,
    height: "100%",
  },
  content: {
    padding: 10,
    gap: 4,
    display: "flex",
  },
  title: {
    fontFamily: typography.h4.fontFamily,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.black,
  },

  date: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.lg,
    color: colors.graniteGray,
  },
  location: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.black,
    maxWidth: 200,
  },
});
