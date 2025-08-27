import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Layout, Loading, Error } from "components/Layout";
import { InsightsCard } from "pursuit/components/Cards/InsightsCard";
import { BucketCard } from "pursuit/components/Cards/BucketCard";
import { EventsCard } from "pursuit/components/Cards/EventsCard";
import { Carousel } from "pursuit/components/Carousel/Carousel";
import { Button } from "pursuit/components/Buttons/Buttons";
import { typography, fontSizes } from "pursuit/themes/tokens/typography";
import { theme, colors } from "pursuit/themes/tokens/colors";
import { getGradientByIndex } from "pursuit/themes/tokens/gradients";
import { GET_INSIGHTS_DATA, GET_EVENTS } from "pursuit/graphql/queries";
import { Event, GetInsightsDataQuery } from "pursuit/graphql/types";
import { useQuery } from "@apollo/client";

const BucketsHeader = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Your Buckets</Text>
      <Button
        text="+ Add"
        variant="primary"
        onPress={() => {}}
        style={styles.addBucketButton}
      />
    </View>
  );
};

const Home = () => {
  const { loading, error, data } =
    useQuery<GetInsightsDataQuery>(GET_INSIGHTS_DATA);
  const {
    loading: eventsLoading,
    error: eventsError,
    data: eventsData,
  } = useQuery(GET_EVENTS);

  const defaultCategories = [
    {
      id: "1",
      name: "Movies",
      emoji: "🎬",
    },
    {
      id: "2",
      name: "Books",
      emoji: "📚",
    },
    {
      id: "3",
      name: "Cooking",
      emoji: "👩‍🍳",
    },
    {
      id: "4",
      name: "Travelling",
      emoji: "✈️",
    },
  ];

  if (loading || eventsLoading) {
    return <Loading />;
  }

  if (error || eventsError) {
    return (
      <Error
        error={error?.message || eventsError?.message || "Something went wrong"}
      />
    );
  }

  console.log(eventsData);

  const insightsData = data?.getInsightsData;
  if (!insightsData) return null;

  const bucketItems = defaultCategories.map((category, index) => (
    <BucketCard
      key={category.id}
      id={category.id}
      name={category.name}
      emoji={category.emoji}
      gradientColors={getGradientByIndex(index)}
    />
  ));

  return (
    <ScrollView>
      <Layout>
        <View style={styles.horizontalPadding}>
          <Text style={styles.greeting}>Good morning, Faith</Text>
          <InsightsCard insightsData={insightsData} />
          <View style={styles.eventsSection}>
            <Text style={styles.title}>Check out these events</Text>
            {eventsData?.getEvents.map((event: Event, index: number) => (
              <EventsCard key={index} event={event} onPress={() => {}} />
            ))}
          </View>
        </View>

        <Carousel items={bucketItems} header={<BucketsHeader />} />
      </Layout>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 320,
    borderRadius: 24,
    padding: 24,
  },
  horizontalPadding: {
    paddingHorizontal: 27,
  },

  greeting: {
    color: theme.text.primary,
    marginBottom: 20,
    fontFamily: typography.h4.fontFamily,
    fontSize: typography.h4.fontSize,
    fontWeight: typography.h4.fontWeight,
    lineHeight: typography.h4.fontSize * typography.h1.lineHeight, // Convert to absolute value for RN
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: typography.h1.fontFamily,
    fontSize: fontSizes.lg,
    fontWeight: typography.h1.fontWeight,
    color: colors.thunder,
  },
  addBucketButton: {
    height: 32,
    backgroundColor: colors.black,
  },

  eventsSection: {
    marginTop: 16,
    gap: 12,
  },
});

export default Home;
