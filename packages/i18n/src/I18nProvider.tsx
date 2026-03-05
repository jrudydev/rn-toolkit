/**
 * I18n Provider
 *
 * React provider component for i18n functionality with adapter pattern.
 */

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { I18nContext } from './I18nContext';
import type {
  I18nAdapter,
  I18nConfig,
  I18nContextValue,
  TranslationParams,
  DateFormatOptions,
  NumberFormatOptions,
  AnnouncementPriority,
} from './types';

export interface I18nProviderProps {
  /** I18n adapter instance */
  adapter: I18nAdapter;
  /** Configuration options */
  config?: I18nConfig;
  /** Children components */
  children: React.ReactNode;
}

/**
 * I18n Provider Component
 *
 * Wraps your app and provides i18n functionality through context.
 *
 * @example
 * ```tsx
 * import { I18nProvider, ConsoleAdapter } from '@rn-toolkit/i18n';
 *
 * const adapter = new ConsoleAdapter({
 *   defaultLocale: 'en',
 *   resources: {
 *     en: {
 *       common: {
 *         welcome: 'Welcome, {{name}}!',
 *       },
 *     },
 *   },
 * });
 *
 * function App() {
 *   return (
 *     <I18nProvider adapter={adapter}>
 *       <MyApp />
 *     </I18nProvider>
 *   );
 * }
 * ```
 */
export function I18nProvider({
  adapter,
  config = {},
  children,
}: I18nProviderProps): React.ReactElement {
  const [isInitialized, setIsInitialized] = useState(false);
  const [locale, setLocaleState] = useState(config.defaultLocale ?? 'en');
  const [isRTL, setIsRTL] = useState(false);

  const adapterRef = useRef(adapter);
  const configRef = useRef(config);

  // Initialize adapter
  useEffect(() => {
    const initializeAdapter = async () => {
      try {
        await adapterRef.current.initialize();

        // Set initial locale if configured
        if (configRef.current.defaultLocale) {
          await adapterRef.current.setLocale(configRef.current.defaultLocale);
        }

        // Get locale config
        const localeConfig = adapterRef.current.getLocaleConfig();
        setLocaleState(localeConfig.locale);
        setIsRTL(localeConfig.isRTL);

        if (configRef.current.debug) {
          console.log(`[I18n] Initialized with ${adapterRef.current.name} adapter`);
          console.log(`[I18n] Locale: ${localeConfig.locale}, RTL: ${localeConfig.isRTL}`);
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('[I18n] Failed to initialize:', error);
      }
    };

    initializeAdapter();
  }, []);

  // Translation function
  const t = useCallback(
    (key: string, params?: TranslationParams): string => {
      const translation = adapterRef.current.translate(key, params);

      // Log missing translations
      if (configRef.current.logMissingTranslations && !adapterRef.current.hasTranslation(key)) {
        console.warn(`[I18n] Missing translation: "${key}" for locale "${locale}"`);

        // Call custom handler if provided
        const customTranslation = configRef.current.onMissingTranslation?.(key, locale);
        if (customTranslation) {
          return customTranslation;
        }
      }

      return translation;
    },
    [locale]
  );

  // Plural translation function
  const tp = useCallback(
    (key: string, count: number, params?: TranslationParams): string => {
      return adapterRef.current.translatePlural(key, count, params);
    },
    []
  );

  // Check if key exists
  const hasKey = useCallback((key: string): boolean => {
    return adapterRef.current.hasTranslation(key);
  }, []);

  // Set locale
  const setLocale = useCallback(async (newLocale: string): Promise<void> => {
    await adapterRef.current.setLocale(newLocale);
    const localeConfig = adapterRef.current.getLocaleConfig();
    setLocaleState(localeConfig.locale);
    setIsRTL(localeConfig.isRTL);

    if (configRef.current.debug) {
      console.log(`[I18n] Locale changed to: ${newLocale}`);
    }
  }, []);

  // Get supported locales
  const getSupportedLocales = useCallback((): string[] => {
    return adapterRef.current.getSupportedLocales();
  }, []);

  // Format date
  const formatDate = useCallback((date: Date, options?: DateFormatOptions): string => {
    return adapterRef.current.formatDate(date, options);
  }, []);

  // Format relative time
  const formatRelativeTime = useCallback((date: Date, baseDate?: Date): string => {
    return adapterRef.current.formatRelativeTime(date, baseDate);
  }, []);

  // Format number
  const formatNumber = useCallback((value: number, options?: NumberFormatOptions): string => {
    return adapterRef.current.formatNumber(value, options);
  }, []);

  // Format currency
  const formatCurrency = useCallback((value: number, currency: string): string => {
    return adapterRef.current.formatCurrency(value, currency);
  }, []);

  // Format percent
  const formatPercent = useCallback((value: number): string => {
    return adapterRef.current.formatPercent(value);
  }, []);

  // Announce for accessibility
  const announce = useCallback((message: string, priority?: AnnouncementPriority): void => {
    adapterRef.current.announceForAccessibility(message, priority);
  }, []);

  // Create context value
  const contextValue = useMemo<I18nContextValue>(
    () => ({
      isInitialized,
      adapterName: adapterRef.current.name,
      locale,
      language: locale.split('-')[0],
      isRTL,
      t,
      tp,
      hasKey,
      setLocale,
      getSupportedLocales,
      formatDate,
      formatRelativeTime,
      formatNumber,
      formatCurrency,
      formatPercent,
      announce,
    }),
    [
      isInitialized,
      locale,
      isRTL,
      t,
      tp,
      hasKey,
      setLocale,
      getSupportedLocales,
      formatDate,
      formatRelativeTime,
      formatNumber,
      formatCurrency,
      formatPercent,
      announce,
    ]
  );

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
}
