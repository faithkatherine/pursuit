import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  Pressable,
  Share,
  Alert,
  BackHandler,
  Animated,
  Easing,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@apollo/client";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { RecommendationCard } from "components/Cards/RecommendationCard";
import { TicketCard } from "components/Payments";
import { Error as LayoutError } from "components/Layout";
import { GET_EVENT, GET_EVENTS } from "graphql/queries";
import type { EventInfoFragment, GetEventQuery, GetEventsQuery } from "graphql/generated/graphql";
import { getTokens } from "utils/secureStorage";
import colors from "themes/tokens/colors";
import typography, { fontSizes, fontWeights } from "themes/tokens/typography";
import { radii, spacing } from "themes/tokens/spacing";
import { getVariant } from "utils/categoryVariants";
import { formatEventDate } from "utils/date";

interface OrderItem {
  tier_name: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
}

interface OrderDetail {
  id: string;
  subtotal: string;
  platform_fee: string;
  total: string;
  status: string;
  checkout_request_id: string;
  resuming: boolean;
  items: OrderItem[];
}

const getRestApiBaseUrl = (): string => {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!configuredUrl) return "http://localhost:8000";
  return configuredUrl.replace(/\/graphql\/?$/, "");
};

const API_BASE_URL = getRestApiBaseUrl();

const getReferenceNumber = (orderId: string): string =>
  `PRS-${orderId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;

export const Confirmation = () => {
  const { eventId, orderId = "", receipt = "" } = useLocalSearchParams<{
    eventId: string;
    orderId?: string;
    receipt?: string;
  }>();
  const router = useRouter();
  const pulse = useRef(new Animated.Value(0)).current;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [orderLoading, setOrderLoading] = useState(true);
  const [orderError, setOrderError] = useState<string | null>(null);

  const {
    data: eventData,
    loading: eventLoading,
    error: eventError,
  } = useQuery<GetEventQuery>(GET_EVENT, {
    variables: { id: eventId },
    skip: !eventId,
    fetchPolicy: "cache-and-network",
  });

  const event = eventData?.event?.event ?? null;
  const categoryId = event?.category?.[0]?.id;

  const { data: recommendationsData } = useQuery<GetEventsQuery>(GET_EVENTS, {
    variables: { category: categoryId ? [categoryId] : undefined, offset: 0, limit: 4 },
    skip: !categoryId,
    fetchPolicy: "cache-and-network",
  });

  const recommendations = useMemo(
    () =>
      (recommendationsData?.events?.events ?? [])
        .filter((item): item is EventInfoFragment => Boolean(item && item.id !== eventId))
        .slice(0, 3),
    [eventId, recommendationsData],
  );

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => sub.remove();
  }, []);

  useEffect(() => {
    pulse.setValue(0);
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  useEffect(() => {
    let isMounted = true;

    const fetchOrder = async () => {
      if (!orderId) {
        setOrderLoading(false);
        setOrderError("Missing order reference");
        return;
      }

      try {
        setOrderLoading(true);
        const tokens = await getTokens();
        if (!tokens.accessToken) {
          throw new Error("Sign in again to view your ticket.");
        }

        const response = await fetch(`${API_BASE_URL}/api/payments/orders/${orderId}/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Could not load ticket details");
        }

        const result = (await response.json()) as OrderDetail;
        if (isMounted) {
          setOrder(result);
          setOrderError(null);
        }
      } catch (error) {
        if (isMounted) {
          setOrderError(error instanceof Error ? error.message : "Could not load ticket details");
        }
      } finally {
        if (isMounted) {
          setOrderLoading(false);
        }
      }
    };

    void fetchOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  if (Platform.OS === "web") {
    return (
      <SafeAreaView style={styles.webContainer}>
        <View style={styles.webCard}>
          <Text style={styles.webTitle}>Ticket confirmation</Text>
          <Text style={styles.webBody}>
            Your confirmed ticket details are best viewed in the Pursuit mobile app.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (eventLoading || orderLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (eventError || !event) {
    return <LayoutError error="Failed to load event details" />;
  }

  if (orderError || !order) {
    return <LayoutError error={orderError ?? "Failed to load ticket details"} />;
  }

  const variant = getVariant(event);
  const categoryColor = variant?.accentColor ?? event.category?.[0]?.color ?? colors.primary;
  const categoryLabel = event.category?.[0]?.name?.toUpperCase() ?? "";
  const formattedDate = formatEventDate(event.date);
  const eventDate =
    typeof formattedDate === "string"
      ? formattedDate
      : `${formattedDate.formattedDate} · ${formattedDate.formattedTime}`;
  const referenceNumber = getReferenceNumber(orderId);
  const ticketItems = order.items.map((item) => ({
    tierName: item.tier_name,
    quantity: item.quantity,
  }));

  const pulseStyle = {
    opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
    transform: [
      {
        scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] }),
      },
    ],
  };

  const shareTicket = async () => {
    await Share.share({
      message: `${event.name} — Ref ${referenceNumber}`,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.checkContainer}>
            <Animated.View style={[styles.checkPulse, pulseStyle]} />
            <View style={styles.checkInner}>
              <MaterialCommunityIcons name="check-circle" size={48} color={colors.primary} />
            </View>
          </View>
          <Text style={styles.heroTitle}>You're going to</Text>
          <Text style={styles.eventTitle}>{event.name}</Text>
          <Text style={styles.heroBody}>
            Your ticket is confirmed and saved to your plans.
          </Text>
        </View>

        <View style={styles.ticketSection}>
          <TicketCard
            eventTitle={event.name}
            eventDate={eventDate}
            venue={event.locationName ?? "Venue TBA"}
            categoryLabel={categoryLabel}
            categoryColor={categoryColor}
            imageUri={event.image ?? undefined}
            items={ticketItems}
            orderId={orderId}
            receipt={receipt}
            qrValue={orderId}
            cutoutColor={colors.white}
          />
        </View>

        <View style={styles.receiptSection}>
          <Text style={styles.receiptText}>M-Pesa receipt {receipt}</Text>
          <Text style={styles.receiptSubtext}>A copy has been sent to your email.</Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={() => router.replace("/(protected)/(tabs)/plans")}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>View in Plans</Text>
          </Pressable>

          <View style={styles.secondaryRow}>
            <Pressable
              onPress={() => Alert.alert("Coming soon", "PDF download coming soon")}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Download PDF</Text>
            </Pressable>
            <Pressable onPress={shareTicket} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Share</Text>
            </Pressable>
          </View>
        </View>

        {recommendations.length > 0 ? (
          <View style={styles.recommendationsSection}>
            <Text style={styles.recommendationsTitle}>You might also like</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recommendations.map((item) => (
                <View key={item.id} style={styles.recommendationCardWrap}>
                  <RecommendationCard
                    event={item}
                    onPress={() =>
                      router.push({
                        pathname: "/(protected)/events/[eventId]",
                        params: { eventId: item.id },
                      })
                    }
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
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
  scrollContent: {
    paddingBottom: spacing["3xl"],
  },
  hero: {
    alignItems: "center",
    paddingTop: spacing["3xl"],
    paddingHorizontal: spacing.lg,
  },
  checkContainer: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
  },
  checkPulse: {
    position: "absolute",
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryFixed,
  },
  checkInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryFixed,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    ...typography.h4,
    marginTop: spacing.base,
    fontSize: fontSizes.xl,
    lineHeight: 28,
    fontWeight: fontWeights.bold,
    color: colors.onSurface,
  },
  eventTitle: {
    ...typography.h4,
    marginTop: 2,
    fontSize: fontSizes.xl,
    lineHeight: 28,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    fontStyle: "italic",
    textAlign: "center",
  },
  heroBody: {
    ...typography.bodySmall,
    maxWidth: 280,
    marginTop: spacing.sm,
    lineHeight: 20,
    color: colors.onSurfaceVariant,
    textAlign: "center",
  },
  ticketSection: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
  },
  receiptSection: {
    alignItems: "center",
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  receiptText: {
    ...typography.caption,
    lineHeight: 16,
    color: colors.onSurfaceVariant,
    textAlign: "center",
  },
  receiptSubtext: {
    ...typography.caption,
    marginTop: spacing.xs,
    lineHeight: 16,
    color: colors.onSurfaceVariant,
    textAlign: "center",
  },
  actions: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  primaryButton: {
    height: 56,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    ...typography.button,
    fontSize: fontSizes.base,
    lineHeight: 22,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  secondaryRow: {
    flexDirection: "row",
    marginTop: spacing.md,
    columnGap: spacing.md,
  },
  secondaryButton: {
    flex: 1,
    height: 48,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    ...typography.buttonSmall,
    lineHeight: 20,
    color: colors.primary,
  },
  recommendationsSection: {
    marginTop: spacing["2xl"],
    paddingBottom: spacing.xl,
  },
  recommendationsTitle: {
    ...typography.h4,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.base,
    fontSize: fontSizes.lg,
    lineHeight: 24,
    fontWeight: fontWeights.semibold,
    color: colors.onSurface,
  },
  recommendationCardWrap: {
    marginRight: spacing.base,
  },
});
