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
import { Layout } from "components/Layout";
import { BucketCard } from "components/Cards/BucketCard";
import { AddBucket } from "./AddBucket";
import { AddBucketItem } from "./AddBucketItem";
import { Button } from "components/Buttons";
import { BaseModal } from "components/Modals";
import { colors, theme } from "themes/tokens/colors";
import { typography, fontWeights } from "themes/tokens/typography";
import { useQuery } from "@apollo/client";
import {
  GET_BUCKET_CATEGORIES,
  GET_BUCKET_ITEMS,
  GET_RECOMMENDATIONS,
} from "../../graphql/queries";
import { cacheUtils, getCachePolicy } from "../../graphql/cache";

interface BucketItem {
  id: string;
  title: string;
  description?: string;
  amount?: number;
  image?: string;
  completed: boolean;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    emoji: string;
  };
}

export const Buckets = () => {
  const { width } = useWindowDimensions();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<BucketItem | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddBucketModal, setShowAddBucketModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  // GraphQL Queries with caching
  const {
    data: categoriesData,
    loading: categoriesLoading,
    refetch: refetchCategories,
  } = useQuery(GET_BUCKET_CATEGORIES, {
    ...getCachePolicy("static"), // Categories rarely change
  });

  const {
    data: itemsData,
    loading: itemsLoading,
    refetch: refetchItems,
  } = useQuery(GET_BUCKET_ITEMS, {
    variables: { categoryId: selectedCategory || undefined },
    ...getCachePolicy("dynamic"), // Items change frequently
    notifyOnNetworkStatusChange: false, // Prevent UI flashing
    fetchPolicy: "cache-first", // Use cache first to prevent jumps
  });

  const { data: recommendationsData, loading: recommendationsLoading } =
    useQuery(GET_RECOMMENDATIONS, {
      ...getCachePolicy("static"), // Recommendations can be cached longer
    });

  const categories = categoriesData?.getBucketCategories || [];
  const bucketItems = itemsData?.getBucketItems || [];
  const recommendations = recommendationsData?.getRecommendations || [];

  // Memoize expensive calculations to prevent re-renders
  const itemsWithCategories = useMemo(
    () =>
      bucketItems.map((item: any) => ({
        ...item,
        category: categories.find((cat: any) => cat.id === item.categoryId),
      })),
    [bucketItems, categories]
  );

  // Search filtering - memoized to prevent re-calculations
  const searchFilteredItems = useMemo(
    () =>
      searchQuery
        ? itemsWithCategories.filter(
            (item: any) =>
              item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase())
          )
        : itemsWithCategories,
    [searchQuery, itemsWithCategories]
  );

  // Separate upcoming and completed items - memoized
  const { sortedUpcoming, recentlyCompleted } = useMemo(() => {
    const upcomingItems = searchFilteredItems.filter(
      (item: any) => !item.completed
    );
    const completedItems = searchFilteredItems.filter(
      (item: any) => item.completed
    );

    return {
      sortedUpcoming: upcomingItems.sort(
        (a: any, b: any) => (b.amount || 0) - (a.amount || 0)
      ),
      recentlyCompleted: completedItems.slice(0, 3),
    };
  }, [searchFilteredItems]);

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

  // Smart recommendations - memoized to prevent re-renders
  const smartRecommendations = useMemo(() => {
    if (recommendations.length > 0) {
      return recommendations.slice(0, 2);
    }

    // Fallback recommendations
    return [
      {
        title: "Cherry Blossoms in Japan",
        amount: 1800,
        image:
          "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400",
        date: "2025-04-10",
        location: "Kyoto, Japan",
      },
      {
        title: "Wine Harvest in Tuscany",
        amount: 900,
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
        date: "2024-09-25",
        location: "Tuscany, Italy",
      },
    ];
  }, [recommendations]);

  const gradients: [string, string][] = useMemo(
    () => [
      [colors.careysPink, colors.shilo],
      [colors.deluge, colors.delugeLight],
      [colors.leather, colors.aluminium],
      [colors.roseFog, colors.careysPink],
    ],
    []
  );

  const getGradientColors = useCallback(
    (index: number): [string, string] => {
      return gradients[index % gradients.length];
    },
    [gradients]
  );

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
        {(categoriesLoading ||
          (itemsLoading && !itemsData) ||
          recommendationsLoading) && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}

        {/* Recommendations Section */}
        <View style={styles.recommendationsSection}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendationsContainer}
          >
            {smartRecommendations.map((recommendation: any, index: number) => (
              <TouchableOpacity
                key={index}
                style={styles.recommendationCard}
                onPress={() => {
                  // Handle adding recommendation to bucket
                }}
              >
                <Image
                  source={{ uri: recommendation.image }}
                  style={styles.recommendationImage}
                />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.8)"]}
                  style={styles.recommendationGradient}
                />
                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationTitle}>
                    {recommendation.title}
                  </Text>
                  <Text style={styles.recommendationLocation}>
                    {recommendation.location}
                  </Text>
                  <Text style={styles.recommendationAmount}>
                    ${recommendation.amount}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categories</Text>
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
                  gradientColors={getGradientColors(index)}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bucket Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory
                ? `${
                    categories.find((c: any) => c.id === selectedCategory)?.name
                  } Items`
                : "Your Adventures"}
            </Text>
            {itemsLoading && itemsData && (
              <View style={styles.subtleLoader}>
                <Text style={styles.subtleLoaderText}>Updating...</Text>
              </View>
            )}
          </View>

          {sortedUpcoming.length > 0 && (
            <>
              <Text style={styles.subsectionTitle}>Upcoming</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.itemsContainer}
              >
                {sortedUpcoming.map((item: any) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.bucketItemCard}
                    onPress={() => handleItemPress(item)}
                  >
                    <Image
                      source={{
                        uri:
                          item.image || "https://via.placeholder.com/300x200",
                      }}
                      style={styles.bucketItemImage}
                    />
                    <LinearGradient
                      colors={["transparent", "rgba(0,0,0,0.8)"]}
                      style={styles.bucketItemGradient}
                    />
                    <View style={styles.bucketItemContent}>
                      <Text style={styles.bucketItemTitle}>{item.title}</Text>
                      <Text style={styles.bucketItemCategory}>
                        {item.category?.emoji} {item.category?.name}
                      </Text>
                      <Text style={styles.bucketItemAmount}>
                        ${item.amount || 0}
                      </Text>
                    </View>
                  </TouchableOpacity>
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
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.bucketItemCard, styles.completedCard]}
                    onPress={() => handleItemPress(item)}
                  >
                    <Image
                      source={{
                        uri:
                          item.image || "https://via.placeholder.com/300x200",
                      }}
                      style={styles.bucketItemImage}
                    />
                    <LinearGradient
                      colors={["transparent", "rgba(0,0,0,0.8)"]}
                      style={styles.bucketItemGradient}
                    />
                    <View style={styles.bucketItemContent}>
                      <Text style={styles.bucketItemTitle}>{item.title}</Text>
                      <Text style={styles.bucketItemCategory}>
                        {item.category?.emoji} {item.category?.name}
                      </Text>
                      <Text style={styles.bucketItemAmount}>
                        ${item.amount || 0}
                      </Text>
                    </View>
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedIcon}>✓</Text>
                    </View>
                  </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: fontWeights.semibold,
    color: theme.text.primary,
    fontFamily: "Work Sans",
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: fontWeights.medium,
    color: theme.text.primary,
    fontFamily: "Work Sans",
    marginBottom: 12,
    marginTop: 20,
  },
  recommendationsContainer: {
    paddingHorizontal: 4,
  },
  recommendationCard: {
    width: 280,
    height: 180,
    borderRadius: 16,
    marginRight: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    backgroundColor: colors.white,
  },
  recommendationImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  recommendationGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
  },
  recommendationContent: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: fontWeights.bold,
    color: colors.white,
    fontFamily: "Work Sans",
    marginBottom: 4,
  },
  recommendationLocation: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontFamily: "Work Sans",
    marginBottom: 8,
  },
  recommendationAmount: {
    fontSize: 16,
    fontWeight: fontWeights.semibold,
    color: colors.white,
    fontFamily: "Work Sans",
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  subtleLoader: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subtleLoaderText: {
    fontSize: 12,
    color: theme.text.secondary,
    fontFamily: "Work Sans",
    fontStyle: "italic",
  },
  bucketItemCard: {
    width: 220,
    height: 160,
    borderRadius: 16,
    marginRight: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    backgroundColor: colors.white,
  },
  bucketItemImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  bucketItemGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
  },
  bucketItemContent: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
  },
  bucketItemTitle: {
    fontSize: 16,
    fontWeight: fontWeights.bold,
    color: colors.white,
    fontFamily: "Work Sans",
    marginBottom: 4,
  },
  bucketItemCategory: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    fontFamily: "Work Sans",
    marginBottom: 6,
  },
  bucketItemAmount: {
    fontSize: 14,
    fontWeight: fontWeights.semibold,
    color: colors.white,
    fontFamily: "Work Sans",
  },
  completedCard: {
    opacity: 0.8,
  },
  completedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  completedIcon: {
    color: colors.deluge,
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default Buckets;
