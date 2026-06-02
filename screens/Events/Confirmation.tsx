import { View, StyleSheet, Text, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button } from "components/Buttons";
import colors from "themes/tokens/colors";
import typography, { fontWeights } from "themes/tokens/typography";

export const Confirmation = () => {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const router = useRouter();

  if (Platform.OS === "web") {
    return (
      <View style={styles.webContainer}>
        <View style={styles.webCard}>
          <Text style={styles.webTitle}>Ticket confirmation</Text>
          <Text style={styles.webBody}>
            Your confirmed ticket details are best viewed in the Pursuit mobile
            app.
          </Text>
          <Button
            text="Back to event"
            variant="primary"
            onPress={() => router.replace(`/(protected)/events/${eventId}`)}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Confirmation content — use eventId to fetch event */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webContainer: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  webCard: {
    width: "100%",
    maxWidth: 480,
    gap: 18,
    padding: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.silverSand,
  },
  webTitle: {
    ...typography.h2,
    fontWeight: fontWeights.bold,
    color: colors.thunder,
    textAlign: "center",
  },
  webBody: {
    ...typography.body,
    color: colors.graniteGray,
    textAlign: "center",
    lineHeight: 22,
  },
});
