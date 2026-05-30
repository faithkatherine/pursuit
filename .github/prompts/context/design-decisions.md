# Pursuit — Design decisions reference

Why things are the way they are. Read this before proposing architectural changes.

## Why GraphQL aggregate query for home

The getHome query fetches everything needed for the home screen in one round trip:
greeting, weather, recommendations, trending, EditorsPick, upcomingEvents, activeTrip.

This aggregate approach exists because:
- Mobile network latency is unpredictable — multiple small queries create waterfall delays
- Cache invalidation is simpler — one cache key invalidates the entire home state
- Backend can optimise joins and database queries in one pass
- Redux-style normalised cache would add complexity for marginal benefit at this scale

The tradeoff: when one section changes (e.g. weather), the entire home cache invalidates.
This is acceptable because weather TTL is 30min, recommendations 60min — both change infrequently.

## Why location_tag is a string not a FK

EditorsPick scoping uses location_tag as a normalised lowercase string (nairobi, mombasa, etc.)
rather than a FK to a City model. Reasons:
- Simpler: no City model to maintain or migrate
- Honest to editorial reality: "Coast — Diani to Mombasa" is a valid editorial scope
  that doesn't map to a single administrative boundary
- Reversible: if a City model is needed later, migration is straightforward
- Consistent with how the frontend already derives location from GPS bounding boxes

The string tag approach was chosen after evaluating three alternatives:
1. FK to City model (rejected: requires administrative boundary data, maintenance burden)
2. GPS bounding polygons (rejected: over-engineered for V1 needs)
3. String tag with normalisation (chosen: simple, flexible, reversible)

## Why cache.modify not refetchQueries for save/unsave

refetchQueries causes a network round trip and a loading flash on every save.
cache.modify updates the cache synchronously and Apollo reflects the change immediately.
The save state update needs to propagate to both getHome.recommendations and the Plans
savedEvents list — cache.modify handles both in one operation.

Implementation pattern:
```typescript
cache.modify({
  fields: {
    getHome(existingHome, { readField }) {
      return {
        ...existingHome,
        recommendations: existingHome.recommendations.map(event =>
          readField('id', event) === eventId
            ? { ...event, isSaved: true }
            : event
        )
      }
    }
  }
})
```

The optimistic response fires immediately, network request happens in background,
and cache is corrected if the server response differs.

## Why EditorsPick is a separate model

The home hero was previously just "first recommendation" with an unconditional badge.
This was dishonest — the badge implied editorial curation that wasn't happening.
EditorsPick is a separate model so:
- curator_note is required (NOT NULL) — no pick without a reason
- Badge only renders when isEditorsPick=true from resolver
- City scoping is explicit (location_tag field)
- Admin workflow exists for curators to publish picks weekly
- Analytics can track which picks drive engagement

The EditorsPick model includes:
- event FK (the actual event being featured)
- location_tag (normalised string: nairobi, mombasa, etc.)
- active_from / active_until (time-scoped visibility)
- curator_note (required field — the "why this matters" copy)
- curator_name (attribution, defaults to "Pursuit team")
- position (reserved for future multi-pick surfaces; V1 always uses position=1)

## Why event detail is a modal not a full screen

The user journey is browse → peek → decide. Modal preserves browse context underneath.
User can swipe down on detail and return exactly where they were in the scroll.
fullScreenModal is used (not card modal) so swipe-to-dismiss can be disabled on
checkout and confirmation screens without fighting iOS UIKit.

The modal stack:
- EventDetail: swipe-to-dismiss enabled, back icon (‹) closes modal
- Checkout: swipe-to-dismiss DISABLED, back icon (‹) returns to detail
- Confirmation: swipe-to-dismiss DISABLED, close icon (✕) dismisses full stack

This pattern was chosen after testing three alternatives:
1. Full-screen push navigation (rejected: loses browse context)
2. Card modal throughout (rejected: can't disable swipe on checkout)
3. fullScreenModal with selective swipe control (chosen)

## Why reconciliation gates getHome

Previous approach fired getHome immediately on mount and patched stale weather with
cache.modify after reconciliation. This created a visible flash of stale data:
user sees "Sunny, 28°C" from cache, then it changes to "Rainy, 22°C" after GPS sync.

Correct approach: getHome has skip: !isReconciled, so it only fires after the backend
state accurately reflects device reality. Home shell renders immediately regardless —
user sees skeleton states for recommendations and weather while reconciliation runs.

The reconciliation sequence:
1. UserProfile resolves from backend (includes allowLocationSharing flag)
2. reconcileLocation(user, client) runs — reads OS permission, shows dialog if needed
3. Sets isReconciled=true when backend state matches device state
4. getHome fires with skip: !isReconciled guard removed
5. Home data sections populate from server

This adds ~200ms to initial home render but eliminates the stale data flash.

## Why no City model

See location_tag decision above. City model would also need:
- Administrative boundary data for each city (maintenance burden)
- Handling of fuzzy boundaries (is Karen "Nairobi"? Is Westlands?)
- FK migrations every time a new city is added
- Decision on whether suburbs count as separate cities

Bounding box approach with string tags handles all current needs:
- GPS coords map to location_tag via simple lat/lng ranges
- Editorial scoping works with loose boundaries (e.g. "coast" = Diani to Mombasa)
- No database joins needed for location filtering
- String tags are human-readable in admin and logs

If V2 needs city-level analytics or multi-city expansion, the migration path is:
1. Create City model with name and bounding polygon
2. Backfill location_tag → city FK via string matching
3. Update resolvers to filter by city FK instead of string tag
4. Frontend continues using string tags as display names

The current string-based approach is the simplest thing that works.
