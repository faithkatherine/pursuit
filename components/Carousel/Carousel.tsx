import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
import { Fragment } from "react/jsx-runtime";
import { ReactNode, useRef } from "react";
import Chevron from "pursuit/assets/icons/chevron.svg";
import colors from "pursuit/themes/tokens/colors";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "../Buttons";
import { fontWeights } from "pursuit/themes/tokens/typography";
interface CarouselProps {
  header: ReactNode;
  items: ReactNode[];
  gap?: number;
}

export const Carousel: React.FC<CarouselProps> = ({
  header,
  items = [],
  gap,
}) => {
  const flatListRef = useRef<FlatList>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>{header}</View>

      <FlatList
        horizontal
        data={items}
        renderItem={({ item }) => <Fragment>{item}</Fragment>}
        contentContainerStyle={{
          paddingLeft: 24,
          paddingRight: 24,
          gap: gap ? gap : 8,
        }}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 27,
    marginBottom: 16,
  },
  chevrons: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
});
