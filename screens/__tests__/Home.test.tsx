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

jest.mock("components/Cards/HeroCard", () => ({
  HeroCard: ({ trip }: any) => (
    <text testID="hero-card">{trip.name}</text>
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

jest.mock("components/Buttons", () => ({
  Button: ({ text }: any) => <text>{text}</text>,
}));

// Mock Apollo Client
jest.mock("@apollo/client", () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(() => [jest.fn()]),
  gql: jest.fn((s: any) => s),
}));

// Mock graphql hooks
jest.mock("graphql/hooks", () => ({
  useHomeData: () => (useQuery as jest.Mock)(),
}));

describe("Home Screen", () => {
  const mockHomeData = {
    getHome: {
      id: "home-1",
      greeting: "Hi Faith",
      timeOfDay: "morning",
      dayOfWeek: "Friday",
      cityName: "Nairobi",
      profilePicture: null,
      userLocation: "Nairobi, Kenya",
      allowLocationSharing: true,
      activeNeighborhood: { id: "1", name: "Westlands", city: "Nairobi" },
      neighborhoods: [
        { id: "1", name: "Westlands", city: "Nairobi" },
        { id: "2", name: "Karen", city: "Nairobi" },
      ],
      weather: {
        city: "Nairobi",
        condition: "Sunny",
        temperature: 26,
        icon: "01d",
      },
      categories: [
        { id: "1", name: "Travel", icon: "plane", color: "#007AFF" },
      ],
      recommendations: [
        {
          id: "1",
          name: "Beach Cleanup",
          description: "Community beach cleanup",
          date: "2026-05-15",
          endDate: null,
          locationName: "Diani Beach",
          image: "https://example.com/photo-1",
          isFree: true,
          isSaved: false,
          reason: "Based on your interest in Outdoors",
          source: "content_based",
          curatorNote: null,
          curatorName: null,
          category: [{ id: "1", name: "Outdoors", icon: "tree", color: "#34C759" }],
        },
        {
          id: "2",
          name: "Tech Conference",
          description: "Annual tech conference",
          date: "2026-06-20",
          endDate: null,
          locationName: "KICC",
          image: "https://example.com/photo-2",
          isFree: false,
          isSaved: false,
          reason: "Trending",
          source: "popular",
          curatorNote: null,
          curatorName: null,
          category: [{ id: "2", name: "Tech", icon: "laptop", color: "#007AFF" }],
        },
      ],
      trending: [
        {
          id: "3",
          name: "Jazz Festival",
          description: "Jazz festival in the park",
          date: "2026-07-01",
          endDate: null,
          locationName: "Uhuru Gardens",
          image: "https://example.com/photo-3",
          isFree: true,
          isSaved: false,
          reason: "Trending",
          source: "trending",
          curatorNote: null,
          curatorName: null,
          category: [{ id: "3", name: "Music", icon: "music", color: "#FF6B35" }],
        },
      ],
      upcomingEvents: [],
      activeTrip: null,
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
    const { getByTestId } = render(<Home />);
    expect(getByTestId("insights-card")).toBeTruthy();
  });

  it("should render Made for your week section", () => {
    const { getByText } = render(<Home />);
    expect(getByText("Made for your week")).toBeTruthy();
  });

  it("should render Trending section", () => {
    const { getByText } = render(<Home />);
    expect(getByText("Trending")).toBeTruthy();
  });

  it("should handle empty home data gracefully", () => {
    (useQuery as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      data: { getHome: null },
    });

    const { getByText } = render(<Home />);
    expect(getByText("Loading...")).toBeTruthy();
  });
});
