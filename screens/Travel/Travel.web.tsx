import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const PURSUIT = {
  purple: "#7C5C9C",
  sage: "#B8C9A8",
  plansBg: "#F8F5F2",
  textPrimary: "#1A1A2E",
  textMuted: "#8A7F7A",
  border: "#E0D5CC",
  white: "#FFFFFF",
  mist: "#EDE8F5",
};

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
    backgroundColor: PURSUIT.plansBg,
  },
  plansBand: {
    width: "100%",
    backgroundColor: PURSUIT.plansBg,
    paddingVertical: 48,
  },
  inner: {
    width: "100%",
    maxWidth: 1200,
    marginHorizontal: "auto",
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 28,
  },
  kicker: {
    fontFamily: "Work Sans",
    fontSize: 12,
    fontWeight: "600",
    color: PURSUIT.purple,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  title: {
    maxWidth: 720,
    fontFamily: "Poppins",
    fontSize: 38,
    fontWeight: "700",
    lineHeight: 46,
    color: PURSUIT.textPrimary,
  },
  layout: {
    flexDirection: "row",
    gap: 24,
  },
  sidebar: {
    width: 280,
    borderRadius: 12,
    backgroundColor: PURSUIT.white,
    padding: 20,
    borderWidth: 1,
    borderColor: PURSUIT.border,
  },
  sidebarTitle: {
    fontFamily: "Poppins",
    fontSize: 18,
    fontWeight: "700",
    color: PURSUIT.textPrimary,
    marginBottom: 14,
  },
  planListItem: {
    gap: 10,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  planListItemActive: {
    backgroundColor: PURSUIT.mist,
  },
  planListName: {
    fontFamily: "Work Sans",
    fontSize: 15,
    fontWeight: "600",
    color: PURSUIT.textPrimary,
  },
  planListDate: {
    marginTop: 3,
    fontFamily: "Work Sans",
    fontSize: 13,
    color: PURSUIT.textMuted,
  },
  statusBadge: {
    alignSelf: "flex-start",
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: PURSUIT.mist,
    color: PURSUIT.purple,
    fontFamily: "Work Sans",
    fontSize: 11,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusActive: {
    backgroundColor: "rgba(184,201,168,0.35)",
    color: "#35512B",
  },
  statusPast: {
    backgroundColor: "#F0ECE7",
    color: PURSUIT.textMuted,
  },
  detailCard: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: PURSUIT.white,
    padding: 20,
    borderWidth: 1,
    borderColor: PURSUIT.border,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    marginBottom: 18,
  },
  detailTitle: {
    fontFamily: "Poppins",
    fontSize: 24,
    fontWeight: "700",
    color: PURSUIT.textPrimary,
  },
  detailMeta: {
    marginTop: 4,
    fontFamily: "Work Sans",
    fontSize: 14,
    color: PURSUIT.textMuted,
  },
  memberRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
  },
  memberAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PURSUIT.purple,
  },
  memberText: {
    fontFamily: "Work Sans",
    fontSize: 12,
    fontWeight: "600",
    color: PURSUIT.white,
  },
  mapPlaceholder: {
    height: 180,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: PURSUIT.border,
    backgroundColor: PURSUIT.mist,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  mapTitle: {
    fontFamily: "Poppins",
    fontSize: 18,
    fontWeight: "700",
    color: PURSUIT.textPrimary,
  },
  mapText: {
    marginTop: 6,
    fontFamily: "Work Sans",
    fontSize: 13,
    color: PURSUIT.textMuted,
  },
  sectionTitle: {
    fontFamily: "Poppins",
    fontSize: 20,
    fontWeight: "700",
    color: PURSUIT.textPrimary,
    marginBottom: 12,
  },
  eventList: {
    gap: 10,
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    borderRadius: 12,
    backgroundColor: PURSUIT.plansBg,
    padding: 14,
  },
  eventTitle: {
    fontFamily: "Poppins",
    fontSize: 15,
    fontWeight: "700",
    color: PURSUIT.textPrimary,
  },
  eventMeta: {
    marginTop: 4,
    fontFamily: "Work Sans",
    fontSize: 13,
    color: PURSUIT.textMuted,
  },
  pricePill: {
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: PURSUIT.mist,
    color: PURSUIT.purple,
    fontFamily: "Work Sans",
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  emptyState: {
    minHeight: 320,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    borderRadius: 12,
    backgroundColor: PURSUIT.white,
    borderWidth: 1,
    borderColor: PURSUIT.border,
    padding: 32,
  },
  illustration: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: PURSUIT.mist,
  },
  emptyTitle: {
    fontFamily: "Poppins",
    fontSize: 20,
    fontWeight: "700",
    color: PURSUIT.textPrimary,
    textAlign: "center",
  },
  primaryButton: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: PURSUIT.purple,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  primaryButtonText: {
    fontFamily: "Work Sans",
    fontSize: 14,
    fontWeight: "600",
    color: PURSUIT.white,
  },
});

export default Travel;
