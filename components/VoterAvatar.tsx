import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import colors from "@shared/constants/tokens/colors";
import { fontSizes, fontWeights } from "@shared/constants/tokens/typography";

interface VoterAvatarProps {
  profilePicture?: string | null;
  displayInitial: string;
  displayColor: string;
  size?: number;
}

const COLOR_MAP: Record<string, string> = {
  purple: colors.deluge,
  pink: colors.frenchPink,
  teal: colors.forest,
  amber: colors.mustard,
  coral: colors.terracotta,
};

export const VoterAvatar: React.FC<VoterAvatarProps> = ({
  profilePicture,
  displayInitial,
  displayColor,
  size = 24,
}) => {
  const avatarStyle = [
    styles.avatar,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: COLOR_MAP[displayColor] ?? colors.deluge,
    },
  ];

  if (profilePicture) {
    return (
      <Image
        source={{ uri: profilePicture }}
        style={avatarStyle}
        accessibilityIgnoresInvertColors
      />
    );
  }

  return (
    <View style={avatarStyle}>
      <Text style={styles.initial}>{displayInitial.slice(0, 1)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.white80,
    overflow: "hidden",
  },
  initial: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    lineHeight: 16,
    color: colors.white,
    textAlign: "center",
  },
});
