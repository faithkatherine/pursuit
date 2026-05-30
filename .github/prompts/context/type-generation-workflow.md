# Pursuit — Type generation workflow

How GraphQL types flow from backend to frontend and what to do when things break.

## The type generation pipeline

```
Backend schema change
  ↓
Django migration + schema update
  ↓
GraphQL introspection query (auto, on server start)
  ↓
Frontend: npm run codegen
  ↓
graphql/generated/graphql.ts + gql.ts regenerated
  ↓
TypeScript errors in IDE
  ↓
Fix type errors in frontend code
  ↓
Commit both backend schema and frontend generated types
```

## Step 1: Backend schema changes

When adding a new field to a GraphQL type, mutation, or query:

```python
# apps/events/schema.py (example)
class EventType(DjangoObjectType):
    is_editors_pick = graphene.Boolean()  # NEW FIELD

    def resolve_is_editors_pick(self, info):
        return self.editors_picks.filter(
            active_from__lte=timezone.now(),
            active_until__gte=timezone.now()
        ).exists()
```

The schema change is LIVE immediately when the Django server restarts.
The frontend does NOT know about it until codegen runs.

## Step 2: Frontend codegen

From the `pursuit/` directory:

```bash
npm run codegen
```

This runs GraphQL Code Generator which:
1. Introspects the running backend GraphQL endpoint
2. Generates TypeScript types from the schema
3. Writes to `graphql/generated/graphql.ts` and `graphql/generated/gql.ts`

**CRITICAL**: The backend server must be running and accessible when codegen runs.
Default endpoint: `http://localhost:8000/graphql/`

If codegen fails with connection error:
```bash
# Start backend first
cd ../pursuit-backend
python manage.py runserver

# Then run codegen
cd ../pursuit
npm run codegen
```

## Step 3: Fix TypeScript errors

After codegen, TypeScript will show errors wherever the schema changed:

```typescript
// Example: new field added to Event type
const event = data.getHome.editorsPick;

// TypeScript now knows about isEditorsPick
if (event.isEditorsPick) {  // ✓ Type-safe!
  // render badge
}
```

If you were using an optional field that became required:
```typescript
// Before codegen: name was optional
const name = event.name ?? 'Untitled';

// After codegen: name is now required (non-null in schema)
const name = event.name;  // No fallback needed
```

## Common TypeScript errors after codegen

### Error: Property does not exist on type

```
Property 'isEditorsPick' does not exist on type 'EventInfoFragment'
```

**Cause**: You added a field to the backend type but forgot to add it to the frontend fragment.

**Fix**: Add the field to the fragment in `graphql/fragments.ts`:

```typescript
export const EVENT_FRAGMENT = gql`
  fragment EventInfo on EventType {
    id
    name
    date
    isEditorsPick  # ADD THIS
    # ... other fields
  }
`;
```

Then run `npm run codegen` again.

### Error: Type 'null' is not assignable to type 'X'

```
Type 'string | null' is not assignable to type 'string'
```

**Cause**: Backend schema changed a field from non-null to nullable (or vice versa).

**Fix**: Update your code to handle the nullability:

```typescript
// Before: field was non-null
const city = data.getHome.cityName;

// After: field is now nullable
const city = data.getHome.cityName ?? 'Unknown';
```

### Error: Argument of type 'X' is not assignable to parameter of type 'Y'

```
Argument of type '{ id: string }' is not assignable to parameter of type 'SaveEventMutationVariables'
```

**Cause**: Mutation variables changed shape in the backend schema.

**Fix**: Check the generated type and update your mutation call:

```typescript
// Check graphql/generated/graphql.ts for SaveEventMutationVariables
type SaveEventMutationVariables = {
  id: string;
  userId?: string;  // New optional field
};

// Update mutation call if needed
saveEvent({ variables: { id, userId } });
```

## Fragment updates

When you add a query or mutation that references an Event, always use the fragment:

```typescript
export const SAVE_EVENT = gql`
  mutation SaveEvent($id: ID!) {
    saveEvent(id: $id) {
      ok
      event {
        ...EventInfo  # ← Reuse fragment, don't inline fields
      }
      errors
    }
  }
  ${EVENT_FRAGMENT}
`;
```

This ensures:
- Consistency across all queries
- Single source of truth for Event fields
- Easier updates when Event schema changes

## Generated files — never edit manually

```
graphql/generated/
  graphql.ts        # All types, query/mutation variables
  gql.ts            # Tagged template literal helper
```

These are auto-generated and will be OVERWRITTEN on next codegen run.

If you need custom types, create them in a separate file:
```typescript
// graphql/customTypes.ts (example)
import { EventInfoFragment } from './generated/graphql';

export type EventWithCategory = EventInfoFragment & {
  primaryCategory: string;  // Derived field
};
```

## Codegen configuration

Location: `pursuit/codegen.ts`

Current config:
- Schema: `http://localhost:8000/graphql/` (Django backend)
- Documents: `graphql/**/*.ts` (queries, fragments)
- Generates: `graphql/generated/`
- Plugins: TypeScript, TypeScript operations, typed document node

If backend URL changes (e.g., using staging):
```typescript
// codegen.ts
const config: CodegenConfig = {
  schema: process.env.GRAPHQL_ENDPOINT || 'http://localhost:8000/graphql/',
  // ...
};
```

Then run:
```bash
GRAPHQL_ENDPOINT=https://pursuit-backend-staging.onrender.com/graphql/ npm run codegen
```

## When to run codegen

**Always run codegen after**:
1. Adding a new GraphQL query or mutation in `graphql/queries.ts`
2. Adding a field to a fragment in `graphql/fragments.ts`
3. Pulling backend schema changes from git
4. Switching branches with schema differences

**Don't need to run codegen when**:
1. Only frontend component changes
2. Only styling or layout changes
3. No GraphQL queries/mutations touched

## Git workflow with schema changes

```bash
# Backend developer adds new field
cd pursuit-backend
# ... make schema changes ...
git add apps/events/schema.py
git commit -m "feat(events): add isEditorsPick field to Event type"
git push

# Frontend developer pulls changes
cd pursuit
git pull
npm run codegen  # ← CRITICAL STEP
# ... fix TypeScript errors ...
git add graphql/generated/
git commit -m "chore: regenerate types after schema update"
git push
```

**Do NOT commit** generated files separately from the code that uses them.
Both should be in the same commit.

## Troubleshooting codegen failures

### "Failed to load schema"

Backend server is not running or not accessible.

```bash
cd pursuit-backend
python manage.py runserver
# Wait for "Starting development server at http://127.0.0.1:8000/"

cd pursuit
npm run codegen
```

### "Unknown type X"

You referenced a type in a query that doesn't exist in the backend schema.

Check backend schema for typos:
```graphql
query GetEvent($id: ID!) {
  event(id: $id) {
    id
    name
    isEditorsPick  # ← Does this field exist in EventType?
  }
}
```

### "Syntax error in GraphQL query"

Your query has a syntax error. Run the query in GraphQL playground first:
`http://localhost:8000/graphql/` → paste query → test

### Generated types are empty or missing

Delete the generated folder and regenerate:
```bash
rm -rf graphql/generated
npm run codegen
```

## Hard rules

- NEVER edit `graphql/generated/*.ts` files manually
- NEVER use `any` type to bypass codegen errors — fix the schema or query
- NEVER commit generated types without also committing the query changes that require them
- ALWAYS run codegen after pulling schema changes from git
- ALWAYS check that backend server is running before running codegen
- ALWAYS use fragments for complex types (Event, User, etc.) — don't inline fields
