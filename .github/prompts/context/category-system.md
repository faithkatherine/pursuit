# Pursuit — Category system reference

## 8 slugs

talks-and-ideas          Lectures, panels, conferences, book launches
workshops-and-classes    Pottery, photography masterclasses, cooking, hands-on learning
concerts-and-nightlife   Concerts, clubs, late-night sets, live music festivals
culture-and-arts         Exhibitions, galleries, theatre, film screenings
outdoors-and-active      Runs, hikes, sports, outdoor adventures, fitness
food-and-drink           Food festivals, tastings, supper clubs, brunches as events
markets-and-popups       Craft fairs, farmers markets, pop-up shops
travel                   Multi-day trips, travel expos, destination festivals

## Visual treatments

Defined in: pursuit/utils/categoryVariants.ts
Applied to: RecommendationCard ONLY (in "Made for your week" horizontal scroll)
NOT applied to: Trending, Plans, EventDetail, Search results, any other surface

| Slug                   | Card bg       | Badge bg     | Badge text + heart fill |
|------------------------|---------------|--------------|------------------------|
| talks-and-ideas        | parchment     | parchmentDeep| leather                |
| workshops-and-classes  | linen         | bareBlush    | tannin                 |
| concerts-and-nightlife | midnightBlue  | white        | black (text inverted)  |
| culture-and-arts       | mistLavender  | ube50        | deluge                 |
| outdoors-and-active    | sageMist      | sage         | forest                 |
| food-and-drink         | peachVeil     | shilo        | terracotta             |
| markets-and-popups     | mustardCream  | mustard      | goldOlive              |
| travel                 | skyMist       | skyDust      | deepHorizon            |

## Special rule for concerts-and-nightlife

This is the ONLY dark-surface variant.
Card title text: white
Card metadata text: white80
Badge text: black (dark text on white badge background)
Heart fill: white (on dark card surface)

All other categories use dark text on light-tinted backgrounds.

## Heart fill animation

When saving an event on a category-variant card, the heart fills with the
badge text color for that category (third column above).

On all other surfaces (Trending, hero, Plans, EventDetail, Search results),
heart fill uses the default brand color: deluge

The animation sequence:
1. User taps heart outline
2. optimisticResponse fires immediately
3. Heart scales up slightly (1.2x) and fills with category accent color
4. Particle animation fires (optional — currently disabled for performance)
5. Heart scales back to 1.0x
6. Mutation completes in background

## Implementation pattern

```typescript
import { getVariant, getCategorySlug } from 'utils/categoryVariants';
import colors from 'themes/tokens/colors';

const variant = getVariant(event);
const heartFillColor = variant?.accentColor ?? colors.deluge;
```

The `getVariant()` helper returns null for events without a category,
and falls back to culture-and-arts variant if category slug is unrecognised.

## Adding a new category

1. Add slug to backend Category model choices
2. Add entry to utils/categoryVariants.ts with matching slug
3. Add token(s) to themes/tokens/colors.ts if new colors needed
4. Run data migration to assign existing events to new category
5. Update seed script to include events in the new category
6. Test RecommendationCard rendering with new variant

Do NOT add more than 8 categories without reviewing the design system.
Five distinct visual treatments is the practical upper limit before the system
degrades into visual noise. If more than 8 categories are needed, consider:
- Collapsing similar categories (e.g. merge markets-and-popups into food-and-drink)
- Using a tag/filter system instead of primary categorisation
- Creating parent categories with subcategories (not recommended for V1)

## Why variants apply only to RecommendationCard

The category color system exists to add visual variety to the horizontal scroll
of "Made for your week" recommendations. This is the only surface where users
see multiple events from different categories at once in a repeated card layout.

Other surfaces intentionally use uniform styling:
- Trending: vertical ranked list — visual hierarchy is more important than variety
- Plans: user's saved events — color-coding by category would be distracting
- EventDetail: full-screen modal — event image provides visual interest
- Search results: uniform styling helps scanning and comparison

Applying category variants everywhere would:
1. Dilute the visual signal (if everything is colorful, nothing stands out)
2. Create accessibility issues (some color combinations fail WCAG contrast ratios)
3. Increase maintenance burden (every card variant needs testing across all surfaces)

The current approach concentrates the color variety where it adds the most value:
the horizontal recommendation scroll on the home screen.

## Color token rationale

Each category's color palette was chosen to evoke the category's emotional tone:

- talks-and-ideas: warm neutrals (parchment, leather) suggest intellectual warmth
- workshops-and-classes: earthy tones (linen, tannin) evoke hands-on making
- concerts-and-nightlife: dark gradient (midnightBlue) creates nighttime atmosphere
- culture-and-arts: soft lavender (mistLavender, ube) suggests creativity
- outdoors-and-active: green/sage tones (sageMist, forest) connect to nature
- food-and-drink: peach/terracotta warmth evokes appetite and conviviality
- markets-and-popups: mustard/gold suggests craft and artisanal goods
- travel: sky blue tones (skyMist, deepHorizon) evoke horizons and exploration

The palette avoids:
- Pure primary colors (too childish for the brand)
- Neon or saturated colors (accessibility issues, visual fatigue)
- Warm reds or oranges (reserved for error states and urgency)

All colors pass WCAG AA contrast requirements for text on their respective backgrounds.
