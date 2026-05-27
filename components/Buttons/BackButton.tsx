import React from "react";
import BackIcon from "assets/icons/back.svg";
import colors from "themes/tokens/colors";
import { Button } from "./Buttons";

interface BackButtonProps {
  onPress: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  iconColor?: string;
  style?: object;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  disabled = false,
  size = "md",
  iconColor = colors.white,
  style,
}) => {
  return (
    <Button
      variant="back"
      onPress={onPress}
      disabled={disabled}
      size={size}
      style={style}
      icon={
        <BackIcon
          width={size === "sm" ? 16 : size === "md" ? 20 : 24}
          height={size === "sm" ? 16 : size === "md" ? 20 : 24}
          fill={iconColor}
        />
      }
    />
  );
};
