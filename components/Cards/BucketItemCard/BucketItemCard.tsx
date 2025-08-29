import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
interface BucketItemCardProps {
  variant: "preview" | "detailed";
  title: string;
  description?: string;
  imageUrl: string;
  date?: Date;
  category: string;
}
export const BucketItemCard: React.FC<BucketItemCardProps> = ({
  variant,
  title,
  description,
  imageUrl,
  category,
}) => {
  switch (variant) {
    case "preview":
      return (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUrl }} style={styles.previewImage} />
          <Text style={styles.previewTitle}>{title}</Text>
          <Text style={styles.previewCategory}>{category}</Text>
        </View>
      );
    case "detailed":
      return (
        <View style={styles.detailedContainer}>
          <Image source={{ uri: imageUrl }} style={styles.detailedImage} />
          <View style={styles.detailedContent}>
            <Text style={styles.detailedTitle}>{title}</Text>
            {description && (
              <Text style={styles.detailedDescription}>{description}</Text>
            )}
            <Text style={styles.detailedCategory}>{category}</Text>
          </View>
        </View>
      );
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  previewContainer: {
    width: 150,
    margin: 10,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewImage: {
    width: "100%",
    height: 100,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 8,
  },
  previewCategory: {
    fontSize: 12,
    color: "#666",
    marginHorizontal: 8,
    marginBottom: 8,
  },
  detailedContainer: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  detailedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  detailedContent: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  detailedTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  detailedDescription: {
    fontSize: 14,
    color: "#333",
    marginVertical: 4,
  },
  detailedCategory: {
    fontSize: 12,
    color: "#666",
  },
});
