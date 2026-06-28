import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { Layout, Error } from "components/Layout";
import { EventExploreCard } from "components/Cards/EventExploreCard";
import { Button } from "components/Buttons";
import { useEvents } from "@shared/hooks/useEvents";
import { filterByCategory, isFeaturedEvent } from "@shared/utils/eventFilters";
import colors from "@shared/constants/tokens/colors";
import typography, { fontSizes, fontWeights } from "@shared/constants/tokens/typography";
import { radii, spacing } from "@shared/constants/tokens/spacing";

const CATEGORIES = [
  "All",
  "Concerts & Nightlife",
  "Outdoors & Active",
  "Arts & Culture",
  "Food & Drink",
  "Markets",
  "Wellness",
  "Talks & Workshops",
];

export const Explore = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { events, loading, error } = useEvents({ limit: 24 });

  const filteredEvents = useMemo(() => {
    return filterByCategory(events, selectedCategory).map((event, index) => ({
      ...event,
      isFeatured: isFeaturedEvent(event, index),
    }));
  }, [events, selectedCategory]);

  if (error) {
    return <Error error={error.message || "Something went wrong"} />;
  }

  return (
    <Layout backgroundColor={colors.background}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>Group</Text>
            <Text style={styles.title}>Shortlist the night together.</Text>
            <Text style={styles.subtitle}>
              Browse events without the native map layer, save contenders, and
              keep the group plan moving.
            </Text>
          </View>
          <Pressable style={styles.primaryAction}>
            <Text style={styles.primaryActionText}>New group</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContent}
          style={styles.categoryScroll}
        >
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant="chips"
              text={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
            />
          ))}
        </ScrollView>

        {loading ? (
          <View style={styles.statePanel}>
            <Text style={styles.stateTitle}>Loading events</Text>
            <Text style={styles.stateBody}>Pulling together the latest plan-worthy options.</Text>
          </View>
        ) : filteredEvents.length === 0 ? (
          <View style={styles.statePanel}>
            <Text style={styles.stateTitle}>No events in this filter yet</Text>
            <Text style={styles.stateBody}>Try another category or check back later.</Text>
            <Pressable
              style={styles.secondaryAction}
              onPress={() => setSelectedCategory("All")}
            >
              <Text style={styles.secondaryActionText}>Show all</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredEvents.map((event) => (
              <View
                key={event.id}
                style={[
                  styles.gridItem,
                  event.isFeatured && styles.featuredGridItem,
                ]}
              >
                <EventExploreCard
                  event={event}
                  isFeatured={event.isFeatured}
                  onPress={() => router.push(`/(protected)/events/${event.id}`)}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  content: {
    width: "100%",
    maxWidth: 1200,
    marginHorizontal: "auto",
    paddingTop: 44,
    paddingBottom: 72,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: spacing["2xl"],
    marginBottom: 24,
  },
  kicker: {
    fontFamily: typography.caption.fontFamily,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: colors.deluge,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  title: {
    maxWidth: 680,
    fontFamily: typography.h1.fontFamily,
    fontSize: 42,
    fontWeight: fontWeights.heavy,
    lineHeight: 48,
    color: colors.thunder,
  },
  subtitle: {
    maxWidth: 620,
    marginTop: 10,
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.base,
    lineHeight: 24,
    color: colors.graniteGray,
  },
  primaryAction: {
    borderRadius: radii.full,
    backgroundColor: colors.deluge,
    paddingHorizontal: 22,
    paddingVertical: 13,
  },
  primaryActionText: {
    fontFamily: typography.button.fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
  categoryScroll: {
    marginBottom: 28,
  },
  categoryContent: {
    gap: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
  },
  gridItem: {
    width: "31.4%",
    minWidth: 280,
    flexGrow: 1,
  },
  featuredGridItem: {
    width: "48%",
  },
  statePanel: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 320,
    gap: 10,
    padding: 32,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.white,
  },
  stateTitle: {
    fontFamily: typography.h4.fontFamily,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.thunder,
  },
  stateBody: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.graniteGray,
  },
  secondaryAction: {
    marginTop: 8,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.deluge,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  secondaryActionText: {
    fontFamily: typography.button.fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.deluge,
  },
});
