import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { VoterInfoType } from "graphql/generated/graphql";
import colors from "themes/tokens/colors";
import { fontSizes, fontWeights } from "themes/tokens/typography";
import { spacing } from "themes/tokens/spacing";
import { VoterAvatar } from "components/VoterAvatar";

interface VoterAvatarRowProps {
  voters: VoterInfoType[];
  interestedCount: number;
  maxVisible?: number;
}

export const VoterAvatarRow: React.FC<VoterAvatarRowProps> = ({
  voters,
  interestedCount,
  maxVisible = 5,
}) => {
  if (interestedCount === 0) {
    return <Text style={styles.emptyText}>No votes yet</Text>;
  }

  const visibleVoters = voters.slice(0, maxVisible);
  const hiddenCount = Math.max(0, interestedCount - visibleVoters.length);

  return (
    <View style={styles.container}>
      <View style={styles.avatarStack}>
        {visibleVoters.map((voter, index) => (
          <View
            key={`${voter.displayInitial}-${voter.displayColor}-${index}`}
            style={index > 0 ? styles.overlappedAvatar : undefined}
          >
            <VoterAvatar
              profilePicture={voter.profilePicture}
              displayInitial={voter.displayInitial}
              displayColor={voter.displayColor}
            />
          </View>
        ))}
        {hiddenCount > 0 && <Text style={styles.overflowText}>+{hiddenCount}</Text>}
      </View>
      <Text style={styles.countText}>
        {interestedCount} interested
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  avatarStack: {
    flexDirection: "row",
    alignItems: "center",
  },
  overlappedAvatar: {
    marginLeft: -8,
  },
  overflowText: {
    marginLeft: spacing.xs,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    lineHeight: 16,
    color: colors.white,
  },
  countText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: 19,
    color: colors.white65,
  },
  emptyText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: 19,
    color: colors.white65,
  },
});
