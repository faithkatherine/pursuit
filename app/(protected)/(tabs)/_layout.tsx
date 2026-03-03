import { Tabs } from "expo-router";
import HomeIcon from "assets/icons/home.svg";
import BackpackIcon from "assets/icons/backpack.svg";
import WalletIcon from "assets/icons/wallet.svg";
import ProfileIcon from "assets/icons/profile.svg";
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
            <HomeIcon fill={color} width={24} height={24} />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="buckets"
        options={{
          tabBarIcon: ({ color }) => (
            <BackpackIcon fill={color} width={24} height={24} />
          ),
          tabBarLabel: "Buckets",
        }}
      />
      <Tabs.Screen
        name="budgets"
        options={{
          tabBarIcon: ({ color }) => (
            <WalletIcon fill={color} width={24} height={24} />
          ),
          tabBarLabel: "Budgets",
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <ProfileIcon fill={color} width={24} height={24} />
          ),
          tabBarLabel: "Profile",
        }}
      />
    </Tabs>
  );
};
const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: colors.white,
    borderTopWidth: 0,
    //height: 80,
    paddingTop: 5,
    elevation: 0,
  },
});

export default TabLayout;
