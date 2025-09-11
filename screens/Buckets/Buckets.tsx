import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Layout, SectionHeader } from "components/Layout";
import { BucketCard } from "components/Cards/BucketCard";
import { BucketItemCard } from "components/Cards/BucketItemCard";
import { RecommendationCard } from "components/Cards/EventsCard";
import { AddBucket } from "./AddBucket";
import { AddBucketItem } from "./AddBucketItem";
import { Button } from "components/Buttons";
import { BaseModal } from "components/Modals";
import { colors, theme } from "themes/tokens/colors";
import { typography, fontWeights } from "themes/tokens/typography";
import { getGradientByIndex } from "themes/tokens/gradients";
import { useQuery } from "@apollo/client";
import {
  useBucketCategories,
  useBucketItems,
  useRecommendations,
  transformBucketItemsWithCategories,
  filterItemsBySearch,
  categorizeItems,
} from "../../graphql/hooks";
import { cacheUtils } from "../../graphql/cache";
import { Category, BucketItem, Recommendation } from "../../graphql/types";

export const Buckets = () => {
  const { width } = useWindowDimensions();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<BucketItem | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddBucketModal, setShowAddBucketModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  // Use shared hooks for consistent data fetching
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useBucketCategories();

  const {
    bucketItems,
    loading: itemsLoading,
    error: itemsError,
    refetch: refetchItems,
  } = useBucketItems(selectedCategory);

  const { recommendations, loading: recommendationsLoading } =
    useRecommendations();

  // Combine and transform data using shared utilities
  const transformedItems = transformBucketItemsWithCategories(
    bucketItems,
    categories
  );
  const filteredItems = filterItemsBySearch(transformedItems, searchQuery);
  const { sortedUpcoming, recentlyCompleted } = categorizeItems(filteredItems);

  const handleCategoryPress = useCallback(
    (categoryId: string) => {
      setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
    },
    [selectedCategory]
  );

  const handleItemPress = useCallback((item: BucketItem) => {
    setSelectedItem(item);
    setShowItemModal(true);
  }, []);

  const handleAddPress = useCallback(() => {
    setShowAddBucketModal(true);
  }, []);

  const handleAddItemPress = useCallback(() => {
    setShowAddItemModal(true);
  }, []);

  const handleAddItemModalClose = () => {
    setShowAddItemModal(false);
    // Invalidate cache to refresh data
    cacheUtils.invalidateBucketData();
  };

  const handleAddBucketModalClose = () => {
    setShowAddBucketModal(false);
    // Invalidate cache to refresh categories
    cacheUtils.invalidateBucketData();
  };

  const smartRecommendations = useMemo(() => {
    if (recommendations.length > 0) {
      return recommendations.slice(0, 2);
    }

    // Fallback recommendations
    return [
      {
        id: "rec-1",
        title: "Cherry Blossoms in Japan",
        amount: 1800,
        image:
          "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400",
        date: "2025-04-10",
        location: "Kyoto, Japan",
      },
      {
        id: "rec-2",
        title: "Wine Harvest in Tuscany",
        amount: 900,
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
        date: "2024-09-25",
        location: "Tuscany, Italy",
      },
    ];
  }, [recommendations]);

  return (
    <Layout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Search Header */}
        <View style={styles.searchHeader}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search bucket items..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={theme.text.secondary}
            />
          </View>
          <View style={styles.buttonGroup}>
            <Button
              text="+ Bucket"
              variant="secondary"
              onPress={handleAddPress}
              style={styles.headerButton}
            />
            <Button
              text="+ Item"
              variant="primary"
              onPress={handleAddItemPress}
              style={[styles.headerButton, styles.primaryHeaderButton]}
            />
          </View>
        </View>

        <Text style={styles.title}>Your Buckets</Text>

        {/* Loading State - Only show for initial loading, not category switches */}
        {(categoriesLoading || itemsLoading || recommendationsLoading) && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}

        {/* Recommendations Section */}
        <View style={styles.recommendationsSection}>
          <SectionHeader title="Recommended for You" />
          <View style={styles.eventsSection}>
            {smartRecommendations.map((recommendation: any, index: number) => (
              <RecommendationCard
                key={recommendation.id || index}
                recommendation={recommendation}
                onPress={() => {
                  // Handle adding recommendation to bucket
                }}
              />
            ))}
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <SectionHeader title="Categories" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category: any, index: number) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleCategoryPress(category.id)}
                style={[
                  styles.categoryWrapper,
                  selectedCategory === category.id && styles.selectedCategory,
                ]}
              >
                <BucketCard
                  id={category.id}
                  name={category.name}
                  emoji={category.emoji}
                  gradientColors={getGradientByIndex(index)}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bucket Items */}
        <View style={styles.section}>
          <SectionHeader
            title={
              selectedCategory
                ? `${
                    categories.find((c: any) => c.id === selectedCategory)?.name
                  } Items`
                : "Your Adventures"
            }
            isLoading={itemsLoading}
            loadingText="Updating..."
          />

          {sortedUpcoming.length > 0 && (
            <>
              <Text style={styles.subsectionTitle}>Upcoming</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.itemsContainer}
              >
                {sortedUpcoming.map((item: any) => (
                  <BucketItemCard
                    key={item.id}
                    variant="preview"
                    title={item.title}
                    description={item.description}
                    imageUrl={
                      item.image || "https://via.placeholder.com/300x200"
                    }
                    category={item.category?.name || "Adventure"}
                    onPress={() => handleItemPress(item)}
                    priority={
                      item.amount > 2000
                        ? "high"
                        : item.amount > 1000
                        ? "medium"
                        : "low"
                    }
                    completed={item.completed}
                  />
                ))}
              </ScrollView>
            </>
          )}

          {recentlyCompleted.length > 0 && (
            <>
              <Text style={styles.subsectionTitle}>Recently Completed</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.itemsContainer}
              >
                {recentlyCompleted.map((item: any) => (
                  <BucketItemCard
                    key={item.id}
                    variant="preview"
                    title={item.title}
                    description={item.description}
                    imageUrl={
                      item.image || "https://via.placeholder.com/300x200"
                    }
                    category={item.category?.name || "Adventure"}
                    onPress={() => handleItemPress(item)}
                    priority={
                      item.amount > 2000
                        ? "high"
                        : item.amount > 1000
                        ? "medium"
                        : "low"
                    }
                    completed={item.completed}
                  />
                ))}
              </ScrollView>
            </>
          )}
        </View>

        {/* Modals */}
        <AddBucketItem
          visible={showAddItemModal}
          onClose={handleAddItemModalClose}
        />

        <BaseModal
          visible={showAddBucketModal}
          animationType="slide"
          variant="bottomSheet"
          onClose={handleAddBucketModalClose}
        >
          <AddBucket onClose={handleAddBucketModalClose} />
        </BaseModal>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: theme.text.secondary,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.text.primary,
    fontFamily: "Work Sans",
  },
  buttonGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  primaryHeaderButton: {
    minWidth: 80,
  },
  itemsContainer: {
    paddingHorizontal: 4,
    gap: 16,
  },
  title: {
    fontFamily: typography.h1.fontFamily,
    fontSize: typography.h1.fontSize,
    fontWeight: fontWeights.bold,
    color: theme.text.primary,
    marginBottom: 24,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: theme.text.secondary,
    fontFamily: "Work Sans",
  },
  recommendationsSection: {
    marginBottom: 32,
  },
  eventsSection: {
    gap: 24,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: fontWeights.medium,
    color: theme.text.primary,
    fontFamily: "Work Sans",
    marginBottom: 12,
    marginTop: 20,
  },
  categoriesSection: {
    marginBottom: 32,
  },
  categoriesContainer: {
    paddingHorizontal: 4,
  },
  categoryWrapper: {
    marginRight: 16,
  },
  selectedCategory: {
    opacity: 1,
    transform: [{ scale: 1.05 }],
  },
  section: {
    marginBottom: 32,
  },
});

export default Buckets;
