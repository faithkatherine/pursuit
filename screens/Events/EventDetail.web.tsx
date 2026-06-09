import { Image, Pressable, ScrollView, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "@apollo/client";
import { useRouter } from "expo-router";

import { GET_EVENT } from "graphql/queries";
import type { EventInfoFragment, EventType, GetEventQuery } from "graphql/generated/graphql";
import { Loading, Error } from "components/Layout";
import { RecommendationCard } from "components/Cards/RecommendationCard";
import { formatEventDate } from "utils/date";

interface EventDetailProps {
  eventId: string;
  onClose?: () => void;
}

const PURSUIT = {
  purple: "#7C5C9C",
  rose: "#E8B5B0",
  sage: "#B8C9A8",
  warmBg: "#FCF9F6",
  mist: "#EDE8F5",
  textPrimary: "#1A1A2E",
  textMuted: "#8A7F7A",
  border: "#E0D5CC",
  white: "#FFFFFF",
  roseBand: "#F5EDE8",
};

const stickyPosition = "sticky" as ViewStyle["position"];

type RelatedEvent = {
  id: string;
  title: string;
  category: string;
  venue: string;
  isoDate: string;
  price: number;
  imageUrl: string;
  accent: string;
};

// TODO: Replace mock data with related events GraphQL query when endpoint is ready
const MOCK_RELATED_EVENTS: RelatedEvent[] = [
  {
    id: "related-1",
    title: "Soul Sessions at Muze",
    category: "Music",
    venue: "Westlands",
    isoDate: "2026-06-18T20:00:00.000Z",
    price: 1800,
    imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=900",
    accent: PURSUIT.purple,
  },
  {
    id: "related-2",
    title: "Gallery Walk: New Kenyan Forms",
    category: "Arts",
    venue: "Nairobi Gallery",
    isoDate: "2026-06-20T15:00:00.000Z",
    price: 700,
    imageUrl: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=900",
    accent: PURSUIT.rose,
  },
  {
    id: "related-3",
    title: "Forest Picnic Club",
    category: "Outdoors",
    venue: "Karura Forest",
    isoDate: "2026-06-22T11:00:00.000Z",
    price: 0,
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900",
    accent: PURSUIT.sage,
  },
];

const relatedToEventInfo = (event: RelatedEvent): EventInfoFragment => ({
  __typename: "EventType",
  id: event.id,
  name: event.title,
  description: `${event.category} experience at ${event.venue}.`,
  image: event.imageUrl,
  date: event.isoDate,
  endDate: null,
  locationName: event.venue,
  moreDetailsUrl: null,
  price: event.price,
  ticketingEnabled: true,
  availableTickets: 12,
  goingCount: 28,
  hasGallery: false,
  galleryImages: "[]",
  galleryDescription: null,
  seriesName: null,
  isFree: event.price === 0,
  isSaved: false,
  hasConfirmedTicket: false,
  isEditorsPick: false,
  reason: null,
  source: null,
  curatorNote: null,
  curatorName: null,
  category: [
    {
      __typename: "CategoryType",
      id: event.category.toLowerCase(),
      name: event.category,
      icon: "",
      color: event.accent,
    },
  ],
});

const formatDate = (date: string): string => {
  const formatted = formatEventDate(date);
  return typeof formatted === "string"
    ? formatted
    : `${formatted.formattedDate}${formatted.formattedTime ? ` · ${formatted.formattedTime}` : ""}`;
};

export const EventDetail = ({ eventId, onClose }: EventDetailProps) => {
  const router = useRouter();
  const { data, loading, error } = useQuery<GetEventQuery>(GET_EVENT, {
    variables: { id: eventId },
    skip: !eventId,
  });
  const event = data?.event?.event as EventType | null | undefined;
  const related = MOCK_RELATED_EVENTS.map(relatedToEventInfo);

  if (loading) return <Loading />;
  if (error || !event) return <Error error="Failed to load event details" />;

  const categoryName = event.category[0]?.name ?? "Event";
  const dateText = formatDate(event.date);
  const priceLabel = event.isFree ? "Free" : `KES ${event.price.toLocaleString()}`;

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.heroBand}>
        {event.image ? (
          <Image source={{ uri: event.image }} style={styles.heroImage} resizeMode="cover" />
        ) : (
          <LinearGradient
            colors={[PURSUIT.textPrimary, PURSUIT.purple]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroImage}
          />
        )}
        <LinearGradient
          colors={["transparent", "rgba(26,26,46,0.9)"]}
          locations={[0.4, 1]}
          style={styles.heroOverlay}
        >
          <View style={styles.inner}>
            <Pressable style={styles.backButton} onPress={onClose ?? (() => router.back())}>
              <Text style={styles.backText}>Back</Text>
            </Pressable>
            <View style={styles.heroCopy}>
              <Text style={styles.badge}>{categoryName}</Text>
              <Text style={styles.heroTitle}>{event.name}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.contentBand}>
        <View style={styles.inner}>
          <View style={styles.detailGrid}>
            <View style={styles.leftColumn}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.bodyText}>
                {event.description ?? "A curated Pursuit experience with details from the organizer coming soon."}
              </Text>

              <Text style={styles.sectionTitle}>The Experience</Text>
              <Text style={styles.bodyText}>
                Expect a thoughtful crowd, a polished setting, and enough room
                to make the night your own. Pursuit will surface timing, venue,
                and host updates as the event gets closer.
              </Text>

              <View style={styles.hostCard}>
                <Text style={styles.hostEyebrow}>Host</Text>
                <Text style={styles.hostName}>{event.curatorName ?? "Pursuit Editors"}</Text>
                <Text style={styles.hostCopy}>
                  {event.curatorNote ?? "Selected for its atmosphere, timing, and fit for a good Nairobi plan."}
                </Text>
              </View>
            </View>

            <View style={styles.rightColumn}>
              <View style={styles.bookingCard}>
                <Text style={styles.bookingEyebrow}>Booking</Text>
                <Text style={styles.price}>{priceLabel}</Text>
                <View style={styles.bookingDivider} />
                <Text style={styles.bookingLabel}>Date & time</Text>
                <Text style={styles.bookingValue}>{dateText}</Text>
                <Text style={styles.bookingLabel}>Venue</Text>
                <Text style={styles.bookingValue}>{event.locationName ?? "Venue TBA"}</Text>
                <Pressable
                  style={styles.primaryButton}
                  onPress={() => router.push(`/(protected)/events/${event.id}/checkout`)}
                >
                  <Text style={styles.primaryButtonText}>Book Now</Text>
                </Pressable>
                <Pressable style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Save Event</Text>
                </Pressable>
                <View style={styles.shareRow}>
                  <Text style={styles.shareText}>Share</Text>
                  <Text style={styles.shareText}>Copy link</Text>
                  <Text style={styles.shareText}>Invite</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.moreBand}>
        <View style={styles.inner}>
          <Text style={styles.sectionTitle}>More Like This</Text>
          <View style={styles.moreGrid}>
            {related.map((item) => (
              <View key={item.id} style={styles.relatedCard}>
                <RecommendationCard
                  event={item}
                  useVariant
                  onPress={() => router.push(`/(protected)/events/${item.id}`)}
                />
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: PURSUIT.warmBg,
  },
  heroBand: {
    width: "100%",
    height: 480,
    backgroundColor: PURSUIT.textPrimary,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    paddingBottom: 36,
  },
  inner: {
    width: "100%",
    maxWidth: 1200,
    marginHorizontal: "auto",
    paddingHorizontal: 24,
  },
  backButton: {
    position: "absolute",
    top: -380,
    left: 24,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  backText: {
    fontFamily: "Work Sans",
    fontSize: 13,
    fontWeight: "600",
    color: PURSUIT.purple,
  },
  heroCopy: {
    maxWidth: 780,
  },
  badge: {
    alignSelf: "flex-start",
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: PURSUIT.mist,
    color: PURSUIT.purple,
    fontFamily: "Work Sans",
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  heroTitle: {
    fontFamily: "Poppins",
    fontSize: 44,
    fontWeight: "700",
    lineHeight: 52,
    color: PURSUIT.white,
  },
  contentBand: {
    width: "100%",
    backgroundColor: PURSUIT.warmBg,
    paddingVertical: 48,
  },
  detailGrid: {
    flexDirection: "row",
    gap: 40,
  },
  leftColumn: {
    flex: 0.6,
    gap: 16,
  },
  rightColumn: {
    flex: 0.4,
  },
  sectionTitle: {
    fontFamily: "Poppins",
    fontSize: 22,
    fontWeight: "700",
    color: PURSUIT.textPrimary,
    marginBottom: 12,
  },
  bodyText: {
    maxWidth: 680,
    fontFamily: "Work Sans",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 26,
    color: PURSUIT.textPrimary,
    marginBottom: 24,
  },
  hostCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: PURSUIT.border,
    backgroundColor: PURSUIT.white,
    padding: 20,
  },
  hostEyebrow: {
    fontFamily: "Work Sans",
    fontSize: 12,
    fontWeight: "600",
    color: PURSUIT.purple,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  hostName: {
    marginTop: 8,
    fontFamily: "Poppins",
    fontSize: 18,
    fontWeight: "700",
    color: PURSUIT.textPrimary,
  },
  hostCopy: {
    marginTop: 8,
    fontFamily: "Work Sans",
    fontSize: 14,
    color: PURSUIT.textMuted,
    lineHeight: 22,
  },
  bookingCard: {
    position: stickyPosition,
    top: 88,
    borderRadius: 16,
    backgroundColor: PURSUIT.white,
    padding: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
  },
  bookingEyebrow: {
    fontFamily: "Work Sans",
    fontSize: 12,
    fontWeight: "600",
    color: PURSUIT.purple,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  price: {
    marginTop: 8,
    fontFamily: "Poppins",
    fontSize: 30,
    fontWeight: "700",
    color: PURSUIT.textPrimary,
  },
  bookingDivider: {
    height: 1,
    backgroundColor: PURSUIT.border,
    marginVertical: 18,
  },
  bookingLabel: {
    fontFamily: "Work Sans",
    fontSize: 12,
    fontWeight: "600",
    color: PURSUIT.textMuted,
    marginBottom: 4,
  },
  bookingValue: {
    fontFamily: "Work Sans",
    fontSize: 15,
    fontWeight: "600",
    color: PURSUIT.textPrimary,
    marginBottom: 14,
  },
  primaryButton: {
    alignItems: "center",
    borderRadius: 999,
    backgroundColor: PURSUIT.purple,
    paddingVertical: 14,
    marginTop: 4,
  },
  primaryButtonText: {
    fontFamily: "Work Sans",
    fontSize: 15,
    fontWeight: "600",
    color: PURSUIT.white,
  },
  secondaryButton: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: PURSUIT.purple,
    paddingVertical: 13,
    marginTop: 10,
  },
  secondaryButtonText: {
    fontFamily: "Work Sans",
    fontSize: 15,
    fontWeight: "600",
    color: PURSUIT.purple,
  },
  shareRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  shareText: {
    fontFamily: "Work Sans",
    fontSize: 13,
    fontWeight: "600",
    color: PURSUIT.textMuted,
  },
  moreBand: {
    width: "100%",
    backgroundColor: PURSUIT.roseBand,
    paddingVertical: 48,
  },
  moreGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  relatedCard: {
    width: "31.7%",
    minWidth: 280,
    flexGrow: 1,
  },
});
