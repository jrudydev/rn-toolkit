/**
 * Analytics Context
 *
 * React context for analytics state and methods.
 */

import { createContext } from 'react';
import type { AnalyticsContextValue, EventParams, UserProperties, EcommerceItem } from './types';

const notInitialized = async () => {
  console.warn('AnalyticsProvider not found. Wrap your app in <AnalyticsProvider>.');
};

/**
 * Default context value (warns if used outside provider)
 */
const defaultContextValue: AnalyticsContextValue = {
  isInitialized: false,
  isEnabled: false,
  adapterName: 'none',
  logEvent: notInitialized,
  logScreenView: notInitialized,
  setUserId: notInitialized,
  setUserProperties: notInitialized,
  setUserProperty: notInitialized,
  setEnabled: notInitialized,
  reset: notInitialized,
  logAppOpen: notInitialized,
  logSignUp: notInitialized,
  logLogin: notInitialized,
  logShare: notInitialized,
  logSearch: notInitialized,
  logSelectContent: notInitialized,
  logPurchase: notInitialized,
  logAddToCart: notInitialized,
  logBeginCheckout: notInitialized,
};

/**
 * Analytics context
 */
export const AnalyticsContext = createContext<AnalyticsContextValue>(defaultContextValue);
