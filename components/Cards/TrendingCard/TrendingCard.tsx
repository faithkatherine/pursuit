import React, { useState } from "react";
import {
  Text,
  Image,
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import colors from "themes/tokens/colors";
import typography, { fontSizes, fontWeights } from "themes/tokens/typography";
import { useSaveEvent, useUnsaveEvent } from "graphql/hooks";
import { Button } from "components/Buttons/Buttons";
import { HeartIcon } from "components/Icons/HeartIcon";
import { formatEventDate } from "utils/date";
import type { EventCardData } from "components/Cards/EventsCard";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.7;
const IMAGE_HEIGHT = CARD_WIDTH * 0.57;
const CARD_PADDING = CARD_WIDTH * 0.054;
const SAVE_BUTTON_SIZE = CARD_WIDTH * 0.143;
const SAVE_BUTTON_OUTER = SAVE_BUTTON_SIZE * 1.5;

interface TrendingCardProps {
  event: EventCardData;
  onPress: () => void;
}

export const TrendingCard: React.FC<TrendingCardProps> = ({
  event,
  onPress,
}) => {
  const [isSaved, setIsSaved] = useState(event.isSaved);
  const [saving, setSaving] = useState(false);
  const [saveEvent] = useSaveEvent();
  const [unsaveEvent] = useUnsaveEvent();

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      if (isSaved) {
        await unsaveEvent({ variables: { id: event.id } });
        setIsSaved(false);
      } else {
        await saveEvent({ variables: { id: event.id } });
        setIsSaved(true);
      }
    } catch {
      // revert on error
    } finally {
      setSaving(false);
    }
  };

  const saveIcon = saving ? (
    <ActivityIndicator size="small" color={colors.deluge} />
  ) : (
    <HeartIcon size={16} color={colors.deluge} filled={isSaved} />
  );

  return (
    <Pressable
      onPress={onPress}
      testID="trending-card"
      style={styles.container}
    >
      {/* Save button - top right with cutout from card background */}
      <View
        style={[
          styles.saveButtonOuter,
          {
            width: SAVE_BUTTON_OUTER,
            height: SAVE_BUTTON_OUTER,
            borderRadius: SAVE_BUTTON_OUTER / 2,
          },
        ]}
      >
        <Button
          variant="secondary"
          icon={saveIcon}
          onPress={handleSave}
          circleDimensions={{
            width: SAVE_BUTTON_SIZE,
            height: SAVE_BUTTON_SIZE,
            borderRadius: SAVE_BUTTON_SIZE / 2,
            borderWidth: 0,
            backgroundColor: colors.white,
          }}
          style={styles.saveButton}
        />
      </View>

      {/* Image area with inset */}
      <View
        style={[
          styles.imageWrapper,
          { margin: CARD_PADDING, height: IMAGE_HEIGHT },
        ]}
      >
        <Image
          source={{ uri: event.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Free/Paid badge - top left */}
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{event.isFree ? "Free" : "Paid"}</Text>
        </View>

        {/* Date badge - bottom right corner */}
        <View style={styles.dateBadge}>
          <Text style={styles.dateBadgeLabel}>Date</Text>
          <Text style={styles.dateBadgeValue}>
            {formatEventDate(event.date)}
          </Text>
        </View>
      </View>

      {/* Text content below image */}
      <View style={styles.textContent}>
        <Text style={styles.eventName} numberOfLines={1}>
          {event.name}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {event.locationName}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    borderRadius: 16,
    backgroundColor: colors.deluge,
    overflow: "visible",
  },
  saveButtonOuter: {
    position: "absolute",
    top: -SAVE_BUTTON_OUTER * 0.17,
    right: -SAVE_BUTTON_OUTER * 0.17,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  saveButton: {
    padding: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  imageWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  priceBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    zIndex: 1,
  },
  priceText: {
    fontFamily: typography.caption.fontFamily,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
  dateBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopLeftRadius: 12,
    alignItems: "center",
  },
  dateBadgeLabel: {
    fontFamily: typography.caption.fontFamily,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.black,
    opacity: 0.7,
  },
  dateBadgeValue: {
    fontFamily: typography.caption.fontFamily,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: colors.black,
  },
  textContent: {
    paddingHorizontal: 14,
    paddingTop: 2,
    paddingBottom: 14,
  },
  eventName: {
    fontFamily: typography.h4.fontFamily,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    color: colors.white,
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.white,
    opacity: 0.7,
  },
});
