# Pursuit — Component and screen template constraints

Rules and patterns for building UI components and screens. Read before creating any new component.

## Component file structure (mandatory)

Every component must follow this structure:

```
components/
  ComponentName/
    ComponentName.tsx           # Main component file
    index.tsx                   # Re-export only: export { ComponentName } from './ComponentName';
    __tests__/
      ComponentName.test.tsx    # Tests
    ComponentName.stories.tsx   # Optional: Storybook stories (not in V1)
```

Screen components follow the same pattern in `screens/` instead of `components/`.

## Component template

```typescript
// components/Cards/EventCard/EventCard.tsx
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { EventInfoFragment } from 'graphql/generated/graphql';
import colors from 'themes/tokens/colors';
import { spacing } from 'themes/tokens/spacing';

// 1. Props interface — always at the top
type EventCardProps = {
  event: EventInfoFragment;
  onPress?: () => void;
  variant?: 'default' | 'compact';
};

// 2. Component function — named export
export const EventCard = ({ event, onPress, variant = 'default' }: EventCardProps) => {
  // 3. Early returns for loading/error states
  if (!event) {
    return null;
  }

  // 4. Derived values and handlers
  const isCompact = variant === 'compact';

  const handlePress = () => {
    onPress?.();
  };

  // 5. Render
  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <Text style={styles.title}>{event.name}</Text>
      {!isCompact && <Text style={styles.date}>{event.date}</Text>}
    </Pressable>
  );
};

// 6. Styles using StyleSheet.create and tokens
const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.thunder,
  },
  date: {
    fontSize: 14,
    color: colors.aluminium,
    marginTop: spacing.xs,
  },
});
```

## Hard constraints for all components

### 1. Type safety

```typescript
// ✓ DO: Use generated GraphQL types
import { EventInfoFragment } from 'graphql/generated/graphql';
type Props = { event: EventInfoFragment };

// ✗ DON'T: Use any or manual type definitions
type Props = { event: any };
type Props = { event: { id: string; name: string } };  // Will drift from schema
```

### 2. Color tokens only

```typescript
// ✓ DO: Use color tokens from themes/tokens/colors.ts
import colors from 'themes/tokens/colors';
backgroundColor: colors.ghostWhite

// ✗ DON'T: Inline hex values
backgroundColor: '#FAF7FC'
backgroundColor: 'rgb(250, 247, 252)'
```

### 3. Spacing tokens only

```typescript
// ✓ DO: Use spacing tokens
import { spacing } from 'themes/tokens/spacing';
padding: spacing.md
marginTop: spacing.xs

// ✗ DON'T: Magic numbers
padding: 16
marginTop: 8
```

### 4. No inline styles for reusable values

```typescript
// ✓ DO: StyleSheet.create for repeated styles
const styles = StyleSheet.create({
  container: { padding: spacing.md },
});

// ✗ DON'T: Inline styles with color/spacing tokens
<View style={{ padding: spacing.md, backgroundColor: colors.white }} />

// ✓ OK: Inline styles for dynamic/one-off values
<View style={{ opacity: isDisabled ? 0.5 : 1 }} />
```

### 5. Conditional rendering patterns

```typescript
// ✓ DO: Use early returns for loading/null states
if (!data) return <Loading />;
if (error) return <Error message={error.message} />;

// ✓ DO: Use && for conditional elements
{isEditorsPick && <Badge text="Editor's Pick" />}

// ✗ DON'T: Nest ternaries more than one level
{isLoading ? <Loading /> : error ? <Error /> : <Content />}  // Hard to read

// ✓ DO: Extract complex conditions
const shouldShowBadge = isEditorsPick && !isExpired && hasNote;
{shouldShowBadge && <Badge />}
```

### 6. Props destructuring and defaults

```typescript
// ✓ DO: Destructure props with defaults in function signature
export const Button = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false
}: ButtonProps) => {
  // ...
};

// ✗ DON'T: Destructure inside function body
export const Button = (props: ButtonProps) => {
  const { label, onPress } = props;
  const variant = props.variant || 'primary';  // Use ?? or default param instead
};
```

### 7. Event handlers

```typescript
// ✓ DO: Define handlers as const functions
const handlePress = () => {
  onPress?.();
};

// ✓ DO: Use optional chaining for optional callbacks
onComplete?.();

// ✗ DON'T: Define handlers inline in render
<Pressable onPress={() => onPress?.()} />  // Creates new function on every render

// ✓ OK: Inline for handlers with parameters
<Pressable onPress={() => onItemPress(item.id)} />
```

## Screen template

```typescript
// screens/Events/EventDetail.tsx
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useQuery } from '@apollo/client';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GET_EVENT } from 'graphql/queries';
import { Loading } from 'components/Layout/Loading';
import { Error } from 'components/Layout/Error';
import colors from 'themes/tokens/colors';
import { spacing } from 'themes/tokens/spacing';

export const EventDetail = () => {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const router = useRouter();

  // Data fetching
  const { data, loading, error } = useQuery(GET_EVENT, {
    variables: { id: eventId },
    skip: !eventId,
  });

  // Loading state
  if (loading) {
    return <Loading />;
  }

  // Error state
  if (error || !data?.event) {
    return <Error message="Could not load event" onRetry={() => router.back()} />;
  }

  const { event } = data;

  // Render
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{event.name}</Text>
      {/* ... rest of screen */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ghostWhite,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.thunder,
    padding: spacing.lg,
  },
});
```

## Hard constraints for screens

### 1. Always handle loading and error states

```typescript
// ✓ DO: Show dedicated loading/error components
if (loading) return <Loading />;
if (error) return <Error message={error.message} />;

// ✗ DON'T: Render nothing or show broken UI
if (loading) return null;  // User sees blank screen
if (error) return <View />;  // Silent failure
```

### 2. Use route params with types

```typescript
// ✓ DO: Type route params
const { eventId } = useLocalSearchParams<{ eventId: string }>();

// ✗ DON'T: Untyped params
const { eventId } = useLocalSearchParams();  // eventId is string | string[]
```

### 3. Screen-level data fetching only

```typescript
// ✓ DO: Fetch data at screen level, pass down as props
// EventDetail.tsx
const { data } = useQuery(GET_EVENT, { variables: { id: eventId } });
return <EventHeader event={data.event} />;

// ✗ DON'T: Fetch in deeply nested components
// EventHeader.tsx (child component)
const { data } = useQuery(GET_EVENT, { variables: { id } });  // Fetches again!
```

### 4. Skeleton loading pattern

For data-heavy screens, show skeleton instead of full-screen spinner:

```typescript
// ✓ DO: Show layout skeleton
if (loading) {
  return (
    <View style={styles.container}>
      <Skeleton width="100%" height={200} />
      <Skeleton width="80%" height={24} style={{ marginTop: spacing.md }} />
      <Skeleton width="60%" height={16} style={{ marginTop: spacing.sm }} />
    </View>
  );
}

// ✗ DON'T: Full screen spinner for content-heavy screens
if (loading) return <Loading />;  // OK for simple screens, bad for complex ones
```

## Category variant constraints

Category variants apply ONLY to RecommendationCard. Do not use elsewhere.

```typescript
// ✓ DO: Use variants in RecommendationCard
import { getVariant } from 'utils/categoryVariants';

const variant = getVariant(event);
const cardBg = variant?.cardBackground ?? colors.white;

// ✗ DON'T: Use variants in other card types
// TrendingCard, HeroCard, UpcomingCard all use uniform styling
```

## Animation constraints

### 1. Use React Native Reanimated, not Animated

```typescript
// ✓ DO: Use Reanimated
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

const scale = useSharedValue(1);
const handlePress = () => {
  scale.value = withSpring(1.2);
};

// ✗ DON'T: Use legacy Animated API
import { Animated } from 'react-native';
```

### 2. Keep animations subtle

```typescript
// ✓ DO: Subtle scale and opacity changes
scale.value = withSpring(1.05, { damping: 15 });

// ✗ DON'T: Aggressive animations
scale.value = withSpring(2.0);  // Too much
```

## Accessibility constraints

### 1. Touch targets minimum 44x44

```typescript
// ✓ DO: Ensure tappable elements are at least 44x44
const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// ✗ DON'T: Tiny touch targets
const styles = StyleSheet.create({
  iconButton: {
    width: 20,
    height: 20,  // Too small
  },
});
```

### 2. Accessible labels for interactive elements

```typescript
// ✓ DO: Add accessibility labels
<Pressable
  accessibilityLabel="Save event to your plans"
  accessibilityRole="button"
  onPress={handleSave}
>
  <HeartIcon />
</Pressable>

// ✗ DON'T: Icon-only buttons without labels
<Pressable onPress={handleSave}>
  <HeartIcon />
</Pressable>
```

## Component reuse patterns

Before creating a new component, check:

1. **Does an existing component do this?**
   - Search `components/` directory
   - Check for similar patterns in existing screens

2. **Can an existing component be extended?**
   - Add a variant prop instead of creating new component
   - Use composition pattern (wrap existing component)

3. **Is this really reusable?**
   - Used in 2+ places = make it a component
   - Used once = inline in screen, extract later if needed

```typescript
// ✓ DO: Extend existing component with variant
<Button variant="secondary" label="Cancel" />

// ✗ DON'T: Create CancelButton, SecondaryButton, etc.
<SecondaryButton label="Cancel" />
```

## Hard rules summary

- ✓ Use generated GraphQL types, never `any`
- ✓ Use color tokens, never inline hex
- ✓ Use spacing tokens, never magic numbers
- ✓ StyleSheet.create for styles, not inline objects (except dynamic values)
- ✓ Handle loading and error states on every screen
- ✓ Type route params with useLocalSearchParams<T>
- ✓ Fetch data at screen level, pass down as props
- ✓ Use Reanimated, not legacy Animated
- ✓ Category variants only in RecommendationCard
- ✓ Minimum 44x44 touch targets
- ✓ Accessibility labels on all interactive elements
- ✗ Never create duplicate components
- ✗ Never add new animation libraries
- ✗ Never use cheerful empty state copy
