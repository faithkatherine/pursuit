import { View, StyleSheet } from "react-native";

interface LayoutProps {
  backgroundColor?: string;
  children: React.ReactNode;
}
export const Layout: React.FC<LayoutProps> = ({
  children,
  backgroundColor,
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>{children}</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    paddingBottom: 10,
  },
});
