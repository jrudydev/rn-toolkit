/**
 * I18n Context
 *
 * React context for i18n functionality.
 */

import { createContext } from 'react';
import type { I18nContextValue } from './types';

/**
 * Default context value (before initialization)
 */
const defaultContextValue: I18nContextValue = {
  isInitialized: false,
  adapterName: 'none',
  locale: 'en',
  language: 'en',
  isRTL: false,

  // Translation methods (return key as fallback)
  t: (key: string) => key,
  tp: (key: string) => key,
  hasKey: () => false,

  // Locale management
  setLocale: async () => {},
  getSupportedLocales: () => ['en'],

  // Formatting (basic fallbacks)
  formatDate: (date: Date) => date.toISOString(),
  formatRelativeTime: () => 'now',
  formatNumber: (value: number) => String(value),
  formatCurrency: (value: number, currency: string) => `${currency} ${value}`,
  formatPercent: (value: number) => `${value * 100}%`,

  // Accessibility
  announce: () => {},
};

/**
 * I18n Context
 *
 * Provides i18n functionality throughout the app.
 */
export const I18nContext = createContext<I18nContextValue>(defaultContextValue);
