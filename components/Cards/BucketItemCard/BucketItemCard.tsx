import colors from "pursuit/themes/tokens/colors";
import typography, {
  fontSizes,
  fontWeights,
} from "pursuit/themes/tokens/typography";
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
interface BucketItemCardProps {
  variant: "preview" | "detailed";
  title: string;
  description?: string;
  imageUrl: string;
  date?: Date;
  category: string;
  onPress?: () => void;
  priority?: "high" | "medium" | "low";
  completed?: boolean;
}
export const BucketItemCard: React.FC<BucketItemCardProps> = ({
  variant,
  title,
  date,
  description,
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
  switch (variant) {
    case "preview":
      return (
        <TouchableOpacity 
          style={[styles.previewContainer, completed && styles.completedCard]} 
          onPress={onPress}
          activeOpacity={0.9}
        >
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUrl }} style={styles.previewImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.imageOverlay}
            />
            <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor() }]} />
            {completed && (
              <View style={styles.completedBadge}>
                <Text style={styles.completedText}>✓</Text>
              </View>
            )}
          </View>
          <View style={styles.previewDetails}>
            <Text style={[styles.previewTitle, completed && styles.completedTitle]} numberOfLines={2}>
              {title}
            </Text>
            <View style={styles.metaContainer}>
              <Text style={styles.previewCategory}>{category}</Text>
              {date && (
                <Text style={styles.previewDate}>
                  {date.toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    case "detailed":
      return (
        <TouchableOpacity 
          style={[styles.detailedContainer, completed && styles.completedCard]} 
          onPress={onPress}
          activeOpacity={0.9}
        >
          <View style={styles.detailedImageContainer}>
            <Image source={{ uri: imageUrl }} style={styles.detailedImage} />
            <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor() }]} />
            {completed && (
              <View style={styles.completedBadge}>
                <Text style={styles.completedText}>✓</Text>
              </View>
            )}
          </View>
          <View style={styles.detailedContent}>
            <Text style={[styles.detailedTitle, completed && styles.completedTitle]} numberOfLines={2}>
              {title}
            </Text>
            {description && (
              <Text style={styles.detailedDescription} numberOfLines={3}>
                {description}
              </Text>
            )}
            <View style={styles.detailedMeta}>
              <Text style={styles.detailedCategory}>{category}</Text>
              {date && (
                <Text style={styles.detailedDate}>
                  {date.toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  previewContainer: {
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
  previewImage: {
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
  previewDetails: {
    padding: 16,
    flex: 1,
    justifyContent: "space-between",
  },
  previewTitle: {
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
  previewCategory: {
    fontSize: fontSizes.xs,
    color: colors.leather,
    fontWeight: fontWeights.medium,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  previewDate: {
    fontSize: fontSizes.xs,
    color: colors.aluminium,
    fontWeight: fontWeights.regular,
  },
  detailedContainer: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginVertical: 8,
    marginHorizontal: 16,
    gap: 16,
  },
  detailedImageContainer: {
    position: "relative",
  },
  detailedImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    resizeMode: "cover",
  },
  detailedContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  detailedTitle: {
    fontFamily: typography.h3.fontFamily,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.thunder,
    lineHeight: fontSizes.lg * 1.2,
  },
  detailedDescription: {
    fontSize: fontSizes.sm,
    color: colors.leather,
    marginVertical: 8,
    lineHeight: fontSizes.sm * 1.4,
  },
  detailedMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailedCategory: {
    fontSize: fontSizes.xs,
    color: colors.deluge,
    fontWeight: fontWeights.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailedDate: {
    fontSize: fontSizes.xs,
    color: colors.aluminium,
    fontWeight: fontWeights.regular,
  },
});
