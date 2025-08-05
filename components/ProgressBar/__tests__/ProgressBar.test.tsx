import { render } from "@testing-library/react-native";
import { ProgressBar } from "../ProgressBar";

describe("ProgressBar", () => {
  it("matches snapshot", () => {
    const { toJSON } = render(<ProgressBar progress={0.5} />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("renders correctly with basic props", () => {
    const { getByTestId } = render(
      <ProgressBar progress={0.5} testID="progress-bar" />
    );

    expect(getByTestId("progress-bar")).toBeTruthy();
  });

  it("renders progress bar with correct width percentage", () => {
    const { getByTestId } = render(
      <ProgressBar progress={0.75} testID="progress-bar" />
    );

    const progressFill = getByTestId("progress-fill");
    expect(progressFill.props.style).toMatchObject({
      width: "75%",
    });
  });

  it("shows percentage text when showPercentage is true", () => {
    const { getByText } = render(
      <ProgressBar progress={0.65} showPercentage={true} />
    );

    expect(getByText("65% complete")).toBeTruthy();
  });

  it("does not show percentage text when showPercentage is false", () => {
    const { queryByText } = render(
      <ProgressBar progress={0.65} showPercentage={false} />
    );

    expect(queryByText("65% complete")).toBeNull();
  });

  it("renders completed and remaining stats when provided", () => {
    const { getByText } = render(
      <ProgressBar progress={0.48} completed={12} remaining={13} />
    );

    expect(getByText("12")).toBeTruthy();
    expect(getByText("Completed")).toBeTruthy();
    expect(getByText("13")).toBeTruthy();
    expect(getByText("Remaining")).toBeTruthy();
  });

  it("does not render stats when completed and remaining are not provided", () => {
    const { queryByText } = render(<ProgressBar progress={0.48} />);

    expect(queryByText("Completed")).toBeNull();
    expect(queryByText("Remaining")).toBeNull();
  });

  it("clamps progress values between 0 and 1", () => {
    const { getByTestId: getByTestIdNegative } = render(
      <ProgressBar progress={-0.5} testID="progress-bar-negative" />
    );
    const { getByTestId: getByTestIdOverOne } = render(
      <ProgressBar progress={1.5} testID="progress-bar-over-one" />
    );

    const negativeProgressFill = getByTestIdNegative("progress-fill");
    const overOneProgressFill = getByTestIdOverOne("progress-fill");

    expect(negativeProgressFill.props.style).toMatchObject({
      width: "0%",
    });
    expect(overOneProgressFill.props.style).toMatchObject({
      width: "100%",
    });
  });

  it("applies custom height", () => {
    const { getByTestId } = render(
      <ProgressBar progress={0.5} height={10} testID="progress-bar" />
    );

    const progressBar = getByTestId("progress-bar");
    expect(progressBar.props.style).toMatchObject({
      height: 10,
    });
  });

  it("applies custom colors", () => {
    const { getByTestId } = render(
      <ProgressBar
        progress={0.5}
        backgroundColor="red"
        fillColor="blue"
        testID="progress-bar"
      />
    );

    const progressBar = getByTestId("progress-bar");
    const progressFill = getByTestId("progress-fill");

    expect(progressBar.props.style).toMatchObject({
      backgroundColor: "red",
    });
    expect(progressFill.props.style).toMatchObject({
      backgroundColor: "blue",
    });
  });

  it("applies custom border radius", () => {
    const { getByTestId } = render(
      <ProgressBar progress={0.5} borderRadius={8} testID="progress-bar" />
    );

    const progressBar = getByTestId("progress-bar");
    const progressFill = getByTestId("progress-fill");

    expect(progressBar.props.style).toMatchObject({
      borderRadius: 8,
    });
    expect(progressFill.props.style).toMatchObject({
      borderRadius: 8,
    });
  });

  it("handles zero progress correctly", () => {
    const { getByTestId } = render(
      <ProgressBar progress={0} testID="progress-bar" showPercentage={true} />
    );

    const progressFill = getByTestId("progress-fill");
    expect(progressFill.props.style).toMatchObject({
      width: "0%",
    });
  });

  it("handles complete progress correctly", () => {
    const { getByTestId, getByText } = render(
      <ProgressBar progress={1} testID="progress-bar" showPercentage={true} />
    );

    const progressFill = getByTestId("progress-fill");
    expect(progressFill.props.style).toMatchObject({
      width: "100%",
    });
    expect(getByText("100% complete")).toBeTruthy();
  });
});
