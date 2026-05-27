import { View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export const Confirmation = () => {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

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
});
