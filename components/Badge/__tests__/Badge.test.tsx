import { render, screen } from "@testing-library/react-native";
import { Badge } from "../Badge";
import colors from "themes/tokens/colors";

describe("Badge", () => {
  it("renders text correctly", () => {
    render(
      <Badge
        text="CULTURE & ARTS"
        backgroundColor={colors.deluge}
        testID="badge"
      />
    );

    expect(screen.getByText("CULTURE & ARTS")).toBeTruthy();
  });

  it("applies custom backgroundColor", () => {
    render(
      <Badge
        text="FREE"
        backgroundColor={colors.sage}
        testID="badge"
      />
    );

    const badge = screen.getByTestId("badge");
    expect(badge.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: colors.sage }),
      ])
    );
  });

  it("uses default white textColor when not provided", () => {
    render(
      <Badge
        text="SOLD OUT"
        backgroundColor={colors.graniteGray}
        testID="badge"
      />
    );

    const text = screen.getByText("SOLD OUT");
    expect(text.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: colors.white })])
    );
  });

  it("applies custom textColor when provided", () => {
    render(
      <Badge
        text="WORKSHOPS"
        backgroundColor={colors.bareBlush}
        textColor={colors.tannin}
        testID="badge"
      />
    );

    const text = screen.getByText("WORKSHOPS");
    expect(text.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ color: colors.tannin })])
    );
  });

  it("has correct accessibility attributes", () => {
    render(
      <Badge
        text="TRENDING"
        backgroundColor={colors.deluge}
        testID="badge"
      />
    );

    const badge = screen.getByTestId("badge");
    expect(badge.props.accessible).toBe(true);
    expect(badge.props.accessibilityRole).toBe("text");
    expect(badge.props.accessibilityLabel).toBe("TRENDING");
  });
});
