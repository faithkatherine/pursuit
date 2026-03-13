import { View, Text, StyleSheet, ScrollView } from "react-native";

import { Layout, Loading, Error, SectionHeader } from "components/Layout";
import { InsightsCard } from "components/Cards/InsightsCard";
import { BucketCard } from "components/Cards/BucketCard";
import { RecommendationCard } from "components/Cards/EventsCard";
import { Carousel } from "components/Carousel";

import { typography, fontWeights } from "themes/tokens/typography";
import { theme, colors } from "themes/tokens/colors";
import { getGradientByIndex } from "themes/tokens/gradients";

import { useHomeData } from "graphql/hooks";
import { CategoryType } from "graphql/generated/graphql";

const Home = () => {
  const { data, loading, error } = useHomeData();

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

  const { greeting, insights, bucketCategories, recommendations } = homeData;

  // const categoryCards = bucketCategories.map(
  //   (category: CategoryType, index: number) => (
  //     <BucketCard
  //       key={category.id}
  //       id={category.id}
  //       name={category.name}
  //       icon={category.icon}
  //       gradientColors={getGradientByIndex(index)}
  //     />
  //   ),
  // );

  return (
    <Layout backgroundColor={colors.white} shouldShowTopInset={false}>
      <ScrollView>
        {insights ? (
          <InsightsCard
            shouldShowTopInset
            insightsData={insights}
            greeting={greeting || "Welcome back!"}
            //userLocation={homeData.}
          />
        ) : null}

        {/* <Carousel
          items={categoryCards}
          header={<SectionHeader title="Categories" />}
        /> */}

        <View style={styles.horizontalPadding}>
          <SectionHeader title="Events Near You" />
          {/* <View style={styles.eventsSection}>
            {recommendations?.map(
              (recommendation: Recommendation, index: number) => (
                <RecommendationCard
                  key={index}
                  recommendation={recommendation}
                  onPress={() => {}}
                />
              ),
            )}
          </View> */}
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  horizontalPadding: {
    paddingHorizontal: 20,
  },

  eventsSection: {
    gap: 24,
  },
});

export default Home;
