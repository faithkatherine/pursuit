import { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  useWindowDimensions,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { Layout, Loading, Error, SectionHeader } from "components/Layout";
import { Button } from "components/Buttons";
import { InsightsCard } from "components/Cards/InsightsCard";
import { TrendingCard } from "components/Cards/TrendingCard";
import { RecommendationCard } from "components/Cards/RecommendationCard";
import { HeroCard, type HeroCardData } from "components/Cards/HeroCard";
import { Carousel } from "components/Carousel";
import type { EventInfoFragment } from "graphql/generated/graphql";

import ScheduleIcon from "assets/icons/schedule_events.svg";

import { colors } from "themes/tokens/colors";
import typography, { fontSizes, fontWeights } from "themes/tokens/typography";
import { radii } from "themes/tokens/spacing";

import { useHomeData } from "hooks/useHome";
import { useLocationPermission } from "hooks/useLocation";
import { CTACard } from "components/Cards/CTACard";
import type { TimeFilter } from "types/time";
import { TIME_FILTERS, FILTER_LABELS, getHoursUntil } from "utils/timeFilter";

// ---------------------------------------------------------------------------
// Home screen
// ---------------------------------------------------------------------------

const Home = () => {
  const router = useRouter();
  const { height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [insightsHeight, setInsightsHeight] = useState(200);
  const [timeFilter, setTimeFilter] = useState<TimeFilter | null>(null);

  const { data, loading, error, refetch } = useHomeData(timeFilter);
  const { toggleLocationPermission, isLocationLoading } =
    useLocationPermission();

  const sectionSpacing = Math.round(screenHeight * 0.012);
  const carouselSpacing = Math.round(screenHeight * 0.015);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error.message || "Something went wrong"} />;
  }

  const homeData = data?.getHome;
  if (!homeData) {
    return <Loading />;
  }

  const {
    weather,
    editorsPick,
    recommendations,
    trending,
    upcomingEvents,
    nextSavedEvent,
    activeTrip,
    cityName,
    allowLocationSharing,
  } = homeData;

  const greetingText = homeData.greeting ?? "Hello";
  const subtitleText =
    homeData.greetingPrompt ?? "Ready for your next adventure?";

  const handleLocationEnable = async () => {
    try {
      await toggleLocationPermission(true);
      await refetch();
    } catch (error) {
      throw error;
    }
  };

  const validRecommendations = (recommendations ?? []).filter(
    (r): r is NonNullable<typeof r> => r != null,
  );
  const validTrending = (trending ?? []).filter(
    (t): t is NonNullable<typeof t> => t != null,
  );

  // Hero card priority: editor's pick → first recommendation
  // Trips and saved events are now handled by CTA cards
  const heroEditorsPick = editorsPick
    ? {
        id: editorsPick.id,
        name: editorsPick.name,
        destination: editorsPick.locationName ?? "",
        startDate: editorsPick.date,
        endDate: editorsPick.endDate ?? editorsPick.date,
        coverImage: editorsPick.image ?? null,
        curatorNote: editorsPick.curatorNote ?? null,
        curatorName: editorsPick.curatorName ?? null,
      }
    : null;

  const heroRecommendation =
    validRecommendations.length > 0 ? validRecommendations[0] : null;
  const heroRecommendationAsCard: HeroCardData | null = heroRecommendation
    ? {
        id: heroRecommendation.id,
        name: heroRecommendation.name,
        destination: heroRecommendation.locationName ?? "",
        startDate: heroRecommendation.date,
        endDate: heroRecommendation.endDate ?? heroRecommendation.date,
        coverImage: heroRecommendation.image ?? null,
        curatorNote: heroRecommendation.curatorNote ?? null,
        curatorName: heroRecommendation.curatorName ?? null,
      }
    : null;

  const heroCard = heroEditorsPick ?? heroRecommendationAsCard;
  const isEditorsPick = !!editorsPick;

  const remainingRecommendations = validRecommendations.slice(0, 8);

  const displayTrending = validTrending.slice(0, 10);

  // Next Up: soonest saved event within 24 hours
  // Saved Event CTA: soonest upcoming saved event not in active trip
  const validUpcoming = (upcomingEvents ?? []).filter(
    (e): e is NonNullable<typeof e> => e != null,
  );
  // Empty filter state
  const hasFilter = timeFilter != null;
  const isFilterEmpty =
    hasFilter &&
    remainingRecommendations.length === 0 &&
    displayTrending.length === 0;

  const fadeStart = insightsHeight - insets.top;
  const statusBarOpacity = scrollY.interpolate({
    inputRange: [0, fadeStart * 0.6, fadeStart],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  return (
    <Layout backgroundColor={colors.white} shouldShowTopInset={false}>
      <Animated.View
        style={[
          styles.statusBarFill,
          { height: insets.top, opacity: statusBarOpacity },
        ]}
      />
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
      >
        <View onLayout={(e) => setInsightsHeight(e.nativeEvent.layout.height)}>
          <LinearGradient
            colors={[colors.silverSand, colors.roseFog]}
            locations={[0, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <LinearGradient
              colors={[
                "transparent",
                "transparent",
                "rgba(255,255,255,0.5)",
                colors.white,
              ]}
              locations={[0, 0.6, 0.85, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <InsightsCard
                shouldShowTopInset
                weather={weather}
                greeting={greetingText}
                subtitle={subtitleText}
                cityName={cityName ?? undefined}
                allowLocationSharing={allowLocationSharing ?? false}
                isLocationLoading={isLocationLoading}
                onChipPress={() => {
                  // TODO: Implement neighborhood filter
                }}
                onLocationEnablePress={handleLocationEnable}
              />

              {/* Trip CTA — always shown */}
              <CTACard
                type="trip"
                tripData={
                  activeTrip
                    ? {
                        id: activeTrip.id,
                        name: activeTrip.name,
                        startDate: activeTrip.startDate,
                        events: (activeTrip as any).events ?? [],
                      }
                    : null
                }
                onPress={() => {
                  if (activeTrip) {
                    // Navigate to trip detail
                    router.push(`/trip/${activeTrip.id}`);
                  } else {
                    // Navigate to plan a trip
                    router.push("/travel");
                  }
                }}
              />

              {/* Saved Event CTA — conditional */}
              {nextSavedEvent && (
                <CTACard
                  type="saved-event"
                  eventData={{
                    id: nextSavedEvent.id,
                    name: nextSavedEvent.name,
                    locationName: nextSavedEvent.locationName,
                    date: nextSavedEvent.date,
                  }}
                  onPress={() => {
                    router.push(`/(protected)/events/${nextSavedEvent.id}`);
                  }}
                />
              )}

              {/* Time filter chips */}
              <View style={styles.filterRow}>
                {TIME_FILTERS.map((filter) => {
                  const selected = timeFilter === filter.key;
                  return (
                    <Button
                      key={filter.key}
                      variant="chips"
                      text={filter.label}
                      selected={selected}
                      onPress={() =>
                        setTimeFilter(selected ? null : filter.key)
                      }
                    />
                  );
                })}
              </View>

              {heroCard && (
                <View
                  style={[
                    styles.heroSection,
                    { paddingBottom: carouselSpacing },
                  ]}
                >
                  <HeroCard
                    trip={heroCard}
                    onPress={() => {
                      router.push(`/(protected)/events/${heroCard.id}`);
                    }}
                    isEditorsPick={isEditorsPick}
                  />
                </View>
              )}
            </LinearGradient>
          </LinearGradient>
        </View>

        <View
          style={[styles.sectionContainer, { paddingVertical: sectionSpacing }]}
        >
          {isFilterEmpty ? (
            /* Empty filter state */
            <View style={styles.emptyState}>
              <ScheduleIcon width={40} height={40} fill={colors.aluminium} />
              <Text style={styles.emptyStateTitle}>
                Nothing on for {FILTER_LABELS[timeFilter!]} yet
              </Text>
              <Text style={styles.emptyStateSubtitle}>
                Check back later or explore everything we have.
              </Text>
              <Pressable
                style={styles.emptyStateCta}
                onPress={() => setTimeFilter(null)}
              >
                <Text style={styles.emptyStateCtaText}>Show all events</Text>
              </Pressable>
            </View>
          ) : (
            <>
              {/* Recommendations — horizontal scroll using RecommendationCard */}
              {remainingRecommendations.length > 0 && (
                <Carousel
                  gap={16}
                  header={
                    <SectionHeader
                      title="Made for your week"
                      buttonText="View All"
                      onButtonPress={() =>
                        router.push({
                          pathname: "/explore",
                          params: { section: "recommendations" },
                        })
                      }
                    />
                  }
                  items={remainingRecommendations.map((rec) => (
                    <RecommendationCard
                      key={rec.id}
                      event={rec as EventInfoFragment}
                      onPress={() =>
                        router.push(`/(protected)/events/${rec.id}`)
                      }
                      useVariant
                    />
                  ))}
                />
              )}

              {/* Trending — vertical list using TrendingCard with rank */}
              {displayTrending.length > 0 && (
                <>
                  <SectionHeader
                    title="Trending"
                    buttonText="View All"
                    onButtonPress={() =>
                      router.push({
                        pathname: "/explore",
                        params: { section: "trending" },
                      })
                    }
                  />
                  <View style={styles.trendingSection}>
                    {displayTrending.map((event, index) => (
                      <View key={event.id} style={styles.trendingRow}>
                        <View style={styles.trendingCardWrapper}>
                          <TrendingCard
                            recommendation={event as EventInfoFragment}
                            onPress={() =>
                              router.push(`/(protected)/events/${event.id}`)
                            }
                          />
                        </View>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </>
          )}
        </View>
      </Animated.ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  statusBarFill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.deluge,
    zIndex: 1,
  },
  heroSection: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  sectionContainer: {
    paddingVertical: 8,
  },
  // Time filter chips
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  // Trending
  trendingSection: {
    paddingHorizontal: 20,
    gap: 12,
  },
  trendingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rankSquare: {
    width: 28,
    height: 28,
    borderRadius: radii.sm,
    backgroundColor: colors.deluge,
    alignItems: "center",
    justifyContent: "center",
  },
  rankNumber: {
    fontFamily: typography.h4.fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  trendingCardWrapper: {
    flex: 1,
  },
  // Empty filter state
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyStateTitle: {
    fontFamily: typography.h4.fontFamily,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.thunder,
    textAlign: "center",
    marginTop: 12,
  },
  emptyStateSubtitle: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.aluminium,
    textAlign: "center",
  },
  emptyStateCta: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radii.xl,
    backgroundColor: colors.deluge,
  },
  emptyStateCtaText: {
    fontFamily: typography.caption.fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
  // Bottom sheet styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: "60%",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.aluminium,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  sheetTitle: {
    fontFamily: typography.h4.fontFamily,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.thunder,
    marginBottom: 12,
  },
  sheetItem: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: radii.md,
  },
  sheetItemActive: {
    backgroundColor: "rgba(124, 92, 156, 0.1)",
  },
  sheetItemText: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.base,
    color: colors.thunder,
  },
  sheetItemTextActive: {
    fontWeight: fontWeights.semibold,
    color: colors.deluge,
  },
});

export default Home;
