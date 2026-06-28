import { renderHook, waitFor } from '@testing-library/react-native';
import { MockedProvider } from '@apollo/client/testing';
import { ReactNode } from 'react';
import {
  useCreateGroupPlan,
  useMyGroupPlans,
  useGroupPlan,
  useAddEventToBucket,
  useRemoveEventFromBucket,
  useCastVote,
} from '../useGroupPlans';
import {
  CREATE_GROUP_PLAN,
  GET_MY_GROUP_PLANS,
  GET_GROUP_PLAN,
  ADD_EVENT_TO_BUCKET,
  REMOVE_EVENT_FROM_BUCKET,
  CAST_VOTE,
} from '@/graphql/queries';

// Mock VoterSessionProvider
jest.mock('@/providers/VoterSessionProvider', () => ({
  useVoterSession: () => ({
    sessionToken: 'test-session-token',
    setSessionToken: jest.fn(),
    clearSession: jest.fn(),
    isLoading: false,
  }),
}));

describe('useGroupPlans hooks', () => {
  const mockGroupPlan = {
    id: '1',
    name: 'Test Plan',
    displayName: "John's Picks · Jun 28",
    status: 'DRAFT',
    creator: {
      id: 'user1',
      firstName: 'John',
    },
    bucketEvents: [],
    invitations: [
      {
        id: 'inv1',
        shareToken: 'abc123',
        isActive: true,
      },
    ],
  };

  describe('useCreateGroupPlan', () => {
    it('should create a group plan successfully', async () => {
      const mocks = [
        {
          request: {
            query: CREATE_GROUP_PLAN,
            variables: { name: 'My Plan' },
          },
          result: {
            data: {
              createGroupPlan: {
                groupPlan: mockGroupPlan,
              },
            },
          },
        },
      ];

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks} addTypename={false}>
          {children}
        </MockedProvider>
      );

      const { result } = renderHook(() => useCreateGroupPlan(), { wrapper });

      const plan = await result.current.createGroupPlan('My Plan');

      await waitFor(() => {
        expect(plan).toEqual(mockGroupPlan);
      });
    });

    it('should handle errors', async () => {
      const mocks = [
        {
          request: {
            query: CREATE_GROUP_PLAN,
            variables: { name: 'My Plan' },
          },
          error: new Error('Failed to create'),
        },
      ];

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks} addTypename={false}>
          {children}
        </MockedProvider>
      );

      const { result } = renderHook(() => useCreateGroupPlan(), { wrapper });

      await expect(result.current.createGroupPlan('My Plan')).rejects.toThrow();
    });
  });

  describe('useMyGroupPlans', () => {
    it('should fetch user group plans', async () => {
      const mocks = [
        {
          request: {
            query: GET_MY_GROUP_PLANS,
          },
          result: {
            data: {
              myGroupPlans: [mockGroupPlan],
            },
          },
        },
      ];

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks} addTypename={false}>
          {children}
        </MockedProvider>
      );

      const { result } = renderHook(() => useMyGroupPlans(), { wrapper });

      await waitFor(() => {
        expect(result.current.groupPlans).toEqual([mockGroupPlan]);
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('useAddEventToBucket', () => {
    it('should add event to bucket', async () => {
      const mockEvent = {
        id: 'be1',
        event: {
          id: 'e1',
          name: 'Test Event',
        },
        ordering: 1,
        interestedCount: 0,
      };

      const mocks = [
        {
          request: {
            query: ADD_EVENT_TO_BUCKET,
            variables: {
              groupPlanId: '1',
              eventId: 'e1',
            },
          },
          result: {
            data: {
              addEventToBucket: {
                groupPlanEvent: mockEvent,
              },
            },
          },
        },
      ];

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks} addTypename={false}>
          {children}
        </MockedProvider>
      );

      const { result } = renderHook(() => useAddEventToBucket(), { wrapper });

      const bucketEvent = await result.current.addEvent('1', 'e1');

      await waitFor(() => {
        expect(bucketEvent).toEqual(mockEvent);
      });
    });
  });

  describe('useRemoveEventFromBucket', () => {
    it('should remove event from bucket', async () => {
      const mocks = [
        {
          request: {
            query: REMOVE_EVENT_FROM_BUCKET,
            variables: {
              groupPlanEventId: 'be1',
            },
          },
          result: {
            data: {
              removeEventFromBucket: {
                success: true,
              },
            },
          },
        },
      ];

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks} addTypename={false}>
          {children}
        </MockedProvider>
      );

      const { result } = renderHook(() => useRemoveEventFromBucket(), { wrapper });

      await result.current.removeEvent('be1');

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('useCastVote', () => {
    it('should cast vote with session token', async () => {
      const mocks = [
        {
          request: {
            query: CAST_VOTE,
            variables: {
              groupPlanEventId: 'be1',
              sessionToken: 'test-session-token',
              direction: 'INTERESTED',
            },
          },
          result: {
            data: {
              castVote: {
                vote: {
                  id: 'v1',
                  direction: 'INTERESTED',
                  castAt: new Date().toISOString(),
                },
              },
            },
          },
        },
      ];

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={mocks} addTypename={false}>
          {children}
        </MockedProvider>
      );

      const { result } = renderHook(() => useCastVote(), { wrapper });

      const vote = await result.current.castVote('be1', 'INTERESTED');

      await waitFor(() => {
        expect(vote).toHaveProperty('id', 'v1');
        expect(vote).toHaveProperty('direction', 'INTERESTED');
      });
    });

    it('should throw error when no session token', async () => {
      // Override mock for this test
      jest.resetModules();
      jest.doMock('@/providers/VoterSessionProvider', () => ({
        useVoterSession: () => ({
          sessionToken: null,
          setSessionToken: jest.fn(),
          clearSession: jest.fn(),
          isLoading: false,
        }),
      }));

      const wrapper = ({ children }: { children: ReactNode }) => (
        <MockedProvider mocks={[]} addTypename={false}>
          {children}
        </MockedProvider>
      );

      const { result } = renderHook(() => useCastVote(), { wrapper });

      await expect(result.current.castVote('be1', 'INTERESTED')).rejects.toThrow(
        'No voter session token found'
      );
    });
  });
});
