import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@apollo/client";
import { useRouter } from "expo-router";
import colors from "themes/tokens/colors";
import { fontSizes, fontWeights } from "themes/tokens/typography";
import {
  PlansToggle,
  PlansTabs,
  UpcomingEventCard,
  EmptyState,
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
} from "graphql/generated/graphql";
import { formatEventDate } from "utils/date";

type TabType = "upcoming" | "past" | "saved";
type SectionType = "my-plans" | "group-plans";

export default function PlansScreen() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<SectionType>("my-plans");
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");

  // Fetch data for each tab - only fetch active tab to avoid unnecessary queries
  const {
    data: upcomingData,
    loading: upcomingLoading,
    error: upcomingError,
  } = useQuery<GetUpcomingPlansQuery>(GET_UPCOMING_PLANS, {
    variables: { offset: 0, limit: 50 },
    skip: activeSection !== "my-plans" || activeTab !== "upcoming",
  });

  const {
    data: pastData,
    loading: pastLoading,
    error: pastError,
  } = useQuery<GetPastPlansQuery>(GET_PAST_PLANS, {
    variables: { offset: 0, limit: 50 },
    skip: activeSection !== "my-plans" || activeTab !== "past",
  });

  const {
    data: savedData,
    loading: savedLoading,
    error: savedError,
  } = useQuery<GetSavedEventsQuery>(GET_SAVED_EVENTS, {
    variables: { offset: 0, limit: 50 },
    skip: activeSection !== "my-plans" || activeTab !== "saved",
  });

  const upcomingEvents = upcomingData?.upcomingPlans?.events ?? [];
  const pastEvents = pastData?.pastPlans?.events ?? [];
  const savedEvents = savedData?.savedEvents?.events ?? [];

  const counts = {
    upcoming: upcomingEvents.length,
    past: pastEvents.length,
    saved: savedEvents.length,
  };

  // Group events by date for upcoming timeline
  const groupEventsByDate = (events: typeof upcomingEvents) => {
    const grouped: Record<string, typeof upcomingEvents> = {};
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
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.deluge} />
        </View>
      );
    }

    if (upcomingError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading plans</Text>
        </View>
      );
    }

    if (upcomingEvents.length === 0) {
      return (
        <EmptyState
          icon="🗓️"
          title="Nothing booked yet."
          subtitle="Buy tickets or tap Going on events to see them here."
          ctaLabel="Browse events →"
          onCta={() => router.push("/(protected)/(tabs)/")}
          nudgeLabel="plan with friends"
          onNudge={() => setActiveSection("group-plans")}
        />
      );
    }

    const groupedEvents = groupEventsByDate(upcomingEvents);

    return (
      <ScrollView style={styles.scrollView}>
        {groupedEvents.map(([dateKey, events]) => {
          const firstEvent = events[0];
          const eventDate = new Date(firstEvent.date);
          const dayNumber = eventDate.getDate().toString();
          const month = eventDate.toLocaleDateString("en-US", {
            month: "short",
          }).toUpperCase();
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
            diffDays > 0 ? `in ${diffDays} day${diffDays > 1 ? "s" : ""}` : undefined;

          return (
            <View key={dateKey}>
              {events.map((event, index) => {
                const categorySlug = event.category?.[0]?.name?.toLowerCase().replace(/\s+/g, "-") || "";
                const categoryColor = colors.deluge;

                const formattedDate = formatEventDate(event.date);
                const time = typeof formattedDate === "object" ? formattedDate.formattedTime : "";

                return (
                  <UpcomingEventCard
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
          icon="🕐"
          title="Your past events will appear here."
          subtitle="Events you attended show up after they've passed."
          ctaLabel="Browse upcoming events →"
          onCta={() => setActiveTab("upcoming")}
        />
      );
    }

    return (
      <ScrollView style={styles.scrollView}>
        {pastEvents.map((event) => {
          const eventDate = new Date(event.date);
          const dayNumber = eventDate.getDate().toString();
          const month = eventDate.toLocaleDateString("en-US", {
            month: "short",
          }).toUpperCase();
          const dayName = eventDate.toLocaleDateString("en-US", {
            weekday: "long",
          });
          const categoryColor = colors.deluge;
          const formattedDate = formatEventDate(event.date);
          const time = typeof formattedDate === "object" ? formattedDate.formattedTime : "";

          return (
            <UpcomingEventCard
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
              statusLabel={
                event.hasConfirmedTicket ? "ATTENDED" : "WENT"
              }
              onPress={() => router.push(`/(protected)/events/${event.id}`)}
            />
          );
        })}
      </ScrollView>
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
          icon="♡"
          title="Save events for later."
          subtitle="Tap ♡ on any event to save it here."
          ctaLabel="Explore events →"
          onCta={() => router.push("/(protected)/explore")}
        />
      );
    }

    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.savedGrid}>
          {savedEvents.map((event) => (
            <View key={event.id} style={styles.savedCardWrapper}>
              <RecommendationCard
                event={event}
                onPress={() => router.push(`/(protected)/events/${event.id}`)}
                useVariant={false}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderGroupPlansContent = () => {
    return (
      <EmptyState
        icon="👥"
        title="No group plans yet"
        subtitle="Create a shortlist of events, invite friends via WhatsApp, and vote on where to go."
        ctaLabel="+ CREATE A GROUP PLAN"
        onCta={() => {
          // Stub for now
          console.log("Create group plan");
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PLANS · YOUR NAIROBI</Text>
      </View>

      {/* Toggle */}
      <View style={styles.toggleContainer}>
        <PlansToggle
          active={activeSection}
          myPlansCount={counts.upcoming + counts.saved}
          groupPlansCount={0}
          onSelect={setActiveSection}
        />
      </View>

      {/* Tabs (only show for My Plans) */}
      {activeSection === "my-plans" && (
        <View style={styles.tabsContainer}>
          <PlansTabs
            active={activeTab}
            counts={counts}
            onSelect={setActiveTab}
          />
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ghostWhite,
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
    paddingVertical: 16,
    gap: 16,
  },
  savedCardWrapper: {
    marginBottom: 16,
  },
});
