import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import Home from "../Home";
import { useQuery } from "@apollo/client";
import { useAuth } from "contexts/AuthContext";
import { Alert } from "react-native";

// Mock the Layout components
jest.mock("components/Layout", () => ({
  Layout: ({ children }: { children: React.ReactNode }) => children,
  Loading: () => <text>Loading...</text>,
  Error: ({ error }: { error: string }) => <text>Error: {error}</text>,
}));

// Mock the card components
jest.mock("components/Cards/InsightsCard", () => ({
  InsightsCard: ({ insightsData }: any) => (
    <text testID="insights-card">Insights: {insightsData.id}</text>
  ),
}));

jest.mock("components/Cards/BucketCard", () => ({
  BucketCard: ({ name, emoji }: any) => (
    <text testID="bucket-card">
      {emoji} {name}
    </text>
  ),
}));

jest.mock("components/Cards/EventsCard", () => ({
  RecommendationCard: ({ recommendation }: any) => (
    <text testID="recommendation-card">{recommendation.title}</text>
  ),
}));

jest.mock("components/Cards/BucketItemCard", () => ({
  BucketItemCard: ({ title }: any) => (
    <text testID="bucket-item-card">{title}</text>
  ),
}));

// Mock the Carousel component
jest.mock("components/Carousel/Carousel", () => ({
  Carousel: ({ items, header }: any) => (
    <div testID="carousel">
      {header}
      {items}
    </div>
  ),
}));

// Mock the AddBucket component
jest.mock("components/Buckets/AddBucket", () => ({
  AddBucket: () => <text testID="add-bucket">Add Bucket Form</text>,
}));

// Mock Apollo Client
jest.mock("@apollo/client", () => ({
  useQuery: jest.fn(),
}));

// Mock Auth Context
jest.mock("contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock Alert
jest.mock("react-native", () => ({
  ...jest.requireActual("react-native"),
  Alert: {
    alert: jest.fn(),
  },
}));

describe("Home Screen", () => {
  const mockUser = {
    id: "1",
    name: "Test User",
    email: "test@example.com",
  };

  const mockHomeData = {
    getHome: {
      id: "home-1",
      greeting: "Good morning, Test User",
      timeOfDay: "morning",
      weather: {
        city: "San Francisco",
        condition: "Sunny",
        temperature: 22,
      },
      insights: {
        id: "insights-1",
        weather: {
          city: "San Francisco",
          condition: "Sunny",
          temperature: 22,
        },
        nextDestination: {
          location: "Tokyo, Japan",
          daysAway: 14,
        },
        progress: {
          completed: 15,
          yearlyGoal: 25,
          percentage: 60,
        },
        recentAchievement: "Completed hiking challenge",
      },
      bucketCategories: [
        { id: "1", name: "Travel", emoji: "✈️" },
        { id: "2", name: "Food", emoji: "🍕" },
      ],
      recommendations: [
        {
          id: "1",
          title: "Beach Cleanup",
          date: "2023-10-15",
          location: "Santa Monica",
        },
        {
          id: "2",
          title: "Tech Conference",
          date: "2023-11-20",
          location: "LA",
        },
      ],
      upcoming: [
        {
          id: "1",
          title: "Learn to surf",
          description: "Take surfing lessons",
          image: "surf-image.jpg",
          category: { name: "Travel" },
        },
        {
          id: "2",
          title: "Visit Tokyo",
          description: "Explore Japan",
          image: "tokyo-image.jpg",
          category: { name: "Travel" },
        },
      ],
    },
  };

  const mockSignOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      signOut: mockSignOut,
    });

    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      data: mockHomeData,
    });
  });

  it("should render loading state", () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: true,
      error: null,
      data: null,
    });

    const { getByText } = render(<Home />);
    expect(getByText("Loading...")).toBeTruthy();
  });

  it("should render error state", () => {
    const errorMessage = "Network error occurred";
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: { message: errorMessage },
      data: null,
    });

    const { getByText } = render(<Home />);
    expect(getByText(`Error: ${errorMessage}`)).toBeTruthy();
  });

  it("should render home content when data is loaded", () => {
    const { getByText, getByTestId } = render(<Home />);

    // Check greeting
    expect(getByText("Good morning, Test User")).toBeTruthy();

    // Check insights card
    expect(getByTestId("insights-card")).toBeTruthy();

    // Check bucket categories
    expect(getByText("✈️ Travel")).toBeTruthy();
    expect(getByText("🍕 Food")).toBeTruthy();

    // Check recommendations
    expect(getByText("Beach Cleanup")).toBeTruthy();
    expect(getByText("Tech Conference")).toBeTruthy();

    // Check upcoming bucket items
    expect(getByText("Learn to surf")).toBeTruthy();
    expect(getByText("Visit Tokyo")).toBeTruthy();
  });

  it("should open add bucket modal when add button is pressed", () => {
    const { getByText, getByTestId } = render(<Home />);

    const addButton = getByText("+");
    fireEvent.press(addButton);

    // Modal should be visible with AddBucket component
    expect(getByTestId("add-bucket")).toBeTruthy();
  });

  it("should show sign out confirmation when sign out button is pressed", () => {
    const { getByText } = render(<Home />);

    const signOutButton = getByText("Sign Out");
    fireEvent.press(signOutButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      "Sign Out",
      "Are you sure you want to sign out?",
      expect.arrayContaining([
        expect.objectContaining({ text: "Cancel", style: "cancel" }),
        expect.objectContaining({ text: "Sign Out", style: "destructive" }),
      ])
    );
  });

  it("should call signOut when confirmed", () => {
    (Alert.alert as jest.Mock).mockImplementation((title, message, buttons) => {
      // Simulate pressing the "Sign Out" button
      const signOutButton = buttons.find((btn: any) => btn.text === "Sign Out");
      if (signOutButton) {
        signOutButton.onPress();
      }
    });

    const { getByText } = render(<Home />);

    const signOutButton = getByText("Sign Out");
    fireEvent.press(signOutButton);

    expect(mockSignOut).toHaveBeenCalled();
  });

  it("should handle empty home data gracefully", () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      data: { getHome: null },
    });

    const { container } = render(<Home />);
    // Component should not crash and return null
    expect(container).toBeTruthy();
  });

  it("should render buckets section title", () => {
    const { getByText } = render(<Home />);
    expect(getByText("Your Buckets")).toBeTruthy();
  });

  it("should render recommendations section title", () => {
    const { getByText } = render(<Home />);
    expect(getByText("Recommendations")).toBeTruthy();
  });

  it("should render upcoming section title", () => {
    const { getByText } = render(<Home />);
    expect(getByText("Upcoming")).toBeTruthy();
  });

  it("should handle missing category gracefully", () => {
    const dataWithMissingCategory = {
      ...mockHomeData,
      getHome: {
        ...mockHomeData.getHome,
        upcoming: [
          {
            id: "1",
            title: "Learn to surf",
            description: "Take surfing lessons",
            image: "surf-image.jpg",
            category: null,
          },
        ],
      },
    };

    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      data: dataWithMissingCategory,
    });

    const { getByText } = render(<Home />);

    // Should still render the bucket item with default category
    expect(getByText("Learn to surf")).toBeTruthy();
  });
});
