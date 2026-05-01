import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Button } from "../Buttons";
import { ToggleSwitch } from "../ToggleSwitch";

describe("Button", () => {
  it("renders with text prop", () => {
    const { getByText } = render(<Button text="Test Button" />);
    expect(getByText("Test Button")).toBeTruthy();
  });

  it("renders with primary variant by default", () => {
    const { getByTestId } = render(<Button text="Default Button" />);
    expect(getByTestId("button-primary")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button text="Clickable Button" onPress={mockOnPress} />,
    );
    fireEvent.press(getByText("Clickable Button").parent);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it("does not call onPress when disabled", () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button text="Disabled Button" onPress={mockOnPress} disabled={true} />,
    );
    fireEvent.press(getByText("Disabled Button").parent);
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it("applies custom styles", () => {
    const customStyle = { marginTop: 20 };
    const { getByTestId } = render(
      <Button text="Styled Button" style={customStyle} />,
    );
    const button = getByTestId("button-primary");
    expect(button.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(customStyle)]),
    );
  });

  it("renders with icon only", () => {
    const TestIcon = () => <text>📧</text>;
    const { getByText } = render(
      <Button icon={<TestIcon />} variant="primary" />,
    );
    expect(getByText("📧")).toBeTruthy();
  });

  it("renders with both text and icon", () => {
    const TestIcon = () => <text>📧</text>;
    const { getByText } = render(
      <Button text="Email" icon={<TestIcon />} variant="primary" />,
    );
    expect(getByText("Email")).toBeTruthy();
    expect(getByText("📧")).toBeTruthy();
  });

  it("handles undefined text prop", () => {
    const { getByTestId } = render(<Button variant="primary" />);
    expect(getByTestId("button-primary")).toBeTruthy();
  });

  // secondary
  it("renders secondary variant", () => {
    const { getByTestId } = render(
      <Button text="Secondary" variant="secondary" />,
    );
    expect(getByTestId("button-secondary")).toBeTruthy();
  });

  it("applies custom style to secondary button", () => {
    const customStyle = { width: 50, height: 50, borderRadius: 25 };
    const { getByTestId } = render(
      <Button text="Circle" variant="secondary" style={customStyle} />,
    );
    const button = getByTestId("button-secondary");
    expect(button.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(customStyle)]),
    );
  });

  // secondary ghost (replaces old "tertiary")
  it("renders secondary ghost variant", () => {
    const { getByTestId } = render(
      <Button text="Skip" variant="secondary" ghost />,
    );
    expect(getByTestId("button-secondary-ghost")).toBeTruthy();
  });

  it("calls onPress on secondary ghost", () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button text="Skip" variant="secondary" ghost onPress={mockOnPress} />,
    );
    fireEvent.press(getByText("Skip").parent);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  // third-party
  it("renders third-party button with default text", () => {
    const { getByText } = render(<Button variant="third-party" />);
    expect(getByText("Continue with Google")).toBeTruthy();
  });

  it("renders third-party button with custom text and icon", () => {
    const AppleIcon = () => <text>🍎</text>;
    const { getByText } = render(
      <Button
        variant="third-party"
        text="Continue with Apple"
        icon={<AppleIcon />}
      />,
    );
    expect(getByText("Continue with Apple")).toBeTruthy();
    expect(getByText("🍎")).toBeTruthy();
  });

  it("calls onPress on third-party button", () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <Button variant="third-party" onPress={mockOnPress} />,
    );
    fireEvent.press(getByTestId("button-third-party"));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  // chips
  it("renders chips variant unselected", () => {
    const { getByTestId } = render(
      <Button variant="chips" text="Tonight" selected={false} />,
    );
    expect(getByTestId("button-chips")).toBeTruthy();
  });

  it("renders chips variant selected", () => {
    const { getByText } = render(
      <Button variant="chips" text="Tonight" selected={true} />,
    );
    expect(getByText("Tonight")).toBeTruthy();
  });

  it("calls onPress on chip", () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <Button variant="chips" text="Weekend" onPress={mockOnPress} />,
    );
    fireEvent.press(getByTestId("button-chips"));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});

describe("ToggleSwitch", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(
      <ToggleSwitch isEnabled={false} onToggle={jest.fn()} />,
    );
    expect(getByTestId("toggle-switch")).toBeTruthy();
  });

  it("reflects isEnabled state", () => {
    const { getByTestId } = render(
      <ToggleSwitch isEnabled={true} onToggle={jest.fn()} />,
    );
    expect(getByTestId("toggle-switch").props.value).toBe(true);
  });

  it("calls onToggle when value changes", () => {
    const mockToggle = jest.fn();
    const { getByTestId } = render(
      <ToggleSwitch isEnabled={false} onToggle={mockToggle} />,
    );
    fireEvent(getByTestId("toggle-switch"), "valueChange", true);
    expect(mockToggle).toHaveBeenCalledWith(true);
  });
});
