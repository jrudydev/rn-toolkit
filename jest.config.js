module.exports = {
  preset: 'react-native',
  roots: ['<rootDir>/packages'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@astacinco/rn-theming$': '<rootDir>/packages/theming/src',
    '^@astacinco/rn-primitives$': '<rootDir>/packages/primitives/src',
    '^@astacinco/rn-testing$': '<rootDir>/packages/testing/src',
    '^@astacinco/rn-i18n$': '<rootDir>/packages/i18n/src',
    '^@astacinco/rn-performance$': '<rootDir>/packages/performance/src',
  },
  collectCoverageFrom: [
    'packages/*/src/**/*.{ts,tsx}',
    '!packages/*/src/**/*.d.ts',
    '!packages/*/src/**/index.ts',
    '!packages/*/src/**/types.ts',
    '!packages/*/src/**/firebase.ts',
    '!packages/*/src/**/*Firebase*.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 75,
      statements: 75,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
