/**
 * Component Builder
 *
 * Fluent builder for component testing with theme support.
 */

import React, { cloneElement, type ReactElement, type ReactNode, type ComponentType } from 'react';
import type { RenderOptions, RenderResult } from '@testing-library/react-native';
import { ThemeMode } from '@rn-toolkit/theming';
import { renderWithTheme } from '../renderWithTheme';
import { createThemeSnapshot } from '../createThemeSnapshot';
import { createAssertionChain } from './assertions/AssertionBuilder';
import type {
  ComponentBuilderConfig,
  ProviderConfig,
  ExtendedRenderResult,
  AssertionChainMethods,
} from './types';

/**
 * Fluent builder for component testing.
 *
 * @example
 * ```typescript
 * dsl.component(<Button label="Click" onPress={fn} />)
 *    .inTheme('dark')
 *    .render()
 *    .assert()
 *    .visible('button')
 *    .text('Click')
 *    .done();
 * ```
 */
export class ComponentBuilder<P = Record<string, unknown>> {
  private element: ReactElement<P>;
  private config: ComponentBuilderConfig = {
    theme: 'light',
    providers: [],
  };
  private additionalProps: Partial<P> = {};

  constructor(element: ReactElement<P>) {
    this.element = element;
  }

  /**
   * Set the theme for rendering.
   */
  inTheme(mode: ThemeMode): this {
    this.config.theme = mode;
    return this;
  }

  /**
   * Alias for inTheme('light')
   */
  inLightMode(): this {
    return this.inTheme('light');
  }

  /**
   * Alias for inTheme('dark')
   */
  inDarkMode(): this {
    return this.inTheme('dark');
  }

  /**
   * Add additional props to the component.
   */
  withProps(props: Partial<P>): this {
    this.additionalProps = { ...this.additionalProps, ...props };
    return this;
  }

  /**
   * Set testID on the component.
   */
  withTestID(testID: string): this {
    this.config.testID = testID;
    return this;
  }

  /**
   * Wrap with an additional provider.
   */
  withProvider<ProviderProps>(
    Provider: ComponentType<ProviderProps & { children: ReactNode }>,
    props?: Omit<ProviderProps, 'children'>
  ): this {
    this.config.providers = this.config.providers || [];
    this.config.providers.push({
      component: Provider as ComponentType<{ children: ReactNode }>,
      props: props as Record<string, unknown>,
    });
    return this;
  }

  /**
   * Wrap with multiple providers.
   */
  withProviders(providers: ProviderConfig[]): this {
    this.config.providers = [...(this.config.providers || []), ...providers];
    return this;
  }

  /**
   * Get the final element with all props applied.
   */
  private getElement(): ReactElement {
    let element = this.element;

    // Apply additional props
    if (Object.keys(this.additionalProps).length > 0) {
      element = cloneElement(
        element,
        this.additionalProps as unknown as Partial<P> & React.Attributes
      );
    }

    // Apply testID if set
    if (this.config.testID) {
      element = cloneElement(
        element,
        { testID: this.config.testID } as unknown as Partial<P> & React.Attributes
      );
    }

    // Wrap with providers (innermost first, so reverse order)
    const providers = [...(this.config.providers || [])].reverse();
    for (const { component: Provider, props } of providers) {
      element = React.createElement(
        Provider,
        { ...props, children: element } as React.Attributes & { children: ReactNode }
      ) as ReactElement;
    }

    return element;
  }

  /**
   * Render the component with theme.
   */
  render(options?: Omit<RenderOptions, 'wrapper'>): ExtendedRenderResult {
    const element = this.getElement();
    const result = renderWithTheme(element, this.config.theme || 'light', options);

    return {
      ...result,
      assert: () => createAssertionChain(result),
    };
  }

  /**
   * Render in both themes and return both results.
   */
  renderBothThemes(options?: Omit<RenderOptions, 'wrapper'>): {
    light: ExtendedRenderResult;
    dark: ExtendedRenderResult;
  } {
    const element = this.getElement();

    const lightResult = renderWithTheme(element, 'light', options);
    const darkResult = renderWithTheme(element, 'dark', options);

    return {
      light: { ...lightResult, assert: () => createAssertionChain(lightResult) },
      dark: { ...darkResult, assert: () => createAssertionChain(darkResult) },
    };
  }

  /**
   * Create theme snapshots for the component.
   * Must be called inside a describe block.
   */
  snapshot(prefix?: string): void {
    const element = this.getElement();
    createThemeSnapshot(element, prefix);
  }

  /**
   * Create snapshots for specific variants of a prop.
   * Must be called inside a describe block.
   */
  snapshotVariants<K extends keyof P>(propName: K, values: P[K][], prefix?: string): void {
    const element = this.getElement();

    values.forEach((value) => {
      const variantElement = cloneElement(
        element,
        { [propName]: value } as unknown as Partial<P> & React.Attributes
      );

      const variantPrefix = prefix
        ? `${prefix} [${String(propName)}=${String(value)}]`
        : `[${String(propName)}=${String(value)}]`;

      createThemeSnapshot(variantElement, variantPrefix);
    });
  }

  // ============================================
  // DIRECT ASSERTION METHODS (shortcuts)
  // ============================================

  /**
   * Render and assert element is visible.
   */
  expectVisible(testID: string): AssertionChainMethods {
    return this.render().assert().visible(testID);
  }

  /**
   * Render and assert text is present.
   */
  expectText(content: string | RegExp): AssertionChainMethods {
    return this.render().assert().text(content);
  }

  /**
   * Render and assert element count.
   */
  expectCount(testID: string, count: number): AssertionChainMethods {
    return this.render().assert().count(testID, count);
  }
}

/**
 * Factory function to create a ComponentBuilder.
 */
export function createComponentBuilder<P>(element: ReactElement<P>): ComponentBuilder<P> {
  return new ComponentBuilder(element);
}
