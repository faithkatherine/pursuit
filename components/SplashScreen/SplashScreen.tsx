import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "themes/tokens/colors";

interface SplashScreenProps {
  onFinish?: () => void;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const contentFadeAnim = useRef(new Animated.Value(0)).current;
  const contentScaleAnim = useRef(new Animated.Value(0.98)).current;
  const screenFadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate content in with a gentle ease
    Animated.parallel([
      Animated.timing(contentFadeAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(contentScaleAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-finish after display time
    const timer = setTimeout(() => {
      if (onFinish) {
        // Very slow, gentle fade out for smooth transition
        Animated.timing(screenFadeAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }).start(() => onFinish());
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, [contentFadeAnim, contentScaleAnim, screenFadeAnim, onFinish]);

  return (
    <AnimatedLinearGradient
      colors={[colors.deluge, colors.delugeLight, colors.roseFog]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { opacity: screenFadeAnim }]}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: contentFadeAnim,
            transform: [{ scale: contentScaleAnim }],
          },
        ]}
      >
        <Text style={styles.title}>PURSUIT</Text>
      </Animated.View>
    </AnimatedLinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 52,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 4,
    textShadowColor: "rgba(0, 0, 0, 0.15)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  taglineContainer: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: colors.white02,
    borderRadius: 20,
  },
  tagline: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.white,
    letterSpacing: 2,
  },
});

export default SplashScreen;
