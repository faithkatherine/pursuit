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
import DiscoverIcon from "assets/icons/begin_journey.svg";
import PlansIcon from "assets/icons/plans.svg";
import GroupIcon from "assets/icons/group_chat.svg";
import ProfileIcon from "assets/icons/travel_explore.svg";
const PHONE_WEB_BREAKPOINT = 768;
const TABLET_WEB_BREAKPOINT = 1200;
const WEB_CONTENT_MAX_WIDTH = 1200;
const WEB_NAV_HEIGHT = 64;
const stickyPosition = "sticky" as ViewStyle["position"];

const getWebPadding = (width: number) => {
  if (width < PHONE_WEB_BREAKPOINT) return 20;
  return 24;
};

const getDesktopLabel = (routeName: string, fallback: string) => {
  if (routeName === "index") return "Discover";
  if (routeName === "plans") return "Plans";
  if (routeName === "explore") return "Group";
  if (routeName === "profile") return "Profile";
  return fallback;
};

const DesktopTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { width } = useWindowDimensions();
  const horizontalPadding = getWebPadding(width);

  return (
    <View style={styles.webNavShell}>
      <View style={[styles.webNavInner, { paddingHorizontal: horizontalPadding }]}>
        <Text style={styles.webBrand}>PURSUIT</Text>
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
          <Pressable style={styles.webSearchPill} accessibilityLabel="Search Pursuit">
            <Text style={styles.webSearchIcon}>🔍</Text>
            {width >= TABLET_WEB_BREAKPOINT && (
              <Text style={styles.webSearchText}>Search events, venues...</Text>
            )}
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
      name="explore"
      options={{
        tabBarIcon: ({ color }) => (
          <GroupIcon fill={color} width={24} height={24} />
        ),
        tabBarLabel: "Group",
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

  if (isPhoneWeb) {
    return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            ...styles.tabBarStyle,
            paddingBottom: insets.bottom + 20,
          },
          tabBarActiveTintColor: PURSUIT.purple,
          tabBarInactiveTintColor: PURSUIT.textMuted,
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
          width: "100%",
        },
        tabBarActiveTintColor: PURSUIT.purple,
        tabBarInactiveTintColor: PURSUIT.textMuted,
      }}
    >
      <TabScreens />
    </Tabs>
  );
};

const PURSUIT = {
  purple: "#7C5C9C",
  warmBg: "#FCF9F6",
  textPrimary: "#1A1A2E",
  textMuted: "#8A7F7A",
  border: "#E0D5CC",
  white: "#FFFFFF",
};

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: PURSUIT.white,
    borderTopWidth: 0,
    paddingTop: 5,
    elevation: 0,
  },
  webScene: {
    backgroundColor: PURSUIT.warmBg,
  },
  webNavShell: {
    position: stickyPosition,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    height: WEB_NAV_HEIGHT,
    width: "100%",
    backgroundColor: PURSUIT.white,
    borderBottomWidth: 1,
    borderBottomColor: PURSUIT.border,
  },
  webNavInner: {
    width: "100%",
    maxWidth: WEB_CONTENT_MAX_WIDTH,
    marginHorizontal: "auto",
    height: WEB_NAV_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    gap: 28,
  },
  webBrand: {
    fontFamily: "Work Sans",
    fontSize: 18,
    fontWeight: "800",
    color: PURSUIT.purple,
    letterSpacing: 3,
  },
  webNavLinks: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flex: 1,
  },
  webNavLink: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  webNavLinkActive: {
    backgroundColor: PURSUIT.purple,
  },
  webNavLinkText: {
    fontFamily: "Work Sans",
    fontSize: 14,
    fontWeight: "600",
    color: PURSUIT.textPrimary,
  },
  webNavLinkTextActive: {
    color: PURSUIT.white,
  },
  webNavActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  webSearchPill: {
    minWidth: 40,
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    backgroundColor: PURSUIT.white,
    borderWidth: 1,
    borderColor: PURSUIT.border,
  },
  webSearchIcon: {
    fontFamily: "Work Sans",
    fontSize: 13,
    color: PURSUIT.textMuted,
    lineHeight: 20,
  },
  webSearchText: {
    fontFamily: "Work Sans",
    fontSize: 13,
    fontWeight: "400",
    color: PURSUIT.textMuted,
  },
  webAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PURSUIT.purple,
  },
  webAvatarText: {
    fontFamily: "Work Sans",
    fontSize: 14,
    fontWeight: "700",
    color: PURSUIT.white,
  },
});

export default WebTabLayout;
