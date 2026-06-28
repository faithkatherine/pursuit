import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "@shared/constants/tokens/colors";
import { fontSizes, fontWeights } from "@shared/constants/tokens/typography";
import { spacing } from "@shared/constants/tokens/spacing";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage >= totalPages;

  if (totalPages <= 1) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isFirstPage && styles.buttonDisabled]}
        onPress={onPrevious}
        disabled={isFirstPage}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text
          style={[
            styles.chevron,
            isFirstPage && styles.chevronDisabled,
          ]}
        >
          ‹
        </Text>
      </TouchableOpacity>

      <View style={styles.pageIndicator}>
        <Text style={styles.pageText}>
          Page {currentPage} of {totalPages}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, isLastPage && styles.buttonDisabled]}
        onPress={onNext}
        disabled={isLastPage}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text
          style={[
            styles.chevron,
            isLastPage && styles.chevronDisabled,
          ]}
        >
          ›
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  button: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  chevron: {
    fontSize: 32,
    fontWeight: fontWeights.regular,
    lineHeight: 40,
    color: colors.white,
  },
  chevronDisabled: {
    color: colors.white,
  },
  pageIndicator: {
    paddingHorizontal: spacing.md,
  },
  pageText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: 20,
    color: colors.white,
    textAlign: "center",
  },
});
