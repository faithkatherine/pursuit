import { View, StyleSheet } from "react-native";
import colors from "themes/tokens/colors";

interface OnboardingProgressMarkersProps {
  currentStep: number;
  totalSteps: number;
}

export const OnboardingProgressMarkers = ({
  currentStep,
  totalSteps,
}: OnboardingProgressMarkersProps) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.marker,
            index + 1 === currentStep && styles.activeMarker,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    justifyContent: "center",
    gap: 8,
  },
  marker: {
    flex: 1,
    height: 4,
    backgroundColor: colors.white,
    maxWidth: 60,
  },
  activeMarker: {
    backgroundColor: colors.black,
  },
});
