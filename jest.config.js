module.exports = {
  preset: 'react-native',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  roots: ['<rootDir>/components', '<rootDir>/apps/mobile/screens', '<rootDir>/contexts'],
  testMatch: [
    '<rootDir>/components/**/__tests__/**/*.(js|jsx|ts|tsx)',
    '<rootDir>/components/**/*.(test|spec).(js|jsx|ts|tsx)',
    '<rootDir>/apps/mobile/screens/**/__tests__/**/*.(js|jsx|ts|tsx)',
    '<rootDir>/apps/mobile/screens/**/*.(test|spec).(js|jsx|ts|tsx)',
    '<rootDir>/contexts/**/__tests__/**/*.(js|jsx|ts|tsx)',
    '<rootDir>/contexts/**/*.(test|spec).(js|jsx|ts|tsx)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|expo|@expo|@expo-google-fonts|expo-font|expo-asset|expo-constants|expo-linking|expo-router|@react-native-community|@react-native-picker|react-native-svg|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|@react-native-async-storage)/)',
  ],
  moduleNameMapper: {
    '^pursuit/(.*)$': '<rootDir>/$1',
    '\\.(svg|png|jpg|jpeg|gif)$': 'jest-transform-stub',
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'apps/mobile/screens/**/*.{js,jsx,ts,tsx}',
    'contexts/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/__tests__/**',
    '!**/index.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
  ],
};