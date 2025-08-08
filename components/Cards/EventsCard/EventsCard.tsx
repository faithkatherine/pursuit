import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Button } from "pursuit/components/Buttons/Buttons";

interface EventsCardProps {
  image?: string;
  title?: string;
  date?: string;
  location?: string;
  onPress?: () => void;
  testID?: string;
}
export const EventsCard: React.FC<EventsCardProps> = ({
  image,
  title = "Event Title",
  date = "Date",
  location = "Location",
  onPress,
  testID,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      testID={testID}
      style={styles.container}
    >
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.date}>{date}</Text>
      <Text style={styles.location}>{location}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 200,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
