// Spacing tokens for consistent layout throughout the app
export const spacing = {
  // Base spacing scale (4px increments)
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  "4xl": 48,
  "5xl": 64,
  "6xl": 80,
} as const;

// Semantic spacing for specific use cases
export const layoutSpacing = {
  screenPaddingHorizontal: spacing.xl, // 24
  screenPaddingVertical: spacing.lg, // 20
  sectionGap: spacing["3xl"], // 40
  cardPadding: spacing.base, // 16
  buttonPadding: spacing.base, // 16
  inputPadding: spacing.md, // 12
} as const;

// Type definitions
export type SpacingName = keyof typeof spacing;
export type LayoutSpacingName = keyof typeof layoutSpacing;

// Border radius tokens
export const radii = {
  xs: 4,
  sm: 6,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  full: 9999,
} as const;

export type RadiusName = keyof typeof radii;

export default spacing;
