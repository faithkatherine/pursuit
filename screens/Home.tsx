import { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { Layout, Loading, Error, SectionHeader } from "components/Layout";
import { InsightsCard } from "components/Cards/InsightsCard";
import { CategoryCard } from "components/Cards/CategoryCard";
import { RecommendationCard } from "components/Cards/EventsCard";
import { Carousel } from "components/Carousel";

import { colors } from "themes/tokens/colors";
import { getGradientByIndex } from "themes/tokens/gradients";

import { useHomeData } from "graphql/hooks";

const Home = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
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

  const { greeting, insights, categories, recommendations } = homeData;

  return (
    <Layout backgroundColor={colors.white} shouldShowTopInset={false}>
      <ScrollView>
        <InsightsCard
          shouldShowTopInset
          insightsData={insights}
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

        <View style={styles.sectionContainer}>
          <SectionHeader title="Recommendations" />
          <View style={styles.eventsSection}>
            {recommendations
              ?.filter((r): r is NonNullable<typeof r> => r != null)
              .map((recommendation) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  onPress={() => {}}
                />
              ))}
          </View>
          <SectionHeader title="Currently trending" />
          {/* <Carousel items={categoryCards} /> */}
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  eventsSection: {
    gap: 24,
  },
});

export default Home;
