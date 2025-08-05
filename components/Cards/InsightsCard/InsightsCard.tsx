import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "pursuit/themes/tokens/colors";
import SunnyIcon from "pursuit/assets/sunny.svg";
import { typography, fontSizes } from "pursuit/themes/tokens/typography";
import { ProgressBar } from "pursuit/components/ProgressBar";

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
  currentCity: string;
  nextDestination: string;
  daysUntilTrip: number;
  completedItems: number;
  yearlyGoal: number;
  recentAchievement: string;
}

export const InsightsCard: React.FC<InsightsCardProps> = ({
  currentCity = "San Francisco",
  nextDestination = "Tokyo, Japan",
  daysUntilTrip = 14,
  completedItems = 12,
  yearlyGoal = 25,
  recentAchievement = "Completed hiking challenge",
}) => {
  const { width } = useWindowDimensions();

  const progress = completedItems / yearlyGoal;

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
            {currentCity}
            {"\n"}Sunny 14°C
          </Text>
        </View>
        <View style={styles.headerDivider} />
        <NextItem
          nextDestination={nextDestination}
          daysUntilTrip={daysUntilTrip}
        />
      </View>

      <View style={styles.bucketListSection}>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add New Item</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.achievement}>🏆 {recentAchievement}</Text>
        </View>
      </View>
      <View style={styles.statsSection}>
        <ProgressBar
          progress={progress}
          completed={completedItems}
          remaining={yearlyGoal - completedItems}
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

  addButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "center",
  },
  addButtonText: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.white,
    fontWeight: "600",
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
