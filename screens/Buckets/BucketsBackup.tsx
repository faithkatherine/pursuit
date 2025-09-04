import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  useWindowDimensions,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Layout } from "components/Layout";
import { BucketCard } from "components/Cards/BucketCard";
import { BucketItemCard } from "components/Cards/BucketItemCard";
import { colors, theme } from "themes/tokens/colors";
import { typography, fontWeights } from "themes/tokens/typography";
import { useQuery } from "@apollo/client";
import {
  GET_BUCKET_CATEGORIES,
  GET_BUCKET_ITEMS,
  GET_RECOMMENDATIONS,
} from "../../graphql/queries";

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
  const [showAddModal, setShowAddModal] = useState(false);

  // GraphQL Queries
  const { data: categoriesData, loading: categoriesLoading } = useQuery(
    GET_BUCKET_CATEGORIES
  );
  const { data: itemsData, loading: itemsLoading } = useQuery(
    GET_BUCKET_ITEMS,
    {
      variables: { categoryId: selectedCategory },
    }
  );
  const { data: recommendationsData } = useQuery(GET_RECOMMENDATIONS);

  const categories = categoriesData?.getBucketCategories || [];
  const bucketItems = itemsData?.getBucketItems || [];
  const recommendations = recommendationsData?.getRecommendations || [];

  // Add category info to items
  const itemsWithCategories = bucketItems.map((item: any) => ({
    ...item,
    category: categories.find((cat: any) => cat.id === item.categoryId),
  }));

  const filteredItems = selectedCategory
    ? itemsWithCategories.filter(
        (item: any) => item.categoryId === selectedCategory
      )
    : itemsWithCategories;

  // Search filtering
  const searchFilteredItems = searchQuery
    ? filteredItems.filter(
        (item: any) =>
          item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredItems;

  // Separate upcoming and completed items
  const upcomingItems = searchFilteredItems.filter(
    (item: any) => !item.completed
  );
  const completedItems = searchFilteredItems.filter(
    (item: any) => item.completed
  );

  const sortedUpcoming = upcomingItems.sort(
    (a: any, b: any) => (b.amount || 0) - (a.amount || 0)
  );
  const recentlyCompleted = completedItems.slice(0, 3);

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const handleItemPress = (item: BucketItem) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const handleAddPress = () => {
    setShowAddModal(true);
  };

  // Smart recommendations
  const getSmartRecommendations = () => {
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
  };

  const getGradientColors = (index: number): [string, string] => {
    const gradients: [string, string][] = [
      [colors.careysPink, colors.shilo],
      [colors.deluge, colors.delugeLight],
      [colors.leather, colors.aluminium],
      [colors.roseFog, colors.careysPink],
    ];
    return gradients[index % gradients.length];
  };

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
          <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Your Buckets</Text>

        {/* Loading State */}
        {(categoriesLoading || itemsLoading) && (
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
            {getSmartRecommendations().map(
              (recommendation: any, index: number) => (
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
              )
            )}
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
          <Text style={styles.sectionTitle}>
            {selectedCategory
              ? `${
                  categories.find((c: any) => c.id === selectedCategory)?.name
                } Items`
              : "Your Adventures"}
          </Text>

          {sortedUpcoming.length > 0 && (
            <>
              <Text style={styles.subsectionTitle}>Upcoming</Text>
              {sortedUpcoming.map((item: any) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.listItem}
                  onPress={() => handleItemPress(item)}
                >
                  <Image
                    source={{
                      uri: item.image || "https://via.placeholder.com/300x200",
                    }}
                    style={styles.listImage}
                  />
                  <View style={styles.listContent}>
                    <Text style={styles.listTitle}>{item.title}</Text>
                    <Text style={styles.listCategory}>
                      {item.category?.name}
                    </Text>
                    {item.amount && (
                      <Text style={styles.listAmount}>
                        ${item.amount.toLocaleString()}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}

          {recentlyCompleted.length > 0 && (
            <>
              <Text style={styles.subsectionTitle}>Recently Completed</Text>
              {recentlyCompleted.map((item: any) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.listItem, styles.completedItem]}
                  onPress={() => handleItemPress(item)}
                >
                  <Image
                    source={{
                      uri: item.image || "https://via.placeholder.com/300x200",
                    }}
                    style={styles.listImage}
                  />
                  <View style={styles.listContent}>
                    <Text style={[styles.listTitle, styles.completedTitle]}>
                      {item.title}
                    </Text>
                    <Text style={styles.listCategory}>
                      {item.category?.name}
                    </Text>
                    {item.amount && (
                      <Text style={styles.listAmount}>
                        ${item.amount.toLocaleString()}
                      </Text>
                    )}
                  </View>
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedIcon}>✓</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>

        {/* Add Item Modal */}
        <Modal
          visible={showAddModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowAddModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Item</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Item Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="What do you want to add to your bucket list?"
                  placeholderTextColor={theme.text.secondary}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Estimated Cost</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="$0"
                  keyboardType="numeric"
                  placeholderTextColor={theme.text.secondary}
                />
              </View>

              <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Add to Bucket List</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
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
  title: {
    fontFamily: typography.h1.fontFamily,
    fontSize: typography.h1.fontSize,
    fontWeight: fontWeights.bold,
    color: theme.text.primary,
    marginBottom: 24,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.deluge,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 24,
    color: colors.white,
    fontWeight: fontWeights.bold,
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
  listItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  completedItem: {
    opacity: 0.7,
  },
  listImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  listContent: {
    flex: 1,
    justifyContent: "center",
  },
  listTitle: {
    fontSize: 16,
    fontWeight: fontWeights.semibold,
    color: theme.text.primary,
    fontFamily: "Work Sans",
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: "line-through",
  },
  listCategory: {
    fontSize: 14,
    color: theme.text.secondary,
    fontFamily: "Work Sans",
    marginBottom: 4,
  },
  listAmount: {
    fontSize: 14,
    fontWeight: fontWeights.medium,
    color: colors.deluge,
    fontFamily: "Work Sans",
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },
  completedIcon: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: fontWeights.semibold,
    color: theme.text.primary,
    fontFamily: "Work Sans",
  },
  closeButton: {
    fontSize: 24,
    color: theme.text.secondary,
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 24,
  },
  formSection: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: fontWeights.medium,
    color: theme.text.primary,
    fontFamily: "Work Sans",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.text.primary,
    fontFamily: "Work Sans",
    backgroundColor: "white",
  },
  saveButton: {
    backgroundColor: colors.deluge,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 32,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: fontWeights.semibold,
    fontFamily: "Work Sans",
  },
});

export default Buckets;
