import { View, Text, StyleSheet } from "react-native";
import Layout from "components/Layout";
import { InsightsCard } from "pursuit/components/Cards/InsightsCard";
import { BucketCard } from "pursuit/components/Cards/BucketCard";
import { Carousel } from "pursuit/components/Carousel/Carousel";
import { Button } from "pursuit/components/Buttons/Buttons";
import { typography, fontSizes } from "pursuit/themes/tokens/typography";
import { theme, colors } from "pursuit/themes/tokens/colors";
import { getGradientByIndex } from "pursuit/themes/tokens/gradients";

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * A simple screen that displays a welcome message.
 *
 * This is a placeholder for what will eventually be a more complex UI.
 *
 * @returns A component that displays a welcome message.
 */

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
  const currentCity = "San Francisco";
  const nextDestination = "Tokyo, Japan";
  const daysUntilTrip = 14;
  const completedItems = 12;
  const yearlyGoal = 25;
  const recentAchievement = "Completed hiking challenge";

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
    <Layout>
      <View style={styles.horizontalPadding}>
        <Text style={styles.greeting}>Good morning, Faith</Text>
        <InsightsCard
          currentCity={currentCity}
          nextDestination={nextDestination}
          daysUntilTrip={daysUntilTrip}
          completedItems={completedItems}
          yearlyGoal={yearlyGoal}
          recentAchievement={recentAchievement}
        />
      </View>
      <Carousel items={bucketItems} header={<BucketsHeader />} />
    </Layout>
  );
};

const styles = StyleSheet.create({
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
});

export default Home;
