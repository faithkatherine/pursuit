import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

import colors from "themes/tokens/colors";
import typography, { fontSizes, fontWeights } from "themes/tokens/typography";
import { radii, spacing } from "themes/tokens/spacing";

interface TicketCardProps {
  eventTitle: string;
  eventDate: string;
  venue: string;
  categoryLabel: string;
  categoryColor: string;
  imageUri?: string;
  items: Array<{ tierName: string; quantity: number }>;
  orderId: string;
  receipt: string;
  qrValue?: string;
  cutoutColor?: string;
  ticketNumber?: number;
  totalTickets?: number;
}

const getReferenceNumber = (orderId: string): string =>
  `PRS-${orderId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;

export const TicketCard = ({
  eventTitle,
  eventDate,
  venue,
  categoryLabel,
  categoryColor,
  imageUri,
  items,
  orderId,
  qrValue,
  cutoutColor = colors.white,
  ticketNumber,
  totalTickets,
}: TicketCardProps) => {
  const referenceNumber = getReferenceNumber(orderId);

  return (
    <View style={styles.container}>
      <View style={[styles.categoryBorder, { backgroundColor: categoryColor }]} />

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.eventImage} resizeMode="cover" />
      ) : (
        <View style={styles.imageFallback} />
      )}

      <View style={styles.infoSection}>
        <Text style={styles.categoryLabel}>{categoryLabel}</Text>
        <Text style={styles.eventTitle}>{eventTitle}</Text>
        <Text style={styles.eventDate}>{eventDate}</Text>
        <Text style={styles.venue}>{venue}</Text>
      </View>

      <View style={styles.perforation}>
        <View style={[styles.leftCutout, { backgroundColor: cutoutColor }]} />
        <View style={styles.dashedLine} />
        <View style={[styles.rightCutout, { backgroundColor: cutoutColor }]} />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.qrContainer}>
          {qrValue ? (
            <QRCode value={qrValue} size={100} backgroundColor={colors.white} />
          ) : (
            <View style={styles.qrPlaceholder}>
              <Text style={styles.qrPlaceholderText}>QR</Text>
            </View>
          )}
        </View>

        <View style={styles.referenceContent}>
          <Text style={styles.referenceLabel}>REFERENCE</Text>
          <Text style={styles.referenceNumber}>{referenceNumber}</Text>
          <View style={styles.referenceSpacer} />
          {items.map((item, index) => (
            <Text key={`${item.tierName}-${index}`} style={styles.ticketItem}>
              {item.quantity} × {item.tierName}
            </Text>
          ))}
          {totalTickets && totalTickets > 1 && ticketNumber ? (
            <Text style={styles.ticketCount}>
              Ticket {ticketNumber} of {totalTickets}
            </Text>
          ) : null}
          <View style={styles.referenceSpacer} />
          <Text style={styles.doorNote}>Show this at the door</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: colors.white,
    borderRadius: radii["2xl"],
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryBorder: {
    height: 4,
  },
  eventImage: {
    width: "100%",
    height: 140,
  },
  imageFallback: {
    width: "100%",
    height: 80,
    backgroundColor: colors.surfaceContainerLow,
  },
  infoSection: {
    padding: spacing.base,
  },
  categoryLabel: {
    ...typography.captionBold,
    lineHeight: 16,
    color: colors.onSurfaceVariant,
    letterSpacing: 1.2,
  },
  eventTitle: {
    ...typography.h4,
    marginTop: spacing.xs,
    fontSize: fontSizes.lg,
    lineHeight: 24,
    fontWeight: fontWeights.semibold,
    color: colors.onSurface,
  },
  eventDate: {
    ...typography.bodySmall,
    marginTop: spacing.xs,
    lineHeight: 20,
    color: colors.onSurfaceVariant,
  },
  venue: {
    ...typography.bodySmall,
    marginTop: 2,
    lineHeight: 20,
    color: colors.onSurfaceVariant,
  },
  perforation: {
    height: 24,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  leftCutout: {
    position: "absolute",
    left: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    zIndex: 2,
  },
  rightCutout: {
    position: "absolute",
    right: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    zIndex: 2,
  },
  dashedLine: {
    flex: 1,
    marginHorizontal: spacing.md,
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.outlineVariant,
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: spacing.base,
  },
  qrContainer: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  qrPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  qrPlaceholderText: {
    ...typography.captionBold,
    lineHeight: 16,
    color: colors.onSurfaceVariant,
  },
  referenceContent: {
    flex: 1,
    marginLeft: spacing.base,
  },
  referenceLabel: {
    ...typography.caption,
    lineHeight: 16,
    color: colors.onSurfaceVariant,
    letterSpacing: 1.2,
  },
  referenceNumber: {
    ...typography.labelLarge,
    marginTop: spacing.xs,
    fontSize: fontSizes.base,
    lineHeight: 22,
    fontWeight: fontWeights.bold,
    color: colors.primary,
  },
  referenceSpacer: {
    height: spacing.sm,
  },
  ticketItem: {
    ...typography.bodySmall,
    lineHeight: 20,
    color: colors.onSurfaceVariant,
  },
  ticketCount: {
    fontSize: 11,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  doorNote: {
    ...typography.caption,
    marginTop: spacing.xs,
    lineHeight: 16,
    color: colors.onSurfaceVariant,
  },
});
