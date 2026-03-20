import React from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "themes/tokens/colors";
import { typography, fontSizes, fontWeights } from "themes/tokens/typography";
import { InsightsDataType } from "graphql/generated/graphql";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WeatherAnimation } from "./WeatherAnimation";
import LocationIcon from "assets/icons/location.svg";
import UserAvatarIcon from "assets/icons/user_avatar.svg";
import { Button } from "components/Buttons";
import { CategoryPills } from "components/Cards/CategoryCard";

interface InsightsCardProps {
  shouldShowTopInset: boolean;
  greeting: string;
  userLocation?: string;
  profileImageUri?: string;
  insightsData?: InsightsDataType | null;
  categories?: Array<{ id: string; name: string; icon: string; color: string }>;
  selectedCategoryId?: string | null;
  onLocationPress?: () => void;
  onCategorySelect?: (categoryId: string | null) => void;
}

// --- QuickStats ---
const QuickStats: React.FC<{
  progress: InsightsDataType["progress"];
}> = ({ progress }) => {
  if (!progress) return null;

  const completed = progress.completed ?? 0;
  const goal = progress.yearlyGoal ?? 0;
  const remaining = progress.remaining ?? 0;

  return (
    <Text style={styles.quickStats}>
      {completed} completed &middot; {goal} goal &middot; {remaining} remaining
    </Text>
  );
};

// --- InsightsCard ---
export const InsightsCard: React.FC<InsightsCardProps> = ({
  insightsData,
  greeting,
  shouldShowTopInset = true,
  profileImageUri,
  categories,
  selectedCategoryId,
  onLocationPress,
  onCategorySelect,
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
        },
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.userDetails}>
        <View style={styles.subUserDetails}>
          <View style={styles.header}>
            {profileImageUri ? (
              <Image
                source={{ uri: profileImageUri }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.profileIconContainer}>
                <UserAvatarIcon width={28} height={28} color={colors.deluge} />
              </View>
            )}
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>{greeting}</Text>
              <Text style={styles.subheading}>Ready for your adventure?</Text>
            </View>
          </View>
          {insightsData?.progress && (
            <QuickStats progress={insightsData.progress} />
          )}
        </View>

        {insightsData?.weather ? (
          <View style={styles.weatherSection}>
            <WeatherAnimation iconCode={insightsData.weather.icon} size={50} />
            <Text style={styles.weatherTemp}>
              {insightsData.weather.temperature
                ? `${Math.round(insightsData.weather.temperature)}\u00B0F`
                : ""}
            </Text>
            <Text style={styles.weatherCondition}>
              {insightsData.weather.condition}
            </Text>
          </View>
        ) : (
          <Button
            variant="secondary"
            onPress={onLocationPress}
            icon={<LocationIcon width={16} height={16} stroke={colors.white} />}
            style={{
              circleDimensions: { width: 32, height: 32, borderWidth: 0 },
              backgroundColor: colors.black,
            }}
          />
        )}
      </View>

      {categories && categories.length > 0 && (
        <CategoryPills
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={onCategorySelect}
        />
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    overflow: "hidden",
    flex: 1,
    gap: 16,
    paddingHorizontal: 20,
  },
  userDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  subUserDetails: {
    flex: 1,
    gap: 16,
  },

  header: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  greetingContainer: {
    flexShrink: 1,
    gap: 4,
  },
  greeting: {
    fontFamily: typography.h4.fontFamily,
    fontSize: typography.h4.fontSize,
    fontWeight: fontWeights.bold,
    color: colors.black,
  },
  subheading: {
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    color: colors.black,
    opacity: 0.8,
  },

  weatherSection: {
    alignItems: "center",
    gap: 2,
    marginRight: 2,
  },
  weatherTemp: {
    fontFamily: typography.h4.fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.thunder,
  },
  weatherCondition: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.xs,
    color: colors.thunder,
    opacity: 0.8,
  },

  quickStats: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.white,
  },
});
