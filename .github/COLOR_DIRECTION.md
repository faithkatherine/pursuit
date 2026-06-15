# Color Direction for Payment Screens

The app is moving toward softer, less saturated colors. Apply this throughout:

## Primary Actions
- Pay button, CTA: use **primary-container** (#7d6799) not primary (#644f7f) — it reads softer

## Backgrounds
- Always **surface** (#fbf9f8) or **surface-container-low** (#f5f3f3)
- NEVER white (#ffffff) as a page background

## Card Borders
- **outline-variant** (#ccc4cf) at **0.5 opacity**, not full opacity

## Category Color Badges
- Use the muted/container variant of each category color, not the full saturation token

## Text on Colored Surfaces
- Prefer **on-surface-variant** (#4a454e) over pure **on-surface** (#1b1c1c) for secondary text

## Shadows
- Avoid hard shadows
- Use subtle elevation: `box-shadow: 0px 2px 8px rgba(0,0,0,0.06)` at most

## Confirmation Screen
- Check circle background: **primary-fixed** (#eedcff) not primary — soft lavender, not purple

## Waiting Screen
- Spinner pulse ring: **primary-fixed-dim** (#d5bcf4)
- Spinner center dot: **primary** (#644f7f)

## React Native Shadow Props
```typescript
{
  shadowColor: colors.black,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
  elevation: 2, // Android
}
```
