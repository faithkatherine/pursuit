// Mock SVG assets
jest.mock('assets/icons/sunny.svg', () => 'SunnyIcon');

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
  useSegments: jest.fn(() => []),
  Stack: {
    Screen: jest.fn(),
  },
}));

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  useForm: jest.fn(() => ({
    control: {},
    handleSubmit: jest.fn((fn) => fn),
    formState: { errors: {} },
    setValue: jest.fn(),
    reset: jest.fn(),
    watch: jest.fn(() => ''),
  })),
  Controller: ({ render }) => render({ 
    field: { 
      onChange: jest.fn(), 
      onBlur: jest.fn(), 
      value: '' 
    } 
  }),
}));

// Mock Apollo Client
jest.mock('@apollo/client', () => ({
  useQuery: jest.fn(() => ({
    data: null,
    loading: false,
    error: null,
    refetch: jest.fn(),
  })),
  useMutation: jest.fn(() => [
    jest.fn().mockResolvedValue({ data: {} }),
    {
      data: null,
      loading: false,
      error: null,
    },
  ]),
  useApolloClient: jest.fn(() => ({
    cache: {
      modify: jest.fn(),
      identify: jest.fn((obj) => `${obj.__typename}:${obj.id}`),
    },
  })),
  ApolloClient: jest.fn(),
  InMemoryCache: jest.fn(),
  ApolloProvider: ({ children }) => children,
  gql: (strings, ...values) => {
    let result = '';
    strings.forEach((string, i) => {
      result += string;
      if (i < values.length) {
        result += values[i];
      }
    });
    return result;
  },
}));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children, style }) => 
    require('react').createElement('div', { style }, children),
}));

// Use the actual react-native preset, just extend it with custom mocks
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Alert: {
      alert: jest.fn(),
    },
    BackHandler: {
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    },
    Linking: {
      openSettings: jest.fn(),
      openURL: jest.fn(),
    },
  };
});

// Mock color and typography imports
jest.mock('themes/tokens/colors', () => ({
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

jest.mock('themes/tokens/typography', () => ({
  typography: {
    h1: { fontFamily: 'Work Sans', fontWeight: 'bold' },
    h2: { fontFamily: 'Work Sans', fontWeight: 'bold' },
    h3: { fontFamily: 'Work Sans', fontWeight: '600', fontSize: 24 },
    h4: { fontFamily: 'Work Sans', fontWeight: '600' },
    body: { fontFamily: 'Work Sans' },
    caption: { fontFamily: 'Work Sans' },
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
  },
  fontWeights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: 'bold',
    heavy: '800',
  },
  default: {
    h1: { fontFamily: 'Work Sans', fontWeight: 'bold' },
    h2: { fontFamily: 'Work Sans', fontWeight: 'bold' },
    h3: { fontFamily: 'Work Sans', fontWeight: '600', fontSize: 24 },
    h4: { fontFamily: 'Work Sans', fontWeight: '600' },
    body: { fontFamily: 'Work Sans' },
    caption: { fontFamily: 'Work Sans' },
  },
}));

jest.mock('themes/tokens/spacing', () => ({
  spacing: {
    xs: 4,
    sm: 8,
    base: 16,
    md: 12,
    lg: 24,
    xl: 32,
  },
  radii: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
}));

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};