import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  BackHandler,
  Animated,
  Easing,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery, gql } from "@apollo/client";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { PaymentMethodRow, TicketStepper, OrderSummaryRow, PhoneInput } from "components/Payments";
import { Error, Loading } from "components/Layout";
import type { EventInfoFragment } from "graphql/generated/graphql";
import { usePayment } from "hooks/usePayment";
import { useAuth } from "providers/AuthProvider";
import colors from "themes/tokens/colors";
import typography, { fontSizes, fontWeights } from "themes/tokens/typography";
import { radii, spacing } from "themes/tokens/spacing";
import { getCategorySlug, getVariant } from "utils/categoryVariants";
import { formatEventDate } from "utils/date";

interface TicketTier {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  available: number;
  capacity?: number | null;
  isActive: boolean;
  sortOrder: number;
}

interface CheckoutEvent {
  id: string;
  name: string;
  date: string;
  endDate?: string | null;
  venue?: string | null;
  locationName?: string | null;
  image?: string | null;
  price: number;
  availableTickets?: number | null;
  category: Array<{ id: string; name: string; color: string }>;
  ticketTiers?: TicketTier[] | null;
}

interface GetEventWithTiersData {
  event?: {
    ok: boolean;
    event?: CheckoutEvent | null;
  } | null;
}

const GET_EVENT_WITH_TIERS = gql`
  query GetEventWithTiers($id: ID!) {
    event(id: $id) {
      ok
      event {
        id
        name
        date
        endDate
        venue: locationName
        locationName
        image
        price
        availableTickets
        category {
          id
          name
          color
        }
        ticketTiers {
          id
          name
          description
          price
          available
          capacity
          isActive
          sortOrder
        }
      }
    }
  }
`;

const formatKES = (amount: number): string =>
  new Intl.NumberFormat("en-KE", {
    maximumFractionDigits: 0,
  }).format(amount);

const getMaskedPhone = (phoneNumber: string): string => {
  if (phoneNumber.length < 7) return phoneNumber;
  return `${phoneNumber.slice(0, 4)} ··· ${phoneNumber.slice(-3)}`;
};

export const Checkout = () => {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const profilePhone = user?.profile?.phoneNumber ?? "";

  const [tierQuantities, setTierQuantities] = useState<Record<number, number>>({});
  const [phoneInput, setPhoneInput] = useState(
    profilePhone.startsWith("254") ? "0" + profilePhone.slice(3) : profilePhone,
  );
  const [normalisedPhone, setNormalisedPhone] = useState(
    profilePhone.startsWith("254") ? profilePhone : "",
  );
  const [userDetails, setUserDetails] = useState({
    name: user?.name ?? user?.fullName ?? user?.firstName ?? "",
    email: user?.email ?? "",
  });
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  const pulse = useRef(new Animated.Value(0)).current;
  const dotOne = useRef(new Animated.Value(0)).current;
  const dotTwo = useRef(new Animated.Value(0)).current;
  const dotThree = useRef(new Animated.Value(0)).current;
  const payment = usePayment();

  const { data, loading, error } = useQuery<GetEventWithTiersData>(GET_EVENT_WITH_TIERS, {
    variables: { id: eventId },
    skip: !eventId,
    fetchPolicy: "cache-and-network",
  });

  const event = data?.event?.event ?? null;

  const tiers = useMemo<TicketTier[]>(() => {
    if (event?.ticketTiers?.length) {
      return [...event.ticketTiers]
        .filter((tier) => tier.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    }

    if (!event) return [];

    return [
      {
        id: Number(event.id),
        name: "General Admission",
        description: null,
        price: Number(event.price),
        available: event.availableTickets ?? 10,
        capacity: event.availableTickets ?? 10,
        isActive: true,
        sortOrder: 0,
      },
    ];
  }, [event]);

  const selectedTiers = useMemo(
    () =>
      Object.entries(tierQuantities)
        .filter(([, qty]) => qty > 0)
        .map(([id, quantity]) => ({ tier_id: Number(id), quantity })),
    [tierQuantities],
  );

  const subtotal = useMemo(
    () =>
      tiers.reduce((sum, tier) => {
        return sum + Number(tier.price) * (tierQuantities[tier.id] ?? 0);
      }, 0),
    [tierQuantities, tiers],
  );

  const eventForCategory = event as unknown as EventInfoFragment | null;
  const categorySlug = eventForCategory ? getCategorySlug(eventForCategory) : null;
  const variant = eventForCategory ? getVariant(eventForCategory) : null;
  const categoryColor = variant?.accentColor ?? event?.category?.[0]?.color ?? colors.primary;
  const categoryLabel = categorySlug ?? event?.category?.[0]?.name ?? "event";
  const formattedDate = event ? formatEventDate(event.date) : null;
  const formattedDateText =
    typeof formattedDate === "string" ? formattedDate : formattedDate?.formattedDate ?? "";
  const formattedTimeText =
    typeof formattedDate === "string" ? "" : formattedDate?.formattedTime ?? "";
  const venue = event?.venue ?? event?.locationName ?? "Venue TBA";
  const canPay =
    selectedTiers.length > 0 &&
    normalisedPhone.length === 12 &&
    userDetails.name.trim().length > 0 &&
    userDetails.email.includes("@");

  useEffect(() => {
    if (profilePhone) {
      setPhoneInput(profilePhone.startsWith("254") ? "0" + profilePhone.slice(3) : profilePhone);
      setNormalisedPhone(profilePhone.startsWith("254") ? profilePhone : "");
    }
  }, [profilePhone]);

  useEffect(() => {
    setUserDetails({
      name: user?.name ?? user?.fullName ?? user?.firstName ?? "",
      email: user?.email ?? "",
    });
  }, [user]);

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      Alert.alert("Leave checkout?", "Your progress will be lost.", [
        { text: "Cancel", style: "cancel" },
        { text: "Leave", style: "destructive", onPress: () => router.back() },
      ]);
      return true;
    });

    return () => sub.remove();
  }, [router]);

  useEffect(() => {
    if (payment.status === "paid" && payment.orderId) {
      router.push({
        pathname: "/(protected)/events/[eventId]/confirmation",
        params: {
          eventId,
          orderId: payment.orderId,
          receipt: payment.receipt ?? "",
        },
      });
    }
  }, [eventId, payment.orderId, payment.receipt, payment.status, router]);

  useEffect(() => {
    if (payment.error === "already_purchased") {
      router.replace("/(protected)/(tabs)/plans");
    }
  }, [payment.error, router]);

  useEffect(() => {
    if (payment.status !== "waiting") return;

    const pulseLoop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    );

    const createDotLoop = (value: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 300,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.delay(600 - delay),
        ]),
      );

    pulse.setValue(0);
    dotOne.setValue(0);
    dotTwo.setValue(0);
    dotThree.setValue(0);
    pulseLoop.start();
    const dotLoops = [
      createDotLoop(dotOne, 0),
      createDotLoop(dotTwo, 200),
      createDotLoop(dotThree, 400),
    ];
    dotLoops.forEach((loop) => loop.start());

    return () => {
      pulseLoop.stop();
      dotLoops.forEach((loop) => loop.stop());
    };
  }, [dotOne, dotThree, dotTwo, payment.status, pulse]);

  const incrementTier = (tierId: number) => {
    const tier = tiers.find((item) => item.id === tierId);
    if (!tier) return;
    const current = tierQuantities[tierId] ?? 0;
    const effectiveMax = Math.min(tier.available, 10);
    if (current >= effectiveMax) return;
    setTierQuantities((prev) => ({
      ...prev,
      [tierId]: current + 1,
    }));
  };

  const decrementTier = (tierId: number) => {
    setTierQuantities((prev) => ({
      ...prev,
      [tierId]: Math.max(0, (prev[tierId] ?? 0) - 1),
    }));
  };

  const startPayment = async () => {
    if (!eventId) return;
    await payment.initiate(Number(eventId), normalisedPhone, selectedTiers, userDetails);
  };

  const renderEventSummary = (compact = false) => {
    if (!event) return null;

    return (
      <View style={[styles.eventCard, compact && styles.compactEventCard]}>
        {event.image ? (
          <Image source={{ uri: event.image }} style={styles.eventImage} />
        ) : (
          <View style={styles.eventImagePlaceholder} />
        )}
        <View style={styles.eventInfo}>
          <Text style={styles.eventName} numberOfLines={2}>
            {event.name}
          </Text>
          <Text style={styles.eventMeta} numberOfLines={2}>
            {formattedDateText} · {formattedTimeText} · {venue}
          </Text>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
          <Text style={styles.categoryBadgeText}>{categoryLabel.toUpperCase()}</Text>
        </View>
      </View>
    );
  };

  if (Platform.OS === "web") {
    return (
      <SafeAreaView style={styles.webContainer}>
        <View style={styles.webCard}>
          <Text style={styles.webTitle}>Continue on the mobile app</Text>
          <Text style={styles.webBody}>
            Ticket checkout uses M-Pesa STK push, which is available in the Pursuit mobile app.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading && !event) {
    return <Loading />;
  }

  if (error || !event) {
    return <Error error="Failed to load event details" />;
  }

  const pulseStyle = {
    opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
    transform: [
      {
        scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] }),
      },
    ],
  };

  const dotStyle = (value: Animated.Value) => ({
    transform: [
      {
        translateY: value.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }),
      },
    ],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.onSurface} />
        </Pressable>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderEventSummary()}

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>TICKETS</Text>
          {tiers.map((tier) => (
            <TicketStepper
              key={tier.id}
              tierId={tier.id}
              tierName={tier.name}
              description={tier.description ?? undefined}
              price={Number(tier.price)}
              quantity={tierQuantities[tier.id] ?? 0}
              available={tier.available}
              onIncrement={incrementTier}
              onDecrement={decrementTier}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>YOUR DETAILS</Text>
          <TextInput
            placeholder="Your name"
            placeholderTextColor={colors.onSurfaceVariant}
            keyboardType="default"
            autoCapitalize="words"
            returnKeyType="next"
            value={userDetails.name}
            onChangeText={(text) => setUserDetails((prev) => ({ ...prev, name: text }))}
            style={styles.textInput}
          />
          <TextInput
            placeholder="your@email.com"
            placeholderTextColor={colors.onSurfaceVariant}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            value={userDetails.email}
            onChangeText={(text) => setUserDetails((prev) => ({ ...prev, email: text }))}
            style={styles.textInput}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>PAY WITH</Text>
          <PaymentMethodRow
            sublabel={
              normalisedPhone
                ? `Pay to ${getMaskedPhone(normalisedPhone)}`
                : "Enter your M-Pesa number below"
            }
          />
          <PhoneInput
            value={phoneInput}
            onChangeText={setPhoneInput}
            onNormalisedChange={setNormalisedPhone}
            error={payment.error && payment.error.toLowerCase().includes("phone") ? payment.error : null}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>ORDER SUMMARY</Text>
          <View style={styles.summaryRows}>
            {selectedTiers.map(({ tier_id, quantity }) => {
              const tier = tiers.find((item) => item.id === tier_id);
              if (!tier) return null;

              return (
                <OrderSummaryRow
                  key={tier_id}
                  label={`${tier.name} × ${quantity}`}
                  amount={Number(tier.price) * quantity}
                />
              );
            })}
            <View style={styles.divider} />
            <OrderSummaryRow label="Total" amount={subtotal} isTotal />
          </View>
        </View>

        <View style={styles.promoSection}>
          <Pressable onPress={() => setShowPromo((value) => !value)}>
            <Text style={styles.promoTrigger}>Have a promo code?</Text>
          </Pressable>
          {showPromo ? (
            <View style={styles.promoRow}>
              <TextInput
                placeholder="Enter code"
                placeholderTextColor={colors.onSurfaceVariant}
                value={promoCode}
                onChangeText={setPromoCode}
                autoCapitalize="characters"
                style={styles.promoInput}
              />
              <Pressable style={styles.applyButton}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.md }]}>
        {payment.status === "failed" && payment.error && payment.error !== "already_purchased" ? (
          <View style={styles.errorCard}>
            <MaterialCommunityIcons name="alert-circle-outline" size={20} color={colors.tertiary} />
            <Text style={styles.errorText}>{payment.error}</Text>
          </View>
        ) : null}
        <Pressable
          disabled={!canPay || payment.status === "initiating"}
          onPress={startPayment}
          style={[styles.payButton, (!canPay || payment.status === "initiating") && styles.disabledPayButton]}
        >
          {payment.status === "initiating" ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.payButtonText}>Pay KES {formatKES(subtotal)}</Text>
          )}
        </Pressable>
      </View>

      {payment.status === "waiting" ? (
        <View style={styles.waitingOverlay}>
          <SafeAreaView style={styles.waitingSafeArea}>
            {renderEventSummary(true)}
            <View style={styles.waitingContent}>
              <View style={styles.pulseContainer}>
                <Animated.View style={[styles.pulseRing, pulseStyle]} />
                <View style={styles.pulseDot}>
                  <MaterialCommunityIcons name="cellphone" size={32} color={colors.white} />
                </View>
              </View>
              <Text style={styles.waitingTitle}>Check your phone</Text>
              <Text style={styles.waitingBody}>
                We've sent an M-Pesa request to {getMaskedPhone(normalisedPhone)}. Enter your PIN to
                complete.
              </Text>
              <View style={styles.waitingDotsRow}>
                <Animated.View style={[styles.waitingDot, dotStyle(dotOne)]} />
                <Animated.View style={[styles.waitingDot, dotStyle(dotTwo)]} />
                <Animated.View style={[styles.waitingDot, dotStyle(dotThree)]} />
                <Text style={styles.waitingDotsText}>Waiting for confirmation...</Text>
              </View>
            </View>
            <View style={[styles.waitingActions, { paddingBottom: insets.bottom + spacing.md }]}>
              <Pressable onPress={payment.cancel} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Text style={styles.waitingHint}>
                If the prompt doesn't appear in 30 seconds, tap cancel and try again.
              </Text>
            </View>
          </SafeAreaView>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  webContainer: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing["2xl"],
  },
  webCard: {
    width: "100%",
    maxWidth: 480,
    padding: spacing["2xl"],
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.white,
  },
  webTitle: {
    ...typography.h3,
    lineHeight: 32,
    color: colors.onSurface,
    textAlign: "center",
  },
  webBody: {
    ...typography.body,
    marginTop: spacing.md,
    lineHeight: 24,
    color: colors.onSurfaceVariant,
    textAlign: "center",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outlineVariant,
    backgroundColor: colors.white,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    ...typography.h4,
    fontSize: fontSizes.lg,
    lineHeight: 24,
    fontWeight: fontWeights.semibold,
    color: colors.onSurface,
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  eventCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing.lg,
    marginTop: spacing.base,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLow,
  },
  compactEventCard: {
    marginBottom: spacing.xl,
  },
  eventImage: {
    width: 48,
    height: 48,
    borderRadius: radii.sm,
  },
  eventImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: radii.sm,
    backgroundColor: colors.surfaceContainer,
  },
  eventInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  eventName: {
    ...typography.labelLarge,
    fontSize: fontSizes.sm,
    lineHeight: 20,
    fontWeight: fontWeights.semibold,
    color: colors.onSurface,
  },
  eventMeta: {
    ...typography.caption,
    marginTop: 2,
    lineHeight: 16,
    color: colors.onSurfaceVariant,
  },
  categoryBadge: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
  },
  categoryBadgeText: {
    ...typography.captionBold,
    lineHeight: 16,
    color: colors.white,
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    ...typography.captionBold,
    marginBottom: spacing.md,
    lineHeight: 16,
    color: colors.onSurfaceVariant,
    letterSpacing: 1,
  },
  textInput: {
    ...typography.body,
    lineHeight: 24,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.white,
    color: colors.onSurface,
  },
  summaryRows: {
    gap: spacing.md,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: spacing.xs,
    backgroundColor: colors.outlineVariant,
    opacity: 0.3,
  },
  promoSection: {
    marginTop: spacing.base,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  promoTrigger: {
    ...typography.bodySmall,
    lineHeight: 20,
    color: colors.primary,
    textDecorationLine: "underline",
  },
  promoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  promoInput: {
    flex: 1,
    ...typography.body,
    lineHeight: 24,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    color: colors.onSurface,
    backgroundColor: colors.white,
  },
  applyButton: {
    height: 48,
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    ...typography.buttonSmall,
    lineHeight: 20,
    color: colors.white,
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.outlineVariant,
    backgroundColor: colors.white,
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.peachVeil,
  },
  errorText: {
    flex: 1,
    ...typography.bodySmall,
    marginLeft: spacing.sm,
    lineHeight: 20,
    color: colors.tertiary,
  },
  payButton: {
    width: "100%",
    height: 56,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledPayButton: {
    backgroundColor: colors.surfaceContainer,
    opacity: 0.5,
  },
  payButtonText: {
    ...typography.button,
    fontSize: fontSizes.base,
    lineHeight: 22,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  waitingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    backgroundColor: colors.white,
  },
  waitingSafeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  waitingContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  pulseContainer: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  pulseRing: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primaryFixed,
  },
  pulseDot: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  waitingTitle: {
    ...typography.h3,
    fontSize: fontSizes["2xl"],
    lineHeight: 32,
    fontWeight: fontWeights.bold,
    color: colors.onSurface,
  },
  waitingBody: {
    ...typography.body,
    maxWidth: 320,
    marginTop: spacing.md,
    lineHeight: 24,
    color: colors.onSurfaceVariant,
    textAlign: "center",
  },
  waitingDotsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xl,
  },
  waitingDot: {
    width: 6,
    height: 6,
    marginRight: spacing.xs,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  waitingDotsText: {
    ...typography.caption,
    marginLeft: spacing.xs,
    lineHeight: 16,
    color: colors.onSurfaceVariant,
  },
  waitingActions: {
    paddingHorizontal: spacing.lg,
  },
  cancelButton: {
    height: 48,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    ...typography.buttonSmall,
    lineHeight: 20,
    color: colors.primary,
  },
  waitingHint: {
    ...typography.caption,
    marginTop: spacing.md,
    lineHeight: 16,
    color: colors.onSurfaceVariant,
    textAlign: "center",
  },
});
