import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
import { Fragment } from "react/jsx-runtime";
import { ReactNode, useRef } from "react";
import Chevron from "assets/icons/chevron.svg";
import colors from "themes/tokens/colors";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "../Buttons";
import { fontWeights } from "themes/tokens/typography";
import { SectionHeader } from "components/Layout";
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
      {header}
      <FlatList
        horizontal
        data={items}
        renderItem={({ item }) => <Fragment>{item}</Fragment>}
        contentContainerStyle={{
          paddingLeft: 20,
          paddingRight: 20,
          gap: gap ? gap : 8,
        }}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  chevrons: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
});
