import React from "react";
import { Text, Image, View, StyleSheet, Pressable } from "react-native";
import colors, { theme } from "themes/tokens/colors";
import typography, { fontSizes, fontWeights } from "themes/tokens/typography";
import { Recommendation } from "graphql/types";
import DateIcon from "assets/icons/date.svg";
import LocationIcon from "assets/icons/location.svg";
import ClockIcon from "assets/icons/clock.svg";

interface RecommendationCardProps {
  recommendation: Recommendation;
  onPress: () => void;
}
export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, onPress }) => {
  return (
    <Pressable onPress={onPress} testID="recommendation-card" style={styles.container}>
      <Image
        source={{ uri: recommendation.image }}
        testID="recommendation-card-image"
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title}>{recommendation.title}</Text>
        <Text style={styles.date}>{recommendation.date}</Text>
        <Text style={styles.location}>{recommendation.location}</Text>
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
