---
description: 'Add a GraphQL mutation end-to-end in the frontend'
agent: 'agent'
tools: ['search/codebase']
argument-hint: 'Mutation name, e.g. SAVE_EVENT or UPDATE_PROFILE'
---

Add a new GraphQL mutation named ${input:mutationName:e.g. SAVE_EVENT} to the frontend.

Steps in order:
1. Check graphql/queries.ts — confirm the mutation does not already exist
2. Add the mutation definition to graphql/queries.ts
3. Run npm run codegen
4. Fix all TypeScript errors — never use `any`
5. Create or update the hook that calls this mutation

Apollo mutation requirements:
- Always include an optimisticResponse if the mutation changes visible UI
- Use cache.modify to update affected queries locally — NEVER use refetchQueries for save/unsave
- Include error handling that rolls back optimistic updates on failure

Do NOT:
- Create a new GraphQL query or mutation on the backend — this prompt is frontend only
- Use refetchQueries for save/unsave operations
- Leave TypeScript errors unresolved
