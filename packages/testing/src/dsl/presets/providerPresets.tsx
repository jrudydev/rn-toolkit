/**
 * Provider Presets
 *
 * Pre-configured provider wrappers for common testing scenarios.
 */

import type { ReactNode, ComponentType } from 'react';
import type { ProviderConfig } from '../types';

/**
 * Creates a provider configuration for easy use with builders.
 */
export function createProviderConfig<P>(
  component: ComponentType<P & { children: ReactNode }>,
  props?: Omit<P, 'children'>
): ProviderConfig {
  return {
    component: component as ComponentType<{ children: ReactNode }>,
    props: props as Record<string, unknown>,
  };
}

/**
 * Creates a wrapper function from provider configs.
 * Useful for renderHook's wrapper option.
 */
export function createWrapperFromConfigs(
  configs: ProviderConfig[]
): (props: { children: ReactNode }) => JSX.Element {
  return function Wrapper({ children }: { children: ReactNode }) {
    let wrapped = children;

    // Apply providers in reverse order (innermost first)
    const reversedConfigs = [...configs].reverse();
    for (const { component: Provider, props } of reversedConfigs) {
      const providerProps = props || {};
      wrapped = <Provider {...providerProps}>{wrapped}</Provider>;
    }

    return <>{wrapped}</>;
  };
}

/**
 * Combines multiple provider configs into one.
 */
export function combineProviders(...configs: ProviderConfig[]): ProviderConfig[] {
  return configs;
}

// Note: Package-specific presets will be added when those packages
// are available as dependencies. For now, users can create their own
// presets using createProviderConfig.
//
// Example usage in user code:
//
// import { NotificationProvider, NoOpAdapter } from '@rn-toolkit/notifications';
// import { createProviderConfig } from '@rn-toolkit/testing';
//
// const notificationPreset = createProviderConfig(NotificationProvider, {
//   adapter: new NoOpAdapter({ initialPermission: 'granted' }),
// });
//
// dsl.hook(() => useNotifications())
//    .withProvider(NotificationProvider, { adapter: mockAdapter })
//    .render();
