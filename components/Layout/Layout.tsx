import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();

  if (backgroundComponent) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={StyleSheet.absoluteFillObject}>{backgroundComponent}</View>
        {children}
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor, paddingTop: insets.top }]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 10,
  },
});
