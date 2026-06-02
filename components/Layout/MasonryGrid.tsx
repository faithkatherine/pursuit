import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";

interface MasonryGridProps {
  children: React.ReactNode[];
  columnGap?: number;
  containerPadding?: number;
  column2Offset?: number;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({
  children,
  columnGap = 12,
  containerPadding = 16,
  column2Offset = 48,
}) => {
  // Split children into two columns
  const column1Items: React.ReactNode[] = [];
  const column2Items: React.ReactNode[] = [];

  children.forEach((child, index) => {
    if (index % 2 === 0) {
      column1Items.push(child);
    } else {
      column2Items.push(child);
    }
  });

  return (
    <View style={[styles.container, { paddingHorizontal: containerPadding }]}>
      {/* Column 1 */}
      <View style={[styles.column, { marginRight: columnGap / 2 }]}>
        {column1Items.map((item, index) => (
          <View key={`col1-${index}`} style={styles.item}>
            {item}
          </View>
        ))}
      </View>

      {/* Column 2 - with offset */}
      <View
        style={[
          styles.column,
          { marginLeft: columnGap / 2, paddingTop: column2Offset },
        ]}
      >
        {column2Items.map((item, index) => (
          <View key={`col2-${index}`} style={styles.item}>
            {item}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
  },
  column: {
    flex: 1,
  },
  item: {
    marginBottom: 12,
  },
});
