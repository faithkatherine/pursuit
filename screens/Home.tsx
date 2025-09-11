import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { useState } from "react";
import { useAuth } from "contexts/AuthContext";

import { Layout, Loading, Error, SectionHeader } from "components/Layout";
import { InsightsCard } from "components/Cards/InsightsCard";
import { BucketCard } from "components/Cards/BucketCard";
import { RecommendationCard } from "components/Cards/EventsCard";
import { BucketItemCard } from "components/Cards/BucketItemCard";
import { Carousel } from "components/Carousel";
import { Button } from "components/Buttons";
import { BaseModal } from "components/Modals";

import { typography, fontSizes } from "themes/tokens/typography";
import { theme, colors } from "themes/tokens/colors";
import { getGradientByIndex } from "themes/tokens/gradients";

import { useHomeData } from "graphql/hooks";
import { Category, HomeData, BucketItem, Recommendation } from "graphql/types";
import { AddBucket } from "./Buckets/AddBucket";

const Home = () => {
  const { user, signOut } = useAuth();
  const [showAddBucketModal, setShowAddBucketModal] = useState(false);

  const { data, loading, error, refetch } = useHomeData();

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

  const { greeting, insights, bucketCategories, recommendations, upcoming } =
    homeData;

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        onPress: signOut,
        style: "destructive",
      },
    ]);
  };

  const buckets = bucketCategories.map((category: Category, index: number) => (
    <BucketCard
      key={category.id}
      id={category.id}
      name={category.name}
      emoji={category.emoji}
      gradientColors={getGradientByIndex(index)}
    />
  ));

  const bucketItemsComponents = upcoming.map(
    (item: BucketItem, index: number) => (
      <BucketItemCard
        key={item.id}
        variant="preview"
        title={item.title}
        imageUrl={item.image}
        category={item.category?.name || "Adventure"}
      />
    )
  );

  return (
    <>
      <ScrollView>
        <Layout>
          <View style={styles.horizontalPadding}>
            <View style={styles.headerContainer}>
              <Text style={styles.greeting}>{greeting}</Text>
              <Button
                text="Sign Out"
                variant="secondary"
                onPress={handleSignOut}
                style={styles.signOutButton}
              />
            </View>
            <InsightsCard insightsData={insights} />
          </View>

          <Carousel
            items={buckets}
            header={
              <SectionHeader
                title="Your Buckets"
                buttonText="+"
                onButtonPress={() => setShowAddBucketModal(true)}
                variant="secondary"
              />
            }
          />

          <View style={styles.horizontalPadding}>
            <SectionHeader title="Recommendations" />
            <View style={styles.eventsSection}>
              {recommendations?.map(
                (recommendation: Recommendation, index: number) => (
                  <RecommendationCard
                    key={index}
                    recommendation={recommendation}
                    onPress={() => {}}
                  />
                )
              )}
            </View>
          </View>
          <Carousel
            items={bucketItemsComponents}
            header={<SectionHeader title="Upcoming" />}
            gap={16}
          />
        </Layout>
      </ScrollView>
      <BaseModal
        visible={showAddBucketModal}
        animationType="slide"
        variant="bottomSheet"
        onClose={() => setShowAddBucketModal(false)}
        children={<AddBucket />}
      />
    </>
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  signOutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  greeting: {
    color: theme.text.primary,
    fontFamily: typography.h4.fontFamily,
    fontSize: typography.h4.fontSize,
    fontWeight: typography.h4.fontWeight,
    lineHeight: typography.h4.fontSize * typography.h1.lineHeight,
    flex: 1,
  },
  eventsSection: {
    gap: 24,
  },
});

export default Home;
