import { useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Layout, Loading, Error, SectionHeader } from "components/Layout";
import { InsightsCard } from "components/Cards/InsightsCard";
import {
  RecommendationCard,
  type EventCardData,
} from "components/Cards/EventsCard";
import { TrendingCard } from "components/Cards/TrendingCard";
import { UpcomingCard } from "components/Cards/UpcomingCard";
import { TripCard, type TripCardData } from "components/Cards/TripCard";
import { Carousel } from "components/Carousel";

import { colors } from "themes/tokens/colors";

import { useHomeData } from "graphql/hooks";

const Home = () => {
  const router = useRouter();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const { data, loading, error } = useHomeData();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [insightsHeight, setInsightsHeight] = useState(200);

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

  // Fade in once the InsightsCard has scrolled past the status bar
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
          <InsightsCard
            shouldShowTopInset
            weather={weather}
            greeting={greeting || "Welcome back!"}
            userLocation={homeData.userLocation || undefined}
            profileImageUri={homeData.profilePicture || undefined}
            categories={
              categories?.filter(
                (category): category is NonNullable<typeof category> =>
                  category != null,
              ) || []
            }
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={setSelectedCategoryId}
            onLocationPress={() => {
              /* TODO: navigate to location picker */
            }}
          />
        </View>

        {activeTrip && (
          <View style={styles.tripSection}>
            <SectionHeader title="Your Upcoming Trip" />
            <TripCard trip={activeTrip as TripCardData} onPress={() => {}} />
          </View>
        )}

        <View style={styles.sectionContainer}>
          <SectionHeader
            title="Recommendations"
            buttonText="View All"
            onButtonPress={() =>
              router.push({ pathname: "/explore", params: { section: "recommendations" } })
            }
          />
          <View style={styles.eventsSection}>
            {recommendations
              ?.filter((r): r is NonNullable<typeof r> => r != null)
              .slice(0, 3)
              .map((recommendation) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation as EventCardData}
                  onPress={() => {}}
                />
              ))}
          </View>

          {upcomingEvents && upcomingEvents.length > 0 && (
            <Carousel
              gap={12}
              header={
                <SectionHeader
                  title="Your Upcoming Events"
                  buttonText="View All"
                  onButtonPress={() =>
                    router.push({ pathname: "/explore", params: { section: "upcoming" } })
                  }
                />
              }
              items={upcomingEvents
                .filter((e): e is NonNullable<typeof e> => e != null)
                .map((event) => (
                  <UpcomingCard
                    key={event.id}
                    event={event as EventCardData}
                    onPress={() => {}}
                  />
                ))}
            />
          )}
          {trending && trending.length > 0 && (
            <Carousel
              gap={16}
              header={
                <SectionHeader
                  title="Trending"
                  buttonText="View All"
                  onButtonPress={() =>
                    router.push({ pathname: "/explore", params: { section: "trending" } })
                  }
                />
              }
              items={trending
                .filter((t): t is NonNullable<typeof t> => t != null)
                .map((event) => (
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
  tripSection: {
    paddingVertical: 12,
  },
  sectionContainer: {
    paddingVertical: 12,
  },
  eventsSection: {
    paddingHorizontal: 20,
    gap: 24,
  },
});

export default Home;
