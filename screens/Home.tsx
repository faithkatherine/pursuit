import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useAuth } from "contexts/AuthContext";

import { Layout, Loading, Error } from "components/Layout";
import { InsightsCard } from "components/Cards/InsightsCard";
import { BucketCard } from "components/Cards/BucketCard";
import { EventsCard } from "components/Cards/EventsCard";
import { BucketItemCard } from "components/Cards/BucketItemCard";
import { Carousel } from "components/Carousel";
import { Button } from "components/Buttons";
import { BaseModal } from "components/Modals";

import { typography, fontSizes } from "themes/tokens/typography";
import { theme, colors } from "themes/tokens/colors";
import { getGradientByIndex } from "themes/tokens/gradients";

import { GET_HOME } from "graphql/queries";
import { GetHomeQuery, Category, HomeData, BucketItem } from "graphql/types";
import { AddBucket } from "./Buckets/AddBucket";

interface BucketsHeaderProps {
  handleAddANewBucket: () => void;
}

const BucketsHeader: React.FC<BucketsHeaderProps> = ({
  handleAddANewBucket,
}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Your Buckets</Text>
      <Button
        text="+"
        variant="secondary"
        circleDimensions={{ width: 32, height: 32, borderRadius: 16 }}
        onPress={handleAddANewBucket}
      />
    </View>
  );
};

const Home = () => {
  const { user, signOut } = useAuth();
  const [showAddBucketModal, setShowAddBucketModal] = useState(false);
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

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          onPress: signOut,
          style: "destructive",
        },
      ]
    );
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

  const bucketItemsComponents = upcoming.map((item, index) => (
    <BucketItemCard
      key={item.id}
      variant="preview"
      title={item.title}
      imageUrl={item.image}
      category={item.category?.name || "Adventure"}
    />
  ));

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
              <BucketsHeader
                handleAddANewBucket={() => setShowAddBucketModal(true)}
              />
            }
          />

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  signOutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.silverSand,
  },

  greeting: {
    color: theme.text.primary,
    fontFamily: typography.h4.fontFamily,
    fontSize: typography.h4.fontSize,
    fontWeight: typography.h4.fontWeight,
    lineHeight: typography.h4.fontSize * typography.h1.lineHeight,
    flex: 1,
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
