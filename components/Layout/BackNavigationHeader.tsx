import { View, Text } from "react-native";
import BackIcon from "assets/icons/back.svg";
import colors, { theme } from "themes/tokens/colors";
import { typography, fontWeights } from "themes/tokens/typography";
import { radii } from "themes/tokens/spacing";
import { StyleSheet } from "react-native";
import { Button } from "components/Buttons";

interface BackNavigationHeaderProps {
  title: string;
  onBackPress: () => void;
}

export const BackNavigationHeader = ({
  title,
  onBackPress,
}: BackNavigationHeaderProps) => {
  return (
    <View style={styles.container}>
      <Button
        onPress={onBackPress}
        style={[
          styles.backButton,
          {
            width: 40,
            height: 40,
            borderRadius: radii.xl,
            backgroundColor: colors.roseFog,
            borderWidth: 0,
            elevation: 0,
          },
        ]}
        variant="secondary"
        icon={<BackIcon width={24} height={24} fill={colors.black} />}
      />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  backButton: {},
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: fontWeights.bold,
    color: theme.text.primary,
    fontFamily: typography.h3.fontFamily,
    textAlign: "center",
    marginRight: 40,
  },
});
