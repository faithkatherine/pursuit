import { Pressable, StyleSheet, View, Text } from "react-native";

import ScheduleIcon from "assets/icons/schedule_events.svg";
import Chevron from "assets/icons/chevron.svg";
import colors from "themes/tokens/colors";
import typography, { fontSizes, fontWeights } from "themes/tokens/typography";
import { EventCardData } from "../EventsCard";

interface NextUpCardProps {
  nextUpEvent: EventCardData;
  nextUpHours: number;
}

export const NextUpCard = ({ nextUpEvent, nextUpHours }: NextUpCardProps) => {
  return (
    <Pressable style={styles.ctaStrip} onPress={() => {}}>
      <ScheduleIcon width={18} height={18} fill={colors.thunder} />
      <View style={styles.ctaStripContent}>
        <Text style={styles.ctaStripLabel}>
          NEXT UP {"\u00B7"} IN{" "}
          {nextUpHours === 0
            ? "< 1 HOUR"
            : `${nextUpHours} HOUR${nextUpHours === 1 ? "" : "S"}`}
        </Text>
        <Text style={styles.ctaStripTitle} numberOfLines={1}>
          {nextUpEvent.name}
          {nextUpEvent.locationName
            ? ` \u00B7 ${nextUpEvent.locationName}`
            : ""}
        </Text>
      </View>
      <View style={{ transform: [{ rotate: "180deg" }] }}>
        <Chevron width={14} height={14} fill={colors.aluminium} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  ctaStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  ctaStripContent: {
    flex: 1,
  },
  ctaStripLabel: {
    fontFamily: typography.caption.fontFamily,
    fontSize: 10,
    fontWeight: fontWeights.semibold,
    color: colors.thunder,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  ctaStripTitle: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.thunder,
  },
});
