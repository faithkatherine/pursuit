import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { Error, Layout, Loading } from "components/Layout";
import type { EventInfoFragment } from "@shared/graphql/generated/graphql";
import { useHomeData } from "@shared/hooks/useHome";
import { useAuth } from "@mobile/providers/AuthProvider";
import { colors } from "@shared/constants/tokens/colors";
import { webTypography } from "@shared/constants/tokens/typography";
import { HomeGreeting } from "./components/HomeGreeting.web";
import { HomeHeroSplit } from "./components/HomeHeroSplit.web";
import { HomeCuratedGrid } from "./components/HomeCuratedGrid.web";
import { useHomeFilters } from "./hooks/useHomeFilters";

// ─── Layout constants ─────────────────────────────────────────
const MAX_CONTENT_WIDTH = 1200;
const CONTENT_PADDING_H = 48;
const HERO_HEIGHT = 520;
const FILTER_SIDEBAR_W = 220;
const EDITORIAL_PANEL_W = 340;
const BREAKPOINT_TABLET = 768;
const BREAKPOINT_DESKTOP = 1024;
const EMPTY_PADDING_Y = 64;
// ──────────────────────────────────────────────────────────────

const getGreetingWord = (greeting?: string | null) => {
  const normalized = greeting?.toLowerCase() ?? "";
  if (normalized.includes("evening")) return "evening";
  if (normalized.includes("afternoon")) return "afternoon";
  return "morning";
};

const getEditorialNote = (event?: EventInfoFragment | null) =>
  event?.curatorNote ??
  event?.description ??
  "A two-decade-old institution that still feels like a discovery. Bring sunglasses, bring tissues, leave by 11.";

const asEvents = (
  events: ReadonlyArray<EventInfoFragment | null> | null | undefined,
) => events?.filter((event): event is EventInfoFragment => event != null) ?? [];

export default function HomeWeb() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    filters,
    dateFilters,
    categoryFilters,
    locationFilters,
    toggleDate,
    toggleCategory,
    toggleLocation,
    resetFilters,
    filterEvents,
  } = useHomeFilters();
  const { data, loading, error } = useHomeData(filters.date);

  if (loading) return <Loading />;
  if (error) return <Error error={error.message || "Something went wrong"} />;

  const homeData = data?.getHome;
  if (!homeData) return <Loading />;

  const recommendations = filterEvents(asEvents(homeData.recommendations));
  const trending = filterEvents(asEvents(homeData.trending));
  const featuredEvent =
    homeData.editorsPick ?? recommendations[0] ?? trending[0] ?? null;
  const firstName = user?.firstName ?? "Faith";
  const greetingWord = getGreetingWord(homeData.greeting);
  const curatorNote = {
    // TODO: Pull curator note from editorial content API when available
    quote:
      "Half the city will tell you Wednesdays at the Alchemist are a tourist trap. They're wrong - Joey B's set last month was the closest thing to a homecoming Westlands has heard all year. Show up at 9, not 11.",
    author: "Wanjiru K.",
    role: "Nightlife Editor",
  };

  return (
    <Layout backgroundColor={colors.pursuitWarmBg} shouldShowTopInset={false}>
      <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
        <HomeGreeting firstName={firstName} greetingWord={greetingWord} />

        {featuredEvent ? (
          <HomeHeroSplit
            featuredEvent={featuredEvent}
            editorialNote={getEditorialNote(featuredEvent)}
            filters={filters}
            dateFilters={dateFilters}
            categoryFilters={categoryFilters}
            locationFilters={locationFilters}
            onToggleDate={toggleDate}
            onToggleCategory={toggleCategory}
            onToggleLocation={toggleLocation}
            onReset={resetFilters}
            onBook={() =>
              router.push(`/(protected)/events/${featuredEvent.id}/checkout`)
            }
            onSave={() =>
              router.push(`/(protected)/events/${featuredEvent.id}`)
            }
          />
        ) : (
          <View style={styles.emptyBand}>
            <View style={styles.inner}>
              <Text style={styles.emptyTitle}>No featured events yet</Text>
              <Text style={styles.emptyBody}>
                Check back soon for the next Pursuit pick.
              </Text>
            </View>
          </View>
        )}

        <HomeCuratedGrid
          title="Curated for you"
          events={recommendations}
          curatorNote={curatorNote}
          showCuratorNote
          onViewAll={() =>
            router.push({ pathname: "/explore", params: { section: "curated" } })
          }
          onEventPress={(eventId) =>
            router.push(`/(protected)/events/${eventId}`)
          }
        />

        <HomeCuratedGrid
          title="Trending"
          events={trending}
          onViewAll={() =>
            router.push({
              pathname: "/explore",
              params: { section: "trending" },
            })
          }
          onEventPress={(eventId) =>
            router.push(`/(protected)/events/${eventId}`)
          }
        />
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.pursuitWarmBg,
  },
  inner: {
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    marginHorizontal: "auto",
    paddingHorizontal: CONTENT_PADDING_H,
  },
  emptyBand: {
    width: "100%",
    backgroundColor: colors.pursuitWarmBg,
    paddingVertical: EMPTY_PADDING_Y,
  },
  emptyTitle: {
    fontFamily: webTypography.heading.fontFamily,
    fontSize: 24,
    fontWeight: webTypography.heading.fontWeight,
    color: colors.pursuitTextPrimary,
  },
  emptyBody: {
    marginTop: 8,
    fontFamily: webTypography.body.fontFamily,
    fontSize: 15,
    fontWeight: webTypography.body.fontWeight,
    color: colors.pursuitTextMuted,
  },
});
