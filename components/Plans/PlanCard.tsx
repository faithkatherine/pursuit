import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import colors from "@shared/constants/tokens/colors";
import { fontSizes, fontWeights } from "@shared/constants/tokens/typography";
import { radii, spacing } from "@shared/constants/tokens/spacing";
import type { VoterInfoType } from "@shared/graphql/generated/graphql";
import { VoterAvatarRow } from "components/VoterAvatarRow";

interface PlanCardProps {
  // Date column
  dayNumber: string;
  month: string;
  dayName: string;
  daysFromNow?: string;

  // Event info
  title: string;
  time: string;
  venue: string;
  categoryLabel?: string;
  categoryColor: string;

  // Status
  isTicketed: boolean;
  ticketCount?: number;
  tierNames?: string[];
  statusLabel?: string;
  variant?: "default" | "frosted" | "voting";
  voters?: VoterInfoType[];
  interestedCount?: number;
  isWinner?: boolean;

  onPress: () => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  dayNumber,
  month,
  dayName,
  daysFromNow,
  title,
  time,
  venue,
  categoryLabel,
  categoryColor,
  isTicketed,
  statusLabel,
  variant = "default",
  voters = [],
  interestedCount = 0,
  isWinner = false,
  onPress,
}) => {
  const isVoting = variant === "voting";

  return (
    <View style={styles.row}>
      {!isVoting && (
        <View style={styles.dateColumn}>
          <Text style={styles.dayNumber}>{dayNumber}</Text>
          <Text style={styles.month}>{month}</Text>
          <Text style={styles.dayName}>{dayName}</Text>
          {daysFromNow && <Text style={styles.daysFromNow}>{daysFromNow}</Text>}
        </View>
      )}

      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          isVoting && styles.votingCard,
          { borderLeftColor: categoryColor },
          isWinner && styles.winnerCard,
          pressed && styles.cardPressed,
        ]}
      >
        <BlurView
          intensity={30}
          tint="light"
          pointerEvents="none"
          style={styles.cardBlur}
        />
        <View style={styles.cardContent}>
          {categoryLabel && (
            <Text style={styles.categoryLabel}>{categoryLabel}</Text>
          )}
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {time} · {venue}
          </Text>

          {isVoting && (
            <VoterAvatarRow
              voters={voters}
              interestedCount={interestedCount}
            />
          )}

          {!isVoting && statusLabel && (
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusBadge,
                  statusLabel === 'SAVED'
                    ? styles.statusBadgeSaved
                    : isTicketed
                    ? styles.statusBadgeTicketed
                    : styles.statusBadgeGoing,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    statusLabel === 'SAVED'
                      ? styles.statusTextSaved
                      : isTicketed
                      ? styles.statusTextTicketed
                      : styles.statusTextGoing,
                  ]}
                >
                  {statusLabel}
                </Text>
              </View>
            </View>
          )}
        </View>

        {!isVoting && (
          <Pressable style={styles.openButton} onPress={onPress}>
            <Text style={styles.openButtonText}>Open</Text>
          </Pressable>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingVertical: spacing.none,
    alignItems: "flex-start",
  },
  dateColumn: {
    width: 56,
    marginRight: 16,
  },
  dayNumber: {
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 37,
    color: colors.white,
  },
  month: {
    fontSize: 11,
    fontWeight: fontWeights.bold,
    lineHeight: 15,
    color: colors.white,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 2,
  },
  dayName: {
    fontSize: 11,
    fontWeight: fontWeights.regular,
    lineHeight: 15,
    color: colors.white,
    marginTop: 2,
  },
  daysFromNow: {
    fontSize: 11,
    fontWeight: fontWeights.regular,
    lineHeight: 15,
    color: colors.white65,
    fontStyle: "italic",
    marginTop: 2,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white02,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
    borderLeftWidth: 4,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  votingCard: {
    borderLeftWidth: 0,
  },
  winnerCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.deluge,
  },
  cardPressed: {
    opacity: 0.7,
  },
  cardBlur: {
    ...StyleSheet.absoluteFillObject,
  },
  cardContent: {
    flex: 1,
    flexShrink: 1,
  },
  categoryLabel: {
    fontSize: 9,
    fontWeight: fontWeights.bold,
    lineHeight: 13,
    color: colors.white65,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    lineHeight: 23,
    color: colors.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: 21,
    color: colors.white65,
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  statusBadgeTicketed: {
    backgroundColor: colors.sage,
  },
  statusBadgeGoing: {
    backgroundColor: colors.primaryFixed,
  },
  statusBadgeSaved: {
    backgroundColor: colors.deluge,
  },
  statusText: {
    fontSize: 10,
    fontWeight: fontWeights.bold,
    lineHeight: 14,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statusTextTicketed: {
    color: colors.forest,
  },
  statusTextGoing: {
    color: colors.deluge,
  },
  statusTextSaved: {
    color: colors.white,
  },
  openButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
    marginLeft: 16,
    flexShrink: 0,
  },
  openButtonText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    lineHeight: 19,
    color: colors.white,
  },
});
