import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TextStyle,
} from "react-native";
import { colors } from "themes/tokens/colors";
import { typography, fontSizes } from "themes/tokens/typography";
import { Progress } from "graphql/types";

interface ProgressBarProps {
  progress: Progress;
  showPercentage?: boolean;
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
  borderRadius?: number;
  textStyle?: StyleProp<TextStyle>;
}

export const ProgressBar = ({
  progress,
  height = 6,
  backgroundColor = "rgba(255, 255, 255, 0.3)",
  fillColor = colors.white,
  borderRadius = 3,
  textStyle,
}: ProgressBarProps) => {
  return (
    <View style={styles.container} testID="progress-bar-container">
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
              width: `${progress.percentage}%`,
              backgroundColor: fillColor,
              borderRadius,
            },
          ]}
          testID="progress-fill"
        />
      </View>
      {progress.completed && progress.yearlyGoal && (
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, textStyle]}>
              {progress.completed}
            </Text>
            <Text style={[styles.statLabel, textStyle]}>Completed</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={[styles.statNumber, textStyle]}>
              {progress.remaining || progress.yearlyGoal - progress.completed}
            </Text>
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
