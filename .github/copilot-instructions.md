# Pursuit frontend — Copilot context

Hyperlocal event discovery app for Nairobi, Kenya. React Native + Expo SDK 52 + Django GraphQL backend. Solo build, staging deployment.

## Stack & critical workflows

- **React Native + Expo SDK 52, TypeScript, Expo Router (file-based routing)**
- **Apollo Client (GraphQL)** — codegen-driven types, optimistic mutations, cache.modify pattern
- **Auth:** expo-auth-session (Google OAuth), refresh token flow in errorLink
- **Location:** expo-location with reconciliation pattern (see below)

### After any GraphQL schema change

```bash
npm run codegen  # Regenerates graphql/generated/graphql.ts
# Fix ALL TypeScript errors — NEVER use `any` as a workaround
```

### Development commands

```bash
npm run dev              # Start Expo dev client
npm test                 # Run Jest tests
npm run type-check       # TypeScript strict check
npm run build:dev:ios    # Build iOS development client via EAS
npm run build:dev:android # Build Android development client via EAS
```

Backend must be running at `http://localhost:8000/graphql/` (Android emulator uses `10.0.2.2:8000`)

## Architecture patterns

### Apollo Client cache rules (CRITICAL)

**Save/unsave pattern** — see `hooks/useSaveToggle.ts`:

```typescript
// ✅ CORRECT: cache.modify + optimistic UI
client.cache.modify({
  id: client.cache.identify({ __typename: "EventType", id: eventId }),
  fields: { isSaved: () => true },
});
// ❌ NEVER use refetchQueries for save/unsave
```

- **fetchPolicy: cache-and-network** on getHome query
- **getHome cache key format:** `home:{userId}:{locationTag}:{timeFilter}:{pickId}`
- **Optimistic responses** on all mutations that update visible UI

### Location reconciliation (app/\_layout.tsx)

1. **reconcileLocation(user, client)** runs after auth, before getHome
2. **isReconciled state** gates getHome query — prevents premature render
3. **Permission flow:**
   - `undetermined` + `allowLocationSharing=true` → show OS permission dialog
   - `denied` + `allowLocationSharing=true` → call DISABLE_LOCATION mutation
   - `denied/false` → never auto-prompt, show State B location pill
4. **useLocationSync** hook fires in background (fire-and-forget)

### Navigation structure (Expo Router file-based)

```
app/
  _layout.tsx              # Root: auth gate, location reconciliation
  (protected)/
    _layout.tsx            # Auth guard, onboarding redirect
    (tabs)/                # Bottom tab navigator
      index.tsx            # Home/Discover
      plans.tsx, group_plans.tsx, profile.tsx
    events/[eventId]/
      _layout.tsx          # Modal stack with fullScreenModal presentation
      index.tsx            # EventDetail (‹ closes modal)
      checkout.tsx         # (‹ back, gesture disabled)
      confirmation.tsx     # (✕ dismiss stack, Android back blocked)
```

**Modal flow rule:** EventDetail → Checkout → Confirmation. Deep link to checkout without detail context must redirect to detail first.

### Auth & token management (providers/AuthProvider.tsx)

- **Google OAuth:** Platform-specific client IDs (iOS/Android/Web) + PKCE flow
- **Token refresh:** Automatic via errorLink in Apollo Client on TOKEN_EXPIRED/NOT_AUTHENTICATED
- **Refresh flow:** Queues pending requests, retries after token refresh, clears on failure
- **Session storage:** expo-secure-store for accessToken/refreshToken
- **User state:** Partial updates via `updateUser()` for nested profile changes

### Date utilities (utils/date.ts)

`formatEventDate()` returns **object, not string:**

```typescript
// Returns: { formattedDate: string, formattedTime: string }
const formatted = formatEventDate(event.date);
const dateText =
  typeof formatted === "string" ? formatted : formatted.formattedDate;
```

All card components handle this pattern — see RecommendationCard, TrendingCard, etc.

## Key file paths

```
app/
  _layout.tsx                   Root layout — auth gate, reconciliation lives here
  (protected)/
    _layout.tsx                 Protected route wrapper
    (tabs)/
      _layout.tsx               Tab navigator
      index.tsx                 Discover tab (home)
      plans.tsx                 Plans tab
      group_plans.tsx           Group Plans tab
      profile.tsx               Me tab
    events/
      [eventId]/
        _layout.tsx             Event modal stack layout
        index.tsx               Event detail screen (modal)
        checkout.tsx            Checkout screen
        confirmation.tsx        Confirmation / ticket screen
    explore.tsx                 Explore / browse screen
    onboarding/                 Onboarding flow
  auth/
    signin.tsx
    signup.tsx
  get-started.tsx
  index.tsx                     Entry point

screens/
  Home.tsx                      Home screen component
  Events/
    EventDetail.tsx
    Checkout.tsx
    Confirmation.tsx
  Explore/
    Explore.tsx
  Plans/                        (to be created)
  GroupPlans/                   (to be created)
  Profiles.tsx

components/
  Cards/
    HeroCard/                   Editor's Pick hero
    RecommendationCard/         Horizontal cards — Made for your week
    TrendingCard/               Vertical ranked list cards
    InsightsCard/               Weather + location chip
      InsightsCard.tsx
      WeatherAnimation.tsx
    CTACard/                    Plan a Trip + Coming Up strips
    ExploreCard/                Browse cards
    UpcomingCard/               Upcoming event cards
    CategoryCard/               Category filter cards
  Buttons/
    Buttons.tsx                 Primary button variants
    SaveButton.tsx              Heart save toggle
    BackButton.tsx
  Layout/
    Layout.tsx
    Loading.tsx
    Error.tsx
    BackNavigationHeader.tsx
  Modals/
    BaseModal.tsx               Base modal wrapper

hooks/
  useHome.ts                    getHome query hook
  useLocation.ts                Location reconciliation + sync
  useEvents.ts                  Event queries
  useSaveToggle.ts              Save/unsave mutation + optimistic update

providers/
  AuthProvider.tsx              Auth state, user profile, token management
  OnboardingProvider.tsx

graphql/
  queries.ts                    All GQL query/mutation definitions
  fragments.ts                  Shared GQL fragments
  client.ts                     Apollo client setup
  generated/
    graphql.ts                  Codegen types
    gql.ts

themes/
  tokens/
    colors.ts                   Color token system
    typography.ts
    spacing.ts
    gradients.ts
  gradients/
    BlushPurpleRadialGradient.tsx
    PurpleRadialGradient.tsx

utils/
  categoryVariants.ts           Category → visual treatment mapping
  timeFilter.ts                 Time filter helpers
  date.ts
  weatherAnimations.ts
  secureStorage.ts
  interests.ts
```

## Color tokens

File: themes/tokens/colors.ts

Key tokens and their semantic purpose:

```typescript
prim: "rgb(248, 243, 248)"; // lightest surface
thunder: "rgb(63, 50, 61)"; // primary dark text
leather: "rgb(150, 116, 89)"; // warm brown accent (Talks & Ideas)
aluminium: "rgb(166, 168, 177)"; // muted metadata text
deluge: "rgb(124, 92, 156)"; // brand purple — primary actions
delugeLight: "rgb(134, 102, 166)";
purple: "rgba(168, 85, 247, 0.5)";
lightPurple: "rgb(109, 40, 217)";
ube: "rgb(139, 127, 188)"; // soft purple (Culture & Arts accent)
ube50: "rgba(139, 127, 188, 0.5)"; // Culture & Arts badge bg
ghostWhite: "rgb(250, 247, 252)"; // content screen background
graniteGray: "rgb(102, 102, 102)";
midnightBlue: "#1a1a2e"; // Concerts & Nightlife card bg
darkNavy: "#16213e";
deepCharcoal: "#0f0f23";

// Category variant palette (used in RecommendationCard only)
parchment: "rgb(245, 240, 230)"; // Talks & Ideas card bg
parchmentDeep: "rgb(232, 222, 200)"; // Talks & Ideas badge bg
linen: "rgb(242, 232, 220)"; // Workshops card bg
tannin: "rgb(107, 74, 42)"; // Workshops badge text + heart fill
mistLavender: "rgb(244, 240, 248)"; // Culture & Arts card bg
sageMist: "rgb(234, 239, 227)"; // Outdoors card bg
sage: "rgb(184, 201, 168)"; // Outdoors badge bg
forest: "rgb(59, 90, 44)"; // Outdoors badge text + heart fill
peachVeil: "rgb(245, 232, 224)"; // Food & Drink card bg
terracotta: "rgb(139, 74, 42)"; // Food & Drink badge text + heart fill
mustardCream: "rgb(240, 232, 212)"; // Markets card bg
mustard: "rgb(212, 184, 90)"; // Markets badge bg
goldOlive: "rgb(107, 90, 26)"; // Markets badge text + heart fill
skyMist: "rgb(224, 232, 240)"; // Travel card bg
```

## Category system

8 categories. Variants defined in utils/categoryVariants.ts.
**Variants are used in RecommendationCard (Made for your week) and EventDetail screen.**
Other surfaces (Trending, Hero, etc.) use uniform card style.

| Slug                   | Card bg      | Badge bg      | Badge text / heart fill |
| ---------------------- | ------------ | ------------- | ----------------------- |
| talks-and-ideas        | parchment    | parchmentDeep | leather                 |
| workshops-and-classes  | linen        | bareBlush     | tannin                  |
| concerts-and-nightlife | midnightBlue | white         | black (text inverted)   |
| culture-and-arts       | mistLavender | ube50         | deluge                  |
| outdoors-and-active    | sageMist     | sage          | forest                  |
| food-and-drink         | peachVeil    | shilo         | terracotta              |
| markets-and-popups     | mustardCream | mustard       | goldOlive               |
| travel                 | skyMist      | skyDust       | deepHorizon             |

Usage:

```typescript
const variant = useVariant ? getVariant(event) : null;
const cardBg = variant ? variant.cardBackground : colors.deluge;
```

## Component patterns

### Card components

All event cards follow a consistent structure:

**Required props:**

- `event: EventInfoFragment` — GraphQL fragment with event data
- `onPress: () => void` — Navigation handler

**Optional props:**

- `useVariant?: boolean` — Enable category-specific styling (RecommendationCard only)

**Common pattern:**

```typescript
export const SomeCard: React.FC<SomeCardProps> = ({ event, onPress, useVariant = false }) => {
  // 1. Get category variant (if enabled)
  const variant = useVariant ? getVariant(event) : null;

  // 2. Extract formatted date
  const formatted = formatEventDate(event.date);
  const dateText = typeof formatted === 'string' ? formatted : formatted.formattedDate;

  // 3. Save/unsave toggle with optimistic UI
  const { isSaved, saving, handleSave } = useSaveToggle(event.id, event.isSaved ?? false);

  return (
    <Pressable onPress={onPress} testID="some-card">
      {/* Card content */}
      <SaveButton onPress={handleSave} isSaved={isSaved} loading={saving} />
    </Pressable>
  );
};
```

**Key components:**

- `RecommendationCard` — Horizontal scroll cards, supports `useVariant` prop
- `TrendingCard` — Vertical ranked cards, uniform style
- `HeroCard` — Editor's Pick trip cards
- `ExploreCard` — Full-screen browse cards
- `UpcomingCard` — Small upcoming event cards

## Testing patterns

### Test file location

Place tests in `__tests__/` directory next to component:

```
components/Cards/RecommendationCard/
  RecommendationCard.tsx
  __tests__/
    RecommendationCard.test.tsx
```

### Required mocks

```typescript
// 1. Mock GraphQL hooks
jest.mock("graphql/hooks", () => ({
  useSaveEvent: () => [jest.fn()],
  useUnsaveEvent: () => [jest.fn()],
}));

// 2. Mock date utilities - MUST return object
jest.mock("utils/date", () => ({
  formatEventDate: (date: string) => ({
    formattedDate: date,
    formattedTime: "12:00 PM",
  }),
}));

// 3. Mock SVG icons
jest.mock("assets/icons/heart.svg", () => ({
  __esModule: true,
  default: () => null,
}));
```

### Test fixture pattern

```typescript
const baseEvent: EventInfoFragment = {
  __typename: "EventType",
  id: "1",
  name: "Test Event",
  date: "2026-05-15",
  locationName: "Nairobi",
  isFree: false,
  isSaved: false,
  category: [
    {
      __typename: "CategoryType",
      id: "c1",
      name: "Culture",
      icon: "🎨",
      color: "#f00",
    },
  ],
  // ...other required fields
};
```

### Run tests

```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

## Apollo patterns — hard rules

- NEVER use refetchQueries for save/unsave — always use cache.modify + optimistic response
- fetchPolicy: cache-and-network on getHome
- getHome cache key: home:{userId}:{locationTag}:{timeFilter}:{pickId}
- Optimistic responses on all mutations that change visible UI

## Navigation patterns — hard rules

- Event modal stack uses fullScreenModal presentation
- Stack: EventDetail (‹ closes modal) → Checkout (‹ back to detail, gesture disabled)
  → Confirmation (✕ dismisses full stack, gesture disabled, Android back blocked)
- Deep link to checkout without detail context must redirect to detail

## Location system

- reconcileLocation(user, client) is a standalone async function, not a hook
- Lives in \_layout.tsx — runs after UserProfile resolves, before getHome fires
- getHome is gated on isReconciled state
- undetermined + allowLocationSharing=true → show OS dialog over splash
- denied + allowLocationSharing=true → call DISABLE_LOCATION mutation, no dialog
- denied/false → never auto-prompt, show State B pill
- Home shell renders immediately; data sections skeleton until getHome resolves

## Hard constraints

- NEVER rename or remove color tokens — only add
- NEVER touch auth flow (signin, signup, Google OAuth) unless explicitly in scope
- NEVER touch onboarding flow unless explicitly in scope
- NEVER use refetchQueries for save/unsave
- NEVER use `any` type as a workaround for codegen errors
- Category variants apply only to RecommendationCard — not Trending, Plans, EventDetail
- EditorsPick badge renders ONLY when isEditorsPick === true from resolver
- Always read the existing file before adding to it — do not rewrite from scratch
- Always check graphql/queries.ts for existing mutation/query names before using

## Active V1 tasks (in priority order)

1. Location reconciliation — move to \_layout.tsx, gate getHome on isReconciled
2. Event Detail + Checkout — complete modal flow per navigation patterns above
3. Plans tab — empty state, populated state, trip detail
4. Search & View All — Postgres full-text, filter chips, single resolver architecture
5. Group Plans tab — setup, WhatsApp vote link, swipe, resolution
6. Trips — lightweight container, trip card on home, auto-suggest for open days
7. Me / Profile — basic profile, settings, sign-out (single + all devices)
8. Polish — skeletons, error states, empty states, smoke test
