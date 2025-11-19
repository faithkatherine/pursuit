import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "@apollo/client";
import { Layout } from "components/Layout";
import { AuthContext, type User } from "providers/AuthProvider";
import { colors, theme } from "themes/tokens/colors";
import { typography, fontWeights } from "themes/tokens/typography";
import { GET_BUCKET_ITEMS } from "../graphql/queries";

const Profiles = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Profiles must be used within an AuthProvider");

  const { user, signOut } = context;
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  // Fetch bucket items using GraphQL
  const { data: bucketData } = useQuery(GET_BUCKET_ITEMS);
  const bucketItems = bucketData?.getBucketItems || [];
  const completedItems = bucketItems.filter((item: any) => item.completed);
  const totalValue = bucketItems.reduce(
    (sum: number, item: any) => sum + (item.amount || 0),
    0
  );
  const completedValue = completedItems.reduce(
    (sum: number, item: any) => sum + (item.amount || 0),
    0
  );

  // Calculate achievements
  const achievements = [
    {
      id: "first-bucket",
      title: "First Adventure",
      description: "Added your first bucket list item",
      icon: "🎯",
      earned: bucketItems.length > 0,
    },
    {
      id: "first-completion",
      title: "Dream Achiever",
      description: "Completed your first bucket list item",
      icon: "✅",
      earned: completedItems.length > 0,
    },
    {
      id: "high-roller",
      title: "High Roller",
      description: "Added a bucket item worth over $1000",
      icon: "💰",
      earned: bucketItems.some((item: any) => (item.amount || 0) > 1000),
    },
    {
      id: "explorer",
      title: "Explorer",
      description: "Completed 5 adventures",
      icon: "🌍",
      earned: completedItems.length >= 5,
    },
  ];

  const earnedAchievements = achievements.filter(
    (achievement) => achievement.earned
  );

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: signOut,
      },
    ]);
  };

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "This feature is coming soon!");
  };

  const handleSettings = () => {
    Alert.alert("Settings", "This feature is coming soon!");
  };

  return (
    <Layout>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <LinearGradient
          colors={[colors.deluge, colors.delugeLight]}
          style={styles.profileHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri:
                  user?.avatar ||
                  "https://via.placeholder.com/100x100.png?text=User",
              }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Text style={styles.editAvatarText}>📷</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user?.name || "User Name"}</Text>
          <Text style={styles.userEmail}>
            {user?.email || "user@example.com"}
          </Text>

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{bucketItems.length}</Text>
            <Text style={styles.statLabel}>Total Dreams</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completedItems.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              ${totalValue.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Total Value</Text>
          </View>
        </View>

        {/* Progress Ring */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.progressRing}>
            <Text style={styles.progressPercentage}>
              {bucketItems.length > 0
                ? Math.round((completedItems.length / bucketItems.length) * 100)
                : 0}
              %
            </Text>
            <Text style={styles.progressLabel}>Dreams Achieved</Text>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  achievement.earned
                    ? styles.earnedAchievement
                    : styles.lockedAchievement,
                ]}
              >
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <Text
                  style={[
                    styles.achievementTitle,
                    !achievement.earned && styles.lockedText,
                  ]}
                >
                  {achievement.title}
                </Text>
                <Text
                  style={[
                    styles.achievementDescription,
                    !achievement.earned && styles.lockedText,
                  ]}
                >
                  {achievement.description}
                </Text>
                {achievement.earned && (
                  <View style={styles.earnedBadge}>
                    <Text style={styles.earnedText}>Earned!</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Interests */}
        {user?.interests && user.interests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Interests</Text>
            <View style={styles.interestsContainer}>
              {user.interests.map((interest: string, index: number) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingDescription}>
                  Get notified about your progress
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.aluminium, true: colors.deluge }}
                thumbColor={notificationsEnabled ? colors.white : colors.white}
              />
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Dark Mode</Text>
                <Text style={styles.settingDescription}>
                  Switch to dark theme
                </Text>
              </View>
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: colors.aluminium, true: colors.deluge }}
                thumbColor={darkModeEnabled ? colors.white : colors.white}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.settingCard} onPress={handleSettings}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Privacy & Security</Text>
                <Text style={styles.settingDescription}>
                  Manage your data and privacy
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingCard} onPress={handleSettings}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Help & Support</Text>
                <Text style={styles.settingDescription}>
                  Get help or contact us
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    padding: 24,
    paddingTop: 40,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.white,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.deluge,
  },
  editAvatarText: {
    fontSize: 14,
  },
  userName: {
    fontFamily: typography.h2.fontFamily,
    fontSize: typography.h2.fontSize,
    fontWeight: fontWeights.bold,
    color: colors.white,
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 20,
  },
  editProfileButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  editProfileText: {
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    color: colors.white,
    fontWeight: fontWeights.semibold,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    marginTop: -20,
  },
  statCard: {
    backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 80,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontFamily: typography.h3.fontFamily,
    fontSize: typography.h3.fontSize,
    fontWeight: fontWeights.bold,
    color: colors.deluge,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: typography.caption.fontFamily,
    fontSize: typography.caption.fontSize,
    color: theme.text.secondary,
    textAlign: "center",
  },
  progressSection: {
    alignItems: "center",
    padding: 20,
  },
  progressRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: colors.deluge,
    backgroundColor: "rgba(124, 92, 156, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  progressPercentage: {
    fontFamily: typography.h3.fontFamily,
    fontSize: typography.h3.fontSize,
    fontWeight: fontWeights.bold,
    color: colors.deluge,
  },
  progressLabel: {
    fontFamily: typography.caption.fontFamily,
    fontSize: typography.caption.fontSize,
    color: theme.text.secondary,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontFamily: typography.h4.fontFamily,
    fontSize: typography.h4.fontSize,
    fontWeight: fontWeights.semibold,
    color: theme.text.primary,
    marginBottom: 16,
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  achievementCard: {
    width: "48%",
    backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  earnedAchievement: {
    borderWidth: 2,
    borderColor: colors.deluge,
  },
  lockedAchievement: {
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementTitle: {
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    fontWeight: fontWeights.semibold,
    color: theme.text.primary,
    textAlign: "center",
    marginBottom: 4,
  },
  achievementDescription: {
    fontFamily: typography.caption.fontFamily,
    fontSize: typography.caption.fontSize,
    color: theme.text.secondary,
    textAlign: "center",
    lineHeight: 16,
  },
  lockedText: {
    opacity: 0.5,
  },
  earnedBadge: {
    backgroundColor: colors.deluge,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  earnedText: {
    fontFamily: typography.caption.fontFamily,
    fontSize: typography.caption.fontSize,
    color: colors.white,
    fontWeight: fontWeights.semibold,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestTag: {
    backgroundColor: theme.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.deluge,
  },
  interestText: {
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    color: colors.deluge,
    fontWeight: fontWeights.medium,
  },
  settingCard: {
    backgroundColor: theme.surface,
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    fontWeight: fontWeights.semibold,
    color: theme.text.primary,
    marginBottom: 4,
  },
  settingDescription: {
    fontFamily: typography.caption.fontFamily,
    fontSize: typography.caption.fontSize,
    color: theme.text.secondary,
  },
  chevron: {
    fontSize: 20,
    color: theme.text.secondary,
    marginLeft: 12,
  },
  signOutButton: {
    backgroundColor: colors.careysPink,
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  signOutText: {
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    color: colors.white,
    fontWeight: fontWeights.semibold,
  },
});

export default Profiles;
