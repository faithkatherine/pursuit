import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Share,
  Alert,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  useGroupPlan,
  useAddEventToBucket,
  useRemoveEventFromBucket,
  useUpdateGroupPlanName,
  useOpenGroupPlanForVoting,
  useCloseGroupPlan,
  useEventSuggestionsForGroupPlan,
} from "hooks/useGroupPlans";
import { colors } from "themes/tokens/colors";
import { typography } from "themes/tokens/typography";
import { spacing } from "themes/tokens/spacing";
import { Layout } from "components/Layout/Layout";
import { BackNavigationHeader } from "components/Layout/BackNavigationHeader";

export default function GroupPlanDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { groupPlan, loading, refetch } = useGroupPlan(id);
  const { addEvent, loading: adding } = useAddEventToBucket();
  const { removeEvent } = useRemoveEventFromBucket();
  const { updateName } = useUpdateGroupPlanName();
  const { openForVoting, loading: opening } = useOpenGroupPlanForVoting();
  const { closePlan, loading: closing } = useCloseGroupPlan();
  const { suggestions, loading: loadingSuggestions } =
    useEventSuggestionsForGroupPlan(id);

  const [editingName, setEditingName] = useState(false);
  const [planName, setPlanName] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const bucketEvents = groupPlan?.bucketEvents || [];
  const invitation = groupPlan?.invitations?.[0];
  const shareToken = invitation?.shareToken;
  const status = groupPlan?.status || "DRAFT";

  const handleSharePlan = async () => {
    if (!shareToken) return;

    const shareUrl = `pursuit://group-plans/share/${shareToken}`;
    const message = `Vote on events with me! ${groupPlan?.displayName || "Group Plan"}\n\n${shareUrl}`;

    try {
      await Share.share({
        message,
        title: "Join my group plan",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleAddEvent = async (eventId: string) => {
    if (!id) return;
    try {
      await addEvent(id, eventId);
      setShowSuggestions(false);
    } catch (error) {
      Alert.alert("Error", "Failed to add event");
    }
  };

  const handleRemoveEvent = async (bucketEventId: string) => {
    Alert.alert("Remove Event", "Are you sure you want to remove this event?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await removeEvent(bucketEventId);
          } catch (error) {
            Alert.alert("Error", "Failed to remove event");
          }
        },
      },
    ]);
  };

  const handleUpdateName = async () => {
    if (!id || !planName.trim()) {
      setEditingName(false);
      return;
    }
    try {
      await updateName(id, planName.trim());
      setEditingName(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update plan name");
    }
  };

  const handleOpenForVoting = async () => {
    if (!id) return;
    if (bucketEvents.length === 0) {
      Alert.alert(
        "No Events",
        "Add at least one event before opening for voting",
      );
      return;
    }

    Alert.alert("Open for Voting", "Ready to share with friends?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Open",
        onPress: async () => {
          try {
            await openForVoting(id);
            handleSharePlan();
          } catch (error) {
            Alert.alert("Error", "Failed to open plan for voting");
          }
        },
      },
    ]);
  };

  const handleClosePlan = async () => {
    if (!id) return;

    Alert.alert("Close Plan", "Close voting and finalize results?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Close",
        style: "destructive",
        onPress: async () => {
          try {
            await closePlan(id);
          } catch (error) {
            Alert.alert("Error", "Failed to close plan");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <Layout>
        <BackNavigationHeader
          title="Group Plan"
          onBackPress={() => router.back()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.deluge} />
        </View>
      </Layout>
    );
  }

  if (!groupPlan) {
    return (
      <Layout>
        <BackNavigationHeader
          title="Group Plan"
          onBackPress={() => router.back()}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Group plan not found</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <BackNavigationHeader
        title="Group Plan"
        onBackPress={() => router.back()}
      />
      <ScrollView style={styles.container}>
        {/* Plan header */}
        <View style={styles.header}>
          {editingName ? (
            <View style={styles.nameEditContainer}>
              <TextInput
                style={styles.nameInput}
                value={planName}
                onChangeText={setPlanName}
                placeholder="Plan name..."
                autoFocus
                onBlur={handleUpdateName}
                onSubmitEditing={handleUpdateName}
              />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.nameContainer}
              onPress={() => {
                setPlanName(groupPlan.name || "");
                setEditingName(true);
              }}
            >
              <Text style={styles.planName}>{groupPlan.displayName}</Text>
              <Ionicons name="pencil" size={16} color={colors.aluminium} />
            </TouchableOpacity>
          )}

          <View style={[styles.statusBadge]}>
            <Text style={[styles.statusText]}>{status}</Text>
          </View>
        </View>

        {/* Events list */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Events ({bucketEvents.length})
            </Text>
            {status === "DRAFT" && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowSuggestions(!showSuggestions)}
              >
                <Ionicons name="add-circle" size={24} color={colors.deluge} />
              </TouchableOpacity>
            )}
          </View>

          {bucketEvents.map((be: any) => (
            <View key={be.id} style={styles.eventCard}>
              {be.event?.image && (
                <Image
                  source={{ uri: be.event.image }}
                  style={styles.eventImage}
                />
              )}
              <View style={styles.eventInfo}>
                <Text style={styles.eventName} numberOfLines={2}>
                  {be.event?.name}
                </Text>
                {status === "OPEN" || status === "CLOSED" ? (
                  <View style={styles.voteInfo}>
                    <Ionicons name="heart" size={16} color={colors.deluge} />
                    <Text style={styles.voteCount}>
                      {be.interestedCount || 0} interested
                    </Text>
                  </View>
                ) : null}
              </View>
              {status === "DRAFT" && (
                <TouchableOpacity onPress={() => handleRemoveEvent(be.id)}>
                  <Ionicons
                    name="close-circle"
                    size={24}
                    color={colors.aluminium}
                  />
                </TouchableOpacity>
              )}
            </View>
          ))}

          {bucketEvents.length === 0 && (
            <View style={styles.emptyEvents}>
              <Ionicons
                name="calendar-outline"
                size={48}
                color={colors.aluminium}
              />
              <Text style={styles.emptyText}>No events added yet</Text>
            </View>
          )}

          {/* Suggestions */}
          {showSuggestions && status === "DRAFT" && (
            <View style={styles.suggestions}>
              <Text style={styles.suggestionsTitle}>Suggested Events</Text>
              {loadingSuggestions ? (
                <ActivityIndicator color={colors.deluge} />
              ) : (
                suggestions.map((event: any) => (
                  <TouchableOpacity
                    key={event.id}
                    style={styles.suggestionCard}
                    onPress={() => handleAddEvent(event.id)}
                    disabled={adding}
                  >
                    {event.image && (
                      <Image
                        source={{ uri: event.image }}
                        style={styles.suggestionImage}
                      />
                    )}
                    <Text style={styles.suggestionName} numberOfLines={2}>
                      {event.name}
                    </Text>
                    <Ionicons name="add" size={20} color={colors.deluge} />
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {status === "DRAFT" && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryButton]}
                onPress={handleOpenForVoting}
                disabled={opening}
              >
                {opening ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <>
                    <Ionicons
                      name="paper-plane"
                      size={20}
                      color={colors.white}
                    />
                    <Text style={styles.primaryButtonText}>
                      Open for Voting
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}

          {status === "OPEN" && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={handleSharePlan}
              >
                <Ionicons name="share-social" size={20} color={colors.deluge} />
                <Text style={styles.secondaryButtonText}>Share Again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.primaryButton]}
                onPress={handleClosePlan}
                disabled={closing}
              >
                {closing ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <>
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={colors.white}
                    />
                    <Text style={styles.primaryButtonText}>Close Voting</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}

          {status === "CLOSED" && (
            <View style={styles.closedState}>
              <Ionicons
                name="checkmark-circle"
                size={48}
                color={colors.forest}
              />
              <Text style={styles.closedText}>Voting Closed</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  errorText: {
    ...typography.body,
    color: colors.aluminium,
  },
  header: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.aluminium + "20",
    gap: spacing.sm,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  planName: {
    ...typography.h2,
    color: colors.thunder,
    flex: 1,
  },
  nameEditContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameInput: {
    ...typography.h2,
    color: colors.thunder,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.deluge,
    paddingVertical: spacing.xs,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
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
    ...typography.caption,
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
  section: {
    padding: spacing.md,
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.thunder,
  },
  addButton: {
    padding: spacing.xs,
  },
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.md,
    shadowColor: colors.thunder,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  eventImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  eventInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  eventName: {
    ...typography.body,
    fontWeight: "600",
    color: colors.thunder,
  },
  voteInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  voteCount: {
    ...typography.caption,
    color: colors.deluge,
  },
  emptyEvents: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  emptyText: {
    ...typography.body,
    color: colors.aluminium,
  },
  suggestions: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  suggestionsTitle: {
    ...typography.body,
    fontWeight: "600",
    color: colors.thunder,
  },
  suggestionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.prim,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.md,
  },
  suggestionImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  suggestionName: {
    ...typography.body,
    color: colors.thunder,
    flex: 1,
  },
  actions: {
    padding: spacing.md,
    gap: spacing.md,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  primaryButton: {
    backgroundColor: colors.deluge,
  },
  primaryButtonText: {
    //...typography.buttonText,
    color: colors.white,
  },
  secondaryButton: {
    backgroundColor: colors.deluge + "20",
  },
  secondaryButtonText: {
    //...typography.buttonText,
    color: colors.deluge,
  },
  closedState: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  closedText: {
    ...typography.h3,
    color: colors.forest,
  },
});
