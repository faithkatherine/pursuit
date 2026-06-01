import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { TrendingCard } from "../TrendingCard";
import type { EventInfoFragment } from "graphql/generated/graphql";

jest.mock("graphql/hooks", () => ({
  useSaveEvent: () => [jest.fn()],
  useUnsaveEvent: () => [jest.fn()],
}));

jest.mock("components/Buttons/Buttons", () => ({
  Button: ({ onPress, testID }: any) => {
    const { TouchableOpacity } = require("react-native");
    return <TouchableOpacity testID={testID} onPress={onPress} />;
  },
}));

jest.mock("assets/icons/heart.svg", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("utils/date", () => ({
  formatEventDate: (date: string) => ({
    formattedDate: date,
    formattedTime: "12:00 PM",
  }),
}));

const baseEvent: EventInfoFragment = {
  __typename: "EventType",
  id: "1",
  name: "Jazz Night",
  description: "A great evening of jazz",
  image: "https://example.com/jazz.jpg",
  date: "2026-05-10",
  endDate: null,
  locationName: "Blue Note, Nairobi",
  isFree: true,
  isSaved: false,
  reason: null,
  source: null,
  curatorNote: null,
  curatorName: null,
  category: [
    {
      __typename: "CategoryType",
      id: "c1",
      name: "Music",
      icon: "music",
      color: "#fff",
    },
  ],
};

describe("TrendingCard", () => {
  it("renders the event name", () => {
    const { getByText } = render(
      <TrendingCard recommendation={baseEvent} onPress={() => {}} />,
    );
    expect(getByText("Jazz Night")).toBeTruthy();
  });

  it("renders the location", () => {
    const { getByText } = render(
      <TrendingCard recommendation={baseEvent} onPress={() => {}} />,
    );
    expect(getByText("Blue Note, Nairobi")).toBeTruthy();
  });

  it('shows "Free" badge for free events', () => {
    const { getByText } = render(
      <TrendingCard recommendation={baseEvent} onPress={() => {}} />,
    );
    expect(getByText("Free")).toBeTruthy();
  });

  it('shows "Paid" badge for paid events', () => {
    const { getByText } = render(
      <TrendingCard
        recommendation={{ ...baseEvent, isFree: false }}
        onPress={() => {}}
      />,
    );
    expect(getByText("Paid")).toBeTruthy();
  });

  it("calls onPress when the card is pressed", () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <TrendingCard recommendation={baseEvent} onPress={onPress} />,
    );
    fireEvent.press(getByTestId("trending-card"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("renders the category badge", () => {
    const { getByText } = render(
      <TrendingCard recommendation={baseEvent} onPress={() => {}} />,
    );
    expect(getByText("Music")).toBeTruthy();
  });

  it("renders without a category gracefully", () => {
    const { queryByText } = render(
      <TrendingCard
        recommendation={{ ...baseEvent, category: [] }}
        onPress={() => {}}
      />,
    );
    expect(queryByText("Music")).toBeNull();
  });

  it("renders the formatted date", () => {
    const { getByText } = render(
      <TrendingCard recommendation={baseEvent} onPress={() => {}} />,
    );
    expect(getByText("2026-05-10")).toBeTruthy();
  });
});
