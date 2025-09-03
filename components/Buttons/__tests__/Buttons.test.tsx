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

  it("renders secondary variant with correct styles", () => {
    const { getByTestId } = render(
      <Button text="Secondary Button" variant="secondary" />
    );
    const button = getByTestId("button-secondary");
    expect(button.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          justifyContent: "center",
          alignItems: "center",
        }),
      ])
    );
  });

  it("renders with icon only", () => {
    const TestIcon = () => <text>📧</text>;
    const { getByText } = render(<Button icon={<TestIcon />} variant="primary" />);
    expect(getByText("📧")).toBeTruthy();
  });

  it("renders with both text and icon", () => {
    const TestIcon = () => <text>📧</text>;
    const { getByText } = render(
      <Button text="Email" icon={<TestIcon />} variant="primary" />
    );
    expect(getByText("Email")).toBeTruthy();
    expect(getByText("📧")).toBeTruthy();
  });

  it("applies circle dimensions to secondary button", () => {
    const circleDimensions = { 
      width: 50, 
      height: 50, 
      borderRadius: 25 
    };
    const { getByTestId } = render(
      <Button 
        text="Circle" 
        variant="secondary" 
        circleDimensions={circleDimensions}
      />
    );
    const button = getByTestId("button-secondary");
    expect(button.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining(circleDimensions)
      ])
    );
  });

  it("handles undefined text prop", () => {
    const { getByTestId } = render(<Button variant="primary" />);
    expect(getByTestId("button-primary")).toBeTruthy();
  });

  it("handles undefined icon prop", () => {
    const { getByText } = render(<Button text="No Icon" variant="primary" />);
    expect(getByText("No Icon")).toBeTruthy();
  });
});
