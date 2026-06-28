import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import colors from "@shared/constants/tokens/colors";
import { fontSizes, fontWeights } from "@shared/constants/tokens/typography";
import { radii, spacing } from "@shared/constants/tokens/spacing";
import type { EventInfoFragment } from "@shared/graphql/generated/graphql";
import { Button } from "components/Buttons";

interface EmptyStateAction {
  label: string;
  onPress: () => void;
}

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  illustration?: React.ReactNode;
  action?: EmptyStateAction;
  ctaLabel?: string;
  onCta?: () => void;
  nudgeLabel?: string;
  onNudge?: () => void;
  suggestedEvents?: EventInfoFragment[];
  renderSuggestedCard?: (event: EventInfoFragment) => React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  illustration,
  action,
  ctaLabel,
  onCta,
  nudgeLabel,
  onNudge,
  suggestedEvents,
  renderSuggestedCard,
}) => {
  const resolvedAction =
    action ?? (ctaLabel && onCta ? { label: ctaLabel, onPress: onCta } : null);

  return (
    <View style={styles.container}>
      {illustration ? (
        <View style={styles.illustrationFrame}>{illustration}</View>
      ) : null}

      <Text style={styles.title}>{title}</Text>

      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

      {resolvedAction && (
        <Button
          text={resolvedAction.label}
          onPress={resolvedAction.onPress}
          variant="primary"
          style={styles.ctaButton}
          textStyle={styles.ctaButtonText}
        />
      )}

      {nudgeLabel && onNudge && (
        <Pressable
          onPress={onNudge}
          style={({ pressed }) => [
            styles.nudgeButton,
            pressed && styles.nudgeButtonPressed,
          ]}
        >
          <Text style={styles.nudgeText}>{nudgeLabel}</Text>
        </Pressable>
      )}

      {/* Suggested events */}
      {suggestedEvents && suggestedEvents.length > 0 && renderSuggestedCard && (
        <View style={styles.suggestedSection}>
          <Text style={styles.suggestedTitle}>Events worth saving</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestedScroll}
          >
            {suggestedEvents.map((event) => (
              <View key={event.id} style={styles.suggestedCardWrapper}>
                {renderSuggestedCard(event)}
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.base,
    paddingHorizontal: spacing["2xl"],
    paddingVertical: spacing["5xl"],
  },
  illustrationFrame: {
    width: 220,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    lineHeight: 26,
    color: colors.white,
    textAlign: "center",
  },
  subtitle: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.regular,
    lineHeight: 24,
    color: colors.white65,
    textAlign: "center",
    maxWidth: 260,
  },
  ctaButton: {
    width: "100%",
    maxWidth: 320,
    borderRadius: radii.full,
    backgroundColor: colors.primaryFixed,
    shadowOpacity: 0,
    elevation: 0,
  },
  ctaButtonText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    lineHeight: 22,
    color: colors.deluge,
  },
  nudgeButton: {
    paddingVertical: spacing.sm,
  },
  nudgeButtonPressed: {
    opacity: 0.7,
  },
  nudgeText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: 19,
    color: colors.deluge,
    textDecorationLine: "underline",
  },
  suggestedSection: {
    width: "100%",
    marginTop: spacing.base,
  },
  suggestedTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: 23,
    color: colors.white,
    marginBottom: spacing.base,
  },
  suggestedScroll: {
    gap: spacing.base,
    paddingRight: spacing.base,
  },
  suggestedCardWrapper: {
    width: 280,
  },
});
