---
description: 'Add a proper empty state to a screen or tab'
agent: 'agent'
tools: ['search/codebase']
argument-hint: 'Screen name, e.g. Plans or GroupPlans'
---

Add an empty state to the ${input:screenName:e.g. Plans} screen.

Empty state requirements:
- Soft illustration or icon — check components/SplashScreen/ and components/Layout/ for existing assets
- Headline: short, honest, not aspirational ("Nothing planned yet" not "Start your journey!")
- Subtext: one sentence explaining what the tab is for
- Primary CTA: action that resolves the empty state (navigates to Discover or relevant flow)
- Optional quiet secondary CTA if relevant (e.g. "plan with friends")

Style requirements:
- Background: ghostWhite or prim from themes/tokens/colors.ts
- Illustration tint: ube50 or soft purple wash
- Headline: thunder token, medium weight
- Subtext: aluminium token, regular weight
- Primary CTA: uses existing Button component from components/Buttons/Buttons.tsx
  — do not create a new button variant

Do NOT:
- Add an empty state that looks like a loading state
- Use cheerful marketing language in empty state copy
- Create new illustration assets — use what exists or use a simple icon
