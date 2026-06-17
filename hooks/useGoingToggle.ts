import { useState } from "react";
import { useMutation, useApolloClient } from "@apollo/client";
import { MARK_GOING, UNMARK_GOING } from "graphql/queries";
import {
  MarkGoingMutation,
  UnmarkGoingMutation,
} from "graphql/generated/graphql";

export const useGoingToggle = (eventId: string, initialIsGoing: boolean) => {
  const client = useApolloClient();
  const [isGoing, setIsGoing] = useState(initialIsGoing);
  const [processing, setProcessing] = useState(false);

  const [markGoing] = useMutation<MarkGoingMutation>(MARK_GOING);
  const [unmarkGoing] = useMutation<UnmarkGoingMutation>(UNMARK_GOING);

  const handleToggle = async () => {
    if (processing) return;

    setProcessing(true);
    const previousState = isGoing;

    try {
      // Optimistic update
      setIsGoing(!isGoing);

      if (isGoing) {
        // Remove going status
        const { data } = await unmarkGoing({
          variables: { id: eventId },
        });

        if (data?.unmarkGoing?.ok) {
          // Update cache
          client.cache.modify({
            id: client.cache.identify({ __typename: "EventType", id: eventId }),
            fields: {
              isGoing() {
                return false;
              },
            },
          });
        } else {
          // Revert on failure
          setIsGoing(previousState);
        }
      } else {
        // Mark as going
        const { data } = await markGoing({
          variables: { id: eventId },
        });

        if (data?.markGoing?.ok) {
          // Update cache
          client.cache.modify({
            id: client.cache.identify({ __typename: "EventType", id: eventId }),
            fields: {
              isGoing() {
                return true;
              },
            },
          });
        } else {
          // Revert on failure
          setIsGoing(previousState);
        }
      }
    } catch (error) {
      console.error("Error toggling going status:", error);
      // Revert on error
      setIsGoing(previousState);
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
