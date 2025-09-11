import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "components/Buttons";
import { typography, fontWeights } from "themes/tokens/typography";
import { theme } from "themes/tokens/colors";

interface SectionHeaderProps {
  title: string;
  buttonText?: string;
  onButtonPress?: () => void;
  variant?: "primary" | "secondary";
  isLoading?: boolean;
  loadingText?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  buttonText,
  onButtonPress,
  variant = "secondary",
  isLoading = false,
  loadingText = "Updating...",
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rightSection}>
        {isLoading && (
          <View style={styles.loadingIndicator}>
            <Text style={styles.loadingText}>{loadingText}</Text>
          </View>
        )}
        {buttonText && onButtonPress && (
          <Button
            text={buttonText}
            variant={variant}
            onPress={onButtonPress}
            style={styles.button}
            circleDimensions={
              buttonText === "+"
                ? { width: 32, height: 32, borderRadius: 16 }
                : undefined
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: fontWeights.semibold,
    color: theme.text.primary,
    fontFamily: "Work Sans",
    flex: 1,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  loadingIndicator: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  loadingText: {
    fontSize: 12,
    color: theme.text.secondary,
    fontFamily: "Work Sans",
    fontStyle: "italic",
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
});
