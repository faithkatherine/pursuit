import { colors } from "./colors";

export type GradientColors = [string, string];

// Seamless flowing gradients - each card's end color becomes the next card's start color
export const gradients: GradientColors[] = [
  [colors.deluge, colors.delugeLight], // Purple to light purple
  [colors.delugeLight, colors.roseFog], // Light purple to rose
  [colors.roseFog, colors.careysPink], // Rose to pink
  [colors.careysPink, colors.shilo], // Pink to peach
  [colors.shilo, colors.leather], // Peach to brown
  [colors.leather, colors.aluminium], // Brown to gray
  [colors.aluminium, colors.silverSand], // Gray to light gray
  [colors.silverSand, colors.deluge], // Light gray back to purple (loops)
];

export const getGradientByIndex = (index: number): GradientColors => {
  return gradients[index % gradients.length];
};

// Utility function to get a specific gradient by name
export const namedGradients = {
  purple: [colors.deluge, colors.delugeLight] as GradientColors,
  lightPurple: [colors.delugeLight, colors.roseFog] as GradientColors,
  pink: [colors.careysPink, colors.roseFog] as GradientColors,
  lightPink: [colors.roseFog, colors.careysPink] as GradientColors,
  gray: [colors.silverSand, colors.aluminium] as GradientColors,
  lightGray: [colors.aluminium, colors.silverSand] as GradientColors,
  brown: [colors.leather, colors.shilo] as GradientColors,
  dark: [colors.thunder, colors.leather] as GradientColors,
} as const;

export type GradientName = keyof typeof namedGradients;

export default gradients;
