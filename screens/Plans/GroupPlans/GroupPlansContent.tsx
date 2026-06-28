import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  Share,
} from "react-native";
import {
  useCloseGroupPlan,
  useCreateGroupPlan,
  useMyGroupPlans,
  useUpdateGroupPlanName,
} from "hooks/useGroupPlans";
import colors from "@shared/constants/tokens/colors";
import { fontSizes, fontWeights } from "@shared/constants/tokens/typography";
import { spacing } from "@shared/constants/tokens/spacing";
import { GroupPlansTabs } from "components/Plans";
import { Ionicons } from "@expo/vector-icons";
import type { GetMyGroupPlansQuery } from "@shared/graphql/generated/graphql";
import { GroupPlanDetailModal } from "screens/Plans/GroupPlans/GroupPlanDetailModal";
import { buildVoteLink } from "@mobile/utils/linking";
import { CreateGroupPlanButton } from "components/CreateGroupPlanButton";

type TabType = "active" | "draft" | "past";
type GroupPlanListItem = NonNullable<
  NonNullable<GetMyGroupPlansQuery["myGroupPlans"]>[number]
>;

export function GroupPlansContent() {
  const [activeTab, setActiveTab] = useState<TabType>("draft");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const { groupPlans, loading, refetch } = useMyGroupPlans();
  const { createGroupPlan, loading: creating } = useCreateGroupPlan();
  const { closePlan } = useCloseGroupPlan();
  const { updateName } = useUpdateGroupPlanName();

  // Filter plans by status based on active tab
  const filteredPlans = useMemo(() => {
    if (!groupPlans) return [];

    switch (activeTab) {
      case "active":
        return groupPlans.filter((plan: GroupPlanListItem) => plan.status === "OPEN");
      case "draft":
        return groupPlans.filter((plan: GroupPlanListItem) => plan.status === "DRAFT");
      case "past":
        return groupPlans.filter((plan: GroupPlanListItem) => plan.status === "CLOSED");
      default:
        return groupPlans;
    }
  }, [groupPlans, activeTab]);

  const handleCreatePlan = async () => {
    try {
      const plan = await createGroupPlan();
      if (plan?.id) {
        setSelectedPlanId(plan.id);
      }
    } catch (error) {
      console.error("Failed to create group plan:", error);
    }
  };

  const handleSharePlan = async (plan: GroupPlanListItem) => {
    const shareToken = plan.invitations?.[0]?.shareToken;
    const link = buildVoteLink(shareToken);

    if (!link) {
      Alert.alert("Share unavailable", "Open this plan for voting first.");
      return;
    }

    await Share.share({
      message: `${plan.displayName} — vote on where we should go! ${link}`,
      url: link,
    });
  };

  const handleLongPressPlan = (plan: GroupPlanListItem) => {
    const actions = [
      { text: "Share", onPress: () => handleSharePlan(plan) },
      {
        text: "Rename",
        onPress: () => {
          if (Platform.OS === "ios" && Alert.prompt) {
            Alert.prompt(
              "Rename plan",
              undefined,
              (name) => {
                if (name.trim()) {
                  updateName(plan.id, name.trim()).then(() => refetch());
                }
              },
              "plain-text",
              plan.displayName ?? plan.name,
            );
            return;
          }

          Alert.alert("Rename", "Open the plan and tap the title to rename it.");
        },
      },
    ];

    if (plan.status === "OPEN") {
      actions.push({
        text: "Close Voting",
        onPress: () => closePlan(plan.id).then(() => refetch()),
      });
    }

    if (plan.status === "DRAFT") {
      actions.push({
        text: "Delete",
        onPress: () =>
          Alert.alert(
            "Delete plan",
            "Delete mutation is not available in the current API yet.",
          ),
      });
    }

    Alert.alert("Group plan actions", "Choose an action", [
      ...actions,
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const renderPlanCard = (item: GroupPlanListItem) => {
    const { id, displayName, status, bucketEvents } = item;
    const eventCount = bucketEvents?.length || 0;
    const firstThreeEvents = bucketEvents?.slice(0, 3) || [];

    return (
      <TouchableOpacity
        key={id}
        style={styles.planCard}
        onPress={() => setSelectedPlanId(id)}
        onLongPress={() => handleLongPressPlan(item)}
      >
        {/* Preview images */}
        <View style={styles.eventPreviewContainer}>
          {firstThreeEvents.map((be, index: number) => (
            <View
              key={be.id}
              style={[styles.eventImageWrapper, { left: index * 15 }]}
            >
              {be.event?.image ? (
                <Image
                  source={{ uri: be.event.image }}
                  style={styles.eventPreviewImage}
                />
              ) : (
                <View
                  style={[styles.eventPreviewImage, styles.placeholderImage]}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={24}
                    color={colors.aluminium}
                  />
                </View>
              )}
            </View>
          ))}
          {eventCount > 3 && (
            <View style={styles.moreIndicator}>
              <Text style={styles.moreText}>+{eventCount - 3}</Text>
            </View>
          )}
        </View>

        {/* Plan info */}
        <View style={styles.planInfo}>
          <Text style={styles.planName} numberOfLines={1}>
            {displayName}
          </Text>
          <View style={styles.planMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar" size={14} color={colors.white} />
              <Text style={styles.metaText}>{eventCount} events</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                status === "DRAFT" && styles.statusDRAFT,
                status === "OPEN" && styles.statusOPEN,
                status === "CLOSED" && styles.statusCLOSED,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  status === "DRAFT" && styles.statusTextDRAFT,
                  status === "OPEN" && styles.statusTextOPEN,
                  status === "CLOSED" && styles.statusTextCLOSED,
                ]}
              >
                {status}
              </Text>
            </View>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color={colors.white} />
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    let title = "";
    let description = "";

    switch (activeTab) {
      case "active":
        title = "No Active Plans";
        description = "Open a draft plan for voting to see it here";
        break;
      case "draft":
        title = "No Draft Plans";
        description = "Create a group plan to get started";
        break;
      case "past":
        title = "No Past Plans";
        description = "Closed plans will appear here";
        break;
    }

    return (
      <View style={styles.emptyState}>
        <Ionicons name="people-outline" size={64} color={colors.white} />
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptyDescription}>{description}</Text>
        {activeTab === "draft" && (
          <CreateGroupPlanButton
            onPress={handleCreatePlan}
            disabled={creating}
            loading={creating}
          />
        )}
      </View>
    );
  };

  if (loading && groupPlans.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.tabsContainer}>
          <GroupPlansTabs active={activeTab} onSelect={setActiveTab} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.white} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <GroupPlansTabs active={activeTab} onSelect={setActiveTab} />
      </View>

      <View style={styles.content}>
        {/* Draft tab: show create button above existing draft cards */}
        {activeTab === "draft" && filteredPlans.length > 0 && (
          <View style={styles.draftHeader}>
            <CreateGroupPlanButton
              onPress={handleCreatePlan}
              disabled={creating}
              loading={creating}
            />
          </View>
        )}

        {/* Content */}
        {filteredPlans.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.listContent}>
            {filteredPlans.map(renderPlanCard)}
          </View>
        )}
      </View>
      <GroupPlanDetailModal
        visible={Boolean(selectedPlanId)}
        groupPlanId={selectedPlanId}
        onClose={() => {
          setSelectedPlanId(null);
          refetch();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  tabsContainer: {
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
  },
  draftHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  planCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  eventPreviewContainer: {
    flexDirection: "row",
    width: 80,
    height: 60,
    position: "relative",
  },
  eventImageWrapper: {
    position: "absolute",
  },
  eventPreviewImage: {
    width: 50,
    height: 60,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 2,
    borderColor: colors.white,
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  moreIndicator: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: colors.deluge,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  moreText: {
    fontSize: fontSizes.xs,
    lineHeight: 16,
    color: colors.white,
    fontWeight: "600",
  },
  planInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  planName: {
    fontSize: fontSizes.base,
    lineHeight: 22,
    fontWeight: "600",
    color: colors.white,
  },
  planMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: fontSizes.xs,
    lineHeight: 16,
    color: colors.white,
    opacity: 0.7,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDRAFT: {
    backgroundColor: "rgba(166, 168, 177, 0.3)",
  },
  statusOPEN: {
    backgroundColor: "rgba(124, 92, 156, 0.3)",
  },
  statusCLOSED: {
    backgroundColor: "rgba(184, 201, 168, 0.3)",
  },
  statusText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "600",
  },
  statusTextDRAFT: {
    color: colors.aluminium,
  },
  statusTextOPEN: {
    color: colors.delugeLight,
  },
  statusTextCLOSED: {
    color: colors.sage,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing.xl * 2,
    gap: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSizes.lg,
    lineHeight: 23,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  emptyDescription: {
    fontSize: fontSizes.base,
    lineHeight: 24,
    color: colors.white,
    opacity: 0.7,
    textAlign: "center",
    maxWidth: 250,
  },
});
