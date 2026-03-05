import type { ComponentType } from 'react';
import type { RegisteredComponent, ComponentRegistryType } from './types';

/**
 * Component Registry
 *
 * Manages the mapping between SDUI component types and React components.
 * Built-in components are registered by default, custom components can be added.
 */
class ComponentRegistryClass {
  private registry: ComponentRegistryType = new Map();

  /**
   * Register a component with the registry
   *
   * @param type - The SDUI type name (e.g., 'text', 'button')
   * @param component - The React component to render
   * @param defaultProps - Optional default props to merge
   *
   * @example
   * ```typescript
   * registry.register('customCard', MyCustomCard, { elevation: 2 });
   * ```
   */
  register(
    type: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: ComponentType<any>,
    defaultProps?: Record<string, unknown>
  ): void {
    this.registry.set(type.toLowerCase(), {
      component,
      defaultProps,
    });
  }

  /**
   * Get a registered component by type
   *
   * @param type - The SDUI type name
   * @returns The registered component or undefined
   */
  get(type: string): RegisteredComponent | undefined {
    return this.registry.get(type.toLowerCase());
  }

  /**
   * Check if a component type is registered
   *
   * @param type - The SDUI type name
   * @returns True if registered
   */
  has(type: string): boolean {
    return this.registry.has(type.toLowerCase());
  }

  /**
   * Unregister a component
   *
   * @param type - The SDUI type name to remove
   */
  unregister(type: string): void {
    this.registry.delete(type.toLowerCase());
  }

  /**
   * Get all registered component types
   *
   * @returns Array of registered type names
   */
  getRegisteredTypes(): string[] {
    return Array.from(this.registry.keys());
  }

  /**
   * Clear all registered components
   * (Useful for testing)
   */
  clear(): void {
    this.registry.clear();
  }
}

/**
 * Global component registry instance
 */
export const ComponentRegistry = new ComponentRegistryClass();

/**
 * Helper function to register multiple components at once
 *
 * @example
 * ```typescript
 * registerComponents({
 *   'customCard': MyCustomCard,
 *   'fancyButton': FancyButton,
 * });
 * ```
 */
export function registerComponents(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components: Record<string, ComponentType<any>>
): void {
  Object.entries(components).forEach(([type, component]) => {
    ComponentRegistry.register(type, component);
  });
}
