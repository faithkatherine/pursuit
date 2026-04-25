import { Tabs } from "expo-router";
import DiscoverIcon from "assets/icons/begin_journey.svg";
import PlansIcon from "assets/icons/plans.svg";
import GroupIcon from "assets/icons/group_chat.svg";
import ProfileIcon from "assets/icons/travel_explore.svg";
import { StyleSheet, Platform } from "react-native";
import colors from "themes/tokens/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const TabLayout = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBarStyle,
          ...(Platform.OS === "android"
            ? { height: 65 }
            : { paddingBottom: insets.bottom + 20 }),
        },
        tabBarActiveTintColor: colors.lightBlue,
        tabBarInactiveTintColor: colors.graniteGray,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <DiscoverIcon fill={color} width={24} height={24} />
          ),
          tabBarLabel: "Discover",
        }}
      />
      <Tabs.Screen
        name="plans"
        options={{
          tabBarIcon: ({ color }) => (
            <PlansIcon fill={color} width={24} height={24} />
          ),
          tabBarLabel: "Plans",
        }}
      />
      <Tabs.Screen
        name="group_plans"
        options={{
          tabBarIcon: ({ color }) => (
            <GroupIcon fill={color} width={24} height={24} />
          ),
          tabBarLabel: "Group Plans",
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <ProfileIcon fill={color} width={24} height={24} />
          ),
          tabBarLabel: "Me",
        }}
      />
    </Tabs>
  );
};
const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: colors.white,
    borderTopWidth: 0,
    paddingTop: 5,
    elevation: 0,
  },
});

export default TabLayout;
