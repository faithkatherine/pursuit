import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "pursuit/themes/tokens/colors";
import SunnyIcon from "pursuit/assets/sunny.svg";
import { typography, fontSizes } from "pursuit/themes/tokens/typography";
import { ProgressBar } from "pursuit/components/ProgressBar";
import { Button } from "pursuit/components/Buttons/Buttons";
import { InsightsData } from "pursuit/graphql/types";

interface NextItemProps {
  nextDestination: string;
  daysUntilTrip: number;
}

export const NextItem: React.FC<NextItemProps> = ({
  nextDestination,
  daysUntilTrip,
}) => {
  return (
    <View style={styles.nextBucketListItem}>
      <Text style={styles.nextbucketListItemText}>{nextDestination}</Text>
      <Text style={styles.nextbucketListItemDays}>
        {daysUntilTrip} days away
      </Text>
    </View>
  );
};

interface InsightsCardProps {
  insightsData: InsightsData;
}

export const InsightsCard: React.FC<InsightsCardProps> = ({ insightsData }) => {
  const { width } = useWindowDimensions();

  return (
    <LinearGradient
      colors={[colors.deluge, colors.roseFog]}
      locations={[0, 1]}
      style={[styles.container, { width: width - 27 * 2 }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.header}>
        <View style={styles.weatherSection}>
          <SunnyIcon width={40} height={40} color={colors.white} />
          <Text style={styles.weatherNow}>
            {insightsData.weather.city}
            {"\n"}
            {insightsData.weather.condition} {insightsData.weather.temperature}
            °C
          </Text>
        </View>
        <View style={styles.headerDivider} />
        <NextItem
          nextDestination={insightsData.nextDestination.location}
          daysUntilTrip={insightsData.nextDestination.daysAway}
        />
      </View>

      <View style={styles.bucketListSection}>
        <Button text="+ Add New Item" variant="primary" onPress={() => {}} />
        <View>
          <Text style={styles.achievement}>
            🏆 {insightsData.recentAchievement}
          </Text>
        </View>
      </View>
      <View style={styles.statsSection}>
        <ProgressBar
          progress={insightsData.progress}
          height={12}
          borderRadius={8}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 320,
    borderRadius: 24,
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "center",
  },
  weatherSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  weatherNow: {
    fontFamily: typography.h1.fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: typography.h1.fontWeight,
    color: colors.prim,
  },
  headerDivider: {
    borderRightWidth: 1,
    borderRightColor: colors.white,
    height: "100%",
  },
  nextBucketListItem: {
    flex: 1,
    gap: 4,
  },
  nextbucketListItemText: {
    fontFamily: typography.h1.fontFamily,
    fontSize: fontSizes.base,
    color: colors.white,
    fontWeight: "600",
  },
  nextbucketListItemDays: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.white,
    opacity: 0.9,
  },

  bucketListSection: {
    justifyContent: "center",
    marginVertical: 16,
    gap: 24,
    flex: 1,
  },

  achievement: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.white,
    textAlign: "center",
    opacity: 0.9,
  },

  statsSection: {
    gap: 8,
  },
});
