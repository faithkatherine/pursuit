import React from "react";
import { render } from "@testing-library/react-native";
import Home from "../Home";
import { useQuery } from "@apollo/client";

// Mock the Layout components
jest.mock("components/Layout", () => ({
  Layout: ({ children }: { children: React.ReactNode }) => children,
  Loading: () => <text>Loading...</text>,
  Error: ({ error }: { error: string }) => <text>Error: {error}</text>,
  SectionHeader: ({ title }: { title: string }) => <text>{title}</text>,
}));

// Mock the card components
jest.mock("components/Cards/InsightsCard", () => ({
  InsightsCard: ({ greeting }: any) => (
    <text testID="insights-card">{greeting}</text>
  ),
}));

jest.mock("components/Cards/BucketCard", () => ({
  BucketCard: ({ name, icon }: any) => (
    <text testID="bucket-card">
      {icon} {name}
    </text>
  ),
  CategoryPills: () => null,
}));

jest.mock("components/Cards/EventsCard", () => ({
  RecommendationCard: ({ recommendation }: any) => (
    <text testID="recommendation-card">{recommendation.title}</text>
  ),
}));

// Mock the Carousel component
jest.mock("components/Carousel", () => ({
  Carousel: ({ items, header }: any) => (
    <div testID="carousel">
      {header}
      {items}
    </div>
  ),
}));

// Mock Apollo Client
jest.mock("@apollo/client", () => ({
  useQuery: jest.fn(),
}));

// Mock graphql hooks
jest.mock("graphql/hooks", () => ({
  useHomeData: () => (useQuery as jest.Mock)(),
}));

// Mock gradients
jest.mock("themes/tokens/gradients", () => ({
  getGradientByIndex: () => ["#000", "#fff"],
}));

describe("Home Screen", () => {
  const mockHomeData = {
    getHome: {
      id: "home-1",
      greeting: "Good morning, Test User",
      timeOfDay: "morning",
      profilePicture: null,
      userLocation: "San Francisco",
      weather: {
        city: "San Francisco",
        condition: "Sunny",
        temperature: 22,
        icon: "01d",
      },
      insights: {
        id: "insights-1",
        weather: {
          city: "San Francisco",
          condition: "Sunny",
          temperature: 22,
          icon: "01d",
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
      categories: [
        { id: "1", name: "Travel", icon: "✈️", color: "#007AFF" },
        { id: "2", name: "Food", icon: "🍕", color: "#FF6B35" },
      ],
      recommendations: [
        {
          id: "1",
          title: "Beach Cleanup",
          date: "2023-10-15",
          locationName: "Santa Monica",
          image: null,
          reason: "Based on your interest in Outdoors",
          source: "content_based",
        },
        {
          id: "2",
          title: "Tech Conference",
          date: "2023-11-20",
          locationName: "LA",
          image: null,
          reason: "Trending in your area",
          source: "popular",
        },
      ],
      upcoming: [],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

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
    const { getByTestId, getAllByTestId } = render(<Home />);

    expect(getByTestId("insights-card")).toBeTruthy();
    expect(getByTestId("carousel")).toBeTruthy();
    expect(getAllByTestId("recommendation-card")).toHaveLength(2);
  });

  it("should render section headers", () => {
    const { getByText } = render(<Home />);
    expect(getByText("Categories")).toBeTruthy();
    expect(getByText("Events Near You")).toBeTruthy();
  });

  it("should handle empty home data gracefully", () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      data: { getHome: null },
    });

    const { getByText } = render(<Home />);
    // Falls back to Loading when homeData is null
    expect(getByText("Loading...")).toBeTruthy();
  });

  it("should handle empty categories", () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      data: {
        getHome: {
          ...mockHomeData.getHome,
          categories: [],
        },
      },
    });

    const { queryByTestId } = render(<Home />);
    // Carousel should not render when no categories
    expect(queryByTestId("carousel")).toBeNull();
  });
});
