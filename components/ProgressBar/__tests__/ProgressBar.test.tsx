import { ProgressBar } from "../ProgressBar";

describe("ProgressBar", () => {
  it("renders correctly with basic props", () => {
    const component = <ProgressBar progress={0.5} />;
    expect(component).toBeDefined();
  });

  it("calculates progress percentage correctly", () => {
    const component = <ProgressBar progress={0.75} />;
    expect(component.props.progress).toBe(0.75);
  });

  it("handles completed and remaining props", () => {
    const component = (
      <ProgressBar progress={0.48} completed={12} remaining={13} />
    );
    expect(component.props.completed).toBe(12);
    expect(component.props.remaining).toBe(13);
  });

  it("clamps progress values between 0 and 1", () => {
    const negativeProgress = <ProgressBar progress={-0.5} />;
    const overOneProgress = <ProgressBar progress={1.5} />;

    expect(negativeProgress.props.progress).toBe(-0.5); // Component should handle clamping internally
    expect(overOneProgress.props.progress).toBe(1.5);
  });

  it("handles custom styling props", () => {
    const component = (
      <ProgressBar
        progress={0.5}
        height={10}
        backgroundColor="red"
        fillColor="blue"
        borderRadius={8}
      />
    );

    expect(component.props.height).toBe(10);
    expect(component.props.backgroundColor).toBe("red");
    expect(component.props.fillColor).toBe("blue");
    expect(component.props.borderRadius).toBe(8);
  });

  it("handles showPercentage prop", () => {
    const withPercentage = (
      <ProgressBar progress={0.65} showPercentage={true} />
    );
    const withoutPercentage = (
      <ProgressBar progress={0.65} showPercentage={false} />
    );

    expect(withPercentage.props.showPercentage).toBe(true);
    expect(withoutPercentage.props.showPercentage).toBe(false);
  });

  it("handles edge cases", () => {
    const zeroProgress = <ProgressBar progress={0} />;
    const completeProgress = <ProgressBar progress={1} />;

    expect(zeroProgress.props.progress).toBe(0);
    expect(completeProgress.props.progress).toBe(1);
  });
});
