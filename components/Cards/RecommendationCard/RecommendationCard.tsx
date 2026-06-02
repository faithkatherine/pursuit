import React from "react";
import {
  Text,
  Image,
  View,
  StyleSheet,
  Pressable,
  Dimensions,
  Platform,
} from "react-native";
import colors from "themes/tokens/colors";
import typography, { fontSizes, fontWeights } from "themes/tokens/typography";
import { radii } from "themes/tokens/spacing";
import { useSaveToggle } from "hooks/useSaveToggle";
import { SaveButton } from "components/Buttons";
import { formatEventDate } from "utils/date";
import { getVariant } from "utils/categoryVariants";
import type { EventInfoFragment } from "graphql/generated/graphql";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = Platform.OS === "web" ? 360 : SCREEN_WIDTH * 0.7;
const IMAGE_HEIGHT = CARD_WIDTH * 0.57;
const CARD_PADDING = CARD_WIDTH * 0.054;
const SAVE_BUTTON_SIZE = CARD_WIDTH * 0.143;
const SAVE_BUTTON_OUTER = SAVE_BUTTON_SIZE * 1.5;

interface RecommendationCardProps {
  event: EventInfoFragment;
  onPress: () => void;
  /** Enable category-specific visual treatment (Made for your week only) */
  useVariant?: boolean;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  event,
  onPress,
  useVariant = false,
}) => {
  const variant = useVariant ? getVariant(event) : null;
  const heartColor = variant ? variant.accentColor : colors.deluge;

  const { isSaved, saving, handleSave } = useSaveToggle(
    event.id,
    event.isSaved ?? false,
  );

  const formattedDate = formatEventDate(event.date);
  const dateText =
    typeof formattedDate === "string"
      ? formattedDate
      : formattedDate.formattedDate;

  const cardBackground = variant ? variant.cardBackground : colors.deluge;
  const titleColor = variant
    ? variant.isDark
      ? colors.white
      : colors.thunder
    : colors.white;
  const subtitleColor = variant
    ? variant.isDark
      ? colors.white80
      : colors.aluminium
    : colors.white;
  const subtitleOpacity = variant ? 1 : 0.7;

  return (
    <Pressable
      onPress={onPress}
      testID="recommendation-card"
      style={[styles.container, { backgroundColor: cardBackground }]}
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
        <SaveButton
          onPress={handleSave}
          isSaved={isSaved}
          loading={saving}
          size="sm"
          fillColor={heartColor}
          style={[
            styles.saveButton,
            {
              width: SAVE_BUTTON_SIZE,
              height: SAVE_BUTTON_SIZE,
              borderRadius: SAVE_BUTTON_SIZE / 2,
              backgroundColor: colors.white,
            },
          ]}
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
          source={{ uri: event.image ?? undefined }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Free/Paid badge - top left */}
        <View
          style={[
            styles.priceBadge,
            variant ? { backgroundColor: variant.badgeBackground } : undefined,
          ]}
        >
          <Text
            style={[
              styles.priceText,
              variant ? { color: variant.accentColor } : undefined,
            ]}
          >
            {event.isFree ? "Free" : "Paid"}
          </Text>
        </View>

        {/* Date badge - bottom right corner */}
        <View style={styles.dateBadge}>
          <Text style={styles.dateBadgeLabel}>Date</Text>
          <Text style={styles.dateBadgeValue}>{dateText}</Text>
        </View>
      </View>

      {/* Text content below image */}
      <View style={styles.textContent}>
        <Text
          style={[styles.eventName, { color: titleColor }]}
          numberOfLines={1}
        >
          {event.name}
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: subtitleColor, opacity: subtitleOpacity },
          ]}
          numberOfLines={1}
        >
          {event.locationName}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Platform.OS === "web" ? "100%" : CARD_WIDTH,
    maxWidth: CARD_WIDTH,
    borderRadius: radii.lg,
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
  },
  imageWrapper: {
    borderRadius: radii.md,
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
    borderRadius: radii.xl,
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
    borderTopLeftRadius: radii.md,
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
    color: colors.white, // overridden inline when variant is active
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.white, // overridden inline when variant is active
    opacity: 0.7,
  },
});
