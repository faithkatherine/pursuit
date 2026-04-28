import { Pressable, View, Text, StyleSheet } from "react-native";

import TravelIcon from "assets/icons/travel_explore.svg";
import Chevron from "assets/icons/chevron.svg";
import colors from "themes/tokens/colors";
import typography, { fontSizes, fontWeights } from "themes/tokens/typography";
import { useRouter } from "expo-router";

export const TripCard = () => {
  const router = useRouter();
  return (
    <Pressable style={styles.ctaStrip} onPress={() => router.push("/travel")}>
      <TravelIcon width={18} height={18} fill={colors.thunder} />
      <View style={styles.ctaStripContent}>
        <Text style={styles.ctaStripTitle}>Plan a trip</Text>
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
