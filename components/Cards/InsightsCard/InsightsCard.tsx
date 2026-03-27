import React from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { colors } from "themes/tokens/colors";
import { typography, fontSizes, fontWeights } from "themes/tokens/typography";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WeatherAnimation } from "./WeatherAnimation";
import LocationIcon from "assets/icons/location.svg";
import UserAvatarIcon from "assets/icons/user_avatar.svg";
import { Button } from "components/Buttons";

interface WeatherData {
  city?: string | null;
  condition?: string | null;
  temperature?: number | null;
  icon?: string | null;
}

interface InsightsCardProps {
  shouldShowTopInset: boolean;
  greeting: string;
  userLocation?: string;
  profileImageUri?: string;
  weather?: WeatherData | null;
  onLocationPress?: () => void;
  onProfilePress: () => void;
}

// --- InsightsCard ---
export const InsightsCard: React.FC<InsightsCardProps> = ({
  weather,
  greeting,
  shouldShowTopInset = true,
  userLocation,
  profileImageUri,
  onLocationPress,
  onProfilePress,
}) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          width: width,
          paddingTop: shouldShowTopInset ? insets.top : 0,
        },
      ]}
    >
      <View style={styles.userDetails}>
        <View style={styles.subUserDetails}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onProfilePress} activeOpacity={0.7}>
              {profileImageUri ? (
                <Image
                  source={{ uri: profileImageUri }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.profileIconContainer}>
                  <UserAvatarIcon
                    width={28}
                    height={28}
                    color={colors.deluge}
                  />
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>{greeting}</Text>
              <Text style={styles.subheading}>Ready for your adventure?</Text>
            </View>
          </View>
        </View>

        {userLocation && weather && (
          <View style={styles.weatherSection}>
            <WeatherAnimation iconCode={weather.icon} size={50} />
            <Text style={styles.weatherTemp}>
              {weather.temperature
                ? `${Math.round(weather.temperature)}\u00B0F`
                : ""}
            </Text>
            <Text style={styles.weatherCondition}>{weather.condition}</Text>
          </View>
        )}
      </View>
      {!userLocation && (
        <View style={styles.location}>
          <Button
            variant="secondary"
            onPress={onLocationPress}
            icon={<LocationIcon width={16} height={16} color={colors.white} />}
            style={styles.locationButton}
          />
          <Text style={styles.locationText}>
            Enable location access for more personalized events
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
    overflow: "hidden",
    flex: 1,
    gap: 12,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
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
  locationButton: {
    backgroundColor: colors.black,
    width: 50,
    height: 50,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  locationText: {
    maxWidth: 250,
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.lg,
    color: colors.black,
  },
});
