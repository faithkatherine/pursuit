import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Pressable,
} from "react-native";
import { Layout, Loading, Error, SectionHeader } from "components/Layout";
import { BucketCard } from "components/Cards/BucketCard";
import { colors, theme } from "themes/tokens/colors";
import { typography, fontWeights, fontSizes } from "themes/tokens/typography";
import { getGradientByIndex } from "themes/tokens/gradients";
import { useBucketCategories, useEvents } from "graphql/hooks";
import { Category, Event } from "graphql/types";

const EventCard: React.FC<{ event: Event; onPress: () => void }> = ({
  event,
  onPress,
}) => {
  return (
    <Pressable onPress={onPress} style={styles.eventCard}>
      {event.image ? (
        <Image
          source={{ uri: event.image }}
          style={styles.eventImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.eventImage, styles.eventImagePlaceholder]}>
          <Text style={styles.eventImagePlaceholderText}>
            {event.category?.[0]?.icon || "🎉"}
          </Text>
        </View>
      )}
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle} numberOfLines={2}>
          {event.name}
        </Text>
        <Text style={styles.eventDate}>{event.date}</Text>
        {event.locationName && (
          <Text style={styles.eventLocation} numberOfLines={1}>
            {event.locationName}
          </Text>
        )}
        {event.isFree && <Text style={styles.freeBadge}>Free</Text>}
      </View>
    </Pressable>
  );
};

export const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { categories, loading: categoriesLoading } = useBucketCategories();
  const {
    events,
    loading: eventsLoading,
    error: eventsError,
    refetch,
  } = useEvents({
    search: searchQuery || undefined,
    category: selectedCategory ? [selectedCategory] : undefined,
  });

  const handleCategoryPress = useCallback(
    (categoryId: string) => {
      setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
    },
    [selectedCategory],
  );

  if (eventsError) {
    return <Error error={eventsError.message || "Something went wrong"} />;
  }

  return (
    <Layout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Explore</Text>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.text.secondary}
          />
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <SectionHeader title="Categories" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category: Category, index: number) => (
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
                  icon={category.icon}
                  gradientColors={getGradientByIndex(index)}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Events */}
        <View style={styles.eventsSection}>
          <SectionHeader
            title={
              selectedCategory
                ? `${categories.find((c: Category) => c.id === selectedCategory)?.name || "Category"} Events`
                : "Events Near You"
            }
            isLoading={eventsLoading}
            loadingText="Loading..."
          />

          {eventsLoading && events.length === 0 ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading events...</Text>
            </View>
          ) : events.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No events found</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery
                  ? "Try a different search term"
                  : "Check back soon for new events"}
              </Text>
            </View>
          ) : (
            <View style={styles.eventsList}>
              {events.map((event: Event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onPress={() => {}}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontFamily: typography.h1.fontFamily,
    fontSize: typography.h1.fontSize,
    fontWeight: fontWeights.bold,
    color: theme.text.primary,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.text.primary,
    fontFamily: "Work Sans",
  },
  categoriesSection: {
    marginBottom: 24,
  },
  categoriesContainer: {
    paddingHorizontal: 4,
  },
  categoryWrapper: {
    marginRight: 12,
    opacity: 0.7,
  },
  selectedCategory: {
    opacity: 1,
    transform: [{ scale: 1.05 }],
  },
  eventsSection: {
    marginBottom: 32,
  },
  eventsList: {
    gap: 16,
  },
  eventCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    flexDirection: "row",
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  eventImage: {
    width: 120,
    height: 110,
  },
  eventImagePlaceholder: {
    backgroundColor: colors.prim,
    alignItems: "center",
    justifyContent: "center",
  },
  eventImagePlaceholderText: {
    fontSize: 32,
  },
  eventContent: {
    flex: 1,
    padding: 12,
    gap: 4,
  },
  eventTitle: {
    fontFamily: typography.h4.fontFamily,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: theme.text.primary,
  },
  eventDate: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.graniteGray,
  },
  eventLocation: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: theme.text.secondary,
  },
  freeBadge: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.xs,
    color: colors.deluge,
    fontWeight: fontWeights.semibold,
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
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
    gap: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: fontWeights.semibold,
    color: theme.text.primary,
    fontFamily: "Work Sans",
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.text.secondary,
    fontFamily: "Work Sans",
  },
});

export default Explore;
