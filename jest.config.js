module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',
  roots: ['<rootDir>/packages'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@rn-toolkit/theming$': '<rootDir>/packages/theming/src',
    '^@rn-toolkit/sdui$': '<rootDir>/packages/sdui/src',
    '^@rn-toolkit/deeplink$': '<rootDir>/packages/deeplink/src',
    '^@rn-toolkit/testing$': '<rootDir>/packages/testing/src',
    '^@rn-toolkit/primitives$': '<rootDir>/packages/primitives/src',
  },
  collectCoverageFrom: [
    'packages/*/src/**/*.{ts,tsx}',
    '!packages/*/src/**/*.d.ts',
    '!packages/*/src/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
