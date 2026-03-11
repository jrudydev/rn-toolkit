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
    '^@rn-toolkit/auth$': '<rootDir>/packages/auth/src',
    '^@rn-toolkit/notifications$': '<rootDir>/packages/notifications/src',
    '^@rn-toolkit/analytics$': '<rootDir>/packages/analytics/src',
    '^@rn-toolkit/i18n$': '<rootDir>/packages/i18n/src',
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
