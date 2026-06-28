// ---------------------------------------------------------------------------
// Category variant map — keyed by category slug
//
// Design principle:
// - Light variants: tinted surfaces using accentColor at 8-14% opacity
// - Dark variant (concerts-and-nightlife): scroll content is white, so uses solid white + subtle dark tints
// ---------------------------------------------------------------------------

import { EventInfoFragment } from "@shared/graphql/generated/graphql";
import colors from "@shared/constants/tokens/colors";

type CategoryVariant = {
  // Original properties (used in RecommendationCard and other places)
  cardBackground: string;
  badgeBackground: string;
  accentColor: string;
  isDark: boolean;

  // EventDetail-specific properties
  colorBandBg: string;
  backButtonBg: string;
  backButtonIcon: string;
  titleContainerBg: string;
  titleTextColor: string;
  badgeTextColor: string;
  accentForeground: string;
  statTileBg: string;
  statTileLabelColor: string;
  statTileValueColor: string;
  curatorNoteBg: string;
  curatorNoteBorder: string;
  ctaBarBg: string;
  ctaForeground: string;
  ctaButtonBg: string;
  ctaButtonText: string;
};

const DEFAULT_VARIANT_KEY = "culture-and-arts";

export const categoryVariants: Record<string, CategoryVariant> = {
  "talks-and-ideas": {
    // Original properties
    cardBackground: colors.parchment,
    badgeBackground: colors.parchmentDeep,
    accentColor: colors.leather,
    isDark: false,
    // EventDetail properties
    colorBandBg: colors.parchment,
    backButtonBg: "rgba(255, 255, 255, 0.85)",
    backButtonIcon: colors.leather,
    titleContainerBg: `${colors.leather}14`,
    titleTextColor: colors.thunder,
    badgeTextColor: colors.leather,
    accentForeground: colors.leather,
    statTileBg: `${colors.leather}14`,
    statTileLabelColor: colors.graniteGray,
    statTileValueColor: colors.white,
    curatorNoteBg: `${colors.leather}14`,
    curatorNoteBorder: colors.leather,
    ctaBarBg: colors.parchment,
    ctaForeground: colors.leather,
    ctaButtonBg: colors.leather,
    ctaButtonText: colors.white,
  },
  "workshops-and-classes": {
    // Original properties
    cardBackground: colors.linen,
    badgeBackground: colors.bareBlush,
    accentColor: colors.tannin,
    isDark: false,
    // EventDetail properties
    colorBandBg: colors.linen,
    backButtonBg: "rgba(255, 255, 255, 0.85)",
    backButtonIcon: colors.tannin,
    titleContainerBg: `${colors.tannin}14`,
    titleTextColor: colors.thunder,
    badgeTextColor: colors.tannin,
    accentForeground: colors.tannin,
    statTileBg: `${colors.tannin}14`,
    statTileLabelColor: colors.graniteGray,
    statTileValueColor: colors.white,
    curatorNoteBg: `${colors.tannin}14`,
    curatorNoteBorder: colors.tannin,
    ctaBarBg: colors.linen,
    ctaForeground: colors.tannin,
    ctaButtonBg: colors.tannin,
    ctaButtonText: colors.white,
  },
  "concerts-and-nightlife": {
    // Original properties
    cardBackground: colors.midnightBlue,
    badgeBackground: `${colors.midnightBlue}95`,
    accentColor: colors.white,
    isDark: true,
    // EventDetail properties
    colorBandBg: colors.midnightBlue,
    backButtonBg: "rgba(255, 255, 255, 0.08)",
    backButtonIcon: colors.white,
    titleContainerBg: colors.white,
    titleTextColor: colors.thunder,
    badgeTextColor: colors.white,
    accentForeground: colors.midnightBlue,
    statTileBg: "rgba(26, 26, 46, 0.04)",
    statTileLabelColor: colors.graniteGray,
    statTileValueColor: colors.black,
    curatorNoteBg: "rgba(26, 26, 46, 0.04)",
    curatorNoteBorder: colors.midnightBlue,
    ctaBarBg: colors.midnightBlue,
    ctaForeground: colors.white,
    ctaButtonBg: colors.white,
    ctaButtonText: colors.midnightBlue,
  },
  "culture-and-arts": {
    // Original properties
    cardBackground: colors.mistLavender,
    badgeBackground: `${colors.mistLavender}95`,
    accentColor: colors.deluge,
    isDark: false,
    // EventDetail properties
    colorBandBg: colors.mistLavender,
    backButtonBg: "rgba(255, 255, 255, 0.85)",
    backButtonIcon: colors.deluge,
    titleContainerBg: `${colors.deluge}14`,
    titleTextColor: colors.thunder,
    badgeTextColor: colors.deluge,
    accentForeground: colors.deluge,
    statTileBg: `${colors.deluge}14`,
    statTileLabelColor: colors.graniteGray,
    statTileValueColor: colors.white,
    curatorNoteBg: `${colors.deluge}14`,
    curatorNoteBorder: colors.deluge,
    ctaBarBg: colors.mistLavender,
    ctaForeground: colors.deluge,
    ctaButtonBg: colors.deluge,
    ctaButtonText: colors.white,
  },
  "outdoors-and-active": {
    // Original properties
    cardBackground: colors.sageMist,
    badgeBackground: colors.sage,
    accentColor: colors.forest,
    isDark: false,
    // EventDetail properties
    colorBandBg: colors.sageMist,
    backButtonBg: "rgba(255, 255, 255, 0.85)",
    backButtonIcon: colors.forest,
    titleContainerBg: `${colors.forest}14`,
    titleTextColor: colors.white,
    badgeTextColor: colors.forest,
    accentForeground: colors.forest,
    statTileBg: `${colors.forest}14`,
    statTileLabelColor: colors.sageMist,
    statTileValueColor: colors.white,
    curatorNoteBg: `${colors.forest}14`,
    curatorNoteBorder: colors.forest,
    ctaBarBg: colors.sageMist,
    ctaForeground: colors.forest,
    ctaButtonBg: colors.forest,
    ctaButtonText: colors.white,
  },
  "food-and-drink": {
    // Original properties
    cardBackground: colors.peachVeil,
    badgeBackground: colors.shilo,
    accentColor: colors.terracotta,
    isDark: false,
    // EventDetail properties
    colorBandBg: colors.peachVeil,
    backButtonBg: "rgba(255, 255, 255, 0.85)",
    backButtonIcon: colors.terracotta,
    titleContainerBg: `${colors.terracotta}14`,
    titleTextColor: colors.thunder,
    badgeTextColor: colors.terracotta,
    accentForeground: colors.terracotta,
    statTileBg: `${colors.terracotta}14`,
    statTileLabelColor: colors.graniteGray,
    statTileValueColor: colors.white,
    curatorNoteBg: `${colors.terracotta}14`,
    curatorNoteBorder: colors.terracotta,
    ctaBarBg: colors.peachVeil,
    ctaForeground: colors.terracotta,
    ctaButtonBg: colors.terracotta,
    ctaButtonText: colors.white,
  },
  "markets-and-popups": {
    // Original properties
    cardBackground: colors.mustardCream,
    badgeBackground: colors.mustard,
    accentColor: colors.goldOlive,
    isDark: false,
    // EventDetail properties
    colorBandBg: colors.mustardCream,
    backButtonBg: "rgba(255, 255, 255, 0.85)",
    backButtonIcon: colors.goldOlive,
    titleContainerBg: `${colors.goldOlive}14`,
    titleTextColor: colors.thunder,
    badgeTextColor: colors.goldOlive,
    accentForeground: colors.goldOlive,
    statTileBg: `${colors.goldOlive}14`,
    statTileLabelColor: colors.graniteGray,
    statTileValueColor: colors.white,
    curatorNoteBg: `${colors.goldOlive}14`,
    curatorNoteBorder: colors.goldOlive,
    ctaBarBg: colors.mustardCream,
    ctaForeground: colors.goldOlive,
    ctaButtonBg: colors.goldOlive,
    ctaButtonText: colors.white,
  },
  travel: {
    // Original properties
    cardBackground: colors.skyMist,
    badgeBackground: colors.skyDust,
    accentColor: colors.deepHorizon,
    isDark: false,
    // EventDetail properties
    colorBandBg: colors.skyMist,
    backButtonBg: "rgba(255, 255, 255, 0.85)",
    backButtonIcon: colors.deepHorizon,
    titleContainerBg: `${colors.deepHorizon}14`,
    titleTextColor: colors.thunder,
    badgeTextColor: colors.deepHorizon,
    accentForeground: colors.deepHorizon,
    statTileBg: `${colors.deepHorizon}14`,
    statTileLabelColor: colors.graniteGray,
    statTileValueColor: colors.white,
    curatorNoteBg: `${colors.deepHorizon}14`,
    curatorNoteBorder: colors.deepHorizon,
    ctaBarBg: colors.skyMist,
    ctaForeground: colors.deepHorizon,
    ctaButtonBg: colors.deepHorizon,
    ctaButtonText: colors.white,
  },
};

export function getCategorySlug(event: EventInfoFragment): string | null {
  const category = event.category;
  if (!category || category.length === 0) return null;
  const name = category[0]?.name ?? "";
  return name
    .toLowerCase()
    .replace(/\s*&\s*/g, "-and-") // "Food & Drink" → "food-and-drink"
    .replace(/\s+/g, "-") // remaining spaces → hyphens
    .replace(/[^a-z0-9-]/g, "") // strip any other non-alphanumeric chars
    .replace(/-+/g, "-"); // collapse double hyphens
}

export function getVariant(event: EventInfoFragment): CategoryVariant | null {
  const slug = getCategorySlug(event);
  if (!slug) return null;
  return categoryVariants[slug] ?? categoryVariants[DEFAULT_VARIANT_KEY];
}
