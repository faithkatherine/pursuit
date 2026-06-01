import { render, screen } from "@testing-library/react-native";
import { SavedIndicator } from "../SavedIndicator";
import colors from "themes/tokens/colors";

describe("SavedIndicator", () => {
  it("renders indicator variant correctly", () => {
    render(
      <SavedIndicator
        iconSize={12}
        iconColor={colors.deluge}
        testID="saved-indicator"
      />
    );

    expect(screen.getByText("Saved to plans")).toBeTruthy();
  });

  it("renders confirmation variant with background", () => {
    render(
      <SavedIndicator
        iconSize={16}
        iconColor={colors.deluge}
        showBackground
        backgroundColor={colors.mistLavender}
        testID="saved-indicator"
      />
    );

    const indicator = screen.getByTestId("saved-indicator");
    expect(indicator.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: colors.mistLavender }),
      ])
    );
  });

  it("applies default graniteGray textColor when showBackground is false", () => {
    render(
      <SavedIndicator
        iconSize={12}
        iconColor={colors.deluge}
        showBackground={false}
        testID="saved-indicator"
      />
    );

    const text = screen.getByText("Saved to plans");
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: colors.graniteGray }),
      ])
    );
  });

  it("uses iconColor as textColor when showBackground is true and textColor not provided", () => {
    render(
      <SavedIndicator
        iconSize={16}
        iconColor={colors.forest}
        showBackground
        backgroundColor={colors.sageMist}
        testID="saved-indicator"
      />
    );

    const text = screen.getByText("Saved to plans");
    expect(text.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: colors.forest })])
    );
  });

  it("applies custom textColor when provided", () => {
    render(
      <SavedIndicator
        iconSize={12}
        iconColor={colors.deluge}
        textColor={colors.thunder}
        testID="saved-indicator"
      />
    );

    const text = screen.getByText("Saved to plans");
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: colors.thunder }),
      ])
    );
  });

  it("has correct accessibility attributes", () => {
    render(
      <SavedIndicator
        iconSize={12}
        iconColor={colors.deluge}
        testID="saved-indicator"
      />
    );

    const indicator = screen.getByTestId("saved-indicator");
    expect(indicator.props.accessible).toBe(true);
    expect(indicator.props.accessibilityRole).toBe("text");
    expect(indicator.props.accessibilityLabel).toBe("Saved to plans");
  });
});
