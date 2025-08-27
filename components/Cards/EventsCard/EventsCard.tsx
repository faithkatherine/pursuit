import React from "react";
import { Text, Image, TouchableOpacity, View, StyleSheet } from "react-native";
import colors, { theme } from "pursuit/themes/tokens/colors";
import { fontSizes, fontWeights } from "pursuit/themes/tokens/typography";
import { Event } from "pursuit/graphql/types";
import { images, ImageKey } from "pursuit/assets/images";

interface EventsCardProps {
  event: Event;
  onPress: () => void;
}
export const EventsCard: React.FC<EventsCardProps> = ({ event, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      testID="events-card"
      style={styles.container}
    >
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
    </TouchableOpacity>
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
    display: "flex",
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    marginVertical: 8,
  },
  date: {
    fontSize: fontSizes.sm,
    color: colors.black,
  },
  location: {
    fontSize: fontSizes.sm,
    color: colors.black,
    marginTop: 4,
  },
});
