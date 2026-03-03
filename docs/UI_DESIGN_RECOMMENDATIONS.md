# UI/UX Design Recommendations — Itinerary & Budget Screens

## Current Design System Summary

- **Palette:** Purple (deluge `rgb(124, 92, 156)`) + blush/pink accents (careysPink, roseFog, shilo) on light lavender background (prim `rgb(248, 243, 248)`)
- **Typography:** Poppins for headings, Work Sans for body. Clean hierarchy H1–H6.
- **Cards:** 12px border radius standard, soft shadows (opacity 0.08), white surfaces
- **Gradients:** Flowing palette from deluge → roseFog → careysPink → shilo → leather → aluminium
- **Personality:** Emoji badges, achievement systems, carousel-based exploration
- **Spacing:** 4px increment scale, generous whitespace

---

## General Principles

### Unify the two moods

The Home/Buckets screens feel warm and explorative (gradients, carousels, emojis), but the Budget screen feels like a separate app — `#F8F9FA` gray background, `#6246EA` buttons, no gradients, no brand warmth. The biggest design win is **bringing these two moods closer together** so the whole app feels like one experience.

### Across both screens

- **Use the gradient palette on section headers, not just Buckets cards.** A subtle deluge-to-roseFog gradient on a "This Week" header instantly makes it feel like Pursuit, not a generic finance app.
- **Keep emojis as personality markers.** They already work in InsightsCard and BucketCards. A trip to NYC gets a city emoji, a food expense gets the fork emoji. Low-effort, high-personality.
- **Micro-interactions matter.** Adding even two animations — a satisfying check when marking something complete, and a subtle scale-press on cards — dramatically increases the "this feels good to use" factor. `react-native-reanimated` layout animations for list reordering would make drag-to-reorder feel native.
- **Illustrations for empty states.** A simple illustrated empty state ("No trips planned yet — where to next?") with a warm-toned SVG turns a dead end into an invitation.

---

## Itinerary Screen

### Day-by-day view

This is the core screen and the hardest to get right. The risk is it becomes a boring list.

**Timeline, not table.** Use a vertical timeline indicator on the left edge — a thin line (2px, deluge color) connecting time dots between items. Items that are timed get a filled dot; unscheduled "flexible" items at the bottom of the day get an open/dashed dot. This immediately communicates "some things are locked, some aren't."

**Day headers with personality.** Instead of just "March 15", show "Saturday, Mar 15" with a small weather icon or a gradient chip background. Make each day feel like a chapter, not a spreadsheet row.

**Item cards — two variants:**

1. **Event-linked items** — Show the event image as a small thumbnail (48px circle or 60px rounded square) on the left, with title, time, and location name. A small chain-link icon or "from saved" badge signals it's connected to a real event. Tap opens event detail.
2. **Custom items** — Same card layout but with a category emoji or icon in place of the image. "Check into hotel" with a bed emoji, "Lunch at Joe's" with a fork. Let users pick or auto-suggest.

**The "flexible" section.** Below the day's timed items, a dashed-border container labeled "Flexible" holds unscheduled items. Visually distinct — slightly lower opacity or a different background tint (prim blush background works well). Users can see "I have these things I want to do but haven't committed to a time."

**Drag-to-reorder feel.** When a user long-presses to drag, the card should lift slightly (scale 1.03, increase shadow), and the timeline dots should animate to show the new position. Use `react-native-reanimated` + `react-native-gesture-handler`.

### Trip overview / header

At the top of each trip, a hero section with:
- Trip title in H2 Poppins bold
- Date range as a subtitle ("Mar 14 – 17, 2026")
- Destination with a small map preview or a blurred event image as background
- Running cost total if they've added estimated costs ("~$420 planned")
- Horizontal day-selector (pill chips: "Day 1", "Day 2", "Day 3") for quick jumping

This header should use a gradient — not as intense as InsightsCard, but softer. Deluge at 15% opacity over a blurred destination image.

### Map view toggle

A floating action button or tab toggle to switch between "list" and "map" view. Map view plots the day's items as numbered markers connected by a route line. Even without real routing, connecting the dots on a MapView with PostGIS coordinates tells a visual story. Each marker shows the item emoji or image thumbnail.

### Today mode

When the trip date matches today, show a persistent "Today" tab or banner. This view strips away all other days and shows only:
- A "Next Up" card at the top (larger, more prominent, countdown timer: "in 2 hours")
- Remaining items below in timeline
- Completed items grayed out with a subtle checkmark

This is the "I'm on vacation, don't make me think" mode.

---

## Budget Screen

### Swap the background

Replace `#F8F9FA` with the prim (`rgb(248, 243, 248)`) blush background. Immediately ties it to the rest of the app. Card surfaces stay white.

### The spending header

Instead of a plain total, make it a mini InsightsCard-style component: a gradient background (subtle, maybe careysPink to roseFog at 30% opacity) with the total in large Poppins bold, a small trend indicator (up/down arrow with percentage vs last period), and the trip name if expenses are trip-linked.

### Category breakdown — make it visual and tappable

Replace or augment the pie chart with **colored category chips** that match the BucketCard gradient style. Each category gets a chip with its emoji, name, and amount:

```
[fork] Food  $145   [car] Transport  $80   [bed] Lodging  $200
```

These should be horizontally scrollable like the BucketCard carousel. Tapping a chip filters the expense list below to that category. More immediately readable than a pie chart and more interactive.

### Expense list items

Each expense entry should be a card (not a plain row) with:
- Category emoji on the left (in a small circular container with a tinted background matching the category gradient color)
- Title and date on the right
- Amount right-aligned, bold
- If trip-linked, a small trip name badge below

Keep the 12px border radius, soft shadow. Use aluminium for secondary text (date, trip name). Use thunder for the amount.

### The "add expense" interaction

Should feel fast and frictionless. A floating action button (deluge purple) that opens a bottom sheet (BaseModal with bottomSheet variant). The sheet should have:
- Amount input at the top, large font, auto-focused with numeric keyboard
- Category selector as emoji chips (one tap, not a dropdown)
- Date defaults to today (tap to change)
- Optional note field
- "Add" button

The key: amount + category + save should be achievable in **under 5 seconds**. Don't make users fill out a form.

### Trip budget integration

If a trip exists, show a section: "Trip: NYC Weekend — $420 planned / $285 spent" with a progress bar. This connects budget to itinerary — the running total from the itinerary plan vs actual spend. Use the existing ProgressBar component with deluge fill.

---

## Touches That Add Fun

1. **Celebration moments.** When a user completes a trip item or finishes a trip under budget, a brief confetti animation or a subtle "nice!" toast. Not overdone — once per milestone.

2. **Trip countdown.** On the trip card in the list view, show "in 12 days" with excitement-building language. Inside the trip, a countdown at the top.

3. **Streak/progress.** On the budget screen, a small "You've tracked expenses for 5 days in a row" streak indicator. Gamification that encourages the habit.

4. **Smart defaults.** When adding an event-linked item to the itinerary, pre-fill everything. When adding an expense after visiting an itinerary item, pre-suggest the category and location. Reduce friction, increase delight.

5. **Image-forward design.** Carry event images through — trip cards should show a hero image (from the first event, or the destination). The itinerary day view should have small event thumbnails. Visual richness makes it feel like a travel app, not a task manager.

---

## Visual Consistency Checklist

| Element | Current | Recommended |
|---|---|---|
| Budget background | `#F8F9FA` (gray) | `rgb(248, 243, 248)` (prim blush) |
| Budget buttons | `#6246EA` (off-brand purple) | deluge `rgb(124, 92, 156)` |
| Card radius | 12px (consistent) | Keep 12px |
| Shadows | 0.08 opacity (consistent) | Keep soft |
| Section headers | Plain text | Subtle gradient chip or tinted background |
| Empty states | Plain text | Illustrated SVG + warm CTA |
| Animations | None (basic Pressable) | Add reanimated scale-press + layout animations |
| Charts | chart-kit defaults | Restyle with brand colors (deluge, careysPink, roseFog) |
