import { View, Text, StyleSheet, Platform } from "react-native";
import { Layout } from "components/Layout";
import { colors, theme } from "@shared/constants/tokens/colors";
import { typography, fontWeights, fontSizes } from "@shared/constants/tokens/typography";
import { radii } from "@shared/constants/tokens/spacing";
import BeginJourneyIcon from "assets/icons/begin_journey.svg";

const Travel = () => {
  return (
    <Layout backgroundColor={colors.white}>
      <View
        style={[
          styles.container,
          Platform.OS === "web" && styles.webContainer,
        ]}
      >
        <BeginJourneyIcon width={200} height={200} />
        <Text style={styles.title}>Plan Your Next Adventure</Text>
        <Text style={styles.description}>
          Create itineraries, add events to your travel plans, and track your
          budget — all in one place.
        </Text>
        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonText}>Coming Soon</Text>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 16,
  },
  webContainer: {
    width: "100%",
    maxWidth: 760,
    marginHorizontal: "auto",
  },
  title: {
    fontFamily: typography.h2.fontFamily,
    fontSize: typography.h2.fontSize,
    fontWeight: fontWeights.bold,
    color: theme.text.primary,
    textAlign: "center",
  },
  description: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.base,
    color: theme.text.secondary,
    textAlign: "center",
    lineHeight: 22,
  },
  comingSoon: {
    marginTop: 8,
    backgroundColor: colors.prim,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: radii["2xl"],
  },
  comingSoonText: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.deluge,
  },
});

export default Travel;
