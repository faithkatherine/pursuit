import React from "react";
import { ActivityIndicator } from "react-native";
import HeartIcon from "assets/icons/heart.svg";
import colors from "@shared/constants/tokens/colors";
import { Button } from "./Buttons";

interface SaveButtonProps {
  onPress: () => void;
  isSaved: boolean;
  loading?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  fillColor?: string;
  style?: object;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  onPress,
  isSaved,
  loading = false,
  disabled = false,
  size = "md",
  fillColor = colors.careysPink,
  style,
}) => {
  return (
    <Button
      variant="save"
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      size={size}
      style={style}
      icon={
        !loading && (
          <HeartIcon
            width={size === "sm" ? 16 : size === "md" ? 20 : 24}
            height={size === "sm" ? 16 : size === "md" ? 20 : 24}
            fill={isSaved ? fillColor : "transparent"}
            color={fillColor}
          />
        )
      }
    />
  );
};
