import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
  useWindowDimensions,
  AppState,
} from "react-native";
import { useQuery, useApolloClient } from "@apollo/client";
import { useRouter } from "expo-router";
import colors from "themes/tokens/colors";
import { fontSizes, fontWeights } from "themes/tokens/typography";
import { spacing } from "themes/tokens/spacing";
import {
  PlansToggle,
  PlansTabs,
  PlanCard,
  EmptyState,
  PaginationControls,
} from "components/Plans";
import { RecommendationCard } from "components/Cards/RecommendationCard";
import {
  GET_UPCOMING_PLANS,
  GET_PAST_PLANS,
  GET_SAVED_EVENTS,
} from "graphql/queries";
import {
  GetUpcomingPlansQuery,
  GetPastPlansQuery,
  GetSavedEventsQuery,
  EventInfoFragment,
} from "graphql/generated/graphql";
import { formatEventDate } from "utils/date";
import { Error, Layout, Loading } from "components/Layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PlansRadialGradient } from "themes/gradients";
import ScheduleEventsIcon from "assets/icons/schedule_events.svg";
import ProcessingEventsIcon from "assets/icons/processing_events.svg";
import PlansIcon from "assets/icons/plans.svg";
import { GroupPlansContent } from "screens/Plans/GroupPlans";

type TabType = "upcoming" | "past" | "saved";
type SectionType = "my-plans" | "group-plans";

const ITEMS_PER_PAGE = 5;

export default function PlansScreen() {
  const router = useRouter();
  const client = useApolloClient();
  const [activeSection, setActiveSection] = useState<SectionType>("my-plans");
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const [savedPage, setSavedPage] = useState(1);
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [navigationTabsHeight, setNavigationTabsHeight] = useState(200);
  const [plansChromeHeight, setPlansChromeHeight] = useState(0);
  const gradientHeight = Math.max(height, navigationTabsHeight);
  const contentMinHeight = Math.max(0, height - insets.top - plansChromeHeight);

  const fadeStart = navigationTabsHeight - insets.top;
  const statusBarOpacity = scrollY.interpolate({
    inputRange: [0, fadeStart * 0.6, fadeStart],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  const upcomingOffset = (upcomingPage - 1) * ITEMS_PER_PAGE;
  const pastOffset = (pastPage - 1) * ITEMS_PER_PAGE;
  const savedOffset = (savedPage - 1) * ITEMS_PER_PAGE;

  const {
    data: upcomingData,
    loading: upcomingLoading,
    error: upcomingError,
  } = useQuery<GetUpcomingPlansQuery>(GET_UPCOMING_PLANS, {
    variables: { offset: upcomingOffset, limit: ITEMS_PER_PAGE },
    skip: activeSection !== "my-plans" || activeTab !== "upcoming",
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: pastData,
    loading: pastLoading,
    error: pastError,
  } = useQuery<GetPastPlansQuery>(GET_PAST_PLANS, {
    variables: { offset: pastOffset, limit: ITEMS_PER_PAGE },
    skip: activeSection !== "my-plans" || activeTab !== "past",
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const {
    data: savedData,
    loading: savedLoading,
    error: savedError,
  } = useQuery<GetSavedEventsQuery>(GET_SAVED_EVENTS, {
    variables: { offset: savedOffset, limit: ITEMS_PER_PAGE },
    skip: activeSection !== "my-plans" || activeTab !== "saved",
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const upcomingEvents =
    upcomingData?.upcomingPlans?.events ?? ([] as EventInfoFragment[]);
  const pastEvents = pastData?.pastPlans?.events ?? ([] as EventInfoFragment[]);
  const savedEvents = savedData?.savedEvents?.events ?? ([] as EventInfoFragment[]);

  const upcomingTotalCount = upcomingData?.upcomingPlans?.totalCount ?? 0;
  const pastTotalCount = pastData?.pastPlans?.totalCount ?? 0;
  const savedTotalCount = savedData?.savedEvents?.totalCount ?? 0;

  const upcomingTotalPages = Math.ceil(upcomingTotalCount / ITEMS_PER_PAGE);
  const pastTotalPages = Math.ceil(pastTotalCount / ITEMS_PER_PAGE);
  const savedTotalPages = Math.ceil(savedTotalCount / ITEMS_PER_PAGE);

  // Prefetch next page when current page loads
  useEffect(() => {
    if (activeSection === "my-plans" && activeTab === "upcoming") {
      const nextOffset = upcomingPage * ITEMS_PER_PAGE;
      if (nextOffset < upcomingTotalCount) {
        client.query({
          query: GET_UPCOMING_PLANS,
          variables: { offset: nextOffset, limit: ITEMS_PER_PAGE },
          fetchPolicy: "network-only",
        });
      }
    }
  }, [activeTab, activeSection, upcomingPage, upcomingTotalCount, client]);

  useEffect(() => {
    if (activeSection === "my-plans" && activeTab === "past") {
      const nextOffset = pastPage * ITEMS_PER_PAGE;
      if (nextOffset < pastTotalCount) {
        client.query({
          query: GET_PAST_PLANS,
          variables: { offset: nextOffset, limit: ITEMS_PER_PAGE },
          fetchPolicy: "network-only",
        });
      }
    }
  }, [activeTab, activeSection, pastPage, pastTotalCount, client]);

  useEffect(() => {
    if (activeSection === "my-plans" && activeTab === "saved") {
      const nextOffset = savedPage * ITEMS_PER_PAGE;
      if (nextOffset < savedTotalCount) {
        client.query({
          query: GET_SAVED_EVENTS,
          variables: { offset: nextOffset, limit: ITEMS_PER_PAGE },
          fetchPolicy: "network-only",
        });
      }
    }
  }, [activeTab, activeSection, savedPage, savedTotalCount, client]);

  // Refetch saved events when app comes to foreground to keep cross-tab logic current
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active" && activeTab === "saved") {
        client.query({
          query: GET_SAVED_EVENTS,
          variables: { offset: savedOffset, limit: ITEMS_PER_PAGE },
          fetchPolicy: "network-only",
        });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [activeTab, savedOffset, client]);

  const groupEventsByDate = (events: EventInfoFragment[]) => {
    const grouped: Record<string, EventInfoFragment[]> = {};
    events.forEach((event) => {
      const dateKey = new Date(event.date).toISOString().split("T")[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  };

  const renderUpcomingContent = () => {
    if (upcomingLoading) {
      return <Loading />;
    }

    if (upcomingError) {
      return <Error error="Failed to load upcoming events." />;
    }

    if (upcomingEvents.length === 0) {
      return (
        <EmptyState
          illustration={<ScheduleEventsIcon width="100%" height="100%" />}
          title="Nothing coming up"
          subtitle="Events you're going to will appear here"
        />
      );
    }

    const groupedEvents = groupEventsByDate(upcomingEvents);

    return (
      <>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.eventListContent}
        >
          {groupedEvents.map(([dateKey, events]) => {
            const firstEvent = events[0];
            const eventDate = new Date(firstEvent.date);
            const dayNumber = eventDate.getDate().toString();
            const month = eventDate
              .toLocaleDateString("en-US", {
                month: "short",
              })
              .toUpperCase();
            const dayName = eventDate.toLocaleDateString("en-US", {
              weekday: "long",
            });

            // Calculate days from now
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const eventDateOnly = new Date(eventDate);
            eventDateOnly.setHours(0, 0, 0, 0);
            const diffTime = eventDateOnly.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const daysFromNow =
              diffDays > 0
                ? `in ${diffDays} day${diffDays > 1 ? "s" : ""}`
                : undefined;

            return (
              <View key={dateKey} style={styles.dateGroup}>
                {events.map((event, index) => {
                  const categoryColor = colors.deluge;

                  const formattedDate = formatEventDate(event.date);
                  const time =
                    typeof formattedDate === "object"
                      ? formattedDate.formattedTime
                      : "";

                  return (
                    <PlanCard
                      key={event.id}
                      dayNumber={index === 0 ? dayNumber : ""}
                      month={index === 0 ? month : ""}
                      dayName={index === 0 ? dayName : ""}
                      daysFromNow={index === 0 ? daysFromNow : undefined}
                      title={event.name}
                      time={time}
                      venue={event.locationName || "TBA"}
                      categoryLabel={event.category?.[0]?.name}
                      categoryColor={categoryColor}
                      isTicketed={event.hasConfirmedTicket ?? false}
                      statusLabel={
                        event.hasConfirmedTicket ? "RSVP CONFIRMED" : "GOING"
                      }
                      onPress={() =>
                        router.push(`/(protected)/events/${event.id}`)
                      }
                    />
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
        <PaginationControls
          currentPage={upcomingPage}
          totalPages={upcomingTotalPages}
          onPrevious={() => setUpcomingPage((p) => Math.max(1, p - 1))}
          onNext={() => setUpcomingPage((p) => Math.min(upcomingTotalPages, p + 1))}
        />
      </>
    );
  };

  const renderPastContent = () => {
    if (pastLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.deluge} />
        </View>
      );
    }

    if (pastEvents.length === 0) {
      return (
        <EmptyState
          illustration={<ProcessingEventsIcon width="100%" height="100%" />}
          title="No past events"
          subtitle="Events you've attended will show up here"
        />
      );
    }

    return (
      <>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.eventListContent}
        >
          {pastEvents.map((event) => {
            const eventDate = new Date(event.date);
            const dayNumber = eventDate.getDate().toString();
            const month = eventDate
              .toLocaleDateString("en-US", {
                month: "short",
              })
              .toUpperCase();
            const dayName = eventDate.toLocaleDateString("en-US", {
              weekday: "long",
            });
            const categoryColor = colors.deluge;
            const formattedDate = formatEventDate(event.date);
            const time =
              typeof formattedDate === "object"
                ? formattedDate.formattedTime
                : "";

            // Use userStatus from backend: 'WENT' or 'SAVED'
            const statusLabel = event.userStatus === 'SAVED'
              ? 'SAVED'
              : event.hasConfirmedTicket
              ? "ATTENDED"
              : "WENT";

            return (
              <PlanCard
                key={event.id}
                dayNumber={dayNumber}
                month={month}
                dayName={dayName}
                title={event.name}
                time={time}
                venue={event.locationName || "TBA"}
                categoryLabel={event.category?.[0]?.name}
                categoryColor={categoryColor}
                isTicketed={event.hasConfirmedTicket ?? false}
                statusLabel={statusLabel}
                onPress={() => router.push(`/(protected)/events/${event.id}`)}
              />
            );
          })}
        </ScrollView>
        <PaginationControls
          currentPage={pastPage}
          totalPages={pastTotalPages}
          onPrevious={() => setPastPage((p) => Math.max(1, p - 1))}
          onNext={() => setPastPage((p) => Math.min(pastTotalPages, p + 1))}
        />
      </>
    );
  };

  const renderSavedContent = () => {
    if (savedLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.deluge} />
        </View>
      );
    }

    if (savedEvents.length === 0) {
      return (
        <EmptyState
          illustration={<PlansIcon width="100%" height="100%" />}
          title="Nothing saved yet"
          subtitle="Save events you're interested in and they'll appear here"
        />
      );
    }

    return (
      <>
        <ScrollView style={styles.scrollView}>
          <View style={styles.savedGrid}>
            {savedEvents.map((event) => (
              <View key={event.id} style={styles.savedCardWrapper}>
                <RecommendationCard
                  event={event}
                  onPress={() => router.push(`/(protected)/events/${event.id}`)}
                  useVariant={false}
                  variant="frosted"
                />
              </View>
            ))}
          </View>
        </ScrollView>
        <PaginationControls
          currentPage={savedPage}
          totalPages={savedTotalPages}
          onPrevious={() => setSavedPage((p) => Math.max(1, p - 1))}
          onNext={() => setSavedPage((p) => Math.min(savedTotalPages, p + 1))}
        />
      </>
    );
  };

  const renderGroupPlansContent = () => {
    return <GroupPlansContent />;
  };

  return (
    <Layout backgroundColor={colors.deluge} shouldShowTopInset={false}>
      <View style={styles.gradientBackground} pointerEvents="none">
        <PlansRadialGradient width={width} height={gradientHeight} />
      </View>
      <Animated.View
        style={[
          styles.statusBarFill,
          { height: insets.top, opacity: statusBarOpacity },
        ]}
      />
      <Animated.ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
      >
        <View
          onLayout={(e) => setNavigationTabsHeight(e.nativeEvent.layout.height)}
        >
          <View style={[styles.container, { paddingTop: insets.top }]}>
            <View
              style={styles.plansChrome}
              onLayout={(e) => setPlansChromeHeight(e.nativeEvent.layout.height)}
            >
              <View style={styles.toggleContainer}>
                <PlansToggle
                  active={activeSection}
                  onSelect={setActiveSection}
                />
              </View>

              {/* Tabs (only show for My Plans) */}
              {activeSection === "my-plans" && (
                <View style={styles.tabsContainer}>
                  <PlansTabs active={activeTab} onSelect={setActiveTab} />
                </View>
              )}
            </View>

            {/* Content */}
            <View style={[styles.content, { minHeight: contentMinHeight }]}>
              {activeSection === "my-plans" ? (
                <>
                  {activeTab === "upcoming" && renderUpcomingContent()}
                  {activeTab === "past" && renderPastContent()}
                  {activeTab === "saved" && renderSavedContent()}
                </>
              ) : (
                renderGroupPlansContent()
              )}
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  statusBarFill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.deluge,
    zIndex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  headerTitle: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    lineHeight: 19,
    color: colors.deluge,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  plansChrome: {
    width: "100%",
  },
  toggleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  tabsContainer: {
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  eventListContent: {
    paddingVertical: spacing.base,
    gap: spacing.md,
  },
  dateGroup: {
    gap: spacing.md,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  errorText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.regular,
    lineHeight: 24,
    color: colors.aluminium,
  },
  savedGrid: {
    paddingVertical: spacing.base,
    alignItems: "center",
    gap: spacing.lg,
  },
  savedCardWrapper: {
    marginBottom: spacing.none,
  },
});
