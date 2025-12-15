import { View, StyleSheet } from "react-native";

interface LayoutProps {
  backgroundColor?: string;
  backgroundComponent?: React.ReactNode;
  children: React.ReactNode;
}
export const Layout: React.FC<LayoutProps> = ({
  children,
  backgroundColor,
  backgroundComponent,
}) => {
  if (backgroundComponent) {
    return (
      <View style={styles.container}>
        <View style={StyleSheet.absoluteFillObject}>
          {backgroundComponent}
        </View>
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>{children}</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 10,
  },
});
