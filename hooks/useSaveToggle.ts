import { useState } from "react";
import { Alert } from "react-native";
import { useApolloClient } from "@apollo/client";
import { useSaveEvent, useUnsaveEvent } from "graphql/hooks";
import { GET_HOME, GET_SAVED_EVENTS } from "graphql/queries";

/**
 * Shared save/unsave toggle logic for event cards.
 * Uses Apollo cache.modify for optimistic in-cache updates so home and plans
 * reflect the change without a full refetch.
 */
export const useSaveToggle = (eventId: string, initialSaved: boolean) => {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);
  const client = useApolloClient();
  const [saveEvent] = useSaveEvent();
  const [unsaveEvent] = useUnsaveEvent();

  const updateCache = (nowSaved: boolean) => {
    // 1. Mark the event's isSaved field everywhere it appears in the cache
    client.cache.modify({
      id: client.cache.identify({ __typename: "EventType", id: eventId }),
      fields: {
        isSaved: () => nowSaved,
      },
    });

    // 2. Update the savedEvents list in the cache
    if (nowSaved) {
      client.cache.modify({
        fields: {
          savedEvents(existing: any = { ok: true, events: [] }) {
            const eventRef = {
              __ref: client.cache.identify({
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
    } else {
      client.cache.modify({
        fields: {
          savedEvents(existing: any = { ok: true, events: [] }) {
            const eventRef = client.cache.identify({
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
    }
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    const prev = isSaved;
    const next = !prev;

    // Optimistic UI + cache
    setIsSaved(next);
    updateCache(next);

    try {
      if (prev) {
        await unsaveEvent({
          variables: { id: eventId },
          optimisticResponse: {
            unsaveEvent: {
              __typename: "SaveEventPayload" as any,
              ok: true,
              event: null,
              errors: null,
            },
          } as any,
        });
      } else {
        await saveEvent({
          variables: { id: eventId },
          optimisticResponse: {
            saveEvent: {
              __typename: "SaveEventPayload" as any,
              ok: true,
              event: null,
              errors: null,
            },
          } as any,
        });
      }
    } catch {
      // Roll back on error
      setIsSaved(prev);
      updateCache(prev);
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
