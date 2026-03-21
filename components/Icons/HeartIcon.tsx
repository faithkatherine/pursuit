import React from "react";
import Svg, { Path } from "react-native-svg";
import colors from "themes/tokens/colors";

const HEART_PATH =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

export const HeartIcon = ({
  size = 18,
  color = colors.deluge,
  filled = false,
}: {
  size?: number;
  color?: string;
  filled?: boolean;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d={HEART_PATH}
      stroke={color}
      strokeWidth={1.8}
      fill={filled ? color : "none"}
    />
  </Svg>
);
