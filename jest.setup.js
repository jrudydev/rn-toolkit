// Jest setup file
// Add any global test setup here

// Suppress React act() warnings for async provider initialization
// These warnings occur when providers initialize asynchronously in useEffect
const originalError = console.error;
console.error = (...args) => {
  if (args[0]?.includes?.('not wrapped in act')) {
    return;
  }
  originalError.call(console, ...args);
};

// Mock react-native modules if needed
jest.mock('react-native/Libraries/Utilities/Appearance', () => ({
  getColorScheme: jest.fn(() => 'light'),
  addChangeListener: jest.fn(),
  removeChangeListener: jest.fn(),
}));
