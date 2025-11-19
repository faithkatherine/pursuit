import { Layout } from "components/Layout";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  Easing,
  useWindowDimensions,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "providers/AuthProvider";
import { images } from "assets/images";
import { theme } from "themes/tokens/colors";
import typography from "themes/tokens/typography";
import { Button } from "components/Buttons";

const GetStarted = () => {
  const router = useRouter();
  const { markGetStartedSeen, isAuthenticated, needsOnboarding } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);
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
  const extendedImages = [...imageKeys, imageKeys[0]];
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToIndex = (index: number, animated: boolean = true) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * imageContainerWidth,
        animated: animated,
      });
    }
  };

  const startAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        scrollToIndex(nextIndex);

        if (nextIndex === totalImages) {
          setTimeout(() => {
            scrollToIndex(0, false);
            setCurrentIndex(0);
          }, 100);
          return totalImages;
        }

        return nextIndex;
      });
    }, 3500);
  };

  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleMomentumScrollEnd = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / imageContainerWidth);

    if (newIndex === totalImages) {
      setTimeout(() => {
        scrollToIndex(0, false);
        setCurrentIndex(0);
      }, 5);
    } else {
      setCurrentIndex(newIndex);
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
              (currentIndex === index ||
                (currentIndex === totalImages && index === 0)) &&
                styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    );
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [imageContainerWidth]);
  const handleBeginPursuit = async () => {
    await markGetStartedSeen();
    if (isAuthenticated && needsOnboarding) {
      router.push("/onboarding/interests");
    } else {
      router.push("/auth/signup");
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          style={[styles.imageContainer, { width: imageContainerWidth }]}
          contentContainerStyle={{ flexDirection: "row" }}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          decelerationRate={0.98}
          snapToInterval={imageContainerWidth}
          snapToAlignment="start"
          scrollEnabled={false}
          onMomentumScrollEnd={handleMomentumScrollEnd}
        >
          {extendedImages.map((imageKey, index) => (
            <Image
              key={`${imageKey}-${index}`}
              source={images[imageKey]}
              style={[styles.carouselImage, { width: imageContainerWidth }]}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
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
