# Itinerary Feature Plan

## Pain Points to Solve

### 1. The "Screenshot Graveyard" Problem
People discover events/activities across Instagram, Google, texts from friends, and email. They screenshot everything, then forget or can't find it later. Pursuit already solves discovery + saving — the itinerary is where saved events graduate to an actual plan. The transition from "saved" to "scheduled" should be one tap, not a manual re-entry.

### 2. "What Am I Doing Today?" on the Trip
Most planning apps are great *before* the trip but awful *during* it. On the day, people want a simple chronological view: what's next, where is it, how do I get there. Not a spreadsheet. A "today" mode — a focused, stripped-down timeline for the current day with navigation links.

### 3. Over-Planning Kills Spontaneity
Apps like TripIt force rigid hour-by-hour scheduling. Real trips have a mix: a concert at 8pm is fixed, but "explore the neighborhood" is loose. The itinerary should support both **timed items** (linked to events with real dates) and **unscheduled items** (things you want to do but haven't committed to a time). A "today" bucket of flexible activities alongside the fixed schedule.

### 4. "How Far Apart Are These Things?"
You book a 10am brunch and a 2pm museum visit — are they across the street or 45 minutes apart? Most apps don't tell you. We have PostGIS already. Showing distance/travel time between consecutive itinerary items is a huge quality-of-life feature that very few apps do well.

### 5. Budget Visibility While Planning, Not After
Wanderlog and Lambus separate budget from itinerary. But the decision "should I add this activity?" is partly a cost question. Showing a running trip total *as you add items* keeps budget awareness inline with planning, not as an afterthought.

---

## Feature Tiers

### Tier 1: Core (MVP Itinerary)

- **Trip container** — title, dates, optional destination. Groups everything.
- **Add from saved events** — one-tap to move a saved event into a trip. Auto-populates date, time, location from the event data. This is the differentiator — the pipeline from discover to plan.
- **Custom items** — manual entries for things not in the events database (restaurant reservations, flights, "check into hotel").
- **Day-by-day view** — items grouped by date, ordered by time. Unscheduled items sit in a "flexible" section at the bottom of each day.
- **Drag to reorder** — lets users rearrange their day without editing times.

### Tier 2: "Better Than Google Docs" Features

- **Map view per day** — plot that day's items on a map with numbered markers and route lines. PostGIS coordinates on events enable this. This is the feature that makes people stop using spreadsheets.
- **Distance between items** — show "15 min walk" or "30 min drive" between consecutive items. Even a simple straight-line distance from Point fields is useful.
- **Running budget per trip** — each item can have an optional cost. Trip header shows total estimated spend. "You've planned $340 of activities for this trip."
- **Today mode** — a focused view that only shows the current day's items, with a "next up" card at the top. Think Google Maps timeline but for your plan.
- **Share as link** — generate a read-only view of the itinerary. Solves "send the plan to the group chat" without requiring everyone to have the app.

### Tier 3: Delight Features (Post-MVP)

- **Smart scheduling suggestions** — "You have 3 hours free between brunch and the concert. Here are events nearby." Leverages events search with location + date + radius filters.
- **Conflict detection** — flag when two items overlap in time.
- **Weather overlay** — show forecast for each day of the trip so users can plan outdoor activities on good days.
- **Trip templates** — "Weekend in NYC" pre-built itineraries that users can clone and customize. Great for content marketing too.
- **Collaborative editing** — multiple users can add/edit items on the same trip. Complex but high value for group travel.
- **Post-trip journal** — after the trip dates pass, the itinerary transforms into a memory view with photos.

---

## Data Model

```
Trip
  - user (FK)
  - title
  - destination_name
  - destination_location (PointField)  # reuse PostGIS setup
  - start_date, end_date
  - is_active
  - timestamps

TripItem
  - trip (FK)
  - event (FK, nullable)          # linked event, or null for custom items
  - title                          # auto-filled from event or manual
  - notes
  - date (nullable)               # null = unscheduled/flexible
  - start_time, end_time (nullable)
  - location_name
  - location (PointField, nullable)
  - estimated_cost (nullable)
  - position (int)                 # for drag-reorder within a day
  - timestamps
```

Key design choice: nullable `date` on TripItem lets items be "planned but not scheduled yet," solving the over-planning problem.

---

## What Makes Pursuit's Itinerary Different

The **saved events pipeline** — discover, save, schedule. Generic planning apps start from a blank page. Pursuit's itinerary is pre-populated with events the user already expressed interest in. That's the story worth nailing first.

---

## Competitive Reference

| App | Strength | Weakness |
|---|---|---|
| TripIt | Auto-parses email confirmations | Rigid scheduling, no discovery |
| Wanderlog | Collaborative, map view | Budget is separate from planning |
| Sygic Travel | Day-by-day with map | No event discovery pipeline |
| Lambus | Budget + itinerary together | Clunky UX, no event linking |
| Google Docs/Notion | Flexible, collaborative | No structure, no maps, no budget |

---

## Implementation Order

1. **After events sprint:** 1 week for Tier 1 backend + frontend
   - Model is simple
   - Hardest FE work: day-by-day grouped list + "add from saved events" picker
2. **Tier 2 features** roll in over following weeks, each independently shippable
3. **Tier 3** based on user feedback post-launch
