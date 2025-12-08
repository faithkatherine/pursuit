import { Layout } from "components/Layout";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Easing,
  useWindowDimensions,
} from "react-native";
import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "providers/AuthProvider";
import { images } from "assets/images";
import { theme } from "themes/tokens/colors";
import typography from "themes/tokens/typography";
import { Button } from "components/Buttons";
import { setHasSeenGetStarted } from "utils/secureStorage";

const GetStarted = () => {
  const router = useRouter();
  const { isAuthenticated, needsOnboarding } = useAuth();
  const { width } = useWindowDimensions();
  const containerMargin = 27;
  const imageContainerWidth = width - containerMargin * 2;

  const imageKeys = [
    "get-started-1",
    "get-started-2",
    "get-started-3",
    "get-started-4",
    "get-started-5",
    "get-started-6",
  ] as const;
  const totalImages = imageKeys.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Create animated values for each image's opacity (crossfade effect)
  const fadeAnims = useRef(
    imageKeys.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))
  ).current;

  const crossfadeToIndex = (fromIndex: number, toIndex: number) => {
    Animated.parallel([
      // Fade out current image
      Animated.timing(fadeAnims[fromIndex], {
        toValue: 0,
        duration: 1000,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
      // Fade in next image
      Animated.timing(fadeAnims[toIndex], {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const startAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % totalImages;
        crossfadeToIndex(prevIndex, nextIndex);
        return nextIndex;
      });
    }, 4000);
  };

  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const renderIndicators = () => {
    return (
      <View style={styles.indicatorsContainer}>
        {imageKeys.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentIndex === index && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    );
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, []);
  const handleBeginPursuit = async () => {
    // Mark that user has seen the get-started screen
    await setHasSeenGetStarted();

    if (isAuthenticated && needsOnboarding) {
      router.push("/onboarding/interests");
    } else {
      router.push("/auth/signup");
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        <View style={[styles.imageContainer, { width: imageContainerWidth }]}>
          {imageKeys.map((imageKey, index) => (
            <Animated.View
              key={`${imageKey}-${index}`}
              style={[
                styles.imageWrapper,
                {
                  opacity: fadeAnims[index],
                  zIndex: currentIndex === index ? 1 : 0,
                },
              ]}
            >
              <Image
                source={images[imageKey]}
                style={[styles.carouselImage, { width: imageContainerWidth }]}
                resizeMode="cover"
              />
            </Animated.View>
          ))}
        </View>
        {renderIndicators()}

        <View style={styles.contentContainer}>
          <Text style={styles.headerTitle}>PURSUIT</Text>
          <Text style={styles.description}>
            Discover personalized events and experiences based on your interests
            and location. Create unforgettable travel itineraries and pursue
            your next adventure with confidence.
          </Text>
        </View>
        <View style={styles.footerContainer}>
          <Button
            text="BEGIN YOUR PURSUIT"
            variant="primary"
            onPress={handleBeginPursuit}
            style={styles.getStartedButton}
          />
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 27,
    gap: 20,
  },
  imageContainer: {
    height: 400,
    borderRadius: 20,
    overflow: "hidden",
    flexGrow: 0,
  },
  imageWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  carouselImage: {
    height: 400,
    borderRadius: 20,
  },
  contentContainer: {
    alignItems: "center",
    marginTop: 30,
    flex: 1,
    justifyContent: "flex-start",
  },
  footerContainer: {
    paddingBottom: 40,
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: typography.h1.fontFamily,
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    color: theme.secondary,
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    color: theme.text.secondary,
    textAlign: "center",
    maxWidth: 300,
  },
  getStartedButton: {
    width: 300,
    height: 48,
    backgroundColor: theme.secondary,
    borderRadius: 16,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowColor: theme.secondary,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  indicatorsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  activeIndicator: {
    backgroundColor: theme.secondary,
    width: 24,
  },
});

export default GetStarted;
