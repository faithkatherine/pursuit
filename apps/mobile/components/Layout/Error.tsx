import { View, Text, StyleSheet } from "react-native";

interface ErrorProps {
  error: string;
}

export const Error: React.FC<ErrorProps> = ({ error }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>
        {error || "An error occurred. Please try again."}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});
