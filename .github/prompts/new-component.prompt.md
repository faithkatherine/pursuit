---
description: 'Create a new reusable component in Pursuit'
agent: 'agent'
tools: ['search/codebase']
argument-hint: 'Component name, e.g. EventStatusBadge'
---

Create a new component named ${input:componentName:e.g. EventStatusBadge}.

Before writing anything:
- Search components/ to confirm this component does not already exist
- Check if an existing component can be extended instead

File structure:
components/${input:componentFolder:e.g. Cards/EventStatusBadge}/${input:componentName}.tsx
components/${input:componentFolder}/index.tsx  (re-export only)

Requirements:
- TypeScript props interface defined at the top of the file
- Use color tokens from themes/tokens/colors.ts — never inline hex values
- Use spacing tokens from themes/tokens/spacing.ts
- No inline styles for colors or spacing — tokens only
- If the component handles category variants, read utils/categoryVariants.ts first
  and apply variants via the existing pattern (do not invent a new variant system)

Do NOT:
- Create components that duplicate existing ones
- Add new animation libraries — use the existing Reanimated setup
- Touch any screen or route file in this pass
