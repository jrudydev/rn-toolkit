/**
 * Deep Link Context
 *
 * React context for deep linking state and navigation methods.
 */

import { createContext } from 'react';
import type { DeepLinkContextValue } from './types';
import { createRouteRegistry } from './RouteRegistry';

/**
 * Default context value (throws if used outside provider)
 */
const defaultContextValue: DeepLinkContextValue = {
  currentRoute: null,
  history: [],
  canGoBack: false,
  navigate: () => {
    throw new Error('DeepLinkProvider not found. Wrap your app with <DeepLinkProvider>.');
  },
  goBack: () => {
    throw new Error('DeepLinkProvider not found. Wrap your app with <DeepLinkProvider>.');
  },
  goForward: () => {
    throw new Error('DeepLinkProvider not found. Wrap your app with <DeepLinkProvider>.');
  },
  reset: () => {
    throw new Error('DeepLinkProvider not found. Wrap your app with <DeepLinkProvider>.');
  },
  getState: () => {
    throw new Error('DeepLinkProvider not found. Wrap your app with <DeepLinkProvider>.');
  },
  setState: () => {
    throw new Error('DeepLinkProvider not found. Wrap your app with <DeepLinkProvider>.');
  },
  registry: createRouteRegistry(),
  badges: new Map(),
  getBadge: () => 0,
  refreshBadges: async () => {
    throw new Error('DeepLinkProvider not found. Wrap your app with <DeepLinkProvider>.');
  },
};

/**
 * Deep link context
 */
export const DeepLinkContext = createContext<DeepLinkContextValue>(defaultContextValue);
