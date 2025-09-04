import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "themes/tokens/colors";
import {
  typography,
  fontSizes,
  fontWeights,
} from "themes/tokens/typography";
import { Button } from "../../Buttons";

interface BucketCardProps {
  id: string;
  name: string;
  emoji: string;
  gradientColors: [string, string];
}

export const BucketCard: React.FC<BucketCardProps> = ({
  id,
  name,
  emoji,
  gradientColors,
}) => {
  return (
    <LinearGradient
      key={id}
      colors={gradientColors}
      locations={[0, 1]}
      style={styles.categoryCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryName}>{name}</Text>
        <Text style={styles.categoryEmoji}>{emoji}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  categoryCard: {
    width: 150,
    height: 80,
    borderRadius: 8,
    padding: 16,
    justifyContent: "space-between",
  },
  categoryHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  categoryEmoji: {
    fontSize: 32,
  },
  categoryName: {
    fontFamily: typography.bodyLarge.fontFamily,
    fontSize: typography.bodyLarge.fontSize,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
});
