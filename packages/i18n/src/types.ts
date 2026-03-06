/**
 * @astacinco/rn-i18n Types
 *
 * Core types for the internationalization adapter pattern.
 */

/**
 * Parameters for translation interpolation
 */
export type TranslationParams = Record<string, string | number>;

/**
 * Plural forms for a translation key
 */
export interface PluralForms {
  zero?: string;
  one: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}

/**
 * Date formatting options
 */
export interface DateFormatOptions {
  /** Date style: 'full', 'long', 'medium', 'short' */
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  /** Time style: 'full', 'long', 'medium', 'short' */
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
  /** Custom format pattern (implementation-specific) */
  format?: string;
  /** Timezone */
  timeZone?: string;
}

/**
 * Number formatting options
 */
export interface NumberFormatOptions {
  /** Style: 'decimal', 'currency', 'percent', 'unit' */
  style?: 'decimal' | 'currency' | 'percent' | 'unit';
  /** Currency code (e.g., 'USD', 'EUR') */
  currency?: string;
  /** Currency display: 'symbol', 'narrowSymbol', 'code', 'name' */
  currencyDisplay?: 'symbol' | 'narrowSymbol' | 'code' | 'name';
  /** Unit identifier (e.g., 'kilometer', 'celsius') */
  unit?: string;
  /** Minimum fraction digits */
  minimumFractionDigits?: number;
  /** Maximum fraction digits */
  maximumFractionDigits?: number;
  /** Use grouping separators */
  useGrouping?: boolean;
}

/**
 * Accessibility announcement priority
 */
export type AnnouncementPriority = 'polite' | 'assertive';

/**
 * Accessibility settings
 */
export interface AccessibilitySettings {
  /** Screen reader is enabled */
  screenReaderEnabled: boolean;
  /** Reduce motion preference */
  reduceMotionEnabled: boolean;
  /** Bold text preference */
  boldTextEnabled: boolean;
  /** Grayscale preference */
  grayscaleEnabled: boolean;
  /** Invert colors preference */
  invertColorsEnabled: boolean;
  /** Font scale multiplier */
  fontScale: number;
}

/**
 * Translation resources structure
 */
export interface TranslationResources {
  [namespace: string]: {
    [key: string]: string | PluralForms;
  };
}

/**
 * Locale configuration
 */
export interface LocaleConfig {
  /** Locale code (e.g., 'en-US', 'es-ES') */
  locale: string;
  /** Language code (e.g., 'en', 'es') */
  language: string;
  /** Region code (e.g., 'US', 'ES') */
  region?: string;
  /** Text direction */
  isRTL: boolean;
  /** Fallback locales */
  fallbacks?: string[];
}

/**
 * I18n Adapter Interface
 *
 * Implement this interface to create a custom i18n adapter.
 * This allows swapping between different i18n libraries (react-i18next, react-intl, etc.)
 * without changing application code.
 */
export interface I18nAdapter {
  /** Unique adapter name */
  readonly name: string;

  /**
   * Initialize the adapter
   * Called once when the I18nProvider mounts
   */
  initialize(): Promise<void>;

  // ============================================
  // TRANSLATION
  // ============================================

  /**
   * Translate a key with optional parameters
   * @param key - Translation key (e.g., 'common.welcome')
   * @param params - Interpolation parameters
   * @returns Translated string
   */
  translate(key: string, params?: TranslationParams): string;

  /**
   * Translate a key with pluralization
   * @param key - Translation key
   * @param count - Count for pluralization
   * @param params - Additional interpolation parameters
   * @returns Translated string with correct plural form
   */
  translatePlural(key: string, count: number, params?: TranslationParams): string;

  /**
   * Check if a translation key exists
   * @param key - Translation key
   * @returns True if the key exists
   */
  hasTranslation(key: string): boolean;

  // ============================================
  // LOCALE MANAGEMENT
  // ============================================

  /**
   * Get the current locale code
   * @returns Current locale (e.g., 'en-US')
   */
  getLocale(): string;

  /**
   * Get the current language code
   * @returns Current language (e.g., 'en')
   */
  getLanguage(): string;

  /**
   * Get full locale configuration
   * @returns Locale configuration object
   */
  getLocaleConfig(): LocaleConfig;

  /**
   * Set the current locale
   * @param locale - Locale code to set
   */
  setLocale(locale: string): Promise<void>;

  /**
   * Get list of supported locales
   * @returns Array of supported locale codes
   */
  getSupportedLocales(): string[];

  // ============================================
  // FORMATTING
  // ============================================

  /**
   * Format a date according to locale
   * @param date - Date to format
   * @param options - Formatting options
   * @returns Formatted date string
   */
  formatDate(date: Date, options?: DateFormatOptions): string;

  /**
   * Format a relative time (e.g., '2 days ago')
   * @param date - Date to format relative to now
   * @param baseDate - Base date (defaults to now)
   * @returns Relative time string
   */
  formatRelativeTime(date: Date, baseDate?: Date): string;

  /**
   * Format a number according to locale
   * @param value - Number to format
   * @param options - Formatting options
   * @returns Formatted number string
   */
  formatNumber(value: number, options?: NumberFormatOptions): string;

  /**
   * Format a currency value
   * @param value - Amount to format
   * @param currency - Currency code (e.g., 'USD')
   * @returns Formatted currency string
   */
  formatCurrency(value: number, currency: string): string;

  /**
   * Format a percentage
   * @param value - Value to format (0.5 = 50%)
   * @returns Formatted percentage string
   */
  formatPercent(value: number): string;

  // ============================================
  // ACCESSIBILITY
  // ============================================

  /**
   * Get current accessibility settings
   * @returns Accessibility settings object
   */
  getAccessibilitySettings(): Promise<AccessibilitySettings>;

  /**
   * Announce a message to screen readers
   * @param message - Message to announce
   * @param priority - Announcement priority
   */
  announceForAccessibility(message: string, priority?: AnnouncementPriority): void;

  /**
   * Check if screen reader is enabled
   * @returns True if screen reader is active
   */
  isScreenReaderEnabled(): Promise<boolean>;
}

/**
 * I18n Provider configuration
 */
export interface I18nConfig {
  /** Default locale */
  defaultLocale?: string;
  /** Fallback locale when translation is missing */
  fallbackLocale?: string;
  /** Enable debug logging */
  debug?: boolean;
  /** Log missing translations */
  logMissingTranslations?: boolean;
  /** Custom missing translation handler */
  onMissingTranslation?: (key: string, locale: string) => string | undefined;
}

/**
 * I18n Context value
 */
export interface I18nContextValue {
  /** Whether the adapter is initialized */
  isInitialized: boolean;
  /** Current adapter name */
  adapterName: string;
  /** Current locale */
  locale: string;
  /** Current language */
  language: string;
  /** Whether current locale is RTL */
  isRTL: boolean;

  // Translation methods
  t: (key: string, params?: TranslationParams) => string;
  tp: (key: string, count: number, params?: TranslationParams) => string;
  hasKey: (key: string) => boolean;

  // Locale management
  setLocale: (locale: string) => Promise<void>;
  getSupportedLocales: () => string[];

  // Formatting
  formatDate: (date: Date, options?: DateFormatOptions) => string;
  formatRelativeTime: (date: Date, baseDate?: Date) => string;
  formatNumber: (value: number, options?: NumberFormatOptions) => string;
  formatCurrency: (value: number, currency: string) => string;
  formatPercent: (value: number) => string;

  // Accessibility
  announce: (message: string, priority?: AnnouncementPriority) => void;
}
