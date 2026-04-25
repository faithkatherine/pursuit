import React from "react";
import { InsightsCard } from "../InsightsCard";

describe("InsightsCard", () => {
  const defaultProps = {
    shouldShowTopInset: true,
    greeting: "Hi Faith",
    dayOfWeek: "Friday",
    cityName: "Nairobi",
    neighborhoodName: "Westlands",
    weather: {
      city: "Nairobi",
      condition: "Sunny",
      temperature: 26,
      icon: "01d",
    },
    onChipPress: jest.fn(),
  };

  it("renders correctly with default props", () => {
    const component = <InsightsCard {...defaultProps} />;
    expect(component).toBeDefined();
    expect(component.props.greeting).toBe("Hi Faith");
    expect(component.props.dayOfWeek).toBe("Friday");
    expect(component.props.cityName).toBe("Nairobi");
  });

  it("renders without weather", () => {
    const component = <InsightsCard {...defaultProps} weather={undefined} />;
    expect(component).toBeDefined();
  });

  it("handles missing optional props", () => {
    const component = (
      <InsightsCard
        shouldShowTopInset={false}
        greeting="Hi there"
      />
    );
    expect(component).toBeDefined();
    expect(component.props.greeting).toBe("Hi there");
  });

  it("has correct component type", () => {
    const component = <InsightsCard {...defaultProps} />;
    expect(component.type).toBe(InsightsCard);
  });
});
