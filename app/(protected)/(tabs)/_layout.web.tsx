import { useState } from "react";
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
import { colors } from "@shared/constants/tokens/colors";
import { webTypography } from "@shared/constants/tokens/typography";

// ─── Layout constants ──────────────────────────────────────────────────────
const MAX_CONTENT_WIDTH = 1200;
const CONTENT_PADDING_H = 24;
const BREAKPOINT_TABLET = 768;
const BREAKPOINT_DESKTOP = 1024;
const NAV_HEIGHT = 60;
const PHONE_TAB_PADDING_TOP = 5;
const PHONE_TAB_PADDING_BOTTOM = 20;
const PHONE_TAB_LABEL_SIZE = 12;
const NAV_GAP = 32;
const NAV_LINK_GAP = 8;
const NAV_ACTION_GAP = 12;
const NAV_LINK_RADIUS = 20;
const NAV_LINK_PADDING_H = 14;
const NAV_LINK_PADDING_V = 4;
const NAV_LABEL_SIZE = 13;
const SEARCH_HEIGHT = 34;
const SEARCH_ICON_WIDTH = 40;
const SEARCH_RADIUS = 24;
const AVATAR_SIZE = 36;
const WORDMARK_SIZE = 16;
const WORDMARK_TRACKING = 3;
const FOCUS_RING_WIDTH = 2;
// ──────────────────────────────────────────────────────────────────────────

const fixedPosition = "fixed" as ViewStyle["position"];

const routeLabels: Record<string, string> = {
  index: "Discover",
  plans: "Plans",
  explore: "Group",
  profile: "Profile",
};

const getDesktopLabel = (routeName: string, fallback: string) =>
  routeLabels[routeName] ?? fallback;

const DesktopTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { width } = useWindowDimensions();
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);
  const [focusedRoute, setFocusedRoute] = useState<string | null>(null);

  return (
    <View style={styles.webNavShell}>
      <View style={styles.webNavInner}>
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
            const isHovered = hoveredRoute === route.key;
            const hasKeyboardFocus = focusedRoute === route.key;

            return (
              <Pressable
                key={route.key}
                accessibilityRole="link"
                accessibilityState={{ selected: isFocused }}
                onBlur={() => setFocusedRoute(null)}
                onFocus={() => setFocusedRoute(route.key)}
                onHoverIn={() => setHoveredRoute(route.key)}
                onHoverOut={() => setHoveredRoute(null)}
                onPress={() => {
                  if (!isFocused) {
                    navigation.navigate(route.name);
                  }
                }}
                style={[
                  styles.webNavLink,
                  isHovered && !isFocused ? styles.webNavLinkHover : null,
                  isFocused ? styles.webNavLinkActive : null,
                  hasKeyboardFocus ? styles.webNavLinkFocus : null,
                ]}
              >
                <Text
                  style={[
                    styles.webNavLinkText,
                    isHovered && !isFocused ? styles.webNavLinkTextHover : null,
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
          <Pressable
            accessibilityLabel="Search events and venues"
            onBlur={() => setFocusedRoute(null)}
            onFocus={() => setFocusedRoute("search")}
            style={[
              styles.webSearchPill,
              focusedRoute === "search" ? styles.webNavLinkFocus : null,
            ]}
          >
            <Text style={styles.webSearchIcon}>🔍</Text>
            {width >= BREAKPOINT_DESKTOP && (
              <Text style={styles.webSearchText}>Search events, venues...</Text>
            )}
          </Pressable>
          <Pressable
            accessibilityLabel="Profile"
            onBlur={() => setFocusedRoute(null)}
            onFocus={() => setFocusedRoute("avatar")}
            style={[
              styles.webAvatar,
              focusedRoute === "avatar" ? styles.webNavLinkFocus : null,
            ]}
          >
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
          <DiscoverIcon fill={color} width={CONTENT_PADDING_H} height={CONTENT_PADDING_H} />
        ),
        tabBarLabel: "Discover",
      }}
    />
    <Tabs.Screen
      name="plans"
      options={{
        tabBarIcon: ({ color }) => (
          <PlansIcon fill={color} width={CONTENT_PADDING_H} height={CONTENT_PADDING_H} />
        ),
        tabBarLabel: "Plans",
      }}
    />
    <Tabs.Screen
      name="explore"
      options={{
        tabBarIcon: ({ color }) => (
          <GroupIcon fill={color} width={CONTENT_PADDING_H} height={CONTENT_PADDING_H} />
        ),
        tabBarLabel: "Group",
      }}
    />
    <Tabs.Screen
      name="profile"
      options={{
        tabBarIcon: ({ color }) => (
          <ProfileIcon fill={color} width={CONTENT_PADDING_H} height={CONTENT_PADDING_H} />
        ),
        tabBarLabel: "Me",
      }}
    />
  </>
);

const WebTabLayout = () => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isPhoneWeb = width < BREAKPOINT_TABLET;

  if (isPhoneWeb) {
    return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            ...styles.tabBarStyle,
            paddingBottom: insets.bottom + PHONE_TAB_PADDING_BOTTOM,
          },
          tabBarActiveTintColor: colors.pursuitPurple,
          tabBarInactiveTintColor: colors.pursuitTextMuted,
          tabBarLabelStyle: {
            fontSize: PHONE_TAB_LABEL_SIZE,
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
        sceneStyle: styles.webScene,
        tabBarActiveTintColor: colors.pursuitPurple,
        tabBarInactiveTintColor: colors.pursuitTextMuted,
      }}
    >
      <TabScreens />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: colors.white,
    borderTopWidth: 0,
    paddingTop: PHONE_TAB_PADDING_TOP,
    elevation: 0,
  },
  webScene: {
    width: "100%",
    backgroundColor: colors.pursuitWarmBg,
    paddingTop: NAV_HEIGHT,
  },
  webNavShell: {
    position: fixedPosition,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    height: NAV_HEIGHT,
    width: "100%",
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.pursuitBorder,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
  },
  webNavInner: {
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    marginHorizontal: "auto",
    paddingHorizontal: CONTENT_PADDING_H,
    height: NAV_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    gap: NAV_GAP,
  },
  webBrand: {
    fontFamily: webTypography.wordmark.fontFamily,
    fontSize: WORDMARK_SIZE,
    fontWeight: webTypography.wordmark.fontWeight,
    color: colors.pursuitPurple,
    letterSpacing: WORDMARK_TRACKING,
  },
  webNavLinks: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: NAV_LINK_GAP,
    flex: 1,
  },
  webNavLink: {
    paddingHorizontal: NAV_LINK_PADDING_H,
    paddingVertical: NAV_LINK_PADDING_V,
    borderRadius: NAV_LINK_RADIUS,
    borderWidth: FOCUS_RING_WIDTH,
    borderColor: "transparent",
  },
  webNavLinkHover: {
    backgroundColor: colors.pursuitMist,
  },
  webNavLinkActive: {
    backgroundColor: colors.pursuitPurple,
  },
  webNavLinkFocus: {
    borderColor: colors.pursuitPurple,
  },
  webNavLinkText: {
    fontFamily: webTypography.label.fontFamily,
    fontSize: NAV_LABEL_SIZE,
    fontWeight: webTypography.label.fontWeight,
    color: colors.pursuitTextPrimary,
  },
  webNavLinkTextHover: {
    color: colors.pursuitPurple,
  },
  webNavLinkTextActive: {
    color: colors.white,
  },
  webNavActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: NAV_ACTION_GAP,
  },
  webSearchPill: {
    minWidth: SEARCH_ICON_WIDTH,
    height: SEARCH_HEIGHT,
    paddingHorizontal: NAV_LINK_PADDING_H,
    borderRadius: SEARCH_RADIUS,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: NAV_LINK_GAP,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.pursuitBorder,
  },
  webSearchIcon: {
    fontFamily: webTypography.body.fontFamily,
    fontSize: NAV_LABEL_SIZE,
    color: colors.pursuitTextMuted,
  },
  webSearchText: {
    fontFamily: webTypography.body.fontFamily,
    fontSize: NAV_LABEL_SIZE,
    fontWeight: webTypography.body.fontWeight,
    color: colors.pursuitTextMuted,
  },
  webAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.pursuitPurple,
    borderWidth: FOCUS_RING_WIDTH,
    borderColor: "transparent",
  },
  webAvatarText: {
    fontFamily: webTypography.label.fontFamily,
    fontSize: NAV_LABEL_SIZE,
    fontWeight: webTypography.label.fontWeight,
    color: colors.white,
  },
});

export default WebTabLayout;
