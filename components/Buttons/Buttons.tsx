import colors from "pursuit/themes/tokens/colors";
import { fontSizes, typography } from "pursuit/themes/tokens/typography";
import { Pressable, StyleSheet, Text } from "react-native";

interface ButtonProps {
  text: string;
  variant?: "primary" | "secondary" | "tertiary";
  onPress?: () => void;
  disabled?: boolean;
  style?: object;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  text,
  variant = "primary",
  onPress,
  disabled,
  style,
  testID,
}) => {
  switch (variant) {
    case "primary":
      return (
        <Pressable
          onPress={onPress}
          disabled={disabled}
          style={[styles.primary, style]}
          testID={testID}
        >
          <Text style={styles.primaryButtonText}>{text}</Text>
        </Pressable>
      );
    case "secondary":
      return (
        <Pressable
          onPress={onPress}
          disabled={disabled}
          style={[
            { padding: 10, borderRadius: 5, backgroundColor: "gray" },
            style,
          ]}
          testID={testID}
        >
          {text}
        </Pressable>
      );
    case "tertiary":
      return (
        <Pressable
          onPress={onPress}
          disabled={disabled}
          style={[
            { padding: 10, borderRadius: 5, backgroundColor: "transparent" },
            style,
          ]}
          testID={testID}
        >
          {text}
        </Pressable>
      );
  }
};

const styles = StyleSheet.create({
  primary: {
    backgroundColor: colors.white02,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "center",
  },
  primaryButtonText: {
    fontFamily: typography.body.fontFamily,
    fontSize: fontSizes.sm,
    color: colors.white,
    fontWeight: "600",
  },
});
