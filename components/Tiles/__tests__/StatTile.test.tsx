import React from "react";
import { render } from "@testing-library/react-native";
import { StatTile } from "../StatTile";
import colors from "@shared/constants/tokens/colors";

describe("StatTile", () => {
  const defaultProps = {
    label: "Going",
    value: "42",
    backgroundColor: colors.mistLavender,
    labelColor: colors.graniteGray,
    valueColor: colors.thunder,
  };

  it("renders correctly with string value", () => {
    const { getByText } = render(<StatTile {...defaultProps} />);
    
    expect(getByText("Going")).toBeTruthy();
    expect(getByText("42")).toBeTruthy();
  });

  it("renders correctly with number value", () => {
    const { getByText } = render(
      <StatTile {...defaultProps} value={42} />
    );
    
    expect(getByText("Going")).toBeTruthy();
    expect(getByText("42")).toBeTruthy();
  });

  it("renders with custom colors", () => {
    const { getByText } = render(
      <StatTile
        {...defaultProps}
        backgroundColor={colors.deluge}
        labelColor={colors.white}
        valueColor={colors.white}
      />
    );
    
    const label = getByText("Going");
    const value = getByText("42");
    
    expect(label).toBeTruthy();
    expect(value).toBeTruthy();
  });

  it("renders with different labels and values", () => {
    const { getByText } = render(
      <StatTile
        {...defaultProps}
        label="Entry"
        value="Free"
      />
    );
    
    expect(getByText("Entry")).toBeTruthy();
    expect(getByText("Free")).toBeTruthy();
  });

  it("renders with em dash for missing data", () => {
    const { getByText } = render(
      <StatTile
        {...defaultProps}
        label="Spots"
        value="—"
      />
    );
    
    expect(getByText("Spots")).toBeTruthy();
    expect(getByText("—")).toBeTruthy();
  });

  it("renders with testID when provided", () => {
    const { getByTestId } = render(
      <StatTile {...defaultProps} testID="stat-tile-going" />
    );
    
    expect(getByTestId("stat-tile-going")).toBeTruthy();
  });

  it("renders complex value text", () => {
    const { getByText } = render(
      <StatTile
        {...defaultProps}
        label="Spots"
        value="3 left"
      />
    );
    
    expect(getByText("Spots")).toBeTruthy();
    expect(getByText("3 left")).toBeTruthy();
  });

  it("renders price value correctly", () => {
    const { getByText } = render(
      <StatTile
        {...defaultProps}
        label="Entry"
        value="KES 1,500"
      />
    );
    
    expect(getByText("Entry")).toBeTruthy();
    expect(getByText("KES 1,500")).toBeTruthy();
  });
});
