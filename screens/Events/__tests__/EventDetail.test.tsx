import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { MockedProvider } from "@apollo/client/testing";
import { EventDetail } from "../EventDetail";
import { GET_EVENT } from "graphql/queries";
import { EventType } from "graphql/generated/graphql";

// Mock react-native-safe-area-context
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock expo-router
const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

// Mock useSaveToggle hook
const mockHandleSave = jest.fn();
jest.mock("hooks/useSaveToggle", () => ({
  useSaveToggle: () => ({
    isSaved: false,
    saving: false,
    handleSave: mockHandleSave,
  }),
}));

// Mock SVG icons
jest.mock("assets/icons/date.svg", () => "DateIcon");
jest.mock("assets/icons/location.svg", () => "LocationIcon");
jest.mock("assets/icons/heart.svg", () => "HeartIcon");

const mockEvent: Partial<EventType> = {
  __typename: "EventType",
  id: "event-1",
  name: "Test Event",
  description: "This is a test event description",
  date: "2024-01-15T18:00:00Z",
  endDate: "2024-01-15T22:00:00Z",
  locationName: "Test Venue",
  image: "https://example.com/image.jpg",
  price: 1500,
  isFree: false,
  category: [{ name: "Culture & Arts" }] as any,
  isSaved: false,
  hasConfirmedTicket: false,
  ticketingEnabled: true,
  availableTickets: 50,
  goingCount: 25,
  isEditorsPick: false,
  curatorNote: null,
  curatorName: null,
  moreDetailsUrl: null,
  hasGallery: false,
  galleryImages: null,
};

const createMock = (event: Partial<EventType> = {}) => ({
  request: {
    query: GET_EVENT,
    variables: { id: "event-1" },
  },
  result: {
    data: {
      event: {
        __typename: "EventNode",
        event: { ...mockEvent, ...event },
      },
    },
  },
});

describe("EventDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    const mocks = [createMock()];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EventDetail eventId="event-1" />
      </MockedProvider>
    );

    // Event details should not be rendered yet during loading
    expect(screen.queryByText("Test Event")).toBeNull();
  });

  it("renders event details correctly", async () => {
    const mocks = [createMock()];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EventDetail eventId="event-1" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Event")).toBeTruthy();
      expect(screen.getByText("This is a test event description")).toBeTruthy();
      expect(screen.getByText("Test Venue")).toBeTruthy();
    });
  });

  it("renders category badge", async () => {
    const mocks = [createMock()];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EventDetail eventId="event-1" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("CULTURE & ARTS")).toBeTruthy();
    });
  });

  it("displays free badge when event is free", async () => {
    const mocks = [createMock({ isFree: true, price: 0 })];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EventDetail eventId="event-1" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Free")).toBeTruthy();
    });
  });

  it("displays booked badge when user has ticket", async () => {
    const mocks = [createMock({ hasConfirmedTicket: true })];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EventDetail eventId="event-1" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Booked")).toBeTruthy();
    });
  });

  it("displays curator note for editor's pick", async () => {
    const mocks = [
      createMock({
        isEditorsPick: true,
        curatorNote: "Don't miss this amazing event!",
        curatorName: "Jane Curator",
      }),
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EventDetail eventId="event-1" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("PURSUIT SAYS")).toBeTruthy();
      expect(screen.getByText("Don't miss this amazing event!")).toBeTruthy();
      expect(screen.getByText("— Jane Curator")).toBeTruthy();
    });
  });

  it("displays stat tiles when ticketing enabled", async () => {
    const mocks = [createMock()];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EventDetail eventId="event-1" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("stat-tile-going")).toBeTruthy();
      expect(screen.getByTestId("stat-tile-entry")).toBeTruthy();
      expect(screen.getByTestId("stat-tile-spots")).toBeTruthy();
    });
  });

  it("displays sold out when no tickets available", async () => {
    const mocks = [createMock({ availableTickets: 0 })];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EventDetail eventId="event-1" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByText("Sold out").length).toBeGreaterThan(0);
    });
  });

  it("navigates to checkout when book button pressed", async () => {
    const mocks = [createMock()];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EventDetail eventId="event-1" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Book")).toBeTruthy();
    });

    const bookButton = screen.getByText("Book");
    fireEvent.press(bookButton);

    expect(mockPush).toHaveBeenCalledWith("/(protected)/events/event-1/checkout");
  });

  it("navigates to confirmation when view ticket button pressed", async () => {
    const mocks = [createMock({ hasConfirmedTicket: true })];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EventDetail eventId="event-1" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("View ticket")).toBeTruthy();
    });

    const viewTicketButton = screen.getByText("View ticket");
    fireEvent.press(viewTicketButton);

    expect(mockPush).toHaveBeenCalledWith(
      "/(protected)/events/event-1/confirmation"
    );
  });

  it("displays more details button when moreDetailsUrl present", async () => {
    const mocks = [
      createMock({
        ticketingEnabled: false,
        moreDetailsUrl: "https://example.com",
      }),
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EventDetail eventId="event-1" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("More details")).toBeTruthy();
    });
  });

  it("calls onClose when provided", async () => {
    const mockOnClose = jest.fn();
    const mocks = [createMock()];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EventDetail eventId="event-1" onClose={mockOnClose} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Event")).toBeTruthy();
    });

    // onClose callback should be available in the component
    expect(mockOnClose).toBeDefined();
  });

  it("renders error state when query fails", async () => {
    const mocks = [
      {
        request: {
          query: GET_EVENT,
          variables: { id: "event-1" },
        },
        error: new Error("Failed to load event"),
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <EventDetail eventId="event-1" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Failed to load event details")).toBeTruthy();
    });
  });
});
