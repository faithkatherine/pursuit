// Mock SVG assets
jest.mock('pursuit/assets/sunny.svg', () => 'SunnyIcon');

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children, style }) => 
    require('react').createElement('div', { style }, children),
}));

// Mock React Native components
jest.mock('react-native', () => ({
  View: ({ children, style, testID }) => 
    require('react').createElement('div', { style, 'data-testid': testID }, children),
  Text: ({ children, style, testID }) => 
    require('react').createElement('span', { style, 'data-testid': testID }, children),
  TouchableOpacity: ({ children, style, testID, onPress }) => 
    require('react').createElement('button', { style, 'data-testid': testID, onClick: onPress }, children),
  StyleSheet: {
    create: (styles) => styles,
  },
  useWindowDimensions: () => ({
    width: 375,
    height: 667,
  }),
}));

// Mock color and typography imports
jest.mock('pursuit/themes/tokens/colors', () => ({
  colors: {
    white: '#ffffff',
    deluge: '#6366f1',
    roseFog: '#ec4899',
    prim: '#f8f3f8',
  },
}));

jest.mock('pursuit/themes/tokens/typography', () => ({
  typography: {
    h1: { fontFamily: 'Work Sans', fontWeight: 'bold' },
    body: { fontFamily: 'Work Sans' },
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
  },
}));

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};