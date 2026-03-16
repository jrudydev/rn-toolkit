// Jest setup file
// Add any global test setup here

// Skip host component name detection for React 19 compatibility
// See: https://github.com/callstack/react-native-testing-library/issues/1303
process.env.RNTL_SKIP_AUTO_DETECT_HOST_COMPONENT_NAMES = '1';

// Suppress React act() warnings for async provider initialization
// These warnings occur when providers initialize asynchronously in useEffect
const originalError = console.error;
console.error = (...args) => {
  if (args[0]?.includes?.('not wrapped in act')) {
    return;
  }
  originalError.call(console, ...args);
};

// Mock react-native Appearance module
jest.mock('react-native/Libraries/Utilities/Appearance', () => ({
  getColorScheme: jest.fn(() => 'light'),
  addChangeListener: jest.fn(() => ({ remove: jest.fn() })),
  removeChangeListener: jest.fn(),
}));
