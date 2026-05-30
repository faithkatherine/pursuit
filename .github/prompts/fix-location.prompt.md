---
description: "Debug and fix location reconciliation issues"
---

Debug a location permission or reconciliation issue in Pursuit.

Read these files first before any diagnosis:

- app/\_layout.tsx
- hooks/useLocation.ts
- providers/AuthProvider.tsx
- graphql/queries.ts (find DISABLE_LOCATION and ENABLE_LOCATION mutations)

The correct reconciliation architecture:

- reconcileLocation(user, client) is a standalone async function extracted from hooks
- It lives in \_layout.tsx and runs after UserProfile resolves
- getHome is gated on isReconciled state (skip: !isReconciled)
- Home shell renders immediately; data sections skeleton until getHome resolves

Reconciliation paths:

- undetermined + allowLocationSharing=true → show OS dialog immediately (proactive re-prompt)
  - granted → set reconciled, sync runs background
  - denied → call DISABLE_LOCATION mutation, set reconciled
- denied + allowLocationSharing=true → call DISABLE_LOCATION mutation, no dialog, set reconciled
- granted + allowLocationSharing=true → set reconciled, sync background
- anything + allowLocationSharing=false → set reconciled immediately, no action

Hard rules:

- NEVER add cache.modify patches to clear stale weather — fix the data source instead
- NEVER show OS permission dialog more than once per session (hasPromptedThisSession ref)
- NEVER fire getHome before isReconciled=true
- Backend getHome resolver must return null weather when allowLocationSharing=false
