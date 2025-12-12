import { View, Text, StyleSheet } from "react-native";
import { Button } from "components/Buttons/Buttons";
import colors, { theme } from "themes/tokens/colors";
import typography from "themes/tokens/typography";

interface SwitchCardProps {
  title: string;
  isEnabled: boolean;
  onToggle: () => void;
}

export const SwitchCard: React.FC<SwitchCardProps> = ({
  title,
  isEnabled,
  onToggle,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Button variant="switch" switchProps={{ isEnabled, onToggle }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 60,
    padding: 16,
    backgroundColor: colors.white50,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    fontWeight: typography.body.fontWeight as any,
  },
});
