/**
 * DSL Types
 *
 * Core type definitions for the testing DSL.
 */

import type { ReactElement, ComponentType, ReactNode } from 'react';
import type { RenderResult, RenderHookResult } from '@testing-library/react-native';
import type { ThemeMode } from '@rn-toolkit/theming';

/**
 * Theme mode options for DSL methods
 */
export type ThemeModeOption = ThemeMode | 'both';

/**
 * Provider configuration for wrapping components
 */
export interface ProviderConfig<P = Record<string, unknown>> {
  /** Provider component */
  component: ComponentType<P & { children: ReactNode }>;
  /** Props to pass to the provider */
  props?: Omit<P, 'children'>;
}

/**
 * Base configuration shared across builders
 */
export interface BaseBuilderConfig {
  /** Theme mode for rendering */
  theme?: ThemeMode;
  /** Additional providers to wrap the component */
  providers?: ProviderConfig[];
}

/**
 * Configuration for component builder
 */
export interface ComponentBuilderConfig extends BaseBuilderConfig {
  /** Test ID for the root element */
  testID?: string;
}

/**
 * Configuration for hook builder
 */
export interface HookBuilderConfig extends BaseBuilderConfig {
  /** Timeout for async operations */
  timeout?: number;
}

/**
 * Configuration for matrix builder
 */
export interface MatrixBuilderConfig<P> {
  /** Variants to test for each prop */
  variants: Partial<{ [K in keyof P]: P[K][] }>;
  /** Themes to test */
  themes: ThemeMode[];
  /** Filter function to exclude combinations */
  filter?: (combo: Partial<P>) => boolean;
}

/**
 * Extended render result with assertion helpers
 */
export interface ExtendedRenderResult extends RenderResult {
  /** Fluent assertion starting point */
  assert: () => AssertionChainMethods;
}

/**
 * Assertion chain methods for fluent assertions
 */
export interface AssertionChainMethods {
  /** Assert element is visible by testID */
  visible(testID: string): AssertionChainMethods;
  /** Assert element is not visible by testID */
  notVisible(testID: string): AssertionChainMethods;
  /** Assert text is present */
  text(content: string | RegExp): AssertionChainMethods;
  /** Assert text is not present */
  noText(content: string | RegExp): AssertionChainMethods;
  /** Assert element count by testID */
  count(testID: string, expected: number): AssertionChainMethods;
  /** Assert element is enabled */
  enabled(testID: string): AssertionChainMethods;
  /** Assert element is disabled */
  disabled(testID: string): AssertionChainMethods;
  /** Assert element has accessible props */
  accessible(testID: string): AssertionChainMethods;
  /** Chain continuation */
  and: AssertionChainMethods;
  /** Finalize assertions (no-op, for readability) */
  done(): void;
  /** Take snapshot after assertions */
  toMatchSnapshot(): void;
}

/**
 * Extended hook render result with helpers
 */
export interface ExtendedHookResult<T> extends RenderHookResult<T, unknown> {
  /** Get current hook value */
  getValue(): T;
  /** Assert value at key matches expected */
  expectValue<K extends keyof T>(key: K, expected: T[K]): ExtendedHookResult<T>;
  /** Assert keys are defined */
  expectDefined<K extends keyof T>(...keys: K[]): ExtendedHookResult<T>;
  /** Assert keys are functions */
  expectFunction<K extends keyof T>(...keys: K[]): ExtendedHookResult<T>;
  /** Wait for value to match */
  waitForValue<K extends keyof T>(key: K, expected: T[K], timeout?: number): Promise<void>;
  /** Perform action wrapped in act and wait */
  actAndWait(action: () => void | Promise<void>, timeout?: number): Promise<void>;
}

/**
 * SDUI render result with schema-specific helpers
 */
export interface SDUIRenderResult extends ExtendedRenderResult {
  /** Find elements by SDUI node type */
  findByNodeType(type: string): ReturnType<RenderResult['queryAllByTestId']>;
  /** Assert count of nodes by type */
  expectNodeCount(type: string, count: number): SDUIRenderResult;
  /** Trigger action on node */
  triggerAction(nodeTestID: string, actionName: string): Promise<void>;
}

/**
 * Variant combination for matrix testing
 */
export interface VariantCombination<P> {
  /** Combined props for this variant */
  props: Partial<P>;
  /** Theme for this variant */
  theme: ThemeMode;
  /** Human-readable name */
  name: string;
}
