module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  roots: ['<rootDir>/components'],
  testMatch: [
    '<rootDir>/components/**/__tests__/**/*.(js|jsx|ts|tsx)',
    '<rootDir>/components/**/*.(test|spec).(js|jsx|ts|tsx)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^pursuit/(.*)$': '<rootDir>/$1',
    '\\.(svg|png|jpg|jpeg|gif)$': 'jest-transform-stub',
  },
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    '!components/**/*.d.ts',
    '!components/**/__tests__/**',
    '!components/**/index.{js,jsx,ts,tsx}',
  ],
};