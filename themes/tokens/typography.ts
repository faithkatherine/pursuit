// Font family tokens
export const fontFamilies = {
  primary: "Work Sans", // Uses system default (iOS: San Francisco, Android: Roboto)
  secondary: "Poppins", // For headings and emphasis
  monospace: "Courier", // For code/file extensions
} as const;

// Font weight tokens
export const fontWeights = {
  light: "300",
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "bold", // Changed to string "bold" for React Native
  heavy: "800",
} as const;

// Font size tokens
export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
  "5xl": 48,
} as const;

// Line height tokens
export const lineHeights = {
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

// Letter spacing tokens
export const letterSpacing = {
  tighter: -0.05,
  tight: -0.025,
  normal: 0,
  wide: 0.025,
  wider: 0.05,
  widest: 0.1,
} as const;

// Composed typography styles
export const typography = {
  // Headings
  h1: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes["4xl"],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
  },
  h2: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes["3xl"],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
  },
  h3: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes["2xl"],
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
  },
  h4: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
  },
  h5: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
  },
  h6: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
  },

  // Body text
  body: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
  },
  bodySmall: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
  },
  bodyLarge: {
    fontFamily: fontFamilies.secondary,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.relaxed,
  },

  // Labels and UI text
  label: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.snug,
  },
  labelLarge: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.snug,
  },

  // File type labels (like PNG, JPG, etc.)
  fileType: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes["5xl"],
    fontWeight: fontWeights.heavy,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.wide,
  },
  fileTypeSmall: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes["2xl"],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.normal,
  },

  // Captions and small text
  caption: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.snug,
  },
  captionBold: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
  },

  // Buttons
  button: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
  },
  buttonSmall: {
    fontFamily: fontFamilies.primary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
  },

  // Code and monospace
  code: {
    fontFamily: fontFamilies.monospace,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.normal,
  },
} as const;

// Type definitions
export type FontFamily = keyof typeof fontFamilies;
export type FontWeight = keyof typeof fontWeights;
export type FontSize = keyof typeof fontSizes;
export type TypographyVariant = keyof typeof typography;

export default typography;
