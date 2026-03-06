/**
 * Matrix Builder
 *
 * Generate tests for all combinations of props and themes.
 */

import React, { cloneElement, type ReactElement } from 'react';
import type { RenderResult } from '@testing-library/react-native';
import { ThemeMode } from '@rn-toolkit/theming';
import { renderWithTheme } from '../renderWithTheme';
import type { VariantCombination } from './types';

/**
 * Configuration for matrix testing.
 */
interface MatrixConfig<P> {
  variants: Partial<{ [K in keyof P]: P[K][] }>;
  themes: ThemeMode[];
  filter?: (combo: Partial<P>, theme: ThemeMode) => boolean;
}

/**
 * Fluent builder for variant matrix testing.
 *
 * @example
 * ```typescript
 * // Generates 4 x 3 x 2 = 24 snapshot tests
 * dsl.matrix(<Button label="Test" onPress={fn} />)
 *    .withVariants('variant', ['primary', 'secondary', 'outline', 'ghost'])
 *    .withVariants('size', ['sm', 'md', 'lg'])
 *    .inThemes(['light', 'dark'])
 *    .snapshotAll();
 * ```
 */
export class MatrixBuilder<P = Record<string, unknown>> {
  private element: ReactElement<P>;
  private variants: Partial<{ [K in keyof P]: P[K][] }> = {};
  private themes: ThemeMode[] = ['light', 'dark'];
  private filterFn?: (combo: Partial<P>, theme: ThemeMode) => boolean;

  constructor(element: ReactElement<P>) {
    this.element = element;
  }

  /**
   * Add variants for a specific prop.
   */
  withVariants<K extends keyof P>(propName: K, values: P[K][]): this {
    this.variants[propName] = values;
    return this;
  }

  /**
   * Set matrix configuration in one call.
   */
  withMatrix(config: Partial<MatrixConfig<P>>): this {
    if (config.variants) {
      this.variants = { ...this.variants, ...config.variants };
    }
    if (config.themes) {
      this.themes = config.themes;
    }
    if (config.filter) {
      this.filterFn = config.filter;
    }
    return this;
  }

  /**
   * Set themes to test.
   */
  inThemes(themes: ThemeMode[]): this {
    this.themes = themes;
    return this;
  }

  /**
   * Only test light theme.
   */
  inLightOnly(): this {
    this.themes = ['light'];
    return this;
  }

  /**
   * Only test dark theme.
   */
  inDarkOnly(): this {
    this.themes = ['dark'];
    return this;
  }

  /**
   * Filter out invalid combinations.
   */
  filter(predicate: (combo: Partial<P>, theme: ThemeMode) => boolean): this {
    this.filterFn = predicate;
    return this;
  }

  /**
   * Generate all prop combinations.
   */
  private generateCombinations(): Partial<P>[] {
    const propNames = Object.keys(this.variants) as (keyof P)[];

    if (propNames.length === 0) {
      return [{}];
    }

    const combine = (
      remaining: (keyof P)[],
      current: Partial<P>
    ): Partial<P>[] => {
      if (remaining.length === 0) {
        return [current];
      }

      const [propName, ...rest] = remaining;
      const values = this.variants[propName] || [];

      if (values.length === 0) {
        return combine(rest, current);
      }

      const results: Partial<P>[] = [];
      for (const value of values) {
        results.push(...combine(rest, { ...current, [propName]: value }));
      }
      return results;
    };

    return combine(propNames, {});
  }

  /**
   * Get all combinations with themes applied and filtering.
   */
  getCombinations(): VariantCombination<P>[] {
    const propCombinations = this.generateCombinations();
    const results: VariantCombination<P>[] = [];

    for (const props of propCombinations) {
      for (const theme of this.themes) {
        // Apply filter if present
        if (this.filterFn && !this.filterFn(props, theme)) {
          continue;
        }

        // Generate human-readable name
        const propsStr = Object.entries(props)
          .map(([k, v]) => `${k}=${String(v)}`)
          .join(', ');
        const name = propsStr ? `[${propsStr}] (${theme})` : `(${theme})`;

        results.push({ props, theme, name });
      }
    }

    return results;
  }

  /**
   * Generate snapshot tests for all combinations.
   * Must be called inside a describe block.
   */
  snapshotAll(prefix?: string): void {
    const combinations = this.getCombinations();

    combinations.forEach(({ props, theme, name }) => {
      const testName = prefix ? `${prefix} ${name}` : name;
      const element = cloneElement(this.element, props as Partial<P> & React.Attributes);

      it(`${testName} matches snapshot`, () => {
        const { toJSON } = renderWithTheme(element, theme);
        expect(toJSON()).toMatchSnapshot();
      });
    });
  }

  /**
   * Run a test function for each combination.
   * Must be called inside a describe block.
   */
  testAll(
    testFn: (result: RenderResult, combo: Partial<P>, theme: ThemeMode) => void,
    prefix?: string
  ): void {
    const combinations = this.getCombinations();

    combinations.forEach(({ props, theme, name }) => {
      const testName = prefix ? `${prefix} ${name}` : name;
      const element = cloneElement(this.element, props as Partial<P> & React.Attributes);

      it(testName, () => {
        const result = renderWithTheme(element, theme);
        testFn(result, props, theme);
      });
    });
  }

  /**
   * Run an async test function for each combination.
   * Must be called inside a describe block.
   */
  testAllAsync(
    testFn: (result: RenderResult, combo: Partial<P>, theme: ThemeMode) => Promise<void>,
    prefix?: string
  ): void {
    const combinations = this.getCombinations();

    combinations.forEach(({ props, theme, name }) => {
      const testName = prefix ? `${prefix} ${name}` : name;
      const element = cloneElement(this.element, props as Partial<P> & React.Attributes);

      it(testName, async () => {
        const result = renderWithTheme(element, theme);
        await testFn(result, props, theme);
      });
    });
  }

  /**
   * Get total number of test combinations.
   */
  getCount(): number {
    return this.getCombinations().length;
  }

  /**
   * Log all combinations (for debugging).
   */
  logCombinations(): this {
    const combinations = this.getCombinations();
    console.log(`Matrix will generate ${combinations.length} tests:`);
    combinations.forEach(({ name }) => console.log(`  - ${name}`));
    return this;
  }
}

/**
 * Factory function to create a MatrixBuilder.
 */
export function createMatrixBuilder<P>(element: ReactElement<P>): MatrixBuilder<P> {
  return new MatrixBuilder(element);
}
