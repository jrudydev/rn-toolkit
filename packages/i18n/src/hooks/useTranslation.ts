/**
 * useTranslation Hook
 *
 * Hook for accessing translation functions.
 */

import { useContext, useCallback } from 'react';
import { I18nContext } from '../I18nContext';
import type { TranslationParams } from '../types';

export interface UseTranslationOptions {
  /** Key prefix for all translations */
  keyPrefix?: string;
  /** Default parameters for all translations */
  defaultParams?: TranslationParams;
}

export interface UseTranslationResult {
  /** Translate a key */
  t: (key: string, params?: TranslationParams) => string;
  /** Translate with pluralization */
  tp: (key: string, count: number, params?: TranslationParams) => string;
  /** Check if translation key exists */
  hasKey: (key: string) => boolean;
  /** Current locale */
  locale: string;
  /** Current language code */
  language: string;
  /** Whether provider is initialized */
  isReady: boolean;
}

/**
 * Hook for accessing translation functions
 *
 * @param options - Translation options
 * @returns Translation functions and locale info
 *
 * @example
 * ```tsx
 * import { useTranslation } from '@rn-toolkit/i18n';
 *
 * function WelcomeMessage({ name }) {
 *   const { t } = useTranslation();
 *
 *   return <Text>{t('common.welcome', { name })}</Text>;
 * }
 *
 * // With key prefix
 * function ProfileScreen() {
 *   const { t } = useTranslation({ keyPrefix: 'profile' });
 *
 *   return (
 *     <View>
 *       <Text>{t('title')}</Text>  // Translates 'profile.title'
 *       <Text>{t('subtitle')}</Text>
 *     </View>
 *   );
 * }
 *
 * // With pluralization
 * function ItemCount({ count }) {
 *   const { tp } = useTranslation();
 *
 *   return <Text>{tp('items.count', count)}</Text>;
 *   // "1 item" or "5 items" based on plural rules
 * }
 * ```
 */
export function useTranslation(options: UseTranslationOptions = {}): UseTranslationResult {
  const context = useContext(I18nContext);
  const { keyPrefix, defaultParams } = options;

  // Translate with optional prefix and default params
  const t = useCallback(
    (key: string, params?: TranslationParams): string => {
      const fullKey = keyPrefix ? `${keyPrefix}.${key}` : key;
      const mergedParams = defaultParams ? { ...defaultParams, ...params } : params;
      return context.t(fullKey, mergedParams);
    },
    [context, keyPrefix, defaultParams]
  );

  // Translate plural with optional prefix
  const tp = useCallback(
    (key: string, count: number, params?: TranslationParams): string => {
      const fullKey = keyPrefix ? `${keyPrefix}.${key}` : key;
      const mergedParams = defaultParams ? { ...defaultParams, ...params } : params;
      return context.tp(fullKey, count, mergedParams);
    },
    [context, keyPrefix, defaultParams]
  );

  // Check key exists with optional prefix
  const hasKey = useCallback(
    (key: string): boolean => {
      const fullKey = keyPrefix ? `${keyPrefix}.${key}` : key;
      return context.hasKey(fullKey);
    },
    [context, keyPrefix]
  );

  return {
    t,
    tp,
    hasKey,
    locale: context.locale,
    language: context.language,
    isReady: context.isInitialized,
  };
}
