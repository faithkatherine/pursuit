import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@apollo/client";

import { Button } from "components/Buttons";
import { GET_EVENT } from "@shared/graphql/queries";
import type { EventInfoFragment, GetEventQuery } from "@shared/graphql/generated/graphql";
import colors from "@shared/constants/tokens/colors";
import typography, { fontSizes, fontWeights } from "@shared/constants/tokens/typography";
import { radii, spacing } from "@shared/constants/tokens/spacing";
import { formatEventDate } from "@shared/utils/date";

type CheckoutEvent = {
  id: string;
  name: string;
  locationName: string;
  date: string;
  price: number | null;
  isFree: boolean;
};

const fallbackCheckoutEvent: CheckoutEvent = {
  id: "preview-event",
  name: "Nocturnal Harmonies",
  locationName: "Theatre after dark",
  date: new Date().toISOString(),
  price: 3200,
  isFree: false,
};

const toCheckoutEvent = (
  event: EventInfoFragment | null | undefined,
  eventId: string | undefined,
): CheckoutEvent => {
  if (!event) {
    return { ...fallbackCheckoutEvent, id: eventId ?? fallbackCheckoutEvent.id };
  }

  return {
    id: event.id,
    name: event.name ?? fallbackCheckoutEvent.name,
    locationName: event.locationName ?? fallbackCheckoutEvent.locationName,
    date: event.date ?? fallbackCheckoutEvent.date,
    price: event.price ?? null,
    isFree: event.isFree ?? event.price === 0,
  };
};

export const Checkout = () => {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const router = useRouter();
  const [ticketCount, setTicketCount] = useState(1);
  const { data } = useQuery<GetEventQuery>(GET_EVENT, {
    variables: { id: eventId },
    skip: !eventId,
  });

  const event = toCheckoutEvent(data?.event?.event as EventType | null, eventId);
  const formattedDate = formatEventDate(event.date);
  const dateText =
    typeof formattedDate === "string"
      ? formattedDate
      : `${formattedDate.formattedDate}${
          formattedDate.formattedTime ? ` · ${formattedDate.formattedTime}` : ""
        }`;
  const unitPrice =
    event.isFree ? 0 : event.price ?? fallbackCheckoutEvent.price ?? 0;
  const serviceFee = unitPrice === 0 ? 0 : 180 * ticketCount;
  const total = unitPrice * ticketCount + serviceFee;

  return (
    <ScrollView
      style={styles.webPage}
      contentContainerStyle={styles.webScrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.webHeader}>
        <Pressable
          style={styles.webBackButton}
          onPress={() => router.replace(`/(protected)/events/${event.id}`)}
        >
          <Text style={styles.webBackButtonText}>Back to event</Text>
        </Pressable>
        <Text style={styles.webKicker}>Checkout</Text>
        <Text style={styles.webTitle}>Reserve your spot.</Text>
      </View>

      <View style={styles.webGrid}>
        <View style={styles.webMainCard}>
          <Text style={styles.webSectionTitle}>Tickets</Text>
          <View style={styles.webTicketRow}>
            <View>
              <Text style={styles.webTicketName}>General admission</Text>
              <Text style={styles.webTicketMeta}>
                {event.isFree
                  ? "Free entry"
                  : `KES ${unitPrice.toLocaleString()}`}{" "}
                · instant confirmation
              </Text>
            </View>
            <View style={styles.webStepper}>
              <Pressable
                style={styles.webStepperButton}
                onPress={() =>
                  setTicketCount((count) => Math.max(1, count - 1))
                }
              >
                <Text style={styles.webStepperText}>-</Text>
              </Pressable>
              <Text style={styles.webTicketCount}>{ticketCount}</Text>
              <Pressable
                style={styles.webStepperButton}
                onPress={() =>
                  setTicketCount((count) => Math.min(6, count + 1))
                }
              >
                <Text style={styles.webStepperText}>+</Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.webSectionTitle}>Payment</Text>
          <View style={styles.webPaymentOption}>
            <View style={styles.webRadio} />
            <View>
              <Text style={styles.webTicketName}>M-Pesa STK push</Text>
              <Text style={styles.webTicketMeta}>
                Enter phone number in the next API-backed step.
              </Text>
            </View>
          </View>

          {/* TODO: Replace frontend-only checkout with GraphQL booking mutation when endpoint is ready. */}
          <Button
            text={total === 0 ? "Confirm free ticket" : "Continue to payment"}
            variant="primary"
            onPress={() =>
              router.replace(`/(protected)/events/${event.id}/confirmation`)
            }
          />
        </View>

        <View style={styles.webSummaryCard}>
          <Text style={styles.webSummaryEyebrow}>Order summary</Text>
          <Text style={styles.webSummaryTitle}>{event.name}</Text>
          <Text style={styles.webSummaryMeta}>{dateText}</Text>
          <Text style={styles.webSummaryMeta}>{event.locationName}</Text>
          <View style={styles.webDivider} />
          <View style={styles.webTotalRow}>
            <Text style={styles.webTotalLabel}>Tickets</Text>
            <Text style={styles.webTotalValue}>
              KES {(unitPrice * ticketCount).toLocaleString()}
            </Text>
          </View>
          <View style={styles.webTotalRow}>
            <Text style={styles.webTotalLabel}>Service fee</Text>
            <Text style={styles.webTotalValue}>
              KES {serviceFee.toLocaleString()}
            </Text>
          </View>
          <View style={styles.webDivider} />
          <View style={styles.webTotalRow}>
            <Text style={styles.webGrandTotal}>Total</Text>
            <Text style={styles.webGrandTotal}>KES {total.toLocaleString()}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  webPage: {
    flex: 1,
    backgroundColor: colors.background,
  },
  webScrollContent: {
    width: "100%",
    maxWidth: 1200,
    marginHorizontal: "auto",
    paddingTop: 44,
    paddingBottom: 72,
  },
  webHeader: {
    marginBottom: 28,
    gap: 8,
  },
  webBackButton: {
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  webBackButtonText: {
    fontFamily: typography.label.fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.deluge,
  },
  webKicker: {
    fontFamily: typography.caption.fontFamily,
    fontSize: 12,
    fontWeight: fontWeights.bold,
    color: colors.deluge,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  webTitle: {
    fontFamily: typography.h1.fontFamily,
    fontSize: 42,
    fontWeight: fontWeights.heavy,
    color: colors.thunder,
    lineHeight: 48,
  },
  webGrid: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 28,
  },
  webMainCard: {
    flex: 1,
    minWidth: 0,
    gap: 18,
    padding: 28,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.white,
  },
  webSummaryCard: {
    width: 360,
    gap: 8,
    padding: 24,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.mistLavender,
  },
  webSectionTitle: {
    fontFamily: typography.h4.fontFamily,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.thunder,
  },
  webTicketRow: {
    borderWidth: 1,
    borderColor: colors.surfaceContainerHighest,
    borderRadius: radii.sm,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.base,
  },
  webTicketName: {
    fontFamily: typography.label.fontFamily,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.thunder,
  },
  webTicketMeta: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.graniteGray,
    marginTop: 4,
  },
  webStepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  webStepperButton: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  webStepperText: {
    fontFamily: typography.button.fontFamily,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.deluge,
  },
  webTicketCount: {
    minWidth: 20,
    textAlign: "center",
    fontFamily: typography.label.fontFamily,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    color: colors.thunder,
  },
  webPaymentOption: {
    borderWidth: 1,
    borderColor: colors.deluge,
    borderRadius: radii.sm,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.mistLavender,
  },
  webRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 5,
    borderColor: colors.deluge,
    backgroundColor: colors.white,
  },
  webSummaryEyebrow: {
    fontFamily: typography.caption.fontFamily,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    color: colors.deluge,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  webSummaryTitle: {
    fontFamily: typography.h4.fontFamily,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.thunder,
    lineHeight: 26,
  },
  webSummaryMeta: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.graniteGray,
  },
  webDivider: {
    height: 1,
    backgroundColor: colors.outlineVariant,
    marginVertical: 12,
  },
  webTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.base,
  },
  webTotalLabel: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.graniteGray,
  },
  webTotalValue: {
    fontFamily: typography.label.fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.thunder,
  },
  webGrandTotal: {
    fontFamily: typography.h4.fontFamily,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.thunder,
  },
});
