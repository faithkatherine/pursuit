import React from "react";
import { render } from "@testing-library/react-native";
import GetStarted from "../index";

describe("GetStarted", () => {
  it("matches snapshot", () => {
    const { toJSON } = render(<GetStarted />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("renders correctly", () => {
    const { getByText } = render(<GetStarted />);
    expect(getByText("PURSUIT")).toBeTruthy();
    expect(getByText("BEGIN YOUR PURSUIT")).toBeTruthy();
  });
});
