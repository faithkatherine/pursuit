import { useRef, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  useWindowDimensions,
  Modal,
  Pressable,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import { Layout, Loading, Error, SectionHeader } from "components/Layout";
import { InsightsCard } from "components/Cards/InsightsCard";
import {
  RecommendationCard,
  type EventCardData,
} from "components/Cards/EventsCard";
import { TrendingCard } from "components/Cards/TrendingCard";
import { HeroCard, type HeroCardData } from "components/Cards/HeroCard";
import { Carousel } from "components/Carousel";

import ScheduleIcon from "assets/icons/schedule_events.svg";
import ProfileIcon from "assets/icons/profile.svg";

import { colors } from "themes/tokens/colors";
import typography, { fontSizes, fontWeights } from "themes/tokens/typography";

import { useHomeData } from "graphql/hooks";
import { CTACard } from "components/Cards/CTACard";

// ---------------------------------------------------------------------------
// Greeting + subtitle utilities (client-side, no backend dependency)
// ---------------------------------------------------------------------------

type TimeBucket = "morning" | "afternoon" | "evening" | "late";

function getTimeBucket(now: Date): TimeBucket {
  const h = now.getHours();
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 22) return "evening";
  return "late";
}

function getGreeting(bucket: TimeBucket, firstName?: string | null): string {
  const name = firstName ? `, ${firstName}` : "";
  switch (bucket) {
    case "morning":
      return `Good morning${name}`;
    case "afternoon":
      return `Good afternoon${name}`;
    case "evening":
      return `Good evening${name}`;
    case "late":
      return firstName ? `Still up, ${firstName}?` : "Still up?";
  }
}

const SUBTITLE_SETS: Record<TimeBucket, string[]> = {
  morning: [
    "What\u2019s on your radar today?",
    "Pick something for later",
    "Make today count",
  ],
  afternoon: [
    "Got plans tonight?",
    "Find something for the evening",
    "What\u2019s the move?",
  ],
  evening: [
    "Where to tonight?",
    "Pick your next adventure",
    "Something fun ahead?",
  ],
  late: ["Anything calling you?", "Quiet plans for tomorrow?"],
};

/**
 * Deterministic daily rotation: hash date string + userId into an index.
 * Stable within a day, changes day-to-day.
 */
function getGreetingPrompt(now: Date, userId?: string | null): string {
  const bucket = getTimeBucket(now);
  const set = SUBTITLE_SETS[bucket];
  const dateStr = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  const seed = `${dateStr}:${userId ?? "anon"}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % set.length;
  return set[index];
}

// ---------------------------------------------------------------------------
// Time filter chips
// ---------------------------------------------------------------------------

type TimeFilter = "tonight" | "weekend" | "next_week";

const TIME_FILTERS: { key: TimeFilter; label: string }[] = [
  { key: "tonight", label: "Tonight" },
  { key: "weekend", label: "This weekend" },
  { key: "next_week", label: "Next week" },
];

const FILTER_LABELS: Record<TimeFilter, string> = {
  tonight: "tonight",
  weekend: "this weekend",
  next_week: "next week",
};

function getHoursUntil(dateStr: string): number | null {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  const ms = d.getTime() - Date.now();
  if (ms < 0) return null;
  return Math.round(ms / (1000 * 60 * 60));
}

// ---------------------------------------------------------------------------
// Home screen
// ---------------------------------------------------------------------------

const Home = () => {
  const router = useRouter();
  const { height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [insightsHeight, setInsightsHeight] = useState(200);
  const [neighborhoodId, setNeighborhoodId] = useState<string | null>(null);
  const [showNeighborhoodPicker, setShowNeighborhoodPicker] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter | null>(null);

  const { data, loading, error } = useHomeData(neighborhoodId, timeFilter);

  const sectionSpacing = Math.round(screenHeight * 0.012);
  const carouselSpacing = Math.round(screenHeight * 0.015);

  const handleNeighborhoodSelect = useCallback((id: string | null) => {
    setNeighborhoodId(id);
    setShowNeighborhoodPicker(false);
  }, []);

  // Compute greeting + subtitle once per render (cheap, all client-side)
  const now = useMemo(() => new Date(), []);

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
    recommendations,
    trending,
    upcomingEvents,
    activeTrip,
    cityName,
    activeNeighborhood,
    neighborhoods,
  } = homeData;

  // Extract first name from backend greeting ("Hi Faith" → "Faith")
  const firstName = homeData.greeting?.replace(/^Hi\s+/, "") || null;
  const bucket = getTimeBucket(now);
  const greetingText = getGreeting(bucket, firstName);
  const subtitleText = getGreetingPrompt(now, homeData.id);

  const validRecommendations = (recommendations ?? []).filter(
    (r): r is NonNullable<typeof r> => r != null,
  );
  const validTrending = (trending ?? []).filter(
    (t): t is NonNullable<typeof t> => t != null,
  );

  // Hero card priority: trip within ~30 days → first recommendation (editor's pick)
  const heroTrip = activeTrip as HeroCardData | null;

  const heroRecommendation =
    !heroTrip && validRecommendations.length > 0
      ? validRecommendations[0]
      : null;
  const heroRecommendationAsCard: HeroCardData | null = heroRecommendation
    ? {
        id: heroRecommendation.id,
        name: heroRecommendation.name,
        destination: heroRecommendation.locationName ?? "",
        startDate: heroRecommendation.date,
        endDate: heroRecommendation.endDate ?? heroRecommendation.date,
        coverImage: heroRecommendation.image ?? null,
        curatorNote: (heroRecommendation as any).curatorNote ?? null,
        curatorName: (heroRecommendation as any).curatorName ?? null,
      }
    : null;

  const heroCard = heroTrip ?? heroRecommendationAsCard;
  const isEditorsPick = !heroTrip && !!heroRecommendation;

  const remainingRecommendations = heroRecommendation
    ? validRecommendations.slice(1, 8)
    : validRecommendations.slice(0, 8);

  const displayTrending = validTrending.slice(0, 10);

  // Next Up: soonest saved event within 24 hours
  const validUpcoming = (upcomingEvents ?? []).filter(
    (e): e is NonNullable<typeof e> => e != null,
  );
  const nextUpEvent = validUpcoming.length > 0 ? validUpcoming[0] : null;
  const nextUpHours = nextUpEvent?.date
    ? getHoursUntil(nextUpEvent.date)
    : null;
  const showNextUp = nextUpHours != null && nextUpHours <= 24;

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

  const neighborhoodName = activeNeighborhood?.name ?? null;

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
            colors={[colors.deluge, colors.roseFog]}
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
                neighborhoodName={neighborhoodName ?? undefined}
                onChipPress={() => setShowNeighborhoodPicker(true)}
              />

              {/* Next Up strip — saved event within 24 hours */}
              {showNextUp && nextUpEvent && (
                <CTACard
                  title="Next Up"
                  subtitle={`${
                    nextUpHours! <= 1
                      ? "Less than an hour"
                      : `In ${nextUpHours} hours`
                  }`}
                  icon={
                    <ScheduleIcon width={33} height={33} fill={colors.white} />
                  }
                  onPress={() => router.push("/upcoming")}
                />
              )}

              {/* Plan a Trip strip — only when no upcoming trips */}
              {!activeTrip && (
                <CTACard
                  title="Plan a Trip"
                  subtitle="Explore the world with us"
                  icon={
                    <ProfileIcon width={33} height={33} fill={colors.white} />
                  }
                  onPress={() => router.push("/travel")}
                />
              )}

              {/* Time filter chips */}
              <View style={styles.filterRow}>
                {TIME_FILTERS.map((f) => {
                  const selected = timeFilter === f.key;
                  return (
                    <Pressable
                      key={f.key}
                      onPress={() => setTimeFilter(selected ? null : f.key)}
                      style={[
                        styles.filterChip,
                        selected
                          ? styles.filterChipSelected
                          : styles.filterChipUnselected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          selected
                            ? styles.filterChipTextSelected
                            : styles.filterChipTextUnselected,
                        ]}
                      >
                        {f.label}
                      </Text>
                    </Pressable>
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
                    onPress={() => {}}
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
              {/* Recommendations — horizontal scroll using TrendingCard */}
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
                    <TrendingCard
                      key={rec.id}
                      event={rec as EventCardData}
                      onPress={() => {}}
                    />
                  ))}
                />
              )}

              {/* Trending — vertical list using RecommendationCard with rank */}
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
                        <View style={styles.rankSquare}>
                          <Text style={styles.rankNumber}>{index + 1}</Text>
                        </View>
                        <View style={styles.trendingCardWrapper}>
                          <RecommendationCard
                            recommendation={event as EventCardData}
                            onPress={() => {}}
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

      {/* Neighborhood picker bottom sheet */}
      <Modal
        visible={showNeighborhoodPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNeighborhoodPicker(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowNeighborhoodPicker(false)}
        >
          <Pressable style={styles.bottomSheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Select Neighborhood</Text>
            <FlatList
              data={[
                { id: null, name: `${cityName || "Nairobi"} (all)`, city: "" },
                ...((neighborhoods ?? []).filter(Boolean) as Array<{
                  id: string;
                  name: string;
                  city: string;
                }>),
              ]}
              keyExtractor={(item) => item.id ?? "all"}
              renderItem={({ item }) => {
                const isActive =
                  item.id === null
                    ? neighborhoodId === null
                    : neighborhoodId === item.id;
                return (
                  <Pressable
                    style={[
                      styles.sheetItem,
                      isActive && styles.sheetItemActive,
                    ]}
                    onPress={() => handleNeighborhoodSelect(item.id)}
                  >
                    <Text
                      style={[
                        styles.sheetItemText,
                        isActive && styles.sheetItemTextActive,
                      ]}
                    >
                      {item.name}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
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
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterChipSelected: {
    backgroundColor: colors.thunder,
  },
  filterChipUnselected: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.25)",
  },
  filterChipText: {
    fontFamily: typography.caption.fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
  },
  filterChipTextSelected: {
    color: colors.white,
  },
  filterChipTextUnselected: {
    color: colors.thunder,
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
    borderRadius: 6,
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
    borderRadius: 20,
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
    borderRadius: 10,
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
