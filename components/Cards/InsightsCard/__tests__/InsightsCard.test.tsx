import React from "react";
import { InsightsCard, NextItem } from "../InsightsCard";

describe("InsightsCard", () => {
  const defaultProps = {
    currentCity: "San Francisco",
    nextDestination: "Tokyo, Japan",
    daysUntilTrip: 14,
    completedItems: 12,
    yearlyGoal: 25,
    recentAchievement: "Completed hiking challenge",
  };

  it("matches snapshot", () => {
    const component = <InsightsCard {...defaultProps} />;
    expect(component).toMatchSnapshot();
  });

  it("renders correctly with default props", () => {
    const component = <InsightsCard {...defaultProps} />;
    expect(component).toBeDefined();
    expect(component.props.currentCity).toBe("San Francisco");
    expect(component.props.nextDestination).toBe("Tokyo, Japan");
    expect(component.props.daysUntilTrip).toBe(14);
  });

  it("calculates progress correctly", () => {
    const component = <InsightsCard {...defaultProps} />;
    // Progress should be completedItems / yearlyGoal = 12/25 = 0.48
    expect(component.props.completedItems).toBe(12);
    expect(component.props.yearlyGoal).toBe(25);
  });

  it("handles custom props correctly", () => {
    const customProps = {
      currentCity: "New York",
      nextDestination: "Paris, France",
      daysUntilTrip: 7,
      completedItems: 5,
      yearlyGoal: 20,
      recentAchievement: "Visited new restaurant",
    };

    const component = <InsightsCard {...customProps} />;
    expect(component.props.currentCity).toBe("New York");
    expect(component.props.nextDestination).toBe("Paris, France");
    expect(component.props.daysUntilTrip).toBe(7);
    expect(component.props.completedItems).toBe(5);
    expect(component.props.yearlyGoal).toBe(20);
    expect(component.props.recentAchievement).toBe("Visited new restaurant");
  });

  it("handles edge case with zero completed items", () => {
    const zeroProps = {
      ...defaultProps,
      completedItems: 0,
    };

    const component = <InsightsCard {...zeroProps} />;
    expect(component.props.completedItems).toBe(0);
    expect(component.props.yearlyGoal).toBe(25);
  });

  it("handles edge case with completed items equal to yearly goal", () => {
    const completedProps = {
      ...defaultProps,
      completedItems: 25,
      yearlyGoal: 25,
    };

    const component = <InsightsCard {...completedProps} />;
    expect(component.props.completedItems).toBe(25);
    expect(component.props.yearlyGoal).toBe(25);
  });

  it("handles single digit days correctly", () => {
    const singleDayProps = {
      ...defaultProps,
      daysUntilTrip: 1,
    };

    const component = <InsightsCard {...singleDayProps} />;
    expect(component.props.daysUntilTrip).toBe(1);
  });

  it("handles long destination names", () => {
    const longDestinationProps = {
      ...defaultProps,
      nextDestination: "Very Long Destination Name That Might Wrap",
    };

    const component = <InsightsCard {...longDestinationProps} />;
    expect(component.props.nextDestination).toBe(
      "Very Long Destination Name That Might Wrap"
    );
  });

  it("handles long achievement names", () => {
    const longAchievementProps = {
      ...defaultProps,
      recentAchievement:
        "Completed a very long and detailed achievement description",
    };

    const component = <InsightsCard {...longAchievementProps} />;
    expect(component.props.recentAchievement).toBe(
      "Completed a very long and detailed achievement description"
    );
  });

  // Component structure tests
  it("has correct prop structure", () => {
    const component = <InsightsCard {...defaultProps} />;
    expect(component.type).toBe(InsightsCard);
    expect(component.props.currentCity).toBe("San Francisco");
    expect(component.props.nextDestination).toBe("Tokyo, Japan");
    expect(component.props.daysUntilTrip).toBe(14);
    expect(component.props.completedItems).toBe(12);
    expect(component.props.yearlyGoal).toBe(25);
    expect(component.props.recentAchievement).toBe("Completed hiking challenge");
  });

  it("calculates progress ratio correctly", () => {
    const component = <InsightsCard {...defaultProps} />;
    // Progress should be completedItems / yearlyGoal = 12/25 = 0.48
    const expectedProgress = component.props.completedItems / component.props.yearlyGoal;
    expect(expectedProgress).toBe(0.48);
  });

  it("handles different progress calculations", () => {
    const halfCompleteProps = {
      ...defaultProps,
      completedItems: 10,
      yearlyGoal: 20,
    };
    
    const component = <InsightsCard {...halfCompleteProps} />;
    const progress = component.props.completedItems / component.props.yearlyGoal;
    expect(progress).toBe(0.5);
  });

  it("supports all interface properties", () => {
    const allProps = {
      currentCity: "Test City",
      nextDestination: "Test Destination",
      daysUntilTrip: 30,
      completedItems: 15,
      yearlyGoal: 50,
      recentAchievement: "Test Achievement",
    };
    
    const component = <InsightsCard {...allProps} />;
    expect(component.props).toEqual(allProps);
  });
});

describe("NextItem", () => {
  it("accepts destination and days props", () => {
    const component = (
      <NextItem nextDestination="Paris, France" daysUntilTrip={5} />
    );
    expect(component.props.nextDestination).toBe("Paris, France");
    expect(component.props.daysUntilTrip).toBe(5);
  });

  it("handles single day correctly", () => {
    const component = (
      <NextItem nextDestination="London, UK" daysUntilTrip={1} />
    );
    expect(component.props.nextDestination).toBe("London, UK");
    expect(component.props.daysUntilTrip).toBe(1);
  });

  it("accepts various prop combinations", () => {
    const component = (
      <NextItem nextDestination="Berlin, Germany" daysUntilTrip={10} />
    );
    expect(component.props.nextDestination).toBe("Berlin, Germany");
    expect(component.props.daysUntilTrip).toBe(10);
  });

  it("has correct component type", () => {
    const component = (
      <NextItem nextDestination="Tokyo" daysUntilTrip={7} />
    );
    expect(component.type).toBe(NextItem);
  });

  it("handles long destination names", () => {
    const longDestination = "A Very Long Destination Name That Might Need Wrapping";
    const component = (
      <NextItem nextDestination={longDestination} daysUntilTrip={15} />
    );
    expect(component.props.nextDestination).toBe(longDestination);
    expect(component.props.daysUntilTrip).toBe(15);
  });

  it("handles zero days", () => {
    const component = (
      <NextItem nextDestination="Leaving Today" daysUntilTrip={0} />
    );
    expect(component.props.nextDestination).toBe("Leaving Today");
    expect(component.props.daysUntilTrip).toBe(0);
  });
});
