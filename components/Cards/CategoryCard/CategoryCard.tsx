import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "themes/tokens/colors";
import { typography, fontSizes, fontWeights } from "themes/tokens/typography";

// --- BucketCard ---
interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  gradientColors: [string, string];
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  name,
  icon,
  gradientColors,
}) => {
  return (
    <LinearGradient
      key={id}
      colors={gradientColors}
      locations={[0, 1]}
      style={styles.categoryCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryName}>{name}</Text>
        <Text style={styles.categoryEmoji}>{icon}</Text>
      </View>
    </LinearGradient>
  );
};

// --- CategoryPills ---
export interface CategoryPillItem {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CategoryPillsProps {
  categories: CategoryPillItem[];
  selectedCategoryId?: string | null;
  onCategorySelect?: (categoryId: string | null) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategoryId,
  onCategorySelect,
}) => {
  const isAllSelected = selectedCategoryId == null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.pillsContainer}
    >
      <TouchableOpacity
        style={[styles.pill, isAllSelected && styles.pillSelected]}
        onPress={() => onCategorySelect?.(null)}
        activeOpacity={0.7}
      >
        <Text
          style={[styles.pillText, isAllSelected && styles.pillTextSelected]}
        >
          All
        </Text>
      </TouchableOpacity>
      {categories.map((category) => {
        const isSelected = selectedCategoryId === category.id;
        return (
          <TouchableOpacity
            key={category.id}
            style={[styles.pill, isSelected && styles.pillSelected]}
            onPress={() => onCategorySelect?.(category.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.pillText, isSelected && styles.pillTextSelected]}
            >
              {category.icon} {category.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // BucketCard styles
  categoryCard: {
    width: 150,
    height: 80,
    borderRadius: 8,
    padding: 16,
    justifyContent: "space-between",
  },
  categoryHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  categoryEmoji: {
    fontSize: 32,
  },
  categoryName: {
    fontFamily: typography.bodyLarge.fontFamily,
    fontSize: typography.bodyLarge.fontSize,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },

  // CategoryPills styles
  pillsContainer: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 4,
  },
  pill: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.thunder,
    backgroundColor: "transparent",
  },
  pillSelected: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  pillText: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.thunder,
  },
  pillTextSelected: {
    color: colors.deluge,
  },
});
