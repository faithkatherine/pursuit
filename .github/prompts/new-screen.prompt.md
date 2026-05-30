---
description: 'Create a new screen in Pursuit following project conventions'
agent: 'agent'
tools: ['search/codebase']
argument-hint: 'Screen name, e.g. EventList or TripDetail'
---

Create a new screen named ${input:screenName:e.g. EventList} in Pursuit.

Follow these conventions exactly:

Route file: app/(protected)/${input:routePath:e.g. events/list}.tsx
Screen component: screens/${input:screenName}/${input:screenName}.tsx
Index export: screens/${input:screenName}/index.tsx

Requirements:
- Screen component imports Loading from components/Layout/Loading.tsx
- Screen component imports Error from components/Layout/Error.tsx
- All data fetching uses Apollo hooks from graphql/queries.ts — confirm names before using
- If new GraphQL query needed, add to graphql/queries.ts then run: npm run codegen
- Fix all TypeScript errors from codegen — never use `any`
- Use color tokens from themes/tokens/colors.ts — never inline hex values
- Use existing spacing tokens from themes/tokens/spacing.ts
- Check components/ for reusable components before building new ones

Do NOT touch:
- Auth flow (app/auth/)
- Onboarding flow (app/(protected)/onboarding/)
- Color tokens file (themes/tokens/colors.ts) — read only
- Any existing screen not directly related to this task
