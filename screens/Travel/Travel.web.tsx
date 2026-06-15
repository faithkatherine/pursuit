import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "themes/tokens/colors";
import { webTypography } from "themes/tokens/typography";

// ─── Layout constants ──────────────────────────────────────────────────────
const MAX_CONTENT_WIDTH = 1200;
const CONTENT_PADDING_H = 24;
const BREAKPOINT_TABLET = 768;
const BREAKPOINT_DESKTOP = 1024;
const SIDEBAR_WIDTH = 280;
const SECTION_PADDING_Y = 48;
const CARD_RADIUS = 12;
const CARD_PADDING = 20;
const HEADER_MARGIN_BOTTOM = 28;
const LAYOUT_GAP = 24;
const GRID_GAP = 20;
const ITEM_GAP = 10;
const BADGE_RADIUS = 999;
const TITLE_MAX_WIDTH = 720;
const TITLE_SIZE = 38;
const TITLE_LINE_HEIGHT = 46;
const DETAIL_TITLE_SIZE = 24;
const SECTION_TITLE_SIZE = 20;
const BODY_SIZE = 14;
const META_SIZE = 13;
const AVATAR_SIZE = 34;
const MAP_HEIGHT = 180;
const ILLUSTRATION_SIZE = 92;
const EMPTY_MIN_HEIGHT = 320;
// ──────────────────────────────────────────────────────────────────────────

type PlanStatus = "Upcoming" | "Active" | "Past";

type PlanEvent = {
  id: string;
  title: string;
  date: string;
  venue: string;
  price: string;
};

type PlanSummary = {
  id: string;
  name: string;
  status: PlanStatus;
  dateRange: string;
  area: string;
  members: string[];
  events: PlanEvent[];
};

// TODO: Replace mock plans with GraphQL trips/plans query when endpoint is ready.
const MOCK_PLANS: PlanSummary[] = [
  {
    id: "nairobi-weekend",
    name: "Nairobi weekend",
    status: "Active",
    dateRange: "Jun 13–15",
    area: "Westlands + Kilimani",
    members: ["FA", "JM", "AK", "NO"],
    events: [
      {
        id: "jazz",
        title: "Jazz at The Alchemist",
        date: "Fri 13 Jun · 7:00 PM",
        venue: "Westlands",
        price: "KES 1,500",
      },
      {
        id: "cinema",
        title: "Rooftop Cinema",
        date: "Sat 14 Jun · 6:30 PM",
        venue: "Kilimani",
        price: "KES 900",
      },
    ],
  },
  {
    id: "gallery-sunday",
    name: "Gallery Sunday",
    status: "Upcoming",
    dateRange: "Jun 22",
    area: "CBD",
    members: ["FA", "LN"],
    events: [
      {
        id: "gallery",
        title: "Sunday Gallery Walk",
        date: "Sun 22 Jun · 2:00 PM",
        venue: "Nairobi Gallery",
        price: "KES 750",
      },
    ],
  },
  {
    id: "forest-run",
    name: "Forest morning",
    status: "Past",
    dateRange: "Jun 1",
    area: "Karura",
    members: ["FA", "AK"],
    events: [],
  },
];

const Travel = () => {
  const [selectedPlanId, setSelectedPlanId] = useState(MOCK_PLANS[0]?.id ?? "");
  const selectedPlan = MOCK_PLANS.find((plan) => plan.id === selectedPlanId);

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.plansBand}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <Text style={styles.kicker}>Plans</Text>
            <Text style={styles.title}>Plan the city before the city plans you.</Text>
          </View>

          {selectedPlan ? (
            <View style={styles.layout}>
              <View style={styles.sidebar}>
                <Text style={styles.sidebarTitle}>Your plans</Text>
                {MOCK_PLANS.map((plan) => {
                  const active = plan.id === selectedPlan.id;
                  return (
                    <Pressable
                      key={plan.id}
                      style={[styles.planListItem, active && styles.planListItemActive]}
                      onPress={() => setSelectedPlanId(plan.id)}
                    >
                      <View>
                        <Text style={styles.planListName}>{plan.name}</Text>
                        <Text style={styles.planListDate}>{plan.dateRange}</Text>
                      </View>
                      <Text
                        style={[
                          styles.statusBadge,
                          plan.status === "Active" && styles.statusActive,
                          plan.status === "Past" && styles.statusPast,
                        ]}
                      >
                        {plan.status}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.detailCard}>
                <View style={styles.detailHeader}>
                  <View>
                    <Text style={styles.detailTitle}>{selectedPlan.name}</Text>
                    <Text style={styles.detailMeta}>
                      {selectedPlan.dateRange} · {selectedPlan.area}
                    </Text>
                  </View>
                  <Pressable style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>Add event</Text>
                  </Pressable>
                </View>

                <View style={styles.memberRow}>
                  {selectedPlan.members.map((member) => (
                    <View key={member} style={styles.memberAvatar}>
                      <Text style={styles.memberText}>{member}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.mapPlaceholder}>
                  <Text style={styles.mapTitle}>Map preview</Text>
                  <Text style={styles.mapText}>
                    Venue pins will appear here when the plans API is connected.
                  </Text>
                </View>

                <Text style={styles.sectionTitle}>Events</Text>
                {selectedPlan.events.length > 0 ? (
                  <View style={styles.eventList}>
                    {selectedPlan.events.map((event) => (
                      <View key={event.id} style={styles.eventRow}>
                        <View>
                          <Text style={styles.eventTitle}>{event.title}</Text>
                          <Text style={styles.eventMeta}>
                            {event.date} · {event.venue}
                          </Text>
                        </View>
                        <Text style={styles.pricePill}>{event.price}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyState}>
                    <View style={styles.illustration} />
                    <Text style={styles.emptyTitle}>
                      Start planning your first Nairobi experience
                    </Text>
                    <Pressable style={styles.primaryButton}>
                      <Text style={styles.primaryButtonText}>Start a plan</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.illustration} />
              <Text style={styles.emptyTitle}>
                Start planning your first Nairobi experience
              </Text>
              <Pressable style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>Start a plan</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.pursuitPlansBg,
  },
  plansBand: {
    width: "100%",
    backgroundColor: colors.pursuitPlansBg,
    paddingVertical: SECTION_PADDING_Y,
  },
  inner: {
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    marginHorizontal: "auto",
    paddingHorizontal: CONTENT_PADDING_H,
  },
  header: {
    marginBottom: HEADER_MARGIN_BOTTOM,
  },
  kicker: {
    fontFamily: webTypography.label.fontFamily,
    fontSize: 12,
    fontWeight: webTypography.label.fontWeight,
    color: colors.pursuitPurple,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  title: {
    maxWidth: TITLE_MAX_WIDTH,
    fontFamily: webTypography.heading.fontFamily,
    fontSize: TITLE_SIZE,
    fontWeight: webTypography.heading.fontWeight,
    lineHeight: TITLE_LINE_HEIGHT,
    color: colors.pursuitTextPrimary,
  },
  layout: {
    flexDirection: "row",
    gap: LAYOUT_GAP,
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    borderRadius: CARD_RADIUS,
    backgroundColor: colors.white,
    padding: CARD_PADDING,
    borderWidth: 1,
    borderColor: colors.pursuitBorder,
  },
  sidebarTitle: {
    fontFamily: webTypography.heading.fontFamily,
    fontSize: 18,
    fontWeight: webTypography.heading.fontWeight,
    color: colors.pursuitTextPrimary,
    marginBottom: 14,
  },
  planListItem: {
    gap: ITEM_GAP,
    borderRadius: CARD_RADIUS,
    padding: 12,
    marginBottom: 8,
  },
  planListItemActive: {
    backgroundColor: colors.pursuitMist,
  },
  planListName: {
    fontFamily: webTypography.label.fontFamily,
    fontSize: 15,
    fontWeight: webTypography.label.fontWeight,
    color: colors.pursuitTextPrimary,
  },
  planListDate: {
    marginTop: 3,
    fontFamily: webTypography.body.fontFamily,
    fontSize: META_SIZE,
    color: colors.pursuitTextMuted,
  },
  statusBadge: {
    alignSelf: "flex-start",
    overflow: "hidden",
    borderRadius: BADGE_RADIUS,
    backgroundColor: colors.pursuitMist,
    color: colors.pursuitPurple,
    fontFamily: webTypography.label.fontFamily,
    fontSize: 11,
    fontWeight: webTypography.label.fontWeight,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusActive: {
    backgroundColor: "rgba(184,201,168,0.35)",
    color: colors.forest,
  },
  statusPast: {
    backgroundColor: colors.surfaceContainer,
    color: colors.pursuitTextMuted,
  },
  detailCard: {
    flex: 1,
    borderRadius: CARD_RADIUS,
    backgroundColor: colors.white,
    padding: CARD_PADDING,
    borderWidth: 1,
    borderColor: colors.pursuitBorder,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: GRID_GAP,
    marginBottom: 18,
  },
  detailTitle: {
    fontFamily: webTypography.heading.fontFamily,
    fontSize: DETAIL_TITLE_SIZE,
    fontWeight: webTypography.heading.fontWeight,
    color: colors.pursuitTextPrimary,
  },
  detailMeta: {
    marginTop: 4,
    fontFamily: webTypography.body.fontFamily,
    fontSize: BODY_SIZE,
    color: colors.pursuitTextMuted,
  },
  memberRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
  },
  memberAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.pursuitPurple,
  },
  memberText: {
    fontFamily: webTypography.label.fontFamily,
    fontSize: 12,
    fontWeight: webTypography.label.fontWeight,
    color: colors.white,
  },
  mapPlaceholder: {
    height: MAP_HEIGHT,
    borderRadius: CARD_RADIUS,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.pursuitBorder,
    backgroundColor: colors.pursuitMist,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  mapTitle: {
    fontFamily: webTypography.heading.fontFamily,
    fontSize: 18,
    fontWeight: webTypography.heading.fontWeight,
    color: colors.pursuitTextPrimary,
  },
  mapText: {
    marginTop: 6,
    fontFamily: webTypography.body.fontFamily,
    fontSize: META_SIZE,
    color: colors.pursuitTextMuted,
  },
  sectionTitle: {
    fontFamily: webTypography.heading.fontFamily,
    fontSize: SECTION_TITLE_SIZE,
    fontWeight: webTypography.heading.fontWeight,
    color: colors.pursuitTextPrimary,
    marginBottom: CARD_RADIUS,
  },
  eventList: {
    gap: ITEM_GAP,
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    borderRadius: CARD_RADIUS,
    backgroundColor: colors.pursuitPlansBg,
    padding: 14,
  },
  eventTitle: {
    fontFamily: webTypography.heading.fontFamily,
    fontSize: 15,
    fontWeight: webTypography.heading.fontWeight,
    color: colors.pursuitTextPrimary,
  },
  eventMeta: {
    marginTop: 4,
    fontFamily: webTypography.body.fontFamily,
    fontSize: META_SIZE,
    color: colors.pursuitTextMuted,
  },
  pricePill: {
    overflow: "hidden",
    borderRadius: BADGE_RADIUS,
    backgroundColor: colors.pursuitMist,
    color: colors.pursuitPurple,
    fontFamily: webTypography.label.fontFamily,
    fontSize: 12,
    fontWeight: webTypography.label.fontWeight,
    paddingHorizontal: ITEM_GAP,
    paddingVertical: 5,
  },
  emptyState: {
    minHeight: EMPTY_MIN_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    borderRadius: CARD_RADIUS,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.pursuitBorder,
    padding: 32,
  },
  illustration: {
    width: ILLUSTRATION_SIZE,
    height: ILLUSTRATION_SIZE,
    borderRadius: ILLUSTRATION_SIZE / 2,
    backgroundColor: colors.pursuitMist,
  },
  emptyTitle: {
    fontFamily: webTypography.heading.fontFamily,
    fontSize: SECTION_TITLE_SIZE,
    fontWeight: webTypography.heading.fontWeight,
    color: colors.pursuitTextPrimary,
    textAlign: "center",
  },
  primaryButton: {
    alignSelf: "flex-start",
    borderRadius: BADGE_RADIUS,
    backgroundColor: colors.pursuitPurple,
    paddingHorizontal: 18,
    paddingVertical: ITEM_GAP,
  },
  primaryButtonText: {
    fontFamily: webTypography.label.fontFamily,
    fontSize: BODY_SIZE,
    fontWeight: webTypography.label.fontWeight,
    color: colors.white,
  },
});

export default Travel;
