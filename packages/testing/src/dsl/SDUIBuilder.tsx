/**
 * SDUI Builder
 *
 * Fluent builder for testing SDUI schemas and rendering.
 */

import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { ThemeMode } from '@rn-toolkit/theming';
import { renderWithTheme } from '../renderWithTheme';
import { createAssertionChain } from './assertions/AssertionBuilder';
import {
  mockSDUISchema,
  mockTextNode,
  mockButtonNode,
  mockCardNode,
  mockListNode,
  mockImageNode,
  mockNavigateAction,
  mockApiAction,
  type SDUISchema,
  type SDUINode,
  type SDUIAction,
} from '../mocks';
import type { SDUIRenderResult, AssertionChainMethods } from './types';

/**
 * Action handler type for testing.
 */
type ActionHandler = (action: SDUIAction) => void | Promise<void>;

/**
 * Fluent builder for SDUI schema testing.
 *
 * @example
 * ```typescript
 * dsl.sdui(schema)
 *    .withActionHandler(mockHandler)
 *    .inTheme('dark')
 *    .render()
 *    .expectNodeCount('button', 2)
 *    .expectText('Hello');
 * ```
 */
export class SDUIBuilder {
  private schema: SDUISchema;
  private theme: ThemeMode = 'light';
  private actionHandler?: ActionHandler;
  private SDUIRenderer?: React.ComponentType<{ schema: SDUISchema; onAction?: ActionHandler }>;

  constructor(schema: SDUISchema) {
    this.schema = schema;
  }

  // ============================================
  // STATIC SCHEMA BUILDERS
  // ============================================

  /**
   * Create a text node.
   */
  static text(content: string, props?: Record<string, unknown>): SDUINode {
    return mockTextNode(content, props);
  }

  /**
   * Create a button node.
   */
  static button(
    label: string,
    action?: SDUIAction,
    props?: Record<string, unknown>
  ): SDUINode {
    return mockButtonNode(label, action, props);
  }

  /**
   * Create a card node.
   */
  static card(title: string, children?: SDUINode[]): SDUINode {
    return mockCardNode(title, children);
  }

  /**
   * Create a list node.
   */
  static list(items: SDUINode[], props?: Record<string, unknown>): SDUINode {
    return mockListNode(items, props);
  }

  /**
   * Create an image node.
   */
  static image(uri: string, props?: Record<string, unknown>): SDUINode {
    return mockImageNode(uri, props);
  }

  /**
   * Create a stack node (vertical or horizontal).
   */
  static stack(
    children: SDUINode[],
    direction: 'vertical' | 'horizontal' = 'vertical'
  ): SDUINode {
    return {
      type: 'stack',
      props: { direction },
      children,
    };
  }

  // ============================================
  // STATIC ACTION BUILDERS
  // ============================================

  /**
   * Create a navigate action.
   */
  static navigate(to: string, params?: Record<string, unknown>): SDUIAction {
    return mockNavigateAction(to, params);
  }

  /**
   * Create an API action.
   */
  static api(
    endpoint: string,
    method: string = 'GET',
    body?: Record<string, unknown>
  ): SDUIAction {
    return mockApiAction(endpoint, method, body);
  }

  /**
   * Create a custom action.
   */
  static custom(type: string, payload?: Record<string, unknown>): SDUIAction {
    return {
      type: 'custom' as const,
      payload: { customType: type, ...payload },
    };
  }

  // ============================================
  // BUILDER METHODS
  // ============================================

  /**
   * Set the theme mode.
   */
  inTheme(mode: ThemeMode): this {
    this.theme = mode;
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
   * Set the action handler for testing.
   */
  withActionHandler(handler: ActionHandler): this {
    this.actionHandler = handler;
    return this;
  }

  /**
   * Set a custom SDUIRenderer component.
   * Required for actual rendering tests.
   */
  withRenderer(
    Renderer: React.ComponentType<{ schema: SDUISchema; onAction?: ActionHandler }>
  ): this {
    this.SDUIRenderer = Renderer;
    return this;
  }

  /**
   * Add children to the schema.
   */
  withChildren(children: SDUINode[]): this {
    this.schema = {
      ...this.schema,
      children: [...this.schema.children, ...children],
    };
    return this;
  }

  /**
   * Add a single node to the schema.
   */
  addNode(node: SDUINode): this {
    this.schema = {
      ...this.schema,
      children: [...this.schema.children, node],
    };
    return this;
  }

  /**
   * Modify schema props.
   */
  withProps(props: Record<string, unknown>): this {
    this.schema = {
      ...this.schema,
      props: { ...this.schema.props, ...props },
    };
    return this;
  }

  /**
   * Get the current schema.
   */
  getSchema(): SDUISchema {
    return this.schema;
  }

  /**
   * Validate the schema structure.
   * Note: Full validation requires @rn-toolkit/security package.
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.schema.type || this.schema.type !== 'screen') {
      errors.push('Schema must have type "screen"');
    }

    if (!Array.isArray(this.schema.children)) {
      errors.push('Schema must have children array');
    }

    const validateNode = (node: SDUINode, path: string): void => {
      if (!node.type) {
        errors.push(`Node at ${path} missing type`);
      }
      if (node.children) {
        node.children.forEach((child, i) => {
          validateNode(child, `${path}.children[${i}]`);
        });
      }
    };

    this.schema.children?.forEach((child, i) => {
      validateNode(child, `children[${i}]`);
    });

    return { valid: errors.length === 0, errors };
  }

  /**
   * Assert the schema is valid.
   */
  expectValidSchema(): this {
    const { valid, errors } = this.validate();
    if (!valid) {
      throw new Error(`Invalid schema:\n${errors.join('\n')}`);
    }
    return this;
  }

  /**
   * Render the SDUI schema.
   * Requires withRenderer() to be called first.
   */
  render(): SDUIRenderResult {
    if (!this.SDUIRenderer) {
      throw new Error(
        'SDUIBuilder.render() requires a renderer. Call withRenderer(SDUIRenderer) first.'
      );
    }

    const Renderer = this.SDUIRenderer;
    const element = (
      <Renderer schema={this.schema} onAction={this.actionHandler} />
    );

    const result = renderWithTheme(element, this.theme);

    // Count nodes by type
    const countNodesByType = (type: string): number => {
      const count = (nodes: SDUINode[]): number => {
        let total = 0;
        for (const node of nodes) {
          if (node.type === type) total++;
          if (node.children) total += count(node.children);
        }
        return total;
      };
      return count(this.schema.children || []);
    };

    const extended: SDUIRenderResult = {
      ...result,
      assert: () => createAssertionChain(result),

      findByNodeType(type: string) {
        return result.queryAllByTestId(new RegExp(`sdui-${type}`));
      },

      expectNodeCount(type: string, expectedCount: number): SDUIRenderResult {
        const schemaCount = countNodesByType(type);
        expect(schemaCount).toBe(expectedCount);
        return extended;
      },

      async triggerAction(nodeTestID: string, actionName: string): Promise<void> {
        const element = result.getByTestId(nodeTestID);
        if (actionName === 'onPress') {
          fireEvent.press(element);
        } else {
          fireEvent(element, actionName);
        }
        // Allow async handlers to complete
        await new Promise((resolve) => setTimeout(resolve, 0));
      },
    };

    return extended;
  }

  /**
   * Create snapshot tests for the schema.
   * Note: Requires withRenderer() for actual rendering.
   */
  snapshot(prefix?: string): void {
    if (!this.SDUIRenderer) {
      throw new Error(
        'SDUIBuilder.snapshot() requires a renderer. Call withRenderer(SDUIRenderer) first.'
      );
    }

    const Renderer = this.SDUIRenderer;
    const element = (
      <Renderer schema={this.schema} onAction={this.actionHandler} />
    );

    const testPrefix = prefix || 'SDUI';

    it(`${testPrefix} matches light theme snapshot`, () => {
      const { toJSON } = renderWithTheme(element, 'light');
      expect(toJSON()).toMatchSnapshot();
    });

    it(`${testPrefix} matches dark theme snapshot`, () => {
      const { toJSON } = renderWithTheme(element, 'dark');
      expect(toJSON()).toMatchSnapshot();
    });
  }
}

/**
 * Factory function to create an SDUIBuilder.
 */
export function createSDUIBuilder(schema: SDUISchema): SDUIBuilder {
  return new SDUIBuilder(schema);
}

/**
 * Factory function to create an SDUIBuilder with a fresh schema.
 */
export function createEmptySDUIBuilder(): SDUIBuilder {
  return new SDUIBuilder(mockSDUISchema({ children: [] }));
}
