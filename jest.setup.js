import '@testing-library/react-native/extend-expect';

// Mock React Native modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

// Mock react-native-svg
jest.mock('react-native-svg', () => 'SvgMock');

// Mock SVG assets with different path patterns
jest.mock('pursuit/assets/sunny.svg', () => 'SunnyIcon');
jest.mock('assets/sunny.svg', () => 'SunnyIcon');
jest.mock('../assets/sunny.svg', () => 'SunnyIcon');

// Mock useWindowDimensions
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    useWindowDimensions: () => ({
      width: 375,
      height: 667,
    }),
  };
});

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};