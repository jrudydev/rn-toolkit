/**
 * Mock SDUI utilities for testing.
 * These mocks simulate the @rn-toolkit/sdui package behavior.
 */

/**
 * SDUI Action types
 */
export type SDUIActionType = 'navigate' | 'api' | 'custom';

export interface SDUIAction {
  type: SDUIActionType;
  payload?: Record<string, unknown>;
}

/**
 * SDUI Component node structure
 */
export interface SDUINode {
  type: string;
  props?: Record<string, unknown>;
  children?: SDUINode[];
  actions?: Record<string, SDUIAction>;
}

/**
 * Full SDUI Schema
 */
export interface SDUISchema {
  type: 'screen';
  id?: string;
  props?: Record<string, unknown>;
  children: SDUINode[];
}

/**
 * Creates a mock SDUI schema for testing.
 *
 * @param overrides - Partial schema to merge with defaults
 * @returns Complete SDUI schema
 *
 * @example
 * ```typescript
 * const schema = mockSDUISchema({
 *   children: [
 *     { type: 'text', props: { content: 'Hello' } },
 *   ],
 * });
 * ```
 */
export function mockSDUISchema(overrides: Partial<SDUISchema> = {}): SDUISchema {
  return {
    type: 'screen',
    id: 'mock-screen',
    props: {},
    children: [],
    ...overrides,
  };
}

/**
 * Creates a mock SDUI text node.
 */
export function mockTextNode(content: string, props?: Record<string, unknown>): SDUINode {
  return {
    type: 'text',
    props: {
      content,
      variant: 'body',
      ...props,
    },
  };
}

/**
 * Creates a mock SDUI button node.
 */
export function mockButtonNode(
  label: string,
  action?: SDUIAction,
  props?: Record<string, unknown>
): SDUINode {
  return {
    type: 'button',
    props: {
      label,
      variant: 'primary',
      ...props,
    },
    actions: action ? { onPress: action } : undefined,
  };
}

/**
 * Creates a mock SDUI card node.
 */
export function mockCardNode(
  title: string,
  children?: SDUINode[],
  props?: Record<string, unknown>
): SDUINode {
  return {
    type: 'card',
    props: {
      title,
      ...props,
    },
    children,
  };
}

/**
 * Creates a mock SDUI list node.
 */
export function mockListNode(items: SDUINode[], props?: Record<string, unknown>): SDUINode {
  return {
    type: 'list',
    props: {
      direction: 'vertical',
      ...props,
    },
    children: items,
  };
}

/**
 * Creates a mock SDUI image node.
 */
export function mockImageNode(uri: string, props?: Record<string, unknown>): SDUINode {
  return {
    type: 'image',
    props: {
      uri,
      variant: 'default',
      ...props,
    },
  };
}

/**
 * Creates a mock navigate action.
 */
export function mockNavigateAction(to: string, params?: Record<string, unknown>): SDUIAction {
  return {
    type: 'navigate',
    payload: { to, params },
  };
}

/**
 * Creates a mock API action.
 */
export function mockApiAction(
  endpoint: string,
  method: string = 'GET',
  body?: Record<string, unknown>
): SDUIAction {
  return {
    type: 'api',
    payload: { endpoint, method, body },
  };
}

/**
 * Builds a complete profile screen schema for testing.
 */
export function mockProfileScreenSchema(username: string = 'testuser'): SDUISchema {
  return mockSDUISchema({
    id: 'profile-screen',
    children: [
      mockImageNode('https://example.com/avatar.png', { variant: 'avatar' }),
      mockTextNode(username, { variant: 'title' }),
      mockTextNode('A short bio goes here', { variant: 'body' }),
      mockListNode([
        mockCardNode('Link 1', undefined, {
          actions: { onPress: mockNavigateAction('/link/1') },
        }),
        mockCardNode('Link 2', undefined, {
          actions: { onPress: mockNavigateAction('/link/2') },
        }),
      ]),
    ],
  });
}
