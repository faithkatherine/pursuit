import { View, Text, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { colors } from "pursuit/themes/tokens/colors";
import { typography, fontSizes } from "pursuit/themes/tokens/typography";

interface ProgressBarProps {
  progress: number;
  showPercentage?: boolean;
  completed?: number;
  remaining?: number;
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
  borderRadius?: number;
  style?: ViewStyle;
  textStyle?: StyleProp<any>;
  testID?: string;
}

export const ProgressBar = ({
  progress,
  showPercentage = false,
  completed,
  remaining,
  height = 6,
  backgroundColor = "rgba(255, 255, 255, 0.3)",
  fillColor = colors.white,
  borderRadius = 3,
  style,
  textStyle,
  testID,
}: ProgressBarProps) => {
  const clampedProgress = Math.max(0, Math.min(1, progress));

  return (
    <View style={[styles.container, style]} testID={testID || "progress-bar-container"}>
      <View
        style={[
          styles.progressBar,
          {
            height,
            backgroundColor,
            borderRadius,
          },
        ]}
        testID="progress-bar"
      >
        <View
          style={[
            styles.progressFill,
            {
              width: `${clampedProgress * 100}%`,
              backgroundColor: fillColor,
              borderRadius,
            },
          ]}
          testID="progress-fill"
        />
      </View>
      {showPercentage && (
        <Text style={[styles.progressText, textStyle]}>
          {Math.round(clampedProgress * 100)}% complete
        </Text>
      )}
      {completed && remaining && (
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, textStyle]}>{completed}</Text>
            <Text style={[styles.statLabel, textStyle]}>Completed</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statNumber, textStyle]}>{remaining}</Text>
            <Text style={[styles.statLabel, textStyle]}>Remaining</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  progressBar: {
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
  progressText: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.white,
    opacity: 0.8,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
    gap: 4,
  },
  statNumber: {
    fontFamily: typography.h1.fontFamily,
    fontSize: fontSizes.lg,
    color: colors.white,
    fontWeight: "bold",
  },
  statLabel: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.white,
    opacity: 0.7,
  },
});
