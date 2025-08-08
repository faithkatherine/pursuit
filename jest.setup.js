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
  Pressable: ({ children, style, testID, onPress, disabled }) => 
    require('react').createElement('button', { 
      style, 
      'data-testid': testID, 
      onClick: disabled ? undefined : onPress,
      disabled 
    }, children),
  FlatList: ({ data, renderItem, horizontal, contentContainerStyle, showsHorizontalScrollIndicator }) => {
    if (!data) return null;
    return require('react').createElement('div', {
      style: { display: 'flex', flexDirection: horizontal ? 'row' : 'column', ...contentContainerStyle },
      'data-horizontal': horizontal,
      'data-shows-scroll-indicator': showsHorizontalScrollIndicator
    }, data.map((item, index) => 
      require('react').createElement('div', { key: index }, 
        renderItem ? renderItem({ item, index }) : item
      )
    ));
  },
  ScrollView: ({ children, style, contentContainerStyle, testID, onScroll, horizontal, showsVerticalScrollIndicator, showsHorizontalScrollIndicator, ...props }) => 
    require('react').createElement('div', { 
      style: { ...style, ...contentContainerStyle },
      'data-testid': testID,
      'data-horizontal': horizontal,
      'data-shows-vertical-scroll': showsVerticalScrollIndicator,
      'data-shows-horizontal-scroll': showsHorizontalScrollIndicator,
      onScroll,
      ...props
    }, children),
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
  },
  theme: {
    primary: "rgb(248, 243, 248)",
    secondary: "rgb(124, 92, 156)",
    accent: "rgb(215, 166, 165)",
    background: "rgb(248, 243, 248)",
    surface: "rgb(199, 201, 204)",
    text: {
      primary: "rgb(63, 50, 61)",
      secondary: "rgb(150, 116, 89)",
      muted: "rgb(166, 168, 177)",
    },
    border: "rgb(199, 201, 204)",
    highlight: "rgb(234, 192, 197)",
    warning: "rgb(232, 181, 176)",
  },
  default: {
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