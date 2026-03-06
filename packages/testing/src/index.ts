/**
 * @astacinco/rn-testing
 *
 * Testing utilities for React Native with automatic theme support.
 *
 * Features:
 * - **Theme Testing** - renderWithTheme, createThemeSnapshot
 * - **Mock Utilities** - mockNavigation, mockSDUI builders
 *
 * For advanced DSL features (fluent API, matrix testing), see @astacinco/rn-testing
 * in the premium repo: https://patreon.com/SparkLabs343
 *
 * @example
 * ```typescript
 * import { renderWithTheme, createThemeSnapshot } from '@astacinco/rn-testing';
 *
 * describe('MyComponent', () => {
 *   createThemeSnapshot(<MyComponent />);
 *
 *   it('renders in dark mode', () => {
 *     const { getByTestId } = renderWithTheme(<MyComponent />, 'dark');
 *     expect(getByTestId('component')).toBeTruthy();
 *   });
 * });
 * ```
 */

// Core render utilities
export { renderWithTheme } from './renderWithTheme';
export { renderWithProviders } from './renderWithProviders';
export type { RenderWithProvidersOptions } from './renderWithProviders';

// Snapshot utilities
export { createThemeSnapshot, createThemedSnapshots } from './createThemeSnapshot';
export type { ThemedSnapshotOptions } from './createThemeSnapshot';

// Mocks
export {
  // Navigation mocks
  mockNavigation,
  createMockUseDeepLink,
  // SDUI mocks
  mockSDUISchema,
  mockTextNode,
  mockButtonNode,
  mockCardNode,
  mockListNode,
  mockImageNode,
  mockNavigateAction,
  mockApiAction,
  mockProfileScreenSchema,
} from './mocks';

export type {
  MockNavigationState,
  MockNavigationReturn,
  SDUIActionType,
  SDUIAction,
  SDUINode,
  SDUISchema,
} from './mocks';
