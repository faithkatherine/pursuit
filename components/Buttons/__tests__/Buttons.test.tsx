import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Button } from "../Buttons";

describe("Button", () => {
  it("renders with text prop", () => {
    const { getByText } = render(<Button text="Test Button" />);
    expect(getByText("Test Button")).toBeTruthy();
  });

  it("renders with primary variant by default", () => {
    const { getByText } = render(<Button text="Default Button" />);
    const button = getByText("Default Button").parent;
    expect(button?.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: "#ffffff",
          borderRadius: 12,
          paddingVertical: 8,
          paddingHorizontal: 16,
          alignSelf: "center",
        }),
      ])
    );
  });

  it("calls onPress when pressed", () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button text="Clickable Button" onPress={mockOnPress} />
    );

    fireEvent.press(getByText("Clickable Button").parent);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it("does not call onPress when disabled", () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button text="Disabled Button" onPress={mockOnPress} disabled={true} />
    );

    fireEvent.press(getByText("Disabled Button").parent);
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it("applies custom styles", () => {
    const customStyle = { marginTop: 20 };
    const { getByText } = render(
      <Button text="Styled Button" style={customStyle} />
    );
    const button = getByText("Styled Button").parent;
    expect(button?.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(customStyle)])
    );
  });

  it("renders with testID", () => {
    const { getByTestId } = render(
      <Button text="Test Button" testID="button-test-id" />
    );
    expect(getByTestId("button-test-id")).toBeTruthy();
  });

  it("renders text with correct styles", () => {
    const { getByText } = render(<Button text="Styled Text" />);
    const text = getByText("Styled Text");
    expect(text.props.style).toEqual({
      fontFamily: "Work Sans",
      fontSize: 14,
      color: "#ffffff",
      fontWeight: "600",
    });
  });
});
