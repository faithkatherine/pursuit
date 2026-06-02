import React from "react";
import { Text, Image, View, StyleSheet, Pressable } from "react-native";
import colors, { theme } from "themes/tokens/colors";
import typography, { fontSizes, fontWeights } from "themes/tokens/typography";
import { radii } from "themes/tokens/spacing";
import { SaveButton } from "components/Buttons";
import { formatEventDate } from "utils/date";
import type { EventInfoFragment } from "graphql/generated/graphql";
import { useSaveToggle } from "hooks/useSaveToggle";

interface TrendingCardProps {
  recommendation: EventInfoFragment;
  onPress: () => void;
}

export const TrendingCard: React.FC<TrendingCardProps> = ({
  recommendation,
  onPress,
}) => {
  const { isSaved, saving, handleSave } = useSaveToggle(
    recommendation.id,
    recommendation.isSaved ?? false,
  );

  const categoryName = recommendation.category[0]?.name;

  const formattedDate = formatEventDate(recommendation.date, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const dateText =
    typeof formattedDate === "string"
      ? formattedDate
      : formattedDate.formattedDate;

  return (
    <View style={styles.shadowWrapper}>
      <Pressable
        onPress={onPress}
        testID="trending-card"
        style={styles.container}
      >
        <Image
          source={{ uri: recommendation.image ?? undefined }}
          testID="trending-card-image"
          style={styles.image}
          resizeMode="cover"
        />

        {/* Content */}
        <View style={styles.content}>
          {/* Top row: category + save */}
          <View style={styles.topRow}>
            {categoryName ? (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{categoryName}</Text>
              </View>
            ) : (
              <View />
            )}
            <SaveButton
              onPress={handleSave}
              isSaved={isSaved}
              loading={saving}
              size="sm"
              fillColor={colors.deluge}
              style={[
                styles.saveButton,
                {
                  width: 32,
                  height: 32,
                  borderRadius: radii.lg,
                  backgroundColor: "transparent",
                },
              ]}
            />
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {recommendation.name}
          </Text>

          <Text style={styles.date}>{dateText}</Text>

          <View style={styles.bottomRow}>
            <Text style={styles.location} numberOfLines={1}>
              {recommendation.locationName}
            </Text>
            <View
              style={[
                styles.priceBadge,
                recommendation.isFree ? styles.freeBadge : styles.paidBadge,
              ]}
            >
              <Text
                style={[
                  styles.priceText,
                  recommendation.isFree ? styles.freeText : styles.paidText,
                ]}
              >
                {recommendation.isFree ? "Free" : "Paid"}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowWrapper: {
    borderRadius: radii.md,
    shadowColor: colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    flexDirection: "row",
    overflow: "hidden",
  },
  image: {
    width: 130,
    height: "auto",
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
    backgroundColor: colors.ghostWhite,
    gap: 4,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryBadge: {
    backgroundColor: "rgba(124, 92, 156, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  categoryText: {
    fontFamily: typography.caption.fontFamily,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.black,
  },
  saveButton: {
    padding: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  title: {
    fontFamily: typography.h4.fontFamily,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    color: theme.text.primary,
  },
  date: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.thunder,
  },
  location: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: theme.text.secondary,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  priceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.xs,
  },
  freeBadge: {
    backgroundColor: "rgba(52, 199, 89, 0.12)",
  },
  paidBadge: {
    backgroundColor: "rgba(124, 92, 156, 0.1)",
  },
  priceText: {
    fontFamily: typography.caption.fontFamily,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
  },
  freeText: {
    color: "rgb(52, 199, 89)",
  },
  paidText: {
    color: colors.deluge,
  },
});
