import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import colors from "themes/tokens/colors";
import { fontSizes, fontWeights } from "themes/tokens/typography";
import { radii, spacing } from "themes/tokens/spacing";
import { Button } from "components/Buttons";
import { PlanCard } from "components/Plans";
import { useAuth } from "providers/AuthProvider";
import {
  useCastVote,
  useCloseGroupPlan,
  useCreateVoterSession,
  useGroupPlan,
  useOpenGroupPlanForVoting,
  useUpdateGroupPlanName,
} from "hooks/useGroupPlans";
import type {
  GroupPlanEventInfoFragment,
  GroupPlanInfoFragment,
} from "graphql/generated/graphql";
import { GroupPlansGroupPlanStatusChoices } from "graphql/generated/graphql";
import { formatEventDate } from "utils/date";
import { buildVoteLink } from "utils/linking";

interface GroupPlanDetailModalProps {
  groupPlanId: string | null;
  visible: boolean;
  onClose: () => void;
}

const SWIPE_THRESHOLD = 80;
const SWIPE_EXIT_DISTANCE = 520;

type VoteDirection = "INTERESTED" | "SKIP";

export const GroupPlanDetailModal: React.FC<GroupPlanDetailModalProps> = ({
  groupPlanId,
  visible,
  onClose,
}) => {
  const { user } = useAuth();
  const { groupPlan, loading, refetch } = useGroupPlan(groupPlanId ?? undefined);
  const { updateName } = useUpdateGroupPlanName();
  const { openForVoting, loading: opening } = useOpenGroupPlanForVoting();
  const { closePlan, loading: closing } = useCloseGroupPlan();
  const { createSession } = useCreateVoterSession();
  const { castVote, loading: castingVote } = useCastVote();
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [localCompleted, setLocalCompleted] = useState(false);
  const [stackIndex, setStackIndex] = useState(0);
  const [voteHistory, setVoteHistory] = useState<
    Array<{ eventId: string; direction: VoteDirection }>
  >([]);
  const position = useRef(new Animated.ValueXY()).current;

  const typedGroupPlan = groupPlan as GroupPlanInfoFragment | undefined;
  const bucketEvents: GroupPlanEventInfoFragment[] =
    typedGroupPlan?.bucketEvents ?? [];
  const shareToken = groupPlan?.invitations?.[0]?.shareToken;
  const voteLink = buildVoteLink(shareToken);
  const isCreator = Boolean(user?.id && groupPlan?.creator?.id === user.id);
  const status = groupPlan?.status;
  const hasCompletedStack =
    localCompleted || Boolean(groupPlan?.myVoterSession?.hasCompletedStack);

  const orderedResults = useMemo(
    () =>
      [...bucketEvents].sort(
        (left, right) => right.interestedCount - left.interestedCount,
      ),
    [bucketEvents],
  );

  useEffect(() => {
    if (!visible || !groupPlan || status !== GroupPlansGroupPlanStatusChoices.Open) {
      return;
    }

    if (!groupPlan.myVoterSession && shareToken) {
      createSession(shareToken).then(() => refetch()).catch(() => undefined);
    }
  }, [createSession, groupPlan, refetch, shareToken, status, visible]);

  useEffect(() => {
    if (groupPlan) {
      setDraftName(groupPlan.name);
      setLocalCompleted(false);
      setStackIndex(0);
      setVoteHistory([]);
      position.setValue({ x: 0, y: 0 });
    }
  }, [groupPlan, position]);

  const handleShare = async () => {
    if (!groupPlan || !voteLink) {
      return;
    }

    await Share.share({
      message: `${groupPlan.displayName} — vote on where we should go! ${voteLink}`,
      url: voteLink,
    });
  };

  const handleSaveName = async () => {
    if (!groupPlan || !draftName.trim()) {
      setIsEditingName(false);
      return;
    }

    await updateName(groupPlan.id, draftName.trim());
    setIsEditingName(false);
    refetch();
  };

  const handleOpenVoting = async () => {
    if (!groupPlan) {
      return;
    }

    await openForVoting(groupPlan.id);
    await refetch();
    handleShare();
  };

  const handleCloseVoting = async () => {
    if (!groupPlan) {
      return;
    }

    await closePlan(groupPlan.id);
    await refetch();
  };

  const handleQuickVote = async (
    bucketEvent: GroupPlanEventInfoFragment,
    direction: VoteDirection,
  ) => {
    await castVote(bucketEvent.id, direction);
    await refetch();
  };

  const resetActiveCard = useCallback(() => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
    }).start();
  }, [position]);

  const animateCardExit = useCallback(
    (toX: number, onComplete: () => void) => {
      Animated.timing(position, {
        toValue: { x: toX, y: 0 },
        duration: 180,
        useNativeDriver: true,
      }).start(({ finished }) => {
        position.setValue({ x: 0, y: 0 });
        if (finished) {
          onComplete();
        }
      });
    },
    [position],
  );

  const handleBrowse = useCallback(
    (direction: "previous" | "next") => {
      if (bucketEvents.length === 0) {
        return;
      }

      const nextIndex =
        direction === "next"
          ? Math.min(stackIndex + 1, bucketEvents.length - 1)
          : Math.max(stackIndex - 1, 0);

      if (nextIndex === stackIndex) {
        resetActiveCard();
        return;
      }

      const exitDistance =
        direction === "next" ? -SWIPE_EXIT_DISTANCE : SWIPE_EXIT_DISTANCE;
      animateCardExit(exitDistance, () => setStackIndex(nextIndex));
    },
    [animateCardExit, bucketEvents.length, resetActiveCard, stackIndex],
  );

  const handleVoteAdvance = useCallback(
    async (direction: VoteDirection) => {
      const bucketEvent = bucketEvents[stackIndex];

      if (!bucketEvent || castingVote) {
        resetActiveCard();
        return;
      }

      try {
        await handleQuickVote(bucketEvent, direction);
        const nextIndex = stackIndex + 1;
        setVoteHistory((current) => [
          ...current,
          { eventId: bucketEvent.id, direction },
        ]);
        setStackIndex(nextIndex);
        if (nextIndex >= bucketEvents.length) {
          setLocalCompleted(true);
        }
      } catch {
        Alert.alert("Vote not saved", "Please try that vote again.");
      }
    },
    [bucketEvents, castingVote, handleQuickVote, resetActiveCard, stackIndex],
  );

  const handleAnimatedVote = useCallback(
    (direction: VoteDirection) => {
      const exitDistance =
        direction === "INTERESTED" ? SWIPE_EXIT_DISTANCE : -SWIPE_EXIT_DISTANCE;
      animateCardExit(exitDistance, () => {
        handleVoteAdvance(direction);
      });
    },
    [animateCardExit, handleVoteAdvance],
  );

  const handleUndoVote = useCallback(() => {
    if (voteHistory.length === 0 || castingVote) {
      return;
    }

    setVoteHistory((current) => current.slice(0, -1));
    setLocalCompleted(false);
    setStackIndex((current) => Math.max(current - 1, 0));
  }, [castingVote, voteHistory.length]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 10 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
        onPanResponderMove: Animated.event(
          [null, { dx: position.x, dy: position.y }],
          { useNativeDriver: false },
        ),
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dx > SWIPE_THRESHOLD) {
            if (status === GroupPlansGroupPlanStatusChoices.Draft) {
              handleBrowse("previous");
              return;
            }

            handleAnimatedVote("INTERESTED");
            return;
          }

          if (gestureState.dx < -SWIPE_THRESHOLD) {
            if (status === GroupPlansGroupPlanStatusChoices.Draft) {
              handleBrowse("next");
              return;
            }

            handleAnimatedVote("SKIP");
            return;
          }

          resetActiveCard();
        },
      }),
    [
      handleAnimatedVote,
      handleBrowse,
      position.x,
      position.y,
      resetActiveCard,
      status,
    ],
  );

  const renderSwipeEventCard = (bucketEvent: GroupPlanEventInfoFragment) => {
    const formattedDate = formatEventDate(bucketEvent.event.date);
    const dateLabel =
      typeof formattedDate === "object"
        ? formattedDate.formattedDate
        : formattedDate;
    const categoryLabel =
      bucketEvent.event.category?.[0]?.name ?? "Pursuit event";

    return (
      <View style={styles.swipeCard}>
        <View style={styles.swipeImageWrap}>
          {bucketEvent.event.image ? (
            <Image
              source={{ uri: bucketEvent.event.image }}
              style={styles.swipeImage}
            />
          ) : (
            <View style={styles.swipeImagePlaceholder}>
              <Ionicons name="calendar-outline" size={40} color={colors.white65} />
            </View>
          )}
        </View>
        <BlurView intensity={20} tint="dark" style={styles.swipeInfoPanel}>
          <Text style={styles.swipeCategory} numberOfLines={1}>
            {categoryLabel}
          </Text>
          <Text style={styles.swipeTitle} numberOfLines={2}>
            {bucketEvent.event.name}
          </Text>
          <Text style={styles.swipeDate} numberOfLines={1}>
            {dateLabel}
          </Text>
        </BlurView>
      </View>
    );
  };

  const renderStackCard = (
    bucketEvent: GroupPlanEventInfoFragment,
    layerIndex: number,
    isActive: boolean,
  ) => {
    const layerStyle =
      layerIndex === 0
        ? styles.stackCardBack
        : layerIndex === 1
          ? styles.stackCardMiddle
          : styles.stackCardTop;
    const activeRotate = position.x.interpolate({
      inputRange: [-SWIPE_EXIT_DISTANCE, 0, SWIPE_EXIT_DISTANCE],
      outputRange: ["-8deg", "0deg", "8deg"],
    });
    const animatedStyle = isActive
      ? [
          styles.stackCard,
          layerStyle,
          {
            transform: [
              { translateX: position.x },
              { translateY: position.y },
              { rotate: activeRotate },
            ],
          },
        ]
      : [styles.stackCard, layerStyle];

    if (isActive) {
      return (
        <Animated.View
          key={bucketEvent.id}
          style={animatedStyle}
          {...panResponder.panHandlers}
        >
          {renderSwipeEventCard(bucketEvent)}
        </Animated.View>
      );
    }

    return (
      <View key={bucketEvent.id} style={[styles.stackCard, layerStyle]}>
        {renderSwipeEventCard(bucketEvent)}
      </View>
    );
  };

  const renderSwipeStack = () => {
    if (bucketEvents.length === 0) {
      return (
        <View style={styles.stackEmpty}>
          <Text style={styles.emptyText}>No events in this plan yet.</Text>
        </View>
      );
    }

    const visibleEvents = bucketEvents.slice(stackIndex, stackIndex + 3);
    const progressIndex = Math.min(stackIndex + 1, bucketEvents.length);

    return (
      <View style={styles.swipeSection}>
        <Text style={styles.progressText}>
          {progressIndex} of {bucketEvents.length} events
        </Text>
        <View style={styles.stackFrame}>
          {visibleEvents.map((bucketEvent, index) =>
            renderStackCard(bucketEvent, 2 - index, index === 0),
          )}
        </View>
        {renderControls()}
      </View>
    );
  };

  const renderControls = () => {
    if (status === GroupPlansGroupPlanStatusChoices.Draft) {
      return (
        <View style={styles.controlsRow}>
          <Pressable
            style={[styles.controlButton, styles.controlButtonSmall]}
            disabled={stackIndex === 0}
            onPress={() => handleBrowse("previous")}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={stackIndex === 0 ? colors.aluminium : colors.deluge}
            />
          </Pressable>
          <Pressable
            style={[styles.controlButton, styles.controlButtonSmall]}
            disabled={stackIndex >= bucketEvents.length - 1}
            onPress={() => handleBrowse("next")}
          >
            <Ionicons
              name="arrow-forward"
              size={22}
              color={
                stackIndex >= bucketEvents.length - 1
                  ? colors.aluminium
                  : colors.deluge
              }
            />
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.controlsRow}>
        <Pressable
          style={[styles.controlButton, styles.controlButtonSmall]}
          disabled={voteHistory.length === 0 || castingVote}
          onPress={handleUndoVote}
        >
          <Ionicons
            name="arrow-undo"
            size={22}
            color={voteHistory.length === 0 ? colors.aluminium : colors.deluge}
          />
        </Pressable>
        <Pressable
          style={[styles.controlButton, styles.controlButtonMedium, styles.skipButton]}
          disabled={castingVote}
          onPress={() => handleAnimatedVote("SKIP")}
        >
          <Ionicons name="close" size={26} color={colors.tertiary} />
        </Pressable>
        <Pressable
          style={[
            styles.controlButton,
            styles.controlButtonMedium,
            styles.interestedButton,
          ]}
          disabled={castingVote}
          onPress={() => handleAnimatedVote("INTERESTED")}
        >
          <Ionicons name="heart" size={25} color={colors.white} />
        </Pressable>
      </View>
    );
  };

  const renderHeader = () => {
    if (!groupPlan) {
      return null;
    }

    return (
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={onClose}>
          <Ionicons name="chevron-down" size={24} color={colors.white} />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          {isEditingName && isCreator ? (
            <TextInput
              value={draftName}
              onChangeText={setDraftName}
              onBlur={handleSaveName}
              onSubmitEditing={handleSaveName}
              autoFocus
              style={styles.nameInput}
              placeholder="Plan name"
              placeholderTextColor={colors.white50}
            />
          ) : (
            <Pressable
              disabled={!isCreator}
              onPress={() => setIsEditingName(true)}
            >
              <Text style={styles.title}>{groupPlan.displayName}</Text>
            </Pressable>
          )}
          <View style={styles.metaRow}>
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>{groupPlan.status}</Text>
            </View>
            <Text style={styles.metaText}>{bucketEvents.length} events</Text>
          </View>
        </View>
        <Pressable style={styles.iconButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={22} color={colors.white} />
        </Pressable>
      </View>
    );
  };

  const renderResults = (isClosed: boolean) => (
    <View style={styles.resultsList}>
      {orderedResults.map((bucketEvent, index) => {
        const formattedDate = formatEventDate(bucketEvent.event.date);
        const time =
          typeof formattedDate === "object" ? formattedDate.formattedTime : "";

        return (
          <PlanCard
            key={bucketEvent.id}
            dayNumber=""
            month=""
            dayName=""
            title={bucketEvent.event.name}
            time={time}
            venue={bucketEvent.event.locationName ?? "TBA"}
            categoryLabel={bucketEvent.event.category?.[0]?.name}
            categoryColor={colors.deluge}
            isTicketed={bucketEvent.event.hasConfirmedTicket ?? false}
            variant="voting"
            voters={bucketEvent.voters}
            interestedCount={bucketEvent.interestedCount}
            isWinner={isClosed && index === 0 && bucketEvent.interestedCount > 0}
            onPress={() => undefined}
          />
        );
      })}
      {orderedResults.length === 0 && (
        <Text style={styles.emptyText}>No events in this plan yet.</Text>
      )}
    </View>
  );

  const renderBody = () => {
    if (loading || !groupPlan) {
      return (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={colors.white} />
        </View>
      );
    }

    if (status === GroupPlansGroupPlanStatusChoices.Draft) {
      return (
        <View style={styles.swipeContent}>
          {renderSwipeStack()}
          <View style={styles.draftActions}>
            <Button
              text="Start Voting"
              variant="primary"
              onPress={handleOpenVoting}
              loading={opening}
              style={styles.primaryButton}
              textStyle={styles.primaryButtonText}
            />
            <Pressable
              style={styles.linkButton}
              onPress={() =>
                Alert.alert(
                  "Add more events",
                  "CreateGroupPlanModal is not wired here yet.",
                )
              }
            >
              <Text style={styles.linkText}>+ Add more events</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    if (status === GroupPlansGroupPlanStatusChoices.Open && !hasCompletedStack) {
      return (
        <View style={styles.swipeContent}>
          {renderSwipeStack()}
        </View>
      );
    }

    if (status === GroupPlansGroupPlanStatusChoices.Open) {
      return (
        <View style={styles.section}>
          {renderResults(false)}
          <View style={styles.prompt}>
            <Text style={styles.promptText}>Share to get more votes</Text>
            <Button
              text="Share"
              variant="primary"
              onPress={handleShare}
              style={styles.promptButton}
              textStyle={styles.primaryButtonText}
            />
          </View>
          {isCreator && (
            <Button
              text="Close Voting"
              variant="primary"
              onPress={handleCloseVoting}
              loading={closing}
              style={styles.primaryButton}
              textStyle={styles.primaryButtonText}
            />
          )}
        </View>
      );
    }

    return (
      <View style={styles.section}>
        {renderResults(true)}
        <Text style={styles.finalisedText}>Plan finalised</Text>
        {isCreator && (
          <Pressable style={styles.linkButton} onPress={handleOpenVoting}>
            <Text style={styles.linkText}>Reopen Voting</Text>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <BlurView intensity={20} tint="dark" style={styles.sheetBlur}>
          <View style={styles.handle} />
          {renderHeader()}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {renderBody()}
          </ScrollView>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 4, 20, 0.55)",
  },
  sheet: {
    flex: 1,
    paddingTop: spacing["5xl"],
    backgroundColor: "transparent",
  },
  sheetBlur: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderTopLeftRadius: radii["2xl"],
    borderTopRightRadius: radii["2xl"],
    overflow: "hidden",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radii.full,
    backgroundColor: "rgba(255, 255, 255, 0.35)",
    alignSelf: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: spacing.base,
    gap: spacing.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white05,
  },
  headerTitleWrap: {
    flex: 1,
    gap: spacing.sm,
  },
  title: {
    fontSize: fontSizes["2xl"],
    fontWeight: fontWeights.bold,
    lineHeight: 31,
    color: colors.white,
  },
  nameInput: {
    fontSize: fontSizes["2xl"],
    fontWeight: fontWeights.bold,
    lineHeight: 31,
    color: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.white50,
    paddingVertical: spacing.xs,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  statusPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    backgroundColor: colors.white02,
  },
  statusText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    lineHeight: 16,
    color: colors.white,
  },
  metaText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: 19,
    color: colors.white65,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.base,
    paddingBottom: spacing["4xl"],
  },
  loadingState: {
    minHeight: 360,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    gap: spacing.base,
  },
  swipeContent: {
    flex: 1,
    gap: spacing.lg,
  },
  swipeSection: {
    flex: 1,
    alignItems: "center",
    gap: spacing.md,
  },
  progressText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: 19,
    color: colors.white65,
    textAlign: "center",
  },
  stackFrame: {
    width: "100%",
    maxWidth: 360,
    aspectRatio: 0.72,
    alignSelf: "center",
  },
  stackEmpty: {
    minHeight: 360,
    justifyContent: "center",
    alignItems: "center",
  },
  stackCard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  stackCardBack: {
    transform: [
      { rotate: "-5deg" },
      { translateY: -12 },
      { translateX: -8 },
      { scale: 0.92 },
    ],
    opacity: 0.5,
    zIndex: 1,
  },
  stackCardMiddle: {
    transform: [
      { rotate: "-2.5deg" },
      { translateY: -6 },
      { translateX: -4 },
      { scale: 0.96 },
    ],
    opacity: 0.75,
    zIndex: 2,
  },
  stackCardTop: {
    transform: [
      { rotate: "0deg" },
      { translateY: 0 },
      { translateX: 0 },
      { scale: 1 },
    ],
    opacity: 1,
    zIndex: 3,
  },
  swipeCard: {
    flex: 1,
    borderRadius: radii.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    backgroundColor: "rgba(255, 255, 255, 0.10)",
  },
  swipeImageWrap: {
    flex: 2,
    backgroundColor: colors.white05,
  },
  swipeImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  swipeImagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white05,
  },
  swipeInfoPanel: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: "center",
    gap: spacing.xs,
    backgroundColor: "rgba(255, 255, 255, 0.10)",
  },
  swipeCategory: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    lineHeight: 16,
    color: colors.white65,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  swipeTitle: {
    fontSize: fontSizes["2xl"],
    fontWeight: fontWeights.bold,
    lineHeight: 30,
    color: colors.white,
  },
  swipeDate: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    lineHeight: 22,
    color: colors.white65,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  controlButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radii.full,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
  },
  controlButtonSmall: {
    width: 44,
    height: 44,
  },
  controlButtonMedium: {
    width: 52,
    height: 52,
  },
  skipButton: {
    borderColor: colors.tertiary,
  },
  interestedButton: {
    borderColor: colors.deluge,
    backgroundColor: colors.deluge,
  },
  draftActions: {
    gap: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.deluge,
    borderRadius: radii.full,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    lineHeight: 22,
    color: colors.white,
  },
  linkButton: {
    alignSelf: "center",
    paddingVertical: spacing.sm,
  },
  linkText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    lineHeight: 22,
    color: colors.white,
  },
  resultsList: {
    gap: spacing.md,
  },
  emptyText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.regular,
    lineHeight: 24,
    color: colors.white65,
    textAlign: "center",
  },
  prompt: {
    gap: spacing.sm,
    alignItems: "center",
    padding: spacing.base,
    borderRadius: radii.md,
    backgroundColor: colors.white05,
  },
  promptText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    lineHeight: 22,
    color: colors.white,
  },
  promptButton: {
    maxWidth: 220,
    backgroundColor: colors.deluge,
    borderRadius: radii.full,
    shadowOpacity: 0,
    elevation: 0,
  },
  finalisedText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    lineHeight: 22,
    color: colors.white65,
    textAlign: "center",
  },
});
