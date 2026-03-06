/**
 * Hook Builder
 *
 * Fluent builder for testing React hooks with provider support.
 */

import React, { type ReactNode, type ComponentType } from 'react';
import { renderHook, act, waitFor, type RenderHookResult } from '@testing-library/react-native';
import { ThemeProvider, ThemeMode } from '@rn-toolkit/theming';
import type { ProviderConfig, ExtendedHookResult } from './types';

/**
 * Wrapper component generator.
 */
function createWrapper(
  providers: ProviderConfig[],
  theme: ThemeMode
): React.FC<{ children: ReactNode }> {
  return function Wrapper({ children }: { children: ReactNode }) {
    // Start with theme provider
    let wrapped: ReactNode = (
      <ThemeProvider mode={theme}>{children}</ThemeProvider>
    );

    // Wrap with additional providers (innermost first, so reverse)
    const reversedProviders = [...providers].reverse();
    for (const { component: Provider, props } of reversedProviders) {
      wrapped = React.createElement(
        Provider,
        { ...props, children: wrapped } as React.Attributes & { children: ReactNode }
      );
    }

    return <>{wrapped}</>;
  };
}

/**
 * Extend hook result with helper methods.
 */
function extendHookResult<T>(result: RenderHookResult<T, unknown>): ExtendedHookResult<T> {
  return {
    ...result,

    getValue(): T {
      return result.result.current;
    },

    expectValue<K extends keyof T>(key: K, expected: T[K]): ExtendedHookResult<T> {
      expect(result.result.current[key]).toEqual(expected);
      return this;
    },

    expectDefined<K extends keyof T>(...keys: K[]): ExtendedHookResult<T> {
      for (const key of keys) {
        expect(result.result.current[key]).toBeDefined();
      }
      return this;
    },

    expectFunction<K extends keyof T>(...keys: K[]): ExtendedHookResult<T> {
      for (const key of keys) {
        expect(typeof result.result.current[key]).toBe('function');
      }
      return this;
    },

    async waitForValue<K extends keyof T>(
      key: K,
      expected: T[K],
      timeout = 5000
    ): Promise<void> {
      await waitFor(
        () => {
          expect(result.result.current[key]).toEqual(expected);
        },
        { timeout }
      );
    },

    async actAndWait(
      action: () => void | Promise<void>,
      timeout = 5000
    ): Promise<void> {
      await act(async () => {
        await action();
      });
      // Wait for any state updates to settle
      await waitFor(() => {}, { timeout });
    },
  };
}

/**
 * Fluent builder for hook testing.
 *
 * @example
 * ```typescript
 * dsl.hook(() => useAuth())
 *    .withTheme('light')
 *    .withProvider(AuthProvider, { adapter: mockAdapter })
 *    .renderAndWait()
 *    .then(result => {
 *      result.expectFunction('signIn', 'signOut')
 *            .expectDefined('user', 'isLoading');
 *    });
 * ```
 */
export class HookBuilder<T> {
  private hookFn: () => T;
  private theme: ThemeMode = 'light';
  private providers: ProviderConfig[] = [];
  private timeout: number = 5000;

  constructor(hookFn: () => T) {
    this.hookFn = hookFn;
  }

  /**
   * Set the theme mode.
   */
  withTheme(mode: ThemeMode): this {
    this.theme = mode;
    return this;
  }

  /**
   * Alias for withTheme('light')
   */
  inLightMode(): this {
    return this.withTheme('light');
  }

  /**
   * Alias for withTheme('dark')
   */
  inDarkMode(): this {
    return this.withTheme('dark');
  }

  /**
   * Add a provider wrapper.
   */
  withProvider<P>(
    Provider: ComponentType<P & { children: ReactNode }>,
    props?: Omit<P, 'children'>
  ): this {
    this.providers.push({
      component: Provider as ComponentType<{ children: ReactNode }>,
      props: props as Record<string, unknown>,
    });
    return this;
  }

  /**
   * Add multiple providers.
   */
  withProviders(providers: ProviderConfig[]): this {
    this.providers.push(...providers);
    return this;
  }

  /**
   * Set timeout for async operations.
   */
  withTimeout(ms: number): this {
    this.timeout = ms;
    return this;
  }

  /**
   * Render the hook synchronously.
   */
  render(): ExtendedHookResult<T> {
    const wrapper = createWrapper(this.providers, this.theme);
    const result = renderHook(() => this.hookFn(), { wrapper });
    return extendHookResult(result);
  }

  /**
   * Render and wait for initial loading to complete.
   * Useful for hooks that have async initialization.
   */
  async renderAndWait(timeout?: number): Promise<ExtendedHookResult<T>> {
    const wrapper = createWrapper(this.providers, this.theme);
    const result = renderHook(() => this.hookFn(), { wrapper });

    // Wait for any initial state updates
    await waitFor(() => {}, { timeout: timeout || this.timeout });

    return extendHookResult(result);
  }

  /**
   * Render and wait for a specific condition.
   */
  async renderUntil<K extends keyof T>(
    key: K,
    expected: T[K],
    timeout?: number
  ): Promise<ExtendedHookResult<T>> {
    const wrapper = createWrapper(this.providers, this.theme);
    const result = renderHook(() => this.hookFn(), { wrapper });

    await waitFor(
      () => {
        expect(result.result.current[key]).toEqual(expected);
      },
      { timeout: timeout || this.timeout }
    );

    return extendHookResult(result);
  }

  /**
   * Render in both themes and return both results.
   */
  renderBothThemes(): {
    light: ExtendedHookResult<T>;
    dark: ExtendedHookResult<T>;
  } {
    const lightWrapper = createWrapper(this.providers, 'light');
    const darkWrapper = createWrapper(this.providers, 'dark');

    const lightResult = renderHook(() => this.hookFn(), { wrapper: lightWrapper });
    const darkResult = renderHook(() => this.hookFn(), { wrapper: darkWrapper });

    return {
      light: extendHookResult(lightResult),
      dark: extendHookResult(darkResult),
    };
  }
}

/**
 * Factory function to create a HookBuilder.
 */
export function createHookBuilder<T>(hookFn: () => T): HookBuilder<T> {
  return new HookBuilder(hookFn);
}
