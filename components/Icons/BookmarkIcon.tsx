import React from "react";
import Svg, { Path } from "react-native-svg";
import colors from "themes/tokens/colors";

const BOOKMARK_PATH = "M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z";

export const BookmarkIcon = ({
  size = 20,
  color = colors.white,
  filled = false,
}: {
  size?: number;
  color?: string;
  filled?: boolean;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d={BOOKMARK_PATH}
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
      fill={filled ? color : "none"}
    />
  </Svg>
);
