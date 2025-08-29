import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Layout, Loading, Error } from "components/Layout";
import { InsightsCard } from "pursuit/components/Cards/InsightsCard";
import { BucketCard } from "pursuit/components/Cards/BucketCard";
import { EventsCard } from "pursuit/components/Cards/EventsCard";
import { BucketItemCard } from "pursuit/components/Cards/BucketItemCard";
import { Carousel } from "pursuit/components/Carousel/Carousel";
import { Button } from "pursuit/components/Buttons/Buttons";
import { typography, fontSizes } from "pursuit/themes/tokens/typography";
import { theme, colors } from "pursuit/themes/tokens/colors";
import { getGradientByIndex } from "pursuit/themes/tokens/gradients";
import { GET_HOME } from "pursuit/graphql/queries";
import { GetHomeQuery, Category } from "pursuit/graphql/types";
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
  const { loading, error, data } = useQuery<GetHomeQuery>(GET_HOME, {
    variables: { offset: 0, limit: 10 }
  });

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

  const bucketItems = [
    {
      id: "1",
      activity: "Skydiving in Dubai",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "2",
      activity: "Visit the Grand Canyon",
      image:
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "3",
      activity: "Learn to play the guitar",
      image:
        "https://images.unsplash.com/photo-1511376777868-611b54f68947?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "4",
      activity: "Go on a safari in Africa",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
    },
  ];

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error.message || "Something went wrong"} />;
  }

  const homeData = data?.getHome;
  if (!homeData) return null;

  const { 
    greeting, 
    timeOfDay, 
    insights, 
    bucketCategories: categories, 
    recommendations, 
    upcoming 
  } = homeData;

  const bucketCategories = (categories || defaultCategories).map((category: Category, index: number) => (
    <BucketCard
      key={category.id}
      id={category.id}
      name={category.name}
      emoji={category.emoji}
      gradientColors={getGradientByIndex(index)}
    />
  ));

  const bucketItemsComponents = (upcoming || bucketItems).map((item, index) => (
    <BucketItemCard
      key={item.id}
      variant="preview"
      title={item.activity}
      imageUrl={item.image}
      category={item.category || "Adventure"}
    />
  ));

  return (
    <ScrollView>
      <Layout>
        <View style={styles.horizontalPadding}>
          <Text style={styles.greeting}>{greeting}</Text>
          <InsightsCard insightsData={insights} />
        </View>
        <Carousel items={bucketCategories} header={<BucketsHeader />} />
        <View style={styles.horizontalPadding}>
          <View style={styles.eventsSection}>
            <Text style={styles.title}>Recommendations</Text>
            {recommendations?.map((event, index) => (
              <EventsCard key={index} event={event} onPress={() => {}} />
            ))}
          </View>
        </View>
        <Carousel
          items={bucketItemsComponents}
          header={
            <Text style={[styles.horizontalPadding, styles.title]}>
              Upcoming
            </Text>
          }
        />
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
