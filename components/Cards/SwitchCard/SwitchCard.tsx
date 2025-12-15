import { View, Text, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "components/Buttons/Buttons";
import colors, { theme } from "themes/tokens/colors";
import typography from "themes/tokens/typography";

interface SwitchCardProps {
  title: string;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const SwitchCard: React.FC<SwitchCardProps> = ({
  title,
  isEnabled,
  onToggle,
}) => {
  return (
    <View style={styles.container}>
      {/* Glassmorphism blur layer - gray frost */}
      <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
        {/* Glass gradient overlay for depth */}
        <LinearGradient
          colors={[
            "rgba(120, 120, 130, 0.5)",
            "rgba(80, 80, 90, 0.3)",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.glassOverlay}
        />
        {/* Inner highlight for glass effect */}
        <LinearGradient
          colors={[
            "rgba(180, 180, 190, 0.4)",
            "rgba(120, 120, 130, 0)",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.innerHighlight}
        />
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Button variant="switch" switchProps={{ isEnabled, onToggle }} />
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 60,
    borderRadius: 20,
    overflow: "hidden",
    // Gray frost glassmorphism border
    borderWidth: 1.5,
    borderColor: "rgba(150, 150, 160, 0.3)",
    // Glass shadow for floating effect
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    // Gray frost background base
    backgroundColor: "rgba(100, 100, 110, 0.4)",
  },
  blurContainer: {
    flex: 1,
    overflow: "hidden",
    borderRadius: 20,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.8,
  },
  innerHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 30,
    opacity: 0.5,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    fontWeight: "600",
    color: colors.white,
    // Text shadow for readability on gray frost
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
