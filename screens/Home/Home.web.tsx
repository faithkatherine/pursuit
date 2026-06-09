import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { HeroCard, type HeroCardData } from "components/Cards/HeroCard";
import { RecommendationCard } from "components/Cards/RecommendationCard";
import { TrendingCard } from "components/Cards/TrendingCard";
import type { EventInfoFragment } from "graphql/generated/graphql";

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
  roseBand: "rgba(232,181,176,0.18)",
};

const FILTERS = ["Tonight", "This Weekend", "Next Week", "This Month"] as const;

type FilterLabel = (typeof FILTERS)[number];

type EventSummary = {
  id: string;
  title: string;
  category: string;
  venue: string;
  date: string;
  isoDate: string;
  price: string;
  numericPrice: number;
  imageUrl: string;
  accent: string;
};

// TODO: Replace with useHomeData() GraphQL hook when endpoint is ready
const MOCK_TRENDING_EVENTS: EventSummary[] = [
  {
    id: "1",
    title: "Jazz at The Alchemist",
    category: "Music",
    venue: "Westlands, Nairobi",
    date: "Fri 13 Jun",
    isoDate: "2026-06-13T19:00:00.000Z",
    price: "KES 1,500",
    numericPrice: 1500,
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900",
    accent: PURSUIT.purple,
  },
  {
    id: "2",
    title: "Rooftop Cinema: Nairobi Nights",
    category: "Film",
    venue: "Kilimani",
    date: "Sat 14 Jun",
    isoDate: "2026-06-14T18:30:00.000Z",
    price: "KES 900",
    numericPrice: 900,
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=900",
    accent: PURSUIT.rose,
  },
  {
    id: "3",
    title: "Karura Forest Morning Run",
    category: "Outdoors",
    venue: "Karura Forest",
    date: "Sun 15 Jun",
    isoDate: "2026-06-15T06:30:00.000Z",
    price: "Free",
    numericPrice: 0,
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900",
    accent: PURSUIT.sage,
  },
  {
    id: "4",
    title: "Ceramics and Coffee Market",
    category: "Markets",
    venue: "Lavington",
    date: "Sat 21 Jun",
    isoDate: "2026-06-21T10:00:00.000Z",
    price: "KES 500",
    numericPrice: 500,
    imageUrl: "https://images.unsplash.com/photo-1473187983305-f615310e7daa?w=900",
    accent: "#C99B72",
  },
  {
    id: "5",
    title: "Afro House Courtyard Session",
    category: "Nightlife",
    venue: "The Mall, Westlands",
    date: "Fri 20 Jun",
    isoDate: "2026-06-20T21:00:00.000Z",
    price: "KES 2,000",
    numericPrice: 2000,
    imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=900",
    accent: "#8B7FBC",
  },
  {
    id: "6",
    title: "Sunday Gallery Walk",
    category: "Arts",
    venue: "Nairobi Gallery",
    date: "Sun 22 Jun",
    isoDate: "2026-06-22T14:00:00.000Z",
    price: "KES 750",
    numericPrice: 750,
    imageUrl: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=900",
    accent: "#D4A99D",
  },
];

const toEventInfo = (event: EventSummary): EventInfoFragment => ({
  __typename: "EventType",
  id: event.id,
  name: event.title,
  description: `${event.category} experience at ${event.venue}.`,
  image: event.imageUrl,
  date: event.isoDate,
  endDate: null,
  locationName: event.venue,
  moreDetailsUrl: null,
  price: event.numericPrice,
  ticketingEnabled: true,
  availableTickets: 18,
  goingCount: 42,
  hasGallery: false,
  galleryImages: "[]",
  galleryDescription: null,
  seriesName: null,
  isFree: event.numericPrice === 0,
  isSaved: false,
  hasConfirmedTicket: false,
  isEditorsPick: event.id === "1",
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

const heroEvent: HeroCardData = {
  id: MOCK_TRENDING_EVENTS[0].id,
  name: MOCK_TRENDING_EVENTS[0].title,
  destination: MOCK_TRENDING_EVENTS[0].venue,
  startDate: MOCK_TRENDING_EVENTS[0].isoDate,
  endDate: MOCK_TRENDING_EVENTS[0].isoDate,
  coverImage: MOCK_TRENDING_EVENTS[0].imageUrl,
  curatorNote: "A warm, low-lit set for the kind of Friday that turns into a plan.",
  curatorName: "Pursuit editors",
};

const Home = () => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterLabel>("Tonight");
  const eventCards = useMemo(
    () => MOCK_TRENDING_EVENTS.map(toEventInfo),
    [],
  );
  const editorPicks = MOCK_TRENDING_EVENTS.slice(1, 4);
  const upcoming = MOCK_TRENDING_EVENTS.slice(2, 6);

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.greetingBand}>
        <View style={styles.inner}>
          <Text style={styles.greeting}>Good evening, Faith</Text>
          <Text style={styles.greetingSubtext}>What's happening in Nairobi tonight?</Text>
          <View style={styles.filterRow}>
            {FILTERS.map((filter) => {
              const selected = activeFilter === filter;
              return (
                <Pressable
                  key={filter}
                  style={[styles.filterPill, selected && styles.filterPillActive]}
                  onPress={() => setActiveFilter(filter)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selected && styles.filterTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.heroBand}>
        <View style={styles.inner}>
          <View style={styles.heroGrid}>
            <View style={styles.heroMain}>
              <HeroCard
                trip={heroEvent}
                isEditorsPick
                onPress={() => router.push(`/(protected)/events/${heroEvent.id}`)}
              />
            </View>
            <View style={styles.editorPanel}>
              <Text style={styles.editorHeading}>Editor's Picks</Text>
              {editorPicks.map((event, index) => (
                <Pressable
                  key={event.id}
                  style={[
                    styles.editorRow,
                    index < editorPicks.length - 1 && styles.editorRowBorder,
                  ]}
                  onPress={() => router.push(`/(protected)/events/${event.id}`)}
                >
                  <Image source={{ uri: event.imageUrl }} style={styles.editorThumb} />
                  <View style={styles.editorText}>
                    <Text style={styles.editorTitle} numberOfLines={2}>
                      {event.title}
                    </Text>
                    <Text style={styles.editorMeta}>{event.date}</Text>
                  </View>
                  <Text style={styles.pricePill}>{event.price}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.trendingBand}>
        <View style={styles.inner}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending in Nairobi</Text>
            <Pressable>
              <Text style={styles.seeAll}>See all →</Text>
            </Pressable>
          </View>
          <View style={styles.threeColumnGrid}>
            {eventCards.slice(0, 6).map((event) => (
              <View key={event.id} style={styles.recommendationCardShell}>
                <RecommendationCard
                  event={event}
                  useVariant
                  onPress={() => router.push(`/(protected)/events/${event.id}`)}
                />
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.forYouBand}>
        <View style={styles.inner}>
          <Text style={styles.sectionTitle}>For You</Text>
          <Text style={styles.sectionSubtext}>Based on your interests</Text>
          <View style={styles.threeColumnGrid}>
            {eventCards.slice(0, 3).map((event) => (
              <View
                key={event.id}
                style={[
                  styles.trendingCardAccent,
                  { borderLeftColor: event.category[0]?.color ?? PURSUIT.purple },
                ]}
              >
                <TrendingCard
                  recommendation={event}
                  onPress={() => router.push(`/(protected)/events/${event.id}`)}
                />
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.upcomingBand}>
        <View style={styles.inner}>
          <Text style={styles.sectionTitle}>Upcoming This Week</Text>
          <View style={styles.twoColumnGrid}>
            {upcoming.map((event) => (
              <Pressable
                key={event.id}
                style={styles.upcomingRow}
                onPress={() => router.push(`/(protected)/events/${event.id}`)}
              >
                <Image source={{ uri: event.imageUrl }} style={styles.upcomingImage} />
                <View style={styles.upcomingText}>
                  <Text style={styles.upcomingTitle}>{event.title}</Text>
                  <Text style={styles.upcomingVenue}>{event.venue}</Text>
                  <Text style={styles.upcomingDate}>{event.date}</Text>
                </View>
                <Text style={styles.pricePill}>{event.price}</Text>
              </Pressable>
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
    width: "100%",
    backgroundColor: PURSUIT.warmBg,
  },
  greetingBand: {
    width: "100%",
    backgroundColor: PURSUIT.mist,
    paddingTop: 40,
    paddingBottom: 24,
  },
  heroBand: {
    width: "100%",
    backgroundColor: PURSUIT.mist,
    paddingBottom: 48,
  },
  trendingBand: {
    width: "100%",
    backgroundColor: PURSUIT.warmBg,
    paddingVertical: 48,
  },
  forYouBand: {
    width: "100%",
    backgroundColor: PURSUIT.roseBand,
    paddingVertical: 48,
  },
  upcomingBand: {
    width: "100%",
    backgroundColor: PURSUIT.warmBg,
    paddingVertical: 48,
  },
  inner: {
    width: "100%",
    maxWidth: 1200,
    marginHorizontal: "auto",
    paddingHorizontal: 24,
  },
  greeting: {
    fontFamily: "Poppins",
    fontSize: 28,
    fontWeight: "700",
    color: PURSUIT.textPrimary,
  },
  greetingSubtext: {
    marginTop: 6,
    fontFamily: "Work Sans",
    fontSize: 16,
    fontWeight: "400",
    color: PURSUIT.textMuted,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 20,
  },
  filterPill: {
    borderWidth: 1,
    borderColor: PURSUIT.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterPillActive: {
    backgroundColor: PURSUIT.purple,
    borderColor: PURSUIT.purple,
  },
  filterText: {
    fontFamily: "Work Sans",
    fontSize: 14,
    fontWeight: "600",
    color: PURSUIT.textPrimary,
  },
  filterTextActive: {
    color: PURSUIT.white,
  },
  heroGrid: {
    flexDirection: "row",
    gap: 24,
  },
  heroMain: {
    flex: 0.65,
    minWidth: 0,
  },
  editorPanel: {
    flex: 0.35,
    minWidth: 300,
    borderRadius: 16,
    backgroundColor: PURSUIT.white,
    padding: 18,
  },
  editorHeading: {
    fontFamily: "Work Sans",
    fontSize: 13,
    fontWeight: "600",
    color: PURSUIT.purple,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  editorRow: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  editorRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: PURSUIT.border,
  },
  editorThumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  editorText: {
    flex: 1,
    minWidth: 0,
  },
  editorTitle: {
    fontFamily: "Poppins",
    fontSize: 15,
    fontWeight: "700",
    color: PURSUIT.textPrimary,
  },
  editorMeta: {
    marginTop: 3,
    fontFamily: "Work Sans",
    fontSize: 12,
    color: PURSUIT.textMuted,
  },
  pricePill: {
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: PURSUIT.mist,
    color: PURSUIT.purple,
    fontFamily: "Work Sans",
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "Poppins",
    fontSize: 20,
    fontWeight: "600",
    color: PURSUIT.textPrimary,
    marginBottom: 16,
  },
  sectionSubtext: {
    marginTop: -12,
    marginBottom: 16,
    fontFamily: "Work Sans",
    fontSize: 14,
    color: PURSUIT.textMuted,
  },
  seeAll: {
    fontFamily: "Work Sans",
    fontSize: 14,
    fontWeight: "600",
    color: PURSUIT.purple,
  },
  threeColumnGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  recommendationCardShell: {
    width: "31.7%",
    minWidth: 280,
    flexGrow: 1,
    borderRadius: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
  },
  trendingCardAccent: {
    width: "31.7%",
    minWidth: 280,
    flexGrow: 1,
    borderLeftWidth: 4,
    borderRadius: 12,
  },
  twoColumnGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  upcomingRow: {
    width: "48%",
    minWidth: 360,
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 12,
    backgroundColor: PURSUIT.white,
    padding: 14,
    borderWidth: 1,
    borderColor: PURSUIT.border,
  },
  upcomingImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  upcomingText: {
    flex: 1,
    minWidth: 0,
  },
  upcomingTitle: {
    fontFamily: "Poppins",
    fontSize: 15,
    fontWeight: "700",
    color: PURSUIT.textPrimary,
  },
  upcomingVenue: {
    marginTop: 4,
    fontFamily: "Work Sans",
    fontSize: 13,
    color: PURSUIT.textMuted,
  },
  upcomingDate: {
    marginTop: 4,
    fontFamily: "Work Sans",
    fontSize: 13,
    fontWeight: "600",
    color: PURSUIT.purple,
  },
});

export default Home;
