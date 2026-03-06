/**
 * Testing DSL
 *
 * Fluent API for expressive, chainable test writing.
 *
 * @example
 * ```typescript
 * import { dsl } from '@rn-toolkit/testing';
 *
 * // Component testing
 * dsl.component(<Button label="Click" onPress={fn} />)
 *    .inTheme('dark')
 *    .render()
 *    .assert()
 *    .visible('button')
 *    .text('Click')
 *    .done();
 *
 * // Matrix testing (generates multiple tests)
 * dsl.matrix(<Button label="Test" onPress={fn} />)
 *    .withVariants('variant', ['primary', 'secondary', 'outline'])
 *    .withVariants('size', ['sm', 'md', 'lg'])
 *    .inThemes(['light', 'dark'])
 *    .snapshotAll();
 *
 * // Hook testing
 * dsl.hook(() => useAuth())
 *    .withProvider(AuthProvider, { adapter: mockAdapter })
 *    .renderAndWait()
 *    .then(result => result.expectFunction('signIn', 'signOut'));
 *
 * // SDUI testing
 * dsl.sdui(schema)
 *    .withRenderer(SDUIRenderer)
 *    .withActionHandler(mockHandler)
 *    .render()
 *    .expectNodeCount('button', 2);
 * ```
 */

import type { ReactElement } from 'react';
import { ComponentBuilder, createComponentBuilder } from './ComponentBuilder';
import { MatrixBuilder, createMatrixBuilder } from './MatrixBuilder';
import { HookBuilder, createHookBuilder } from './HookBuilder';
import { SDUIBuilder, createSDUIBuilder, createEmptySDUIBuilder } from './SDUIBuilder';
import type { SDUISchema } from '../mocks';

// Re-export builders
export { ComponentBuilder } from './ComponentBuilder';
export { MatrixBuilder } from './MatrixBuilder';
export { HookBuilder } from './HookBuilder';
export { SDUIBuilder } from './SDUIBuilder';

// Re-export types
export type {
  ThemeModeOption,
  ProviderConfig,
  BaseBuilderConfig,
  ComponentBuilderConfig,
  HookBuilderConfig,
  MatrixBuilderConfig,
  ExtendedRenderResult,
  AssertionChainMethods,
  ExtendedHookResult,
  SDUIRenderResult,
  VariantCombination,
} from './types';

// Re-export assertions
export {
  createAssertionChain,
  AssertionBuilder,
  expectThemeDifference,
  expectColorDifference,
  expectAccessibility,
  type AccessibilityRule,
} from './assertions';

// Re-export presets
export {
  createProviderConfig,
  createWrapperFromConfigs,
  combineProviders,
} from './presets';

/**
 * Main DSL entry point.
 *
 * Provides factory methods for creating test builders.
 */
export const dsl = {
  /**
   * Create a component test builder.
   *
   * @example
   * ```typescript
   * dsl.component(<Button label="Click" onPress={fn} />)
   *    .inTheme('dark')
   *    .render()
   *    .assert()
   *    .visible('button')
   *    .done();
   * ```
   */
  component<P>(element: ReactElement<P>): ComponentBuilder<P> {
    return createComponentBuilder(element);
  },

  /**
   * Create a variant matrix test builder.
   *
   * @example
   * ```typescript
   * dsl.matrix(<Button label="Test" onPress={fn} />)
   *    .withVariants('variant', ['primary', 'secondary'])
   *    .withVariants('size', ['sm', 'md', 'lg'])
   *    .snapshotAll();
   * ```
   */
  matrix<P>(element: ReactElement<P>): MatrixBuilder<P> {
    return createMatrixBuilder(element);
  },

  /**
   * Create a hook test builder.
   *
   * @example
   * ```typescript
   * dsl.hook(() => useAuth())
   *    .withProvider(AuthProvider, { adapter: mockAdapter })
   *    .render()
   *    .expectFunction('signIn');
   * ```
   */
  hook<T>(hookFn: () => T): HookBuilder<T> {
    return createHookBuilder(hookFn);
  },

  /**
   * Create an SDUI test builder.
   *
   * @example
   * ```typescript
   * dsl.sdui(schema)
   *    .withRenderer(SDUIRenderer)
   *    .render()
   *    .expectNodeCount('button', 2);
   * ```
   */
  sdui(schema: SDUISchema): SDUIBuilder {
    return createSDUIBuilder(schema);
  },

  /**
   * Create an SDUI builder with an empty schema.
   *
   * @example
   * ```typescript
   * dsl.emptySDUI()
   *    .addNode(SDUIBuilder.text('Hello'))
   *    .addNode(SDUIBuilder.button('Click', SDUIBuilder.navigate('/home')))
   *    .withRenderer(SDUIRenderer)
   *    .render();
   * ```
   */
  emptySDUI(): SDUIBuilder {
    return createEmptySDUIBuilder();
  },
};
