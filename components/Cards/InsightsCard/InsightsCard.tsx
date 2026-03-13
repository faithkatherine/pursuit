import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, theme } from "themes/tokens/colors";
import SunnyIcon from "assets/icons/sunny.svg";
import { typography, fontSizes, fontWeights } from "themes/tokens/typography";
import { ProgressBar } from "components/ProgressBar";
import { InsightsDataType, HomeDataType } from "graphql/generated/graphql";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { images } from "assets/images";

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
  shouldShowTopInset: boolean;
  greeting: string;
  userLocation?: string;
  insightsData: InsightsDataType;
  profileImageUri?: string;
}

export const InsightsCard: React.FC<InsightsCardProps> = ({
  insightsData,
  greeting,
  userLocation,
  shouldShowTopInset = true,
  profileImageUri,
}) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[colors.deluge, colors.roseFog]}
      locations={[0, 1]}
      style={[
        styles.container,
        {
          width: width,
          paddingTop: shouldShowTopInset ? insets.top : 0,
          paddingHorizontal: 20,
        },
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View>
        <View style={styles.header}>
          <Image
            source={
              profileImageUri
                ? { uri: profileImageUri }
                : {
                    uri: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  }
            }
            style={styles.profileImage}
            resizeMode="cover"
          />
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.subheading}>
              Ready to Explore {userLocation || "your location"}?
            </Text>
          </View>
        </View>
        <View style={styles.weatherSection}>
          <SunnyIcon width={40} height={40} color={colors.white} />
          {/* <Text style={styles.weatherNow}>
            {insightsData.weather.city}
            {"\n"}
            {insightsData.weather.condition} {insightsData.weather.temperature}
            °C
          </Text> */}
        </View>
        <View style={styles.headerDivider} />
        {/* <NextItem
          nextDestination={insightsData.nextDestination.location}
          daysUntilTrip={insightsData.nextDestination.daysAway}
        /> */}
      </View>

      <View style={styles.bucketListSection}>
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
    height: 250,
  },
  header: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  greetingContainer: {
    flex: 1,
    gap: 4,
  },
  greeting: {
    fontFamily: typography.h4.fontFamily,
    fontSize: typography.h4.fontSize,
    fontWeight: fontWeights.bold,
    color: theme.text.black,
  },
  subheading: {
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    color: theme.text.black,
    opacity: 0.9,
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
