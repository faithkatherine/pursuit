import React, { useState } from "react";
import {
  Text,
  Image,
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import colors, { theme } from "themes/tokens/colors";
import typography, { fontSizes, fontWeights } from "themes/tokens/typography";
import { useSaveEvent, useUnsaveEvent } from "graphql/hooks";
import { Button } from "components/Buttons/Buttons";
import { HeartIcon } from "components/Icons/HeartIcon";
import { formatEventDate } from "utils/date";

export interface EventCardData {
  id: string;
  image: string;
  name: string;
  description: string;
  date: string;
  locationName: string;
  isFree: boolean;
  isSaved: boolean;
  reason?: string | null;
  source?: string | null;
  category: Array<{ id: string; name: string; icon?: string | null }>;
}

interface RecommendationCardProps {
  recommendation: EventCardData;
  onPress: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onPress,
}) => {
  const [isSaved, setIsSaved] = useState(recommendation.isSaved);
  const [saving, setSaving] = useState(false);
  const [saveEvent] = useSaveEvent();
  const [unsaveEvent] = useUnsaveEvent();

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      if (isSaved) {
        await unsaveEvent({ variables: { id: recommendation.id } });
        setIsSaved(false);
      } else {
        await saveEvent({ variables: { id: recommendation.id } });
        setIsSaved(true);
      }
    } catch {
      // revert on error
    } finally {
      setSaving(false);
    }
  };

  const categoryName = recommendation.category[0]?.name;

  const saveIcon = saving ? (
    <ActivityIndicator size="small" color={colors.deluge} />
  ) : (
    <HeartIcon size={18} color={colors.deluge} filled={isSaved} />
  );

  return (
    <View style={styles.shadowWrapper}>
      <Pressable
        onPress={onPress}
        testID="recommendation-card"
        style={styles.container}
      >
        <Image
          source={{ uri: recommendation.image }}
          testID="recommendation-card-image"
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
            <Button
              variant="secondary"
              icon={saveIcon}
              onPress={handleSave}
              circleDimensions={{
                width: 32,
                height: 32,
                borderRadius: 16,
                borderWidth: 0,
                backgroundColor: "transparent",
              }}
              style={styles.saveButton}
            />
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {recommendation.name}
          </Text>

          <Text style={styles.date}>
            {formatEventDate(recommendation.date, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </Text>

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
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
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
    backgroundColor: colors.delugeLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontFamily: typography.caption.fontFamily,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.white,
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
    borderRadius: 4,
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
