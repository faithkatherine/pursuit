import { useState } from "react";
import { useMutation } from "@apollo/client";
import { Alert } from "react-native";
import { MARK_GOING, UNMARK_GOING, GET_UPCOMING_PLANS } from "@shared/graphql/queries";
import {
  MarkGoingMutation,
  UnmarkGoingMutation,
} from "@shared/graphql/generated/graphql";

/**
 * Shared going/not-going toggle logic for event detail screen.
 * - Mark going: optimisticResponse + refetchQueries (date-ordered list is hard to insert into)
 * - Unmark going: optimisticResponse + cache.modify (removal is easy)
 */
export const useGoingToggle = (eventId: string, initialIsGoing: boolean) => {
  const [isGoing, setIsGoing] = useState(initialIsGoing);
  const [processing, setProcessing] = useState(false);

  const [markGoing] = useMutation<MarkGoingMutation>(MARK_GOING);
  const [unmarkGoing] = useMutation<UnmarkGoingMutation>(UNMARK_GOING);

  const handleToggle = async () => {
    if (processing) return;

    setProcessing(true);
    const previousState = isGoing;
    const nextState = !isGoing;

    // Optimistic local state
    setIsGoing(nextState);

    try {
      if (isGoing) {
        // Unmark going: remove from lists with cache.modify
        await unmarkGoing({
          variables: { id: eventId },
          // Note: The mutation returns the full event with isGoing: false
          // Apollo will automatically update the cache entity
          update: (cache) => {
            // Remove from upcomingPlans and pastPlans
            cache.modify({
              fields: {
                upcomingPlans(existing: any = { ok: true, events: [] }) {
                  const eventRef = cache.identify({
                    __typename: "EventType",
                    id: eventId,
                  });
                  return {
                    ...existing,
                    events: (existing.events ?? []).filter(
                      (ref: any) => ref.__ref !== eventRef,
                    ),
                  };
                },
                pastPlans(existing: any = { ok: true, events: [] }) {
                  const eventRef = cache.identify({
                    __typename: "EventType",
                    id: eventId,
                  });
                  return {
                    ...existing,
                    events: (existing.events ?? []).filter(
                      (ref: any) => ref.__ref !== eventRef,
                    ),
                  };
                },
              },
            });
          },
        });
      } else {
        // Mark going: refetch because upcomingPlans is date-ordered
        await markGoing({
          variables: { id: eventId },
          // Note: The mutation returns the full event with isGoing: true
          // Apollo will automatically update the cache entity
          refetchQueries: [
            { query: GET_UPCOMING_PLANS, variables: { offset: 0, limit: 50 } },
          ],
          awaitRefetchQueries: false, // Don't block UI
        });
      }
    } catch (error) {
      console.error("Error toggling going status:", error);
      // Revert on error
      setIsGoing(previousState);
      Alert.alert(
        "Couldn't update status",
        "Something went wrong. Please try again.",
        [
          { text: "Retry", onPress: handleToggle },
          { text: "Cancel", style: "cancel" },
        ],
      );
    } finally {
      setProcessing(false);
    }
  };

  return {
    isGoing,
    processing,
    handleToggle,
  };
};
