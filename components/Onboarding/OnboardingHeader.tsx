import { StyleSheet, View } from "react-native";
import { Button } from "components/Buttons";
import BackIcon from "assets/icons/back.svg";
import colors from "themes/tokens/colors";

interface OnboardingHeaderProps {
  showBackButton?: boolean;
  onBackPress?: () => void;
  onSkipPress?: () => void;
}

export const OnboardingHeader = ({
  showBackButton,
  onBackPress,
  onSkipPress,
}: OnboardingHeaderProps) => {
  return (
    <View style={styles.container}>
      {showBackButton && (
        <Button
          variant="secondary"
          circleDimensions={{
            width: 40,
            height: 40,
            borderRadius: 20,
            borderWidth: 0,
            backgroundColor: colors.white02,
          }}
          icon={<BackIcon fill={colors.white} width={24} height={24} />}
          onPress={onBackPress}
        />
      )}
      {showBackButton && (
        <Button
          variant="tertiary"
          text="Skip"
          textStyle={styles.skipButtonText}
          onPress={onSkipPress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  skipButtonText: {
    color: colors.white,
  },
});
