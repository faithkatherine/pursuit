export const colors = {
  // Primary colors
  prim: '#f8f3f8',
  thunder: '#3f323d',
  leather: '#967459',
  aluminium: '#a6a8b1',
  careysPink: '#d7a6a5',
  shilo: '#e8b5b0',
  silverSand: '#c7c9cc',
  roseFog: '#eac0c5',
  deluge: '#7c5c9c', // Using the second deluge color as it's more specific
  delugeLight: '#8666a6', // Alternative deluge shade
} as const;

// RGB variants for when you need rgba values
export const colorsRGB = {
  prim: 'rgba(248, 243, 248, 1)',
  thunder: 'rgba(63, 50, 61, 1)',
  leather: 'rgba(150, 116, 89, 1)',
  aluminium: 'rgba(166, 168, 177, 1)',
  careysPink: 'rgba(215, 166, 165, 1)',
  shilo: 'rgba(232, 181, 176, 1)',
  silverSand: 'rgba(199, 201, 204, 1)',
  roseFog: 'rgba(234, 192, 197, 1)',
  deluge: 'rgba(124, 92, 156, 1)',
  delugeLight: 'rgba(134, 102, 166, 1)',
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
  },
  border: colors.silverSand,
  highlight: colors.roseFog,
  warning: colors.shilo,
} as const;

// Type definitions for TypeScript support
export type ColorName = keyof typeof colors;
export type ThemeColorName = keyof typeof theme;

export default colors;