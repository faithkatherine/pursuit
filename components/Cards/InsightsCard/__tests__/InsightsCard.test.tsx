import { render } from "@testing-library/react-native";
import { InsightsCard } from "pursuit/components/Cards/InsightsCard";

// Mock the ProgressBar component
jest.mock("pursuit/components/ProgressBar", () => ({
  ProgressBar: ({ progress, completed, remaining }: any) => {
    const { View, Text } = require("react-native");
    return (
      <View testID="progress-bar-mock">
        <Text testID="progress-value">{Math.round(progress * 100)}%</Text>
        {completed !== undefined && (
          <Text testID="completed-value">{completed}</Text>
        )}
        {remaining !== undefined && (
          <Text testID="remaining-value">{remaining}</Text>
        )}
      </View>
    );
  },
}));

// Mock the SVG icon
jest.mock("pursuit/assets/sunny.svg", () => "SunnyIcon");

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
    const { toJSON } = render(<InsightsCard {...defaultProps} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders correctly with default props", () => {
    const { getByText } = render(<InsightsCard {...defaultProps} />);

    expect(getByText("San Francisco")).toBeTruthy();
    expect(getByText("Tokyo, Japan")).toBeTruthy();
    expect(getByText("14 days away")).toBeTruthy();
    expect(getByText("🏆 Completed hiking challenge")).toBeTruthy();
    expect(getByText("+ Add New Item")).toBeTruthy();
  });

  it("renders weather information", () => {
    const { getByText } = render(<InsightsCard {...defaultProps} />);

    expect(getByText(/Sunny 14°C/)).toBeTruthy();
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

    const { getByText, getByTestId } = render(
      <InsightsCard {...customProps} />
    );

    expect(getByText("New York")).toBeTruthy();
    expect(getByText("Paris, France")).toBeTruthy();
    expect(getByText("7 days away")).toBeTruthy();
    expect(getByText("🏆 Visited new restaurant")).toBeTruthy();

    // 5/20 = 0.25 = 25%
    expect(getByTestId("progress-value")).toHaveProperty("children", ["25%"]);
    expect(getByTestId("completed-value")).toHaveProperty("children", ["5"]);
    expect(getByTestId("remaining-value")).toHaveProperty("children", ["15"]); // 20 - 5
  });

  it("handles edge case with zero completed items", () => {
    const zeroProps = {
      ...defaultProps,
      completedItems: 0,
    };

    const { getByTestId } = render(<InsightsCard {...zeroProps} />);

    // 0/25 = 0 = 0%
    expect(getByTestId("progress-value")).toHaveProperty("children", ["0%"]);
    expect(getByTestId("completed-value")).toHaveProperty("children", ["0"]);
    expect(getByTestId("remaining-value")).toHaveProperty("children", ["25"]);
  });

  it("handles edge case with completed items equal to yearly goal", () => {
    const completedProps = {
      ...defaultProps,
      completedItems: 25,
      yearlyGoal: 25,
    };

    const { getByTestId } = render(<InsightsCard {...completedProps} />);

    // 25/25 = 1 = 100%
    expect(getByTestId("progress-value")).toHaveProperty("children", ["100%"]);
    expect(getByTestId("completed-value")).toHaveProperty("children", ["25"]);
    expect(getByTestId("remaining-value")).toHaveProperty("children", ["0"]);
  });

  it("renders NextItem component correctly", () => {
    const { getByText } = render(<InsightsCard {...defaultProps} />);

    expect(getByText("Tokyo, Japan")).toBeTruthy();
    expect(getByText("14 days away")).toBeTruthy();
  });

  it("handles single digit days correctly", () => {
    const singleDayProps = {
      ...defaultProps,
      daysUntilTrip: 1,
    };

    const { getByText } = render(<InsightsCard {...singleDayProps} />);

    expect(getByText("1 days away")).toBeTruthy();
  });

  it("handles long destination names", () => {
    const longDestinationProps = {
      ...defaultProps,
      nextDestination: "Very Long Destination Name That Might Wrap",
    };

    const { getByText } = render(<InsightsCard {...longDestinationProps} />);

    expect(
      getByText("Very Long Destination Name That Might Wrap")
    ).toBeTruthy();
  });

  it("handles long achievement names", () => {
    const longAchievementProps = {
      ...defaultProps,
      recentAchievement:
        "Completed a very long and detailed achievement description",
    };

    const { getByText } = render(<InsightsCard {...longAchievementProps} />);

    expect(
      getByText("🏆 Completed a very long and detailed achievement description")
    ).toBeTruthy();
  });
});
