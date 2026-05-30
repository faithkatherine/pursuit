---
description: "Add tests for a component, hook, or screen in Pursuit"
---

Add tests for a component, hook, or screen (e.g. RecommendationCard or useSaveToggle).

Before writing:

- Check if a `__tests__` directory exists alongside the target file
- Read existing test files in the same directory to match patterns
- Confirm the target file's dependencies (what it imports)

## Test file location patterns

Component tests:

```text
components/Cards/RecommendationCard/RecommendationCard.tsx
components/Cards/RecommendationCard/__tests__/RecommendationCard.test.tsx
```

Hook tests:

```text
hooks/useSaveToggle.ts
hooks/__tests__/useSaveToggle.test.ts
```

Screen tests:

```text
screens/Events/EventDetail.tsx
screens/Events/__tests__/EventDetail.test.tsx
```

## Testing stack and patterns

- Jest + React Native Testing Library
- @testing-library/react-native for component tests
- @testing-library/react-hooks for hook tests
- Mock Apollo Client queries/mutations using MockedProvider
- Mock expo modules (expo-router, expo-location) using jest.mock()

## Component test requirements

```typescript
import { render, screen } from '@testing-library/react-native';
import { MockedProvider } from '@apollo/client/testing';
import ComponentName from '../ComponentName';

describe('ComponentName', () => {
  it('renders with required props', () => {
    render(
      <MockedProvider>
        <ComponentName {...requiredProps} />
      </MockedProvider>
    );
    expect(screen.getByText('Expected text')).toBeTruthy();
  });

  it('applies category variant styling when category is present', () => {
    // Test category variant logic if applicable
  });

  it('handles missing optional props gracefully', () => {
    // Test defensive rendering
  });
});
```

## Hook test requirements

```typescript
import { renderHook, waitFor } from '@testing-library/react-native';
import { MockedProvider } from '@apollo/client/testing';
import useHookName from '../useHookName';

const wrapper = ({ children }) => (
  <MockedProvider mocks={mocks}>{children}</MockedProvider>
);

describe('useHookName', () => {
  it('returns expected initial state', () => {
    const { result } = renderHook(() => useHookName(), { wrapper });
    expect(result.current.someValue).toBe(expectedValue);
  });

  it('handles mutation optimistically', async () => {
    const { result } = renderHook(() => useHookName(), { wrapper });

    act(() => {
      result.current.mutationFunction(args);
    });

    // Optimistic response should update immediately
    expect(result.current.someValue).toBe(optimisticValue);

    await waitFor(() => {
      // Server response should update after network round trip
      expect(result.current.someValue).toBe(serverValue);
    });
  });
});
```

## Apollo query/mutation mocking pattern

```typescript
import { GET_HOME, SAVE_EVENT } from 'graphql/queries';

const mocks = [
  {
    request: {
      query: GET_HOME,
      variables: { offset: 0, limit: 10 },
    },
    result: {
      data: {
        getHome: {
          id: '1',
          greeting: 'Good morning',
          recommendations: [...],
          // Full mock data matching generated types
        },
      },
    },
  },
  {
    request: {
      query: SAVE_EVENT,
      variables: { id: 'event-123' },
    },
    result: {
      data: {
        saveEvent: {
          ok: true,
          event: {
            id: 'event-123',
            isSaved: true,
          },
        },
      },
    },
  },
];
```

## What to test (priority order)

1. **Critical user paths**: save/unsave, navigation, authentication
2. **Data transformation**: category variant selection, date formatting
3. **Error states**: network failures, missing data, permission denied
4. **Edge cases**: empty lists, null values, very long strings
5. **Accessibility**: screen reader labels, touch targets

## What NOT to test

- Implementation details (internal state, private functions)
- Third-party library internals (Apollo Client's cache logic)
- Styling unless it's conditional (don't test that backgroundColor is a specific hex)
- Generated types from codegen

## Running tests

```bash
# Run all tests
npm test

# Run specific test file
npm test RecommendationCard.test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Test data factories

If the target uses complex GraphQL types, create a factory in the test file:

```typescript
const createMockEvent = (overrides = {}) => ({
  id: "event-1",
  name: "Test Event",
  date: "2026-06-01T18:00:00Z",
  isSaved: false,
  category: [{ name: "Culture & Arts" }],
  ...overrides,
});
```

## Hard rules

- NEVER mock the component under test — only its dependencies
- NEVER use `any` type in test files — use generated GraphQL types
- NEVER test implementation details — test user-visible behavior
- Always clean up timers, subscriptions, or async operations in afterEach
- Always use MockedProvider for components that use GraphQL
