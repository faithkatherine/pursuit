import React from "react";
import Svg, { Path } from "react-native-svg";
import colors from "themes/tokens/colors";

const STAR_PATH =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

export const StarIcon = ({
  size = 16,
  color = colors.white,
}: {
  size?: number;
  color?: string;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d={STAR_PATH}
      stroke={color}
      strokeWidth={1.5}
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);
