import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@apollo/client";

import { GET_EVENT } from "@shared/graphql/queries";
import type { EventInfoFragment, GetEventQuery } from "@shared/graphql/generated/graphql";
import colors from "@shared/constants/tokens/colors";
import typography, { fontSizes, fontWeights } from "@shared/constants/tokens/typography";
import { radii, spacing } from "@shared/constants/tokens/spacing";
import { formatEventDate } from "@shared/utils/date";

export const Confirmation = () => {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const router = useRouter();
  const { data } = useQuery<GetEventQuery>(GET_EVENT, {
    variables: { id: eventId },
    skip: !eventId,
  });

  const event = data?.event?.event as EventInfoFragment | null | undefined;
  const formattedDate = event ? formatEventDate(event.date) : null;
  const dateText =
    !formattedDate || typeof formattedDate === "string"
      ? formattedDate
      : `${formattedDate.formattedDate}${
          formattedDate.formattedTime ? ` · ${formattedDate.formattedTime}` : ""
        }`;

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <View style={styles.ticketStub}>
          <Text style={styles.stubText}>Pursuit</Text>
        </View>
        <View style={styles.ticketBody}>
          <Text style={styles.kicker}>Ticket confirmation</Text>
          <Text style={styles.title}>{event?.name ?? "You're booked"}</Text>
          <Text style={styles.meta}>{dateText ?? "Date confirmed in your plan"}</Text>
          <Text style={styles.meta}>{event?.locationName ?? "Location details coming soon"}</Text>

          <View style={styles.detailGrid}>
            <View style={styles.detailTile}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text style={styles.detailValue}>Confirmed</Text>
            </View>
            <View style={styles.detailTile}>
              <Text style={styles.detailLabel}>Tickets</Text>
              <Text style={styles.detailValue}>1</Text>
            </View>
            <View style={styles.detailTile}>
              <Text style={styles.detailLabel}>Ref</Text>
              <Text style={styles.detailValue}>{eventId?.slice(0, 8) ?? "PURSUIT"}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={styles.primaryButton}
              onPress={() => router.replace(`/(protected)/events/${eventId}`)}
            >
              <Text style={styles.primaryButtonText}>Back to event</Text>
            </Pressable>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => router.replace("/(protected)/(tabs)/plans")}
            >
              <Text style={styles.secondaryButtonText}>View plans</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    width: "100%",
    maxWidth: 900,
    marginHorizontal: "auto",
    paddingTop: 56,
    paddingBottom: 72,
  },
  card: {
    flexDirection: "row",
    minHeight: 420,
    borderRadius: radii.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.white,
    shadowColor: colors.thunder,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
  },
  ticketStub: {
    width: 180,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.deluge,
  },
  stubText: {
    transform: [{ rotate: "-90deg" }],
    fontFamily: typography.h2.fontFamily,
    fontSize: fontSizes["3xl"],
    fontWeight: fontWeights.heavy,
    color: colors.white,
  },
  ticketBody: {
    flex: 1,
    padding: 34,
    gap: 12,
  },
  kicker: {
    fontFamily: typography.caption.fontFamily,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: colors.deluge,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  title: {
    fontFamily: typography.h1.fontFamily,
    fontSize: 40,
    fontWeight: fontWeights.heavy,
    lineHeight: 46,
    color: colors.thunder,
  },
  meta: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.base,
    color: colors.graniteGray,
  },
  detailGrid: {
    flexDirection: "row",
    gap: 14,
    marginTop: 18,
  },
  detailTile: {
    flex: 1,
    padding: 16,
    borderRadius: radii.sm,
    backgroundColor: colors.mistLavender,
  },
  detailLabel: {
    fontFamily: typography.caption.fontFamily,
    fontSize: fontSizes.xs,
    color: colors.graniteGray,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  detailValue: {
    fontFamily: typography.label.fontFamily,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    color: colors.thunder,
    marginTop: 6,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: "auto",
  },
  primaryButton: {
    borderRadius: radii.full,
    backgroundColor: colors.deluge,
    paddingHorizontal: 22,
    paddingVertical: 13,
  },
  primaryButtonText: {
    fontFamily: typography.button.fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
  secondaryButton: {
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.deluge,
    paddingHorizontal: 22,
    paddingVertical: 13,
  },
  secondaryButtonText: {
    fontFamily: typography.button.fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.deluge,
  },
});
