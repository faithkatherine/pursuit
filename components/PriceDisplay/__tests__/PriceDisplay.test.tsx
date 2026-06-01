import { render, screen } from "@testing-library/react-native";
import { PriceDisplay } from "../PriceDisplay";
import colors from "themes/tokens/colors";

describe("PriceDisplay", () => {
  it("displays 'Free' when isFree is true", () => {
    render(
      <PriceDisplay
        price={0}
        isFree={true}
        color={colors.deluge}
        testID="price-display"
      />
    );

    expect(screen.getByText("Free")).toBeTruthy();
  });

  it("displays 'Free' when price is 0", () => {
    render(
      <PriceDisplay
        price={0}
        isFree={false}
        color={colors.deluge}
        testID="price-display"
      />
    );

    expect(screen.getByText("Free")).toBeTruthy();
  });

  it("displays formatted price with KES currency", () => {
    render(
      <PriceDisplay
        price={1500}
        isFree={false}
        color={colors.deluge}
        testID="price-display"
      />
    );

    expect(screen.getByText("KES 1,500")).toBeTruthy();
  });

  it("formats large prices with commas", () => {
    render(
      <PriceDisplay
        price={25000}
        isFree={false}
        color={colors.forest}
        testID="price-display"
      />
    );

    expect(screen.getByText("KES 25,000")).toBeTruthy();
  });

  it("handles null price with isFree true", () => {
    render(
      <PriceDisplay
        price={null}
        isFree={true}
        color={colors.terracotta}
        testID="price-display"
      />
    );

    expect(screen.getByText("Free")).toBeTruthy();
  });

  it("handles undefined price with isFree true", () => {
    render(
      <PriceDisplay
        price={undefined}
        isFree={true}
        color={colors.goldOlive}
        testID="price-display"
      />
    );

    expect(screen.getByText("Free")).toBeTruthy();
  });

  it("applies custom color to text", () => {
    render(
      <PriceDisplay
        price={1500}
        isFree={false}
        color={colors.deepHorizon}
        testID="price-display"
      />
    );

    const text = screen.getByText("KES 1,500");
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: colors.deepHorizon }),
      ])
    );
  });

  it("has correct accessibility attributes", () => {
    render(
      <PriceDisplay
        price={2000}
        isFree={false}
        color={colors.deluge}
        testID="price-display"
      />
    );

    const container = screen.getByTestId("price-display");
    expect(container.props.accessible).toBe(true);
    expect(container.props.accessibilityRole).toBe("text");
    expect(container.props.accessibilityLabel).toBe("KES 2,000");
  });
});
