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
    <text testID="recommendation-card">{recommendation.name}</text>
  ),
}));

jest.mock("components/Cards/TrendingCard", () => ({
  TrendingCard: ({ event }: any) => (
    <text testID="trending-card">{event.name}</text>
  ),
}));

jest.mock("components/Carousel", () => ({
  Carousel: ({ header, items }: any) => (
    <text testID="carousel">
      {header}
      {items}
    </text>
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
      categories: [
        { id: "1", name: "Travel", icon: "✈️", color: "#007AFF" },
        { id: "2", name: "Food", icon: "🍕", color: "#FF6B35" },
      ],
      recommendations: [
        {
          id: "1",
          name: "Beach Cleanup",
          description: "Join our community beach cleanup event",
          date: "2023-10-15",
          locationName: "Santa Monica",
          image: "https://images.unsplash.com/photo-1",
          isFree: true,
          isSaved: false,
          reason: "Based on your interest in Outdoors",
          source: "content_based",
          category: [{ id: "1", name: "Outdoors", icon: "🌲", color: "#34C759" }],
        },
        {
          id: "2",
          name: "Tech Conference",
          description: "Annual tech conference with top speakers",
          date: "2023-11-20",
          locationName: "LA",
          image: "https://images.unsplash.com/photo-2",
          isFree: false,
          isSaved: false,
          reason: "Trending in your area",
          source: "popular",
          category: [{ id: "2", name: "Tech", icon: "💻", color: "#007AFF" }],
        },
      ],
      trending: [
        {
          id: "3",
          name: "Jazz Festival",
          description: "Annual jazz festival in the park",
          date: "2023-12-01",
          locationName: "Central Park",
          image: "https://images.unsplash.com/photo-3",
          isFree: true,
          isSaved: false,
          reason: "Trending",
          source: "trending",
          category: [{ id: "3", name: "Music", icon: "🎵", color: "#FF6B35" }],
        },
        {
          id: "4",
          name: "Food Market",
          description: "Weekend artisan food market",
          date: "2023-12-10",
          locationName: "Downtown",
          image: "https://images.unsplash.com/photo-4",
          isFree: false,
          isSaved: false,
          reason: "Trending",
          source: "trending",
          category: [{ id: "4", name: "Food", icon: "🍕", color: "#FF6B35" }],
        },
      ],
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
    expect(getAllByTestId("recommendation-card")).toHaveLength(2);
  });

  it("should render section headers", () => {
    const { getByText } = render(<Home />);
    expect(getByText("Recommendations")).toBeTruthy();
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

  it("should render trending section when trending data is available", () => {
    const { getAllByTestId, getByText } = render(<Home />);
    expect(getByText("Trending")).toBeTruthy();
    expect(getAllByTestId("trending-card")).toHaveLength(2);
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

    const { queryAllByTestId } = render(<Home />);
    // No category cards should render when categories is empty
    expect(queryAllByTestId("bucket-card")).toHaveLength(0);
  });
});
