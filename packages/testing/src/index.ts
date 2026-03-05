/**
 * @rn-toolkit/testing
 *
 * Testing utilities for React Native with automatic theme support.
 *
 * @example
 * ```typescript
 * import { renderWithTheme, createThemeSnapshot } from '@rn-toolkit/testing';
 *
 * describe('MyComponent', () => {
 *   it('renders in dark mode', () => {
 *     const { getByTestId } = renderWithTheme(<MyComponent />, 'dark');
 *     expect(getByTestId('component')).toBeTruthy();
 *   });
 *
 *   createThemeSnapshot(<MyComponent />);
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
