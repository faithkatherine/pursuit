import { Tabs } from "expo-router";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import DiscoverIcon from "assets/icons/begin_journey.svg";
import PlansIcon from "assets/icons/plans.svg";
import GroupIcon from "assets/icons/group_chat.svg";
import ProfileIcon from "assets/icons/travel_explore.svg";
import colors from "themes/tokens/colors";

const PHONE_WEB_BREAKPOINT = 768;
const TABLET_WEB_BREAKPOINT = 1200;
const WEB_CONTENT_MAX_WIDTH = 1280;
const WEB_NAV_HEIGHT = 80;
const stickyPosition = "sticky" as ViewStyle["position"];

const getWebPadding = (width: number) => {
  if (width < PHONE_WEB_BREAKPOINT) return 20;
  if (width < TABLET_WEB_BREAKPOINT) return 40;
  return 80;
};

const getDesktopLabel = (routeName: string, fallback: string) => {
  if (routeName === "index") return "Discover";
  if (routeName === "plans") return "Plans";
  if (routeName === "group_plans") return "Inbox";
  if (routeName === "profile") return "Me";
  return fallback;
};

const DesktopTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { width } = useWindowDimensions();
  const horizontalPadding = getWebPadding(width);

  return (
    <View style={styles.webNavShell}>
      <View style={[styles.webNavInner, { paddingHorizontal: horizontalPadding }]}>
        <Text style={styles.webBrand}>Pursuit</Text>
        <View style={styles.webNavLinks}>
          {state.routes.map((route, index) => {
            const options = descriptors[route.key]?.options;
            const fallbackLabel =
              typeof options?.tabBarLabel === "string"
                ? options.tabBarLabel
                : options?.title ?? route.name;
            const label = getDesktopLabel(route.name, fallbackLabel);
            const isFocused = state.index === index;

            return (
              <Pressable
                key={route.key}
                onPress={() => {
                  if (!isFocused) {
                    navigation.navigate(route.name);
                  }
                }}
                style={[
                  styles.webNavLink,
                  isFocused ? styles.webNavLinkActive : null,
                ]}
              >
                <Text
                  style={[
                    styles.webNavLinkText,
                    isFocused ? styles.webNavLinkTextActive : null,
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.webNavActions}>
          <Pressable style={styles.webIconButton} accessibilityLabel="Search">
            <Ionicons name="search" size={20} color={WEB_COLORS.primary} />
          </Pressable>
          <Pressable style={styles.webAvatar} accessibilityLabel="Profile">
            <Text style={styles.webAvatarText}>F</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const TabScreens = () => (
  <>
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
  </>
);

const WebTabLayout = () => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isPhoneWeb = width < PHONE_WEB_BREAKPOINT;
  const horizontalPadding = getWebPadding(width);

  if (isPhoneWeb) {
    return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            ...styles.tabBarStyle,
            paddingBottom: insets.bottom + 20,
          },
          tabBarActiveTintColor: colors.lightBlue,
          tabBarInactiveTintColor: colors.graniteGray,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
          },
        }}
      >
        <TabScreens />
      </Tabs>
    );
  }

  return (
    <Tabs
      tabBar={(props) => <DesktopTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          ...styles.webScene,
          paddingTop: WEB_NAV_HEIGHT,
          maxWidth: WEB_CONTENT_MAX_WIDTH,
          marginHorizontal: "auto",
          paddingHorizontal: horizontalPadding,
          width: "100%",
        },
        tabBarActiveTintColor: colors.lightBlue,
        tabBarInactiveTintColor: colors.graniteGray,
      }}
    >
      <TabScreens />
    </Tabs>
  );
};

const WEB_COLORS = {
  primary: "#665382",
  background: "#fcf9f6",
  surfaceLow: "#f6f3f0",
  onSurfaceVariant: "#4a454e",
  outlineVariant: "#cbc4cf",
};

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: colors.white,
    borderTopWidth: 0,
    paddingTop: 5,
    elevation: 0,
  },
  webScene: {
    backgroundColor: WEB_COLORS.background,
  },
  webNavShell: {
    position: stickyPosition,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    height: WEB_NAV_HEIGHT,
    backgroundColor: WEB_COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: WEB_COLORS.outlineVariant,
    shadowColor: WEB_COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
  webNavInner: {
    width: "100%",
    maxWidth: WEB_CONTENT_MAX_WIDTH,
    marginHorizontal: "auto",
    minHeight: WEB_NAV_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    gap: 36,
  },
  webBrand: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 24,
    fontWeight: "700",
    color: WEB_COLORS.primary,
    letterSpacing: -0.5,
  },
  webNavLinks: {
    flexDirection: "row",
    alignItems: "center",
    gap: 28,
    flex: 1,
  },
  webNavLink: {
    minHeight: WEB_NAV_HEIGHT,
    paddingHorizontal: 2,
    paddingTop: 30,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  webNavLinkActive: {
    borderBottomColor: WEB_COLORS.primary,
  },
  webNavLinkText: {
    fontFamily: "Manrope",
    fontSize: 15,
    fontWeight: "500",
    color: WEB_COLORS.onSurfaceVariant,
  },
  webNavLinkTextActive: {
    color: WEB_COLORS.primary,
    fontWeight: "700",
  },
  webNavActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  webIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: WEB_COLORS.surfaceLow,
  },
  webAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: WEB_COLORS.primary,
  },
  webAvatarText: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 14,
    fontWeight: "700",
    color: colors.white,
  },
});

export default WebTabLayout;
