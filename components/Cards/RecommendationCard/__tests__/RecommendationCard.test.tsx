import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { RecommendationCard } from "../RecommendationCard";
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

jest.mock("components/Icons/HeartIcon", () => ({
  HeartIcon: () => null,
}));

jest.mock("utils/date", () => ({
  formatEventDate: (date: string) => date,
}));

const baseEvent: EventInfoFragment = {
  __typename: "EventType",
  id: "2",
  name: "Street Food Festival",
  description: "Taste the best street food in the city",
  image: "https://example.com/food.jpg",
  date: "2026-05-15",
  endDate: null,
  locationName: "Westlands, Nairobi",
  isFree: false,
  isSaved: false,
  reason: null,
  source: null,
  curatorNote: null,
  curatorName: null,
  category: [
    {
      __typename: "CategoryType",
      id: "c2",
      name: "Food",
      icon: "food",
      color: "#f00",
    },
  ],
};

describe("RecommendationCard", () => {
  it("renders the event name", () => {
    const { getByText } = render(
      <RecommendationCard event={baseEvent} onPress={() => {}} />,
    );
    expect(getByText("Street Food Festival")).toBeTruthy();
  });

  it("renders the location", () => {
    const { getByText } = render(
      <RecommendationCard event={baseEvent} onPress={() => {}} />,
    );
    expect(getByText("Westlands, Nairobi")).toBeTruthy();
  });

  it('shows "Paid" badge for paid events', () => {
    const { getByText } = render(
      <RecommendationCard event={baseEvent} onPress={() => {}} />,
    );
    expect(getByText("Paid")).toBeTruthy();
  });

  it('shows "Free" badge for free events', () => {
    const { getByText } = render(
      <RecommendationCard
        event={{ ...baseEvent, isFree: true }}
        onPress={() => {}}
      />,
    );
    expect(getByText("Free")).toBeTruthy();
  });

  it("calls onPress when the card is pressed", () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <RecommendationCard event={baseEvent} onPress={onPress} />,
    );
    fireEvent.press(getByTestId("recommendation-card"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("renders the formatted date", () => {
    const { getByText } = render(
      <RecommendationCard event={baseEvent} onPress={() => {}} />,
    );
    expect(getByText("2026-05-15")).toBeTruthy();
  });

  it("renders gracefully with a null image", () => {
    const { getByTestId } = render(
      <RecommendationCard
        event={{ ...baseEvent, image: null }}
        onPress={() => {}}
      />,
    );
    expect(getByTestId("recommendation-card")).toBeTruthy();
  });

  it("renders gracefully with a null locationName", () => {
    const { getByTestId } = render(
      <RecommendationCard
        event={{ ...baseEvent, locationName: null }}
        onPress={() => {}}
      />,
    );
    expect(getByTestId("recommendation-card")).toBeTruthy();
  });
});
