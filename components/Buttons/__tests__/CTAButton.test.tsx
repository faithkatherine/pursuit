import { render, screen, fireEvent } from "@testing-library/react-native";
import { CTAButton } from "../CTAButton";
import colors from "themes/tokens/colors";

describe("CTAButton", () => {
  const mockOnPress = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders primary variant correctly", () => {
    render(
      <CTAButton
        variant="primary"
        onPress={mockOnPress}
        textColor={colors.white}
        testID="cta-button"
      >
        Book now
      </CTAButton>
    );

    const button = screen.getByTestId("cta-button");
    expect(button).toBeTruthy();
    expect(screen.getByText("Book now")).toBeTruthy();
  });

  it("renders outlined variant correctly", () => {
    render(
      <CTAButton
        variant="outlined"
        onPress={mockOnPress}
        textColor={colors.deluge}
        testID="cta-button"
      >
        Share
      </CTAButton>
    );

    const button = screen.getByTestId("cta-button");
    expect(button).toBeTruthy();
    expect(screen.getByText("Share")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    render(
      <CTAButton
        variant="primary"
        onPress={mockOnPress}
        textColor={colors.white}
        testID="cta-button"
      >
        Book now
      </CTAButton>
    );

    const button = screen.getByTestId("cta-button");
    fireEvent.press(button);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it("does not call onPress when disabled", () => {
    render(
      <CTAButton
        variant="primary"
        onPress={mockOnPress}
        disabled
        textColor={colors.white}
        testID="cta-button"
      >
        Sold out
      </CTAButton>
    );

    const button = screen.getByTestId("cta-button");
    fireEvent.press(button);
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it("applies custom backgroundColor", () => {
    render(
      <CTAButton
        variant="primary"
        onPress={mockOnPress}
        backgroundColor={colors.deluge}
        textColor={colors.white}
        testID="cta-button"
      >
        Book now
      </CTAButton>
    );

    const button = screen.getByTestId("cta-button");
    expect(button.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: colors.deluge }),
      ])
    );
  });

  it("applies custom borderColor", () => {
    render(
      <CTAButton
        variant="outlined"
        onPress={mockOnPress}
        borderColor={colors.deluge}
        textColor={colors.deluge}
        testID="cta-button"
      >
        Share
      </CTAButton>
    );

    const button = screen.getByTestId("cta-button");
    expect(button.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ borderColor: colors.deluge }),
      ])
    );
  });

  it("applies flex prop", () => {
    render(
      <CTAButton
        variant="primary"
        onPress={mockOnPress}
        textColor={colors.white}
        flex={2}
        testID="cta-button"
      >
        View ticket
      </CTAButton>
    );

    const button = screen.getByTestId("cta-button");
    expect(button.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ flex: 2 })])
    );
  });

  it("applies fullWidth prop", () => {
    render(
      <CTAButton
        variant="primary"
        onPress={mockOnPress}
        textColor={colors.white}
        fullWidth
        testID="cta-button"
      >
        More details
      </CTAButton>
    );

    const button = screen.getByTestId("cta-button");
    expect(button.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ width: "100%" })])
    );
  });

  it("has correct accessibility attributes", () => {
    render(
      <CTAButton
        variant="primary"
        onPress={mockOnPress}
        textColor={colors.white}
        testID="cta-button"
      >
        Book now
      </CTAButton>
    );

    const button = screen.getByTestId("cta-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Book now");
  });
});
