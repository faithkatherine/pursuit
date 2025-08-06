import { FlatList, View, StyleSheet } from "react-native";
import { Fragment } from "react/jsx-runtime";
import { ReactNode } from "react";
interface CarouselProps {
  header: ReactNode;
  items: ReactNode[];
}

export const Carousel: React.FC<CarouselProps> = ({ header, items = [] }) => {
  return (
    <View style={styles.container}>
      {header}
      <FlatList
        horizontal
        data={items}
        renderItem={({ item }) => <Fragment>{item}</Fragment>}
        contentContainerStyle={{
          paddingLeft: 24,
          paddingRight: 24,
          gap: 8,
        }}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
});
