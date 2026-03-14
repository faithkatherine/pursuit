import colors from "themes/tokens/colors";
import typography, { fontSizes, fontWeights } from "themes/tokens/typography";
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface CategoryDetailProps {
  title: string;
  description?: string;
  imageUrl: string;
  date?: Date;
  category: string;
  onPress?: () => void;
  priority?: "high" | "medium" | "low";
  completed?: boolean;
}

export const CategoryDetail: React.FC<CategoryDetailProps> = ({
  title,
  date,
  imageUrl,
  category,
  onPress,
  priority = "medium",
  completed = false,
}) => {
  const getPriorityColor = () => {
    switch (priority) {
      case "high":
        return colors.careysPink;
      case "low":
        return colors.leather;
      default:
        return colors.deluge;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, completed && styles.completedCard]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.imageOverlay}
        />
        <View
          style={[
            styles.priorityIndicator,
            { backgroundColor: getPriorityColor() },
          ]}
        />
        {completed && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>✓</Text>
          </View>
        )}
      </View>
      <View style={styles.details}>
        <Text
          style={[styles.title, completed && styles.completedTitle]}
          numberOfLines={2}
        >
          {title}
        </Text>
        <View style={styles.metaContainer}>
          <Text style={styles.category}>{category}</Text>
          {date && (
            <Text style={styles.date}>{date.toLocaleDateString()}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 185,
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ scale: 1 }],
  },
  completedCard: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    position: "relative",
    height: 130,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  priorityIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  completedBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  completedText: {
    color: colors.deluge,
    fontSize: 14,
    fontWeight: "bold",
  },
  details: {
    padding: 16,
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontFamily: typography.h4.fontFamily,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    color: colors.thunder,
    lineHeight: fontSizes.base * 1.3,
    marginBottom: 8,
  },
  completedTitle: {
    textDecorationLine: "line-through",
    color: colors.aluminium,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  category: {
    fontSize: fontSizes.xs,
    color: colors.leather,
    fontWeight: fontWeights.medium,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  date: {
    fontSize: fontSizes.xs,
    color: colors.aluminium,
    fontWeight: fontWeights.regular,
  },
});
