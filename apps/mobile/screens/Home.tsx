import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
import { GetHomeQuery, Category, HomeData } from "pursuit/graphql/types";
import { useQuery } from "@apollo/client";

const BucketsHeader = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Your Buckets</Text>
      <Button
        text="+"
        variant="secondary"
        circleDimensions={{ width: 32, height: 32, borderRadius: 16 }}
        onPress={() => {}}
      />
    </View>
  );
};

const Home = () => {
  const { loading, error, data } = useQuery<GetHomeQuery>(GET_HOME, {
    variables: { offset: 0, limit: 10 },
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error.message || "Something went wrong"} />;
  }

  const homeData = data?.getHome as HomeData;
  if (!homeData) return null;

  const { greeting, insights, bucketCategories, recommendations, upcoming } =
    homeData;

  const buckets = bucketCategories.map((category: Category, index: number) => (
    <BucketCard
      key={category.id}
      id={category.id}
      name={category.name}
      emoji={category.emoji}
      gradientColors={getGradientByIndex(index)}
    />
  ));

  const bucketItemsComponents = upcoming.map((item, index) => (
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

        <Carousel items={buckets} header={<BucketsHeader />} />

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
          header={<Text style={styles.title}>Upcoming</Text>}
          gap={16}
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
    lineHeight: typography.h4.fontSize * typography.h1.lineHeight,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontFamily: typography.h4.fontFamily,
    fontSize: typography.h4.fontSize,
    fontWeight: typography.h4.fontWeight,
    color: colors.thunder,
  },
  addButtonContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.prim,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.prim,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "600",
    marginTop: -2,
  },
  eventsSection: {
    gap: 24,
  },
});

export default Home;
