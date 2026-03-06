/**
 * @rn-toolkit/testing
 *
 * Testing utilities for React Native with automatic theme support.
 *
 * Features:
 * - **Theme Testing** - renderWithTheme, createThemeSnapshot
 * - **Mock Utilities** - mockNavigation, mockSDUI builders
 * - **DSL (PAID)** - Fluent API for expressive test writing
 *
 * @example
 * ```typescript
 * // Basic usage
 * import { renderWithTheme, createThemeSnapshot } from '@rn-toolkit/testing';
 *
 * describe('MyComponent', () => {
 *   createThemeSnapshot(<MyComponent />);
 *
 *   it('renders in dark mode', () => {
 *     const { getByTestId } = renderWithTheme(<MyComponent />, 'dark');
 *     expect(getByTestId('component')).toBeTruthy();
 *   });
 * });
 *
 * // DSL usage (PAID)
 * import { dsl } from '@rn-toolkit/testing';
 *
 * dsl.component(<Button label="Click" onPress={fn} />)
 *    .inTheme('dark')
 *    .render()
 *    .assert()
 *    .visible('button')
 *    .text('Click')
 *    .done();
 *
 * dsl.matrix(<Button />)
 *    .withVariants('variant', ['primary', 'secondary'])
 *    .withVariants('size', ['sm', 'md', 'lg'])
 *    .snapshotAll();  // Generates 6 tests automatically!
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

// ============================================
// DSL (Fluent Testing API) - PAID TIER
// ============================================

export { dsl } from './dsl';

// DSL Builders
export {
  ComponentBuilder,
  MatrixBuilder,
  HookBuilder,
  SDUIBuilder,
} from './dsl';

// DSL Types
export type {
  ThemeModeOption,
  ProviderConfig,
  ExtendedRenderResult,
  AssertionChainMethods,
  ExtendedHookResult,
  SDUIRenderResult,
  VariantCombination,
} from './dsl';

// DSL Assertions
export {
  createAssertionChain,
  AssertionBuilder,
  expectThemeDifference,
  expectColorDifference,
  expectAccessibility,
  type AccessibilityRule,
} from './dsl';

// DSL Presets
export {
  createProviderConfig,
  createWrapperFromConfigs,
  combineProviders,
} from './dsl';
