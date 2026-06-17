import React from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import colors from "themes/tokens/colors";
import { fontSizes, fontWeights } from "themes/tokens/typography";
import type { EventInfoFragment } from "graphql/generated/graphql";

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  onCta?: () => void;
  nudgeLabel?: string;
  onNudge?: () => void;
  suggestedEvents?: EventInfoFragment[];
  renderSuggestedCard?: (event: EventInfoFragment) => React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  ctaLabel,
  onCta,
  nudgeLabel,
  onNudge,
  suggestedEvents,
  renderSuggestedCard,
}) => {
  return (
    <View style={styles.container}>
      {/* Icon circle */}
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>{subtitle}</Text>

      {/* Primary CTA */}
      {ctaLabel && onCta && (
        <Pressable
          onPress={onCta}
          style={({ pressed }) => [
            styles.ctaButton,
            pressed && styles.ctaButtonPressed,
          ]}
        >
          <Text style={styles.ctaButtonText}>{ctaLabel}</Text>
        </Pressable>
      )}

      {/* Nudge link */}
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
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  iconText: {
    fontSize: 32,
    lineHeight: 37,
    color: colors.aluminium,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    lineHeight: 26,
    color: colors.thunder,
    textAlign: "center",
    marginTop: 16,
  },
  subtitle: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.regular,
    lineHeight: 24,
    color: colors.aluminium,
    textAlign: "center",
    marginTop: 8,
    maxWidth: 280,
  },
  ctaButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: colors.primaryFixed,
  },
  ctaButtonPressed: {
    opacity: 0.7,
  },
  ctaButtonText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
    lineHeight: 22,
    color: colors.deluge,
  },
  nudgeButton: {
    marginTop: 12,
    paddingVertical: 8,
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
    marginTop: 32,
  },
  suggestedTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: 23,
    color: colors.thunder,
    marginBottom: 16,
  },
  suggestedScroll: {
    gap: 16,
    paddingRight: 16,
  },
  suggestedCardWrapper: {
    width: 280,
  },
});
