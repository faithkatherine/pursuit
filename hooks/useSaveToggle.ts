import { useState } from "react";
import { useSaveEvent, useUnsaveEvent } from "graphql/hooks";

/**
 * Shared save/unsave toggle logic for event cards.
 * Handles optimistic local state and reverts on error.
 */
export const useSaveToggle = (eventId: string, initialSaved: boolean) => {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);
  const [saveEvent] = useSaveEvent();
  const [unsaveEvent] = useUnsaveEvent();

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    const prev = isSaved;
    setIsSaved(!prev); // optimistic update
    try {
      if (prev) {
        await unsaveEvent({ variables: { id: eventId } });
      } else {
        await saveEvent({ variables: { id: eventId } });
      }
    } catch {
      setIsSaved(prev); // revert on error
    } finally {
      setSaving(false);
    }
  };

  return { isSaved, saving, handleSave };
};
