export const colors = {
  prim: "rgb(248, 243, 248)",
  thunder: "rgb(63, 50, 61)",
  leather: "rgb(150, 116, 89)",
  aluminium: "rgb(166, 168, 177)",
  careysPink: "rgb(215, 166, 165)",
  shilo: "rgb(232, 181, 176)",
  silverSand: "rgb(199, 201, 204)",
  roseFog: "rgb(234, 192, 197)",
  deluge: "rgb(124, 92, 156)",
  delugeLight: "rgb(134, 102, 166)",
  black: "rgb(0, 0, 0)",
  white: "rgb(255, 255, 255)",
  white02: "rgba(255, 255, 255, 0.2)",
  white05: "rgba(255, 255, 255, 0.05)",
  white50: "rgba(255, 255, 255, 0.5)",
  white65: "rgba(255, 255, 255, 0.65)",
  white80: "rgba(255, 255, 255, 0.8)",
  ghostWhite: "rgb(250,247,252)",
  lightBlue: "rgb(107, 78, 255)",
  graniteGray: "rgb(102, 102, 102)",
  gray: "rgb(128, 128, 128)",
} as const;

// Semantic color names for easier usage
export const theme = {
  primary: colors.prim,
  secondary: colors.deluge,
  accent: colors.careysPink,
  background: colors.prim,
  surface: colors.silverSand,
  text: {
    primary: colors.thunder,
    secondary: colors.leather,
    muted: colors.aluminium,
    black: colors.black,
    white: colors.white,
  },
  border: colors.silverSand,
  highlight: colors.roseFog,
  warning: colors.shilo,
} as const;

// Type definitions for TypeScript support
export type ColorName = keyof typeof colors;
export type ThemeColorName = keyof typeof theme;

export default colors;
