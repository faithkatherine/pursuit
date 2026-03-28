import { useRef, useState } from "react";
import { View, StyleSheet, Animated, useWindowDimensions } from "react-native";
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
import { UpcomingCard } from "components/Cards/UpcomingCard";
import { HeroCard, type HeroCardData } from "components/Cards/HeroCard";
import { Button } from "components/Buttons";
import { Carousel } from "components/Carousel";

import { colors } from "themes/tokens/colors";

import { useHomeData, useLocationPermission } from "graphql/hooks";

const Home = () => {
  const router = useRouter();
  const { height: screenHeight } = useWindowDimensions();
  const { data, loading, error } = useHomeData();
  const { toggleLocationPermission } = useLocationPermission();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [insightsHeight, setInsightsHeight] = useState(200);

  // Dynamic spacing based on screen height
  const sectionSpacing = Math.round(screenHeight * 0.012); // ~10-12px
  const carouselSpacing = Math.round(screenHeight * 0.015); // ~12-14px

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
    greeting,
    weather,
    categories,
    recommendations,
    trending,
    upcomingEvents,
    activeTrip,
  } = homeData;

  const validUpcoming = (upcomingEvents ?? []).filter(
    (e): e is NonNullable<typeof e> => e != null,
  );
  const validRecommendations = (recommendations ?? []).filter(
    (r): r is NonNullable<typeof r> => r != null,
  );
  const validTrending = (trending ?? []).filter(
    (t): t is NonNullable<typeof t> => t != null,
  );

  // Hero card priority: active trip → first upcoming event → first recommendation
  const heroTrip = activeTrip as HeroCardData | null;

  const heroEvent =
    !heroTrip && validUpcoming.length > 0 ? validUpcoming[0] : null;
  const heroEventAsCard: HeroCardData | null = heroEvent
    ? {
        id: heroEvent.id,
        name: heroEvent.name,
        destination: heroEvent.locationName ?? "",
        startDate: heroEvent.date,
        endDate: heroEvent.date,
        coverImage: heroEvent.image ?? null,
      }
    : null;

  const heroRecommendation =
    !heroTrip && !heroEvent && validRecommendations.length > 0
      ? validRecommendations[0]
      : null;
  const heroRecommendationAsCard: HeroCardData | null = heroRecommendation
    ? {
        id: heroRecommendation.id,
        name: heroRecommendation.name,
        destination: heroRecommendation.locationName ?? "",
        startDate: heroRecommendation.date,
        endDate: heroRecommendation.date,
        coverImage: heroRecommendation.image ?? null,
      }
    : null;

  const heroCard = heroTrip ?? heroEventAsCard ?? heroRecommendationAsCard;
  const heroTitle = heroTrip
    ? "Your Upcoming Trip"
    : heroEvent
      ? "Don't Miss This"
      : "Recommended For You";

  // Lists show 4, skipping the first if used as hero
  const remainingUpcoming = heroEvent
    ? validUpcoming.slice(1, 5)
    : validUpcoming.slice(0, 3);

  const remainingRecommendations = heroRecommendation
    ? validRecommendations.slice(1, 4)
    : validRecommendations.slice(0, 3);

  const displayTrending = validTrending.slice(0, 3);

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
          {/* Horizontal: purple (left) → pink (right) */}
          <LinearGradient
            colors={[colors.deluge, colors.roseFog]}
            locations={[0, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {/* Vertical: transparent at top → white at bottom (extended for seamless fade) */}
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
                greeting={greeting || "Welcome back!"}
                userLocation={homeData.userLocation || undefined}
                profileImageUri={homeData.profilePicture || undefined}
                onLocationPress={() => {
                  toggleLocationPermission(true);
                }}
                onProfilePress={() =>
                  router.push("/(protected)/(tabs)/profile")
                }
              />

              {heroCard && (
                <View
                  style={[
                    styles.heroSection,
                    { paddingBottom: carouselSpacing },
                  ]}
                >
                  <SectionHeader title={heroTitle} />
                  <HeroCard trip={heroCard} onPress={() => {}} />
                  {!heroTrip && (
                    <View style={styles.tripCtaContainer}>
                      <Button
                        variant="gradient"
                        text="Plan a Trip"
                        onPress={() => router.push("/travel")}
                      />
                    </View>
                  )}
                </View>
              )}
            </LinearGradient>
          </LinearGradient>
        </View>

        {remainingUpcoming.length > 0 && (
          <Carousel
            gap={12}
            header={
              <SectionHeader
                title="Your Upcoming Events"
                buttonText="View All"
                onButtonPress={() =>
                  router.push({
                    pathname: "/explore",
                    params: { section: "upcoming" },
                  })
                }
              />
            }
            items={remainingUpcoming.map((event) => (
              <UpcomingCard
                key={event.id}
                event={event as EventCardData}
                onPress={() => {}}
              />
            ))}
          />
        )}

        <View
          style={[styles.sectionContainer, { paddingVertical: sectionSpacing }]}
        >
          {remainingRecommendations.length > 0 && (
            <>
              <SectionHeader
                title="Recommendations"
                buttonText="View All"
                onButtonPress={() =>
                  router.push({
                    pathname: "/explore",
                    params: { section: "recommendations" },
                  })
                }
              />
              <View style={styles.eventsSection}>
                {remainingRecommendations.map((recommendation) => (
                  <RecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation as EventCardData}
                    onPress={() => {}}
                  />
                ))}
              </View>
            </>
          )}

          {displayTrending.length > 0 && (
            <Carousel
              gap={16}
              header={
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
              }
              items={displayTrending.map((event) => (
                <TrendingCard
                  key={event.id}
                  event={event as EventCardData}
                  onPress={() => {}}
                />
              ))}
            />
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
    paddingTop: 4,
    paddingBottom: 16,
  },
  sectionContainer: {
    paddingVertical: 8,
  },
  eventsSection: {
    paddingHorizontal: 20,
    gap: 16,
  },
  tripCtaContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
});

export default Home;
