/**
 * Assertion Builder
 *
 * Fluent assertion chain for component testing.
 */

import type { RenderResult } from '@testing-library/react-native';
import type { AssertionChainMethods } from '../types';

/**
 * Creates a fluent assertion chain from a render result.
 *
 * @example
 * ```typescript
 * const result = renderWithTheme(<Button label="Click" testID="btn" />);
 * createAssertionChain(result)
 *   .visible('btn')
 *   .text('Click')
 *   .enabled('btn')
 *   .done();
 * ```
 */
export function createAssertionChain(renderResult: RenderResult): AssertionChainMethods {
  const chain: AssertionChainMethods = {
    visible(testID: string): AssertionChainMethods {
      const element = renderResult.queryByTestId(testID);
      expect(element).toBeTruthy();
      return chain;
    },

    notVisible(testID: string): AssertionChainMethods {
      const element = renderResult.queryByTestId(testID);
      expect(element).toBeNull();
      return chain;
    },

    text(content: string | RegExp): AssertionChainMethods {
      if (typeof content === 'string') {
        const element = renderResult.queryByText(content);
        expect(element).toBeTruthy();
      } else {
        const element = renderResult.queryByText(content);
        expect(element).toBeTruthy();
      }
      return chain;
    },

    noText(content: string | RegExp): AssertionChainMethods {
      if (typeof content === 'string') {
        const element = renderResult.queryByText(content);
        expect(element).toBeNull();
      } else {
        const element = renderResult.queryByText(content);
        expect(element).toBeNull();
      }
      return chain;
    },

    count(testID: string, expected: number): AssertionChainMethods {
      const elements = renderResult.queryAllByTestId(testID);
      expect(elements.length).toBe(expected);
      return chain;
    },

    enabled(testID: string): AssertionChainMethods {
      const element = renderResult.getByTestId(testID);
      // Check for disabled prop or accessibilityState
      const props = element.props || {};
      const accessibilityState = props.accessibilityState || {};
      expect(props.disabled !== true && accessibilityState.disabled !== true).toBe(true);
      return chain;
    },

    disabled(testID: string): AssertionChainMethods {
      const element = renderResult.getByTestId(testID);
      const props = element.props || {};
      const accessibilityState = props.accessibilityState || {};
      expect(props.disabled === true || accessibilityState.disabled === true).toBe(true);
      return chain;
    },

    accessible(testID: string): AssertionChainMethods {
      const element = renderResult.getByTestId(testID);
      const props = element.props || {};
      // Check for basic accessibility props
      const hasAccessibility =
        props.accessible !== false &&
        (props.accessibilityLabel || props.accessibilityRole || props.accessibilityHint);
      expect(hasAccessibility).toBeTruthy();
      return chain;
    },

    get and(): AssertionChainMethods {
      return chain;
    },

    done(): void {
      // No-op, just for readability at chain end
    },

    toMatchSnapshot(): void {
      expect(renderResult.toJSON()).toMatchSnapshot();
    },
  };

  return chain;
}

/**
 * AssertionBuilder class for more complex assertion scenarios.
 */
export class AssertionBuilder implements AssertionChainMethods {
  private renderResult: RenderResult;
  private errors: Error[] = [];

  constructor(renderResult: RenderResult) {
    this.renderResult = renderResult;
  }

  visible(testID: string): this {
    try {
      const element = this.renderResult.queryByTestId(testID);
      expect(element).toBeTruthy();
    } catch (e) {
      this.errors.push(e as Error);
    }
    return this;
  }

  notVisible(testID: string): this {
    try {
      const element = this.renderResult.queryByTestId(testID);
      expect(element).toBeNull();
    } catch (e) {
      this.errors.push(e as Error);
    }
    return this;
  }

  text(content: string | RegExp): this {
    try {
      const element = this.renderResult.queryByText(content);
      expect(element).toBeTruthy();
    } catch (e) {
      this.errors.push(e as Error);
    }
    return this;
  }

  noText(content: string | RegExp): this {
    try {
      const element = this.renderResult.queryByText(content);
      expect(element).toBeNull();
    } catch (e) {
      this.errors.push(e as Error);
    }
    return this;
  }

  count(testID: string, expected: number): this {
    try {
      const elements = this.renderResult.queryAllByTestId(testID);
      expect(elements.length).toBe(expected);
    } catch (e) {
      this.errors.push(e as Error);
    }
    return this;
  }

  enabled(testID: string): this {
    try {
      const element = this.renderResult.getByTestId(testID);
      const props = element.props || {};
      const accessibilityState = props.accessibilityState || {};
      expect(props.disabled !== true && accessibilityState.disabled !== true).toBe(true);
    } catch (e) {
      this.errors.push(e as Error);
    }
    return this;
  }

  disabled(testID: string): this {
    try {
      const element = this.renderResult.getByTestId(testID);
      const props = element.props || {};
      const accessibilityState = props.accessibilityState || {};
      expect(props.disabled === true || accessibilityState.disabled === true).toBe(true);
    } catch (e) {
      this.errors.push(e as Error);
    }
    return this;
  }

  accessible(testID: string): this {
    try {
      const element = this.renderResult.getByTestId(testID);
      const props = element.props || {};
      const hasAccessibility =
        props.accessible !== false &&
        (props.accessibilityLabel || props.accessibilityRole || props.accessibilityHint);
      expect(hasAccessibility).toBeTruthy();
    } catch (e) {
      this.errors.push(e as Error);
    }
    return this;
  }

  get and(): this {
    return this;
  }

  done(): void {
    if (this.errors.length > 0) {
      throw new Error(
        `Assertion chain failed with ${this.errors.length} error(s):\n` +
          this.errors.map((e) => e.message).join('\n')
      );
    }
  }

  toMatchSnapshot(): void {
    this.done(); // Check for errors first
    expect(this.renderResult.toJSON()).toMatchSnapshot();
  }
}
