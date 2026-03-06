/**
 * @astacinco/rn-i18n
 *
 * Internationalization with adapter pattern for swappable i18n providers.
 *
 * Features:
 * - Adapter pattern for provider flexibility (react-i18next, react-intl, etc.)
 * - Built-in adapters: ReactI18next, Console, NoOp
 * - Translation with interpolation and pluralization
 * - Date, number, and currency formatting
 * - RTL support
 * - Accessibility features (screen reader announcements)
 * - TypeScript first
 *
 * @example
 * ```tsx
 * import {
 *   I18nProvider,
 *   ConsoleAdapter,
 *   useTranslation,
 *   useLocale,
 * } from '@astacinco/rn-i18n';
 *
 * // Use Console adapter for debugging
 * const adapter = new ConsoleAdapter({
 *   defaultLocale: 'en',
 *   resources: {
 *     en: {
 *       common: {
 *         welcome: 'Welcome, {{name}}!',
 *         items: { one: '1 item', other: '{{count}} items' },
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
 *
 * // In components
 * function HomeScreen() {
 *   const { t, tp } = useTranslation();
 *   const { formatCurrency, isRTL } = useLocale();
 *
 *   return (
 *     <View style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
 *       <Text>{t('common.welcome', { name: 'John' })}</Text>
 *       <Text>{tp('common.items', 5)}</Text>
 *       <Text>{formatCurrency(99.99, 'USD')}</Text>
 *     </View>
 *   );
 * }
 * ```
 */

// Context and Provider
export { I18nContext } from './I18nContext';
export { I18nProvider } from './I18nProvider';
export type { I18nProviderProps } from './I18nProvider';

// Adapters
export { NoOpAdapter, ConsoleAdapter, ReactI18nextAdapter } from './adapters';
export type { ConsoleAdapterOptions, ReactI18nextAdapterOptions } from './adapters';

// Hooks
export { useTranslation, useLocale, useAccessibility } from './hooks';
export type {
  UseTranslationOptions,
  UseTranslationResult,
  UseLocaleResult,
  UseAccessibilityResult,
} from './hooks';

// Types
export type {
  I18nAdapter,
  I18nConfig,
  I18nContextValue,
  TranslationParams,
  PluralForms,
  DateFormatOptions,
  NumberFormatOptions,
  AccessibilitySettings,
  AnnouncementPriority,
  LocaleConfig,
  TranslationResources,
} from './types';
