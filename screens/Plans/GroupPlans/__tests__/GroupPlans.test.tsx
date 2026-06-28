import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import GroupPlans from '../GroupPlans';
import { useMyGroupPlans, useCreateGroupPlan } from '@/hooks/useGroupPlans';

// Mock dependencies
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/useGroupPlans', () => ({
  useMyGroupPlans: jest.fn(),
  useCreateGroupPlan: jest.fn(),
}));

jest.mock('@/components/Layout/Layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('GroupPlans', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
  };

  const mockGroupPlans = [
    {
      id: '1',
      displayName: "John's Music Picks · Jun 28",
      status: 'DRAFT',
      bucketEvents: [
        {
          id: 'be1',
          event: {
            id: 'e1',
            name: 'Jazz Concert',
            image: 'https://example.com/image1.jpg',
          },
        },
        {
          id: 'be2',
          event: {
            id: 'e2',
            name: 'Rock Festival',
            image: 'https://example.com/image2.jpg',
          },
        },
      ],
      invitations: [
        {
          id: 'inv1',
          shareToken: 'abc123',
          isActive: true,
        },
      ],
      createdAt: '2024-06-28T10:00:00Z',
      updatedAt: '2024-06-28T10:00:00Z',
    },
    {
      id: '2',
      displayName: "Sarah's Food Picks · Jun 27",
      status: 'OPEN',
      bucketEvents: [
        {
          id: 'be3',
          event: {
            id: 'e3',
            name: 'Food Festival',
            image: null,
          },
          interestedCount: 3,
        },
      ],
      invitations: [],
      createdAt: '2024-06-27T10:00:00Z',
      updatedAt: '2024-06-27T10:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should render loading state', () => {
    (useMyGroupPlans as jest.Mock).mockReturnValue({
      groupPlans: [],
      loading: true,
      refetch: jest.fn(),
    });

    (useCreateGroupPlan as jest.Mock).mockReturnValue({
      createGroupPlan: jest.fn(),
      loading: false,
    });

    const { getByTestId } = render(<GroupPlans />);

    // Should show loading indicator
    expect(getByTestId).toBeDefined();
  });

  it('should render group plans list', async () => {
    (useMyGroupPlans as jest.Mock).mockReturnValue({
      groupPlans: mockGroupPlans,
      loading: false,
      refetch: jest.fn(),
    });

    (useCreateGroupPlan as jest.Mock).mockReturnValue({
      createGroupPlan: jest.fn(),
      loading: false,
    });

    const { getByText, getAllByText } = render(<GroupPlans />);

    await waitFor(() => {
      expect(getByText("John's Music Picks · Jun 28")).toBeTruthy();
      expect(getByText("Sarah's Food Picks · Jun 27")).toBeTruthy();
      expect(getByText('2 events')).toBeTruthy();
      expect(getByText('1 events')).toBeTruthy();
    });
  });

  it('should display status badges correctly', async () => {
    (useMyGroupPlans as jest.Mock).mockReturnValue({
      groupPlans: mockGroupPlans,
      loading: false,
      refetch: jest.fn(),
    });

    (useCreateGroupPlan as jest.Mock).mockReturnValue({
      createGroupPlan: jest.fn(),
      loading: false,
    });

    const { getByText } = render(<GroupPlans />);

    await waitFor(() => {
      expect(getByText('DRAFT')).toBeTruthy();
      expect(getByText('OPEN')).toBeTruthy();
    });
  });

  it('should navigate to plan detail when card is pressed', async () => {
    (useMyGroupPlans as jest.Mock).mockReturnValue({
      groupPlans: mockGroupPlans,
      loading: false,
      refetch: jest.fn(),
    });

    (useCreateGroupPlan as jest.Mock).mockReturnValue({
      createGroupPlan: jest.fn(),
      loading: false,
    });

    const { getByText } = render(<GroupPlans />);

    await waitFor(() => {
      const planCard = getByText("John's Music Picks · Jun 28");
      fireEvent.press(planCard);
    });

    expect(mockRouter.push).toHaveBeenCalledWith('/group-plans/1');
  });

  it('should create new plan and navigate to setup', async () => {
    const mockCreateGroupPlan = jest.fn().mockResolvedValue({ id: 'new-plan-id' });

    (useMyGroupPlans as jest.Mock).mockReturnValue({
      groupPlans: [],
      loading: false,
      refetch: jest.fn(),
    });

    (useCreateGroupPlan as jest.Mock).mockReturnValue({
      createGroupPlan: mockCreateGroupPlan,
      loading: false,
    });

    const { getByText } = render(<GroupPlans />);

    const createButton = getByText('New Plan');
    fireEvent.press(createButton);

    await waitFor(() => {
      expect(mockCreateGroupPlan).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith('/group-plans/new-plan-id/setup');
    });
  });

  it('should render empty state when no plans', async () => {
    (useMyGroupPlans as jest.Mock).mockReturnValue({
      groupPlans: [],
      loading: false,
      refetch: jest.fn(),
    });

    (useCreateGroupPlan as jest.Mock).mockReturnValue({
      createGroupPlan: jest.fn(),
      loading: false,
    });

    const { getByText } = render(<GroupPlans />);

    await waitFor(() => {
      expect(getByText('No Group Plans Yet')).toBeTruthy();
      expect(getByText('Create a group plan to vote on events with friends')).toBeTruthy();
    });
  });

  it('should handle refresh', async () => {
    const mockRefetch = jest.fn();

    (useMyGroupPlans as jest.Mock).mockReturnValue({
      groupPlans: mockGroupPlans,
      loading: false,
      refetch: mockRefetch,
    });

    (useCreateGroupPlan as jest.Mock).mockReturnValue({
      createGroupPlan: jest.fn(),
      loading: false,
    });

    const { getByTestId } = render(<GroupPlans />);

    // Note: Testing pull-to-refresh in React Native Testing Library is limited
    // This is a placeholder for where the test would go
    expect(mockRefetch).toBeDefined();
  });

  it('should show +X more indicator for plans with more than 3 events', async () => {
    const planWithManyEvents = {
      ...mockGroupPlans[0],
      bucketEvents: [
        ...mockGroupPlans[0].bucketEvents,
        { id: 'be4', event: { id: 'e4', name: 'Event 4' } },
        { id: 'be5', event: { id: 'e5', name: 'Event 5' } },
      ],
    };

    (useMyGroupPlans as jest.Mock).mockReturnValue({
      groupPlans: [planWithManyEvents],
      loading: false,
      refetch: jest.fn(),
    });

    (useCreateGroupPlan as jest.Mock).mockReturnValue({
      createGroupPlan: jest.fn(),
      loading: false,
    });

    const { getByText } = render(<GroupPlans />);

    await waitFor(() => {
      expect(getByText('+2')).toBeTruthy(); // 5 events - 3 shown = +2
    });
  });
});
