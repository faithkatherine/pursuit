module.exports = {
  preset: '@testing-library/react-native',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: [
    '**/__tests__/**/*.(js|jsx|ts|tsx)',
    '**/*.(test|spec).(js|jsx|ts|tsx)'
  ],
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    '!components/**/*.d.ts',
    '!components/**/__tests__/**',
    '!components/**/index.{js,jsx,ts,tsx}',
  ],
  moduleNameMapping: {
    '^pursuit/(.*)$': '<rootDir>/$1',
  },
};