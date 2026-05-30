# Pursuit — Backend-Frontend sync patterns

How changes flow between the two repos and what to do in the correct order.

## Core principle

The backend is the source of truth for:
- Data schema (GraphQL types)
- Business logic (recommendations, EditorsPick selection, location tagging)
- Cache invalidation rules (Redis TTLs)

The frontend is the source of truth for:
- UI state (which tab is active, modal open/closed)
- Visual design (color tokens, category variants)
- Navigation flow (modal stack, deep links)

Neither should duplicate the other's responsibilities.

## Adding a new feature end-to-end

### Example: Add "Going count" to events (how many users saved this event)

**Step 1: Backend model change**

```python
# pursuit-backend/apps/events/models.py
class Event(models.Model):
    # ... existing fields ...

    @property
    def going_count(self):
        """Count of users who saved this event"""
        return self.user_interactions.count()
```

**Step 2: Backend schema update**

```python
# pursuit-backend/apps/events/schema.py
class EventType(DjangoObjectType):
    going_count = graphene.Int()

    def resolve_going_count(self, info):
        # Use select_related to avoid N+1
        return self.user_interactions.count()

    class Meta:
        model = Event
        fields = '__all__'
```

**Step 3: Backend test**

```python
# pursuit-backend/apps/events/tests.py
def test_going_count(self):
    event = EventFactory.create()
    user1 = UserFactory.create()
    user2 = UserFactory.create()

    UserEvents.objects.create(user=user1, event=event)
    UserEvents.objects.create(user=user2, event=event)

    self.assertEqual(event.going_count, 2)
```

**Step 4: Backend migration (if model field added)**

```bash
cd pursuit-backend
python manage.py makemigrations events
python manage.py migrate
```

**Step 5: Start backend server**

```bash
python manage.py runserver
```

**Step 6: Frontend — update fragment**

```typescript
// pursuit/graphql/fragments.ts
export const EVENT_FRAGMENT = gql`
  fragment EventInfo on EventType {
    id
    name
    date
    isSaved
    goingCount  # ← ADD NEW FIELD
    # ... other fields
  }
`;
```

**Step 7: Frontend — run codegen**

```bash
cd pursuit
npm run codegen
```

This regenerates `graphql/generated/graphql.ts` with the new `goingCount` field on `EventInfoFragment`.

**Step 8: Frontend — use the new field**

```typescript
// pursuit/components/Cards/RecommendationCard/RecommendationCard.tsx
import { EventInfoFragment } from 'graphql/generated/graphql';

type Props = {
  event: EventInfoFragment;
};

export const RecommendationCard = ({ event }: Props) => {
  return (
    <View>
      <Text>{event.name}</Text>
      <Text>{event.goingCount} going</Text>  {/* ← Type-safe! */}
    </View>
  );
};
```

**Step 9: Frontend — test**

```typescript
// pursuit/components/Cards/RecommendationCard/__tests__/RecommendationCard.test.tsx
it('displays going count', () => {
  const event = createMockEvent({ goingCount: 42 });
  render(<RecommendationCard event={event} />);
  expect(screen.getByText('42 going')).toBeTruthy();
});
```

**Step 10: Commit both repos**

```bash
# Backend
cd pursuit-backend
git add apps/events/models.py apps/events/schema.py apps/events/tests.py
git commit -m "feat(events): add going_count field to Event"
git push

# Frontend
cd pursuit
git add graphql/fragments.ts graphql/generated/ components/Cards/RecommendationCard/
git commit -m "feat(events): display going count on event cards"
git push
```

## Change patterns and required steps

### Pattern 1: New GraphQL query (no backend change needed)

Example: Add a "Get saved events" query that uses existing backend resolver.

**Backend**: No changes (resolver already exists)

**Frontend**:
1. Add query to `graphql/queries.ts`
2. Run `npm run codegen`
3. Create hook (e.g., `useSavedEvents.ts`)
4. Use in component
5. Add tests

### Pattern 2: New mutation (backend resolver needed)

Example: Add "Unsave all events" mutation.

**Backend**:
1. Add mutation to schema
2. Implement resolver
3. Add test
4. Start server

**Frontend**:
1. Add mutation to `graphql/queries.ts`
2. Run `npm run codegen`
3. Create/update hook
4. Use in component with optimistic response
5. Update cache.modify to reflect changes
6. Add tests

### Pattern 3: Change existing field type (schema migration)

Example: Change `date` from String to DateTime.

**Backend**:
1. Update schema type definition
2. Update resolver (if needed)
3. Migration if database field changes
4. Update seed data
5. Test

**Frontend**:
1. Run `npm run codegen`
2. Fix all TypeScript errors (type changed from string to DateTime)
3. Update date formatting utils if needed
4. Update tests

### Pattern 4: Add computed field (no database change)

Example: Add `isUpcoming` boolean to Event (computed from date).

**Backend**:
1. Add `@property` or resolver method
2. Add to schema type
3. Test
4. Start server

**Frontend**:
1. Add to fragment
2. Run `npm run codegen`
3. Use in component
4. Test

## Cache invalidation sync

When backend changes affect cached data:

**Backend cache keys** (Redis):
```python
# apps/insights/resolvers.py
cache_key = f"home:{user_id}:{location_tag}:{time_filter}:{pick_id}"
```

**Frontend cache policy**:
```typescript
// pursuit/hooks/useHome.ts
useQuery(GET_HOME, {
  fetchPolicy: 'cache-and-network',  // Always fetch, but show cache first
});
```

**When to invalidate frontend cache**:
- User saves/unsaves event → `cache.modify` (optimistic)
- Location changes → `refetchQueries: [GET_HOME]`
- Time filter changes → query variables change, Apollo auto-refetches

**When to invalidate backend cache**:
- EditorsPick changes → clear `home:{userId}:{locationTag}:*` pattern
- Weather API updates → clear `weather:{locationTag}` (TTL handles this)
- User saves event → no home cache invalidation needed (computed on read)

## Location tag sync

**Backend** derives location_tag from GPS coords:

```python
# pursuit-backend/apps/users/utils.py
def location_tag_from_coords(lat, lng):
    # Nairobi bounding box
    if -1.45 <= lat <= -1.15 and 36.65 <= lng <= 37.10:
        return "nairobi"
    # Mombasa bounding box
    elif -4.10 <= lat <= -3.95 and 39.60 <= lng <= 39.75:
        return "mombasa"
    else:
        return "kenya"  # fallback
```

**Frontend** sends GPS, receives normalized tag:

```typescript
// pursuit/hooks/useLocation.ts
await enableLocationMutation({
  variables: {
    locationName: "Nairobi, Kenya",
    location: [latitude, longitude],  // Backend derives tag from this
  },
});

// getHome query uses the derived tag
const { data } = useQuery(GET_HOME);  // Backend uses user.profile.last_synced_location_tag
```

**Critical**: Frontend NEVER stores or computes location_tag directly.
It only sends GPS coords. Backend normalizes and stores the tag.

## Permission sync (location example)

**Backend** stores canonical permission state:

```python
# UserProfile.allow_location_sharing
# This is the source of truth
```

**Frontend** reconciles OS permission with backend state:

```typescript
// pursuit/hooks/useLocation.ts
const { status } = await Location.getForegroundPermissionsAsync();
const backendEnabled = user.profile?.allowLocationSharing ?? false;

if (status === 'denied' && backendEnabled) {
  // OS permission revoked but backend thinks it's on
  await client.mutate({ mutation: DISABLE_LOCATION });
}
```

**Flow**:
1. User denies permission in OS settings
2. App launches, reconciliation runs
3. Frontend detects mismatch
4. Frontend calls `DISABLE_LOCATION` mutation
5. Backend updates `UserProfile.allow_location_sharing = False`
6. Backend nulls out lat/lng
7. Next getHome query returns null weather

## Error handling sync

**Backend** returns structured errors:

```python
class SaveEventMutation(graphene.Mutation):
    ok = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, id):
        try:
            # ... save logic ...
            return SaveEventMutation(ok=True, errors=[])
        except Event.DoesNotExist:
            return SaveEventMutation(ok=False, errors=["Event not found"])
```

**Frontend** handles errors and rolls back optimistic updates:

```typescript
// pursuit/hooks/useSaveToggle.ts
const [saveEvent] = useMutation(SAVE_EVENT, {
  optimisticResponse: { /* ... */ },
  update: (cache) => { /* cache.modify ... */ },
  onError: (error) => {
    // Optimistic update is auto-rolled back by Apollo
    Alert.alert('Error', 'Could not save event');
  },
});
```

## Seed data sync

Backend seed scenarios must match frontend test expectations:

**Backend seed**:
```python
# pursuit-backend/management/commands/seed_scenario_a.py
# Create User A with location sharing on, active EditorsPick for Nairobi
user_a = User.objects.get_or_create(email="user_a@test.com")
user_a.profile.allow_location_sharing = True
user_a.profile.location = Point(36.8219, -1.2921)  # Nairobi coords
```

**Frontend expects**:
```typescript
// When logged in as user_a@test.com:
// - InsightsCard shows weather
// - Hero card shows EditorsPick with badge
// - getHome.allowLocationSharing === true
```

Both repos should document seed scenarios in the same format (see CLAUDE.md).

## Hard rules for sync

1. **Never duplicate business logic**
   - Recommendation ranking: backend only
   - Category variant colors: frontend only
   - Location tag derivation: backend only
   - Navigation state: frontend only

2. **Always use generated types**
   - Backend schema change → frontend codegen → use generated types
   - Never manually sync type definitions

3. **Cache keys must match**
   - If backend changes cache key format, frontend refetch must use new format
   - Both use `userId` at minimum in all cache keys

4. **Migration order matters**
   - Additive changes (new optional field): backend first, frontend anytime
   - Breaking changes (rename field): requires coordination or versioning

5. **Test data must align**
   - Seed scenario names match between repos
   - Test users have same emails and states in both

6. **Never bypass the sync workflow**
   - Don't manually update generated types to "fix" schema mismatch
   - Don't add frontend fallbacks for missing backend fields — fix the backend
   - Don't cache-patch around backend data issues — fix the resolver
