import { Pressable, View, Text, StyleSheet } from "react-native";

import ChevronIcon from "assets/icons/chevron.svg";
import ProfileIcon from "assets/icons/profile.svg";
import colors from "themes/tokens/colors";
import typography, { fontSizes, fontWeights } from "themes/tokens/typography";
import { EventCardData } from "../EventsCard";

interface CTACardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  nextUpEvent?: EventCardData | null;
  nextUpHours?: number | null;
  variant?: "primary" | "secondary";
  backgroundColor?: string;
  onPress: () => void;
}

export const CTACard: React.FC<CTACardProps> = ({
  title,
  subtitle,
  icon,
  variant = "primary",
  backgroundColor,
  nextUpEvent,
  nextUpHours,
  onPress,
}) => {
  switch (variant) {
    case "primary":
      return (
        <Pressable
          style={[styles.ctaStrip, { backgroundColor: backgroundColor }]}
          onPress={onPress}
        >
          <View style={styles.ctaIconBox}>{icon}</View>
          <View style={styles.ctaStripContent}>
            <Text style={styles.ctaStripTitle}>{title}</Text>
            <Text style={styles.ctaStripSubtitle}>{subtitle}</Text>
          </View>
          <View>
            <ChevronIcon
              width={24}
              height={24}
              stroke={colors.black87}
              strokeWidth={36}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </View>
        </Pressable>
      );
    case "secondary":
      return (
        <Pressable
          style={[styles.ctaStrip, styles.ctaStripSecondary]}
          onPress={onPress}
        >
          <View style={styles.ctaIconBox}>{icon}</View>
          <View style={styles.ctaStripContent}>
            <Text style={styles.ctaStripTitle}>
              NEXT UP IN {nextUpHours} HOURS
            </Text>
            <Text style={styles.ctaStripSubtitle}>{nextUpEvent?.name}</Text>
          </View>
          <View>
            <ChevronIcon
              width={24}
              height={24}
              stroke={colors.black87}
              strokeWidth={48}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </View>
        </Pressable>
      );
  }
};

const styles = StyleSheet.create({
  ctaStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: colors.shilo,
  },
  ctaStripSecondary: {
    backgroundColor: colors.white,
  },
  ctaIconBox: {
    width: 45,
    height: 45,
    borderRadius: 7,
    backgroundColor: colors.ube50,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaStripContent: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  ctaStripTitle: {
    fontFamily: typography.h4.fontFamily,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.black87,
    textTransform: "uppercase",
  },
  ctaStripSubtitle: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    color: colors.black87,
  },
});
