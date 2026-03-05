/**
 * useLocale Hook
 *
 * Hook for locale management and formatting.
 */

import { useContext } from 'react';
import { I18nContext } from '../I18nContext';
import type { DateFormatOptions, NumberFormatOptions } from '../types';

export interface UseLocaleResult {
  /** Current locale code (e.g., 'en-US') */
  locale: string;
  /** Current language code (e.g., 'en') */
  language: string;
  /** Whether current locale is RTL */
  isRTL: boolean;
  /** List of supported locales */
  supportedLocales: string[];
  /** Change the current locale */
  setLocale: (locale: string) => Promise<void>;

  // Formatting functions
  /** Format a date */
  formatDate: (date: Date, options?: DateFormatOptions) => string;
  /** Format a relative time (e.g., '2 days ago') */
  formatRelativeTime: (date: Date, baseDate?: Date) => string;
  /** Format a number */
  formatNumber: (value: number, options?: NumberFormatOptions) => string;
  /** Format a currency value */
  formatCurrency: (value: number, currency: string) => string;
  /** Format a percentage */
  formatPercent: (value: number) => string;
}

/**
 * Hook for locale management and formatting
 *
 * @returns Locale info and formatting functions
 *
 * @example
 * ```tsx
 * import { useLocale } from '@rn-toolkit/i18n';
 *
 * function LanguagePicker() {
 *   const { locale, supportedLocales, setLocale } = useLocale();
 *
 *   return (
 *     <View>
 *       <Text>Current: {locale}</Text>
 *       {supportedLocales.map((loc) => (
 *         <Button
 *           key={loc}
 *           title={loc}
 *           onPress={() => setLocale(loc)}
 *         />
 *       ))}
 *     </View>
 *   );
 * }
 *
 * // Formatting
 * function PriceDisplay({ price, currency }) {
 *   const { formatCurrency } = useLocale();
 *
 *   return <Text>{formatCurrency(price, currency)}</Text>;
 *   // "$1,234.56" or "1.234,56 €" based on locale
 * }
 *
 * // RTL support
 * function RTLAwareView({ children }) {
 *   const { isRTL } = useLocale();
 *
 *   return (
 *     <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
 *       {children}
 *     </View>
 *   );
 * }
 * ```
 */
export function useLocale(): UseLocaleResult {
  const context = useContext(I18nContext);

  return {
    locale: context.locale,
    language: context.language,
    isRTL: context.isRTL,
    supportedLocales: context.getSupportedLocales(),
    setLocale: context.setLocale,
    formatDate: context.formatDate,
    formatRelativeTime: context.formatRelativeTime,
    formatNumber: context.formatNumber,
    formatCurrency: context.formatCurrency,
    formatPercent: context.formatPercent,
  };
}
