import type { ComponentType } from 'react';

/**
 * Supported SDUI action types
 */
export type SDUIActionType = 'navigate' | 'api' | 'setState' | 'custom';

/**
 * SDUI Action definition
 */
export interface SDUIAction {
  /**
   * Type of action to perform
   */
  type: SDUIActionType;

  /**
   * Action payload
   */
  payload?: Record<string, unknown>;
}

/**
 * SDUI Component node in the schema tree
 */
export interface SDUINode {
  /**
   * Component type (maps to registered component)
   */
  type: string;

  /**
   * Unique key for React rendering (optional, auto-generated if not provided)
   */
  key?: string;

  /**
   * Props to pass to the component
   */
  props?: Record<string, unknown>;

  /**
   * Child nodes
   */
  children?: SDUINode[];

  /**
   * Actions mapped to event handlers
   */
  actions?: Record<string, SDUIAction>;
}

/**
 * Root SDUI Schema representing a screen
 */
export interface SDUISchema {
  /**
   * Schema type (always 'screen' for root)
   */
  type: 'screen';

  /**
   * Unique screen identifier
   */
  id?: string;

  /**
   * Screen-level props
   */
  props?: Record<string, unknown>;

  /**
   * Child components
   */
  children: SDUINode[];
}

/**
 * Action handler function type
 */
export type ActionHandler = (action: SDUIAction) => void | Promise<void>;

/**
 * Component registry entry
 */
export interface RegisteredComponent {
  /**
   * The React component
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;

  /**
   * Default props to merge
   */
  defaultProps?: Record<string, unknown>;
}

/**
 * SDUI Renderer props
 */
export interface SDUIRendererProps {
  /**
   * The schema to render
   */
  schema: SDUISchema;

  /**
   * Custom action handler
   */
  onAction?: ActionHandler;

  /**
   * Test ID for the root container
   */
  testID?: string;
}

/**
 * Component registry type
 */
export type ComponentRegistryType = Map<string, RegisteredComponent>;
