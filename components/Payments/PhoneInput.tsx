import React, { useState, useCallback } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

import colors from "themes/tokens/colors";
import typography, { fontSizes, fontWeights } from "themes/tokens/typography";
import { radii, spacing } from "themes/tokens/spacing";

interface PhoneInputProps {
  value: string;
  onChangeText: (value: string) => void;
  onNormalisedChange: (normalised: string) => void;
  error?: string | null;
  onSubmitEditing?: () => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChangeText,
  onNormalisedChange,
  error,
  onSubmitEditing,
}) => {
  const [touched, setTouched] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  const normaliseAndValidate = (digits: string) => {
    if (digits.length === 0) return { normalised: null, error: null };
    const stripped = digits.startsWith("0") ? digits.slice(1) : digits;
    if (stripped.length < 9) {
      return { normalised: null, error: "Enter at least 9 digits" };
    }
    return { normalised: "254" + stripped.slice(0, 9), error: null };
  };

  const handleChangeText = useCallback(
    (text: string) => {
      const digitsOnly = text.replace(/\D/g, "").slice(0, 10);
      onChangeText(digitsOnly);
      const { normalised, error: valError } = normaliseAndValidate(digitsOnly);
      setInternalError(valError);
      onNormalisedChange(normalised ?? "");
    },
    [onChangeText, onNormalisedChange],
  );

  const handleBlur = useCallback(() => {
    setTouched(true);
  }, []);

  const displayError = touched ? error ?? internalError : error;

  return (
    <View>
      <View style={[styles.container, displayError ? styles.containerError : null]}>
        <View style={styles.prefix}>
          <Text style={styles.prefixText}>+254</Text>
        </View>

        <View style={styles.divider} />

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChangeText}
          onBlur={handleBlur}
          onSubmitEditing={onSubmitEditing}
          placeholder="790 517 633"
          placeholderTextColor={colors.onSurfaceVariant}
          keyboardType="number-pad"
          returnKeyType="done"
          maxLength={10}
          autoComplete="tel"
          textContentType="telephoneNumber"
        />
      </View>

      {displayError ? <Text style={styles.error}>{displayError}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radii.md,
    backgroundColor: colors.white,
    overflow: "hidden",
  },
  containerError: {
    borderColor: colors.tertiary,
  },
  prefix: {
    width: 72,
    paddingHorizontal: spacing.base,
    paddingVertical: 14,
    backgroundColor: colors.surfaceContainerLow,
    justifyContent: "center",
    alignItems: "center",
  },
  prefixText: {
    ...typography.body,
    fontSize: fontSizes.base,
    lineHeight: 24,
    fontWeight: fontWeights.medium,
    color: colors.onSurfaceVariant,
  },
  divider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: colors.outlineVariant,
  },
  input: {
    flex: 1,
    ...typography.body,
    paddingHorizontal: spacing.base,
    paddingVertical: 14,
    fontSize: fontSizes.base,
    lineHeight: 24,
    color: colors.onSurface,
    letterSpacing: 0.5,
  },
  error: {
    ...typography.caption,
    marginTop: 6,
    fontSize: fontSizes.xs,
    color: colors.tertiary,
    marginLeft: 4,
  },
});
