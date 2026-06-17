import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import colors from "themes/tokens/colors";
import { fontSizes, fontWeights } from "themes/tokens/typography";

interface UpcomingEventCardProps {
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

  onPress: () => void;
}

export const UpcomingEventCard: React.FC<UpcomingEventCardProps> = ({
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
  onPress,
}) => {
  return (
    <View style={styles.row}>
      {/* Date column */}
      <View style={styles.dateColumn}>
        <Text style={styles.dayNumber}>{dayNumber}</Text>
        <Text style={styles.month}>{month}</Text>
        <Text style={styles.dayName}>{dayName}</Text>
        {daysFromNow && <Text style={styles.daysFromNow}>{daysFromNow}</Text>}
      </View>

      {/* Card */}
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          { borderLeftColor: categoryColor },
          pressed && styles.cardPressed,
        ]}
      >
        <View style={styles.cardContent}>
          {categoryLabel && (
            <Text style={[styles.categoryLabel, { color: categoryColor }]}>
              {categoryLabel}
            </Text>
          )}
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {time} · {venue}
          </Text>

          {statusLabel && (
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: isTicketed
                      ? colors.sage
                      : colors.primaryFixed,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: isTicketed ? colors.forest : colors.deluge,
                    },
                  ]}
                >
                  {statusLabel}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Open button */}
        <Pressable style={styles.openButton} onPress={onPress}>
          <Text style={styles.openButtonText}>Open</Text>
        </Pressable>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingVertical: 16,
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
    color: colors.thunder,
  },
  month: {
    fontSize: 11,
    fontWeight: fontWeights.bold,
    lineHeight: 15,
    color: colors.aluminium,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 2,
  },
  dayName: {
    fontSize: 11,
    fontWeight: fontWeights.regular,
    lineHeight: 15,
    color: colors.aluminium,
    marginTop: 2,
  },
  daysFromNow: {
    fontSize: 11,
    fontWeight: fontWeights.regular,
    lineHeight: 15,
    color: colors.aluminium,
    fontStyle: "italic",
    marginTop: 2,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.7,
  },
  cardContent: {
    flex: 1,
  },
  categoryLabel: {
    fontSize: 9,
    fontWeight: fontWeights.bold,
    lineHeight: 13,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    lineHeight: 23,
    color: colors.thunder,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: 21,
    color: colors.aluminium,
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
    borderRadius: 999,
  },
  statusText: {
    fontSize: 10,
    fontWeight: fontWeights.bold,
    lineHeight: 14,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  openButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    marginLeft: 16,
  },
  openButtonText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    lineHeight: 19,
    color: colors.thunder,
  },
});
