// ---------------------------------------------------------------------------
// Category variant map — keyed by category slug

import { EventInfoFragment } from "graphql/generated/graphql";
import colors from "themes/tokens/colors";

// ---------------------------------------------------------------------------
type CategoryVariant = {
  cardBackground: string;
  badgeBackground: string;
  accentColor: string; // badge text + heart fill
  isDark: boolean;
};

const DEFAULT_VARIANT_KEY = "culture-and-arts";

export const categoryVariants: Record<string, CategoryVariant> = {
  "talks-and-ideas": {
    cardBackground: colors.parchment,
    badgeBackground: colors.parchmentDeep,
    accentColor: colors.leather,
    isDark: false,
  },
  "workshops-and-classes": {
    cardBackground: colors.linen,
    badgeBackground: colors.bareBlush,
    accentColor: colors.tannin,
    isDark: false,
  },
  "concerts-and-nightlife": {
    cardBackground: colors.midnightBlue,
    badgeBackground: colors.white,
    accentColor: colors.black,
    isDark: true,
  },
  "culture-and-arts": {
    cardBackground: colors.mistLavender,
    badgeBackground: colors.ube50,
    accentColor: colors.deluge,
    isDark: false,
  },
  "outdoors-and-active": {
    cardBackground: colors.sageMist,
    badgeBackground: colors.sage,
    accentColor: colors.forest,
    isDark: false,
  },
  "food-and-drink": {
    cardBackground: colors.peachVeil,
    badgeBackground: colors.shilo,
    accentColor: colors.terracotta,
    isDark: false,
  },
  "markets-and-popups": {
    cardBackground: colors.mustardCream,
    badgeBackground: colors.mustard,
    accentColor: colors.goldOlive,
    isDark: false,
  },
  travel: {
    cardBackground: colors.skyMist,
    badgeBackground: colors.skyDust,
    accentColor: colors.deepHorizon,
    isDark: false,
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
