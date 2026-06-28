import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useMyGroupPlans, useCreateGroupPlan } from "hooks/useGroupPlans";
import colors from "@shared/constants/tokens/colors";
import { fontSizes, fontWeights } from "@shared/constants/tokens/typography";
import { spacing } from "@shared/constants/tokens/spacing";
import { Layout } from "components/Layout/Layout";
import { GroupPlansTabs } from "components/Plans";
import { Ionicons } from "@expo/vector-icons";

type TabType = "active" | "draft" | "past";

export default function GroupPlans() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const { groupPlans, loading, refetch } = useMyGroupPlans();
  const { createGroupPlan, loading: creating } = useCreateGroupPlan();

  // Filter plans by status based on active tab
  const filteredPlans = useMemo(() => {
    if (!groupPlans) return [];

    switch (activeTab) {
      case "active":
        return groupPlans.filter((plan: any) => plan.status === "OPEN");
      case "draft":
        return groupPlans.filter((plan: any) => plan.status === "DRAFT");
      case "past":
        return groupPlans.filter((plan: any) => plan.status === "CLOSED");
      default:
        return groupPlans;
    }
  }, [groupPlans, activeTab]);

  const handleCreatePlan = async () => {
    try {
      const plan = await createGroupPlan();
      if (plan?.id) {
        // Navigate to plan detail screen
        router.push(`/group-plans/${plan.id}`);
      }
    } catch (error) {
      console.error("Failed to create group plan:", error);
    }
  };

  const renderPlanCard = ({ item }: any) => {
    const { id, displayName, status, bucketEvents } = item;
    const eventCount = bucketEvents?.length || 0;
    const firstThreeEvents = bucketEvents?.slice(0, 3) || [];

    return (
      <TouchableOpacity
        style={styles.planCard}
        onPress={() => router.push(`/group-plans/${id}`)}
      >
        {/* Preview images */}
        <View style={styles.eventPreviewContainer}>
          {firstThreeEvents.map((be: any, index: number) => (
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
              <Ionicons name="calendar" size={14} color={colors.aluminium} />
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

        <Ionicons name="chevron-forward" size={20} color={colors.aluminium} />
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
        <Ionicons name="people-outline" size={64} color={colors.aluminium} />
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptyDescription}>{description}</Text>
      </View>
    );
  };

  if (loading && groupPlans.length === 0) {
    return (
      <Layout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.deluge} />
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Group Plans</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreatePlan}
            disabled={creating}
          >
            {creating ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <>
                <Ionicons name="add" size={20} color={colors.white} />
                <Text style={styles.createButtonText}>New Plan</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <GroupPlansTabs active={activeTab} onSelect={setActiveTab} />
        </View>

        <FlatList
          data={filteredPlans}
          renderItem={renderPlanCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          onRefresh={refetch}
          refreshing={loading}
        />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ghostWhite,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.prim,
    borderBottomWidth: 1,
    borderBottomColor: colors.aluminium + "20",
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.thunder,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.deluge,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  createButtonText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
  tabsContainer: {
    backgroundColor: colors.prim,
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  planCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.md,
    shadowColor: colors.thunder,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    backgroundColor: colors.prim,
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
    color: colors.white,
    fontWeight: "600",
  },
  planInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  planName: {
    fontSize: fontSizes.base,
    fontWeight: "600",
    color: colors.thunder,
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
    color: colors.aluminium,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDRAFT: {
    backgroundColor: colors.aluminium + "20",
  },
  statusOPEN: {
    backgroundColor: colors.deluge + "20",
  },
  statusCLOSED: {
    backgroundColor: colors.sage + "20",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  statusTextDRAFT: {
    color: colors.aluminium,
  },
  statusTextOPEN: {
    color: colors.deluge,
  },
  statusTextCLOSED: {
    color: colors.forest,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing.xl * 2,
    gap: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.thunder,
  },
  emptyDescription: {
    fontSize: fontSizes.base,
    color: colors.aluminium,
    textAlign: "center",
    maxWidth: 250,
  },
});
