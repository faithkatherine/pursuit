import { useState } from "react";
import { Alert } from "react-native";
import { useApolloClient } from "@apollo/client";
import { useSaveEvent, useUnsaveEvent } from "hooks/useEvents";

/**
 * Shared save/unsave toggle logic for event cards.
 * Uses optimisticResponse for immediate entity update + cache.modify for list surgery.
 */
export const useSaveToggle = (eventId: string, initialSaved: boolean) => {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);
  const client = useApolloClient();
  const [saveEvent] = useSaveEvent();
  const [unsaveEvent] = useUnsaveEvent();

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    const prev = isSaved;
    const next = !prev;

    // Optimistic local state
    setIsSaved(next);

    try {
      if (prev) {
        // Unsave: remove from list
        await unsaveEvent({
          variables: { id: eventId },
          // Note: The mutation returns the full event with isSaved: false
          // Apollo will automatically update the cache entity
          update: (cache) => {
            // Remove from savedEvents list
            cache.modify({
              fields: {
                savedEvents(existing: any = { ok: true, events: [] }) {
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
        // Save: add to list
        await saveEvent({
          variables: { id: eventId },
          // Note: The mutation returns the full event with isSaved: true
          // Apollo will automatically update the cache entity
          update: (cache) => {
            // Add to savedEvents list
            cache.modify({
              fields: {
                savedEvents(existing: any = { ok: true, events: [] }) {
                  const eventRef = {
                    __ref: cache.identify({
                      __typename: "EventType",
                      id: eventId,
                    }),
                  };
                  const alreadyPresent = (existing.events ?? []).some(
                    (ref: any) => ref.__ref === eventRef.__ref,
                  );
                  if (alreadyPresent) return existing;
                  return {
                    ...existing,
                    events: [eventRef, ...(existing.events ?? [])],
                  };
                },
              },
            });
          },
        });
      }
    } catch {
      // Roll back on error
      setIsSaved(prev);
      Alert.alert(
        "Couldn't save event",
        "Something went wrong. Please try again.",
        [
          { text: "Retry", onPress: handleSave },
          { text: "Cancel", style: "cancel" },
        ],
      );
    } finally {
      setSaving(false);
    }
  };

  return { isSaved, saving, handleSave };
};
