/**
 * Console I18n Adapter
 *
 * A debugging adapter that logs all i18n operations to console.
 * Useful for development and debugging.
 */

import type {
  I18nAdapter,
  TranslationParams,
  LocaleConfig,
  DateFormatOptions,
  NumberFormatOptions,
  AccessibilitySettings,
  AnnouncementPriority,
  TranslationResources,
} from '../types';

export interface ConsoleAdapterOptions {
  /** Log prefix */
  prefix?: string;
  /** Include timestamps in logs */
  timestamps?: boolean;
  /** Initial locale */
  defaultLocale?: string;
  /** Translation resources */
  resources?: Record<string, TranslationResources>;
  /** Supported locales */
  supportedLocales?: string[];
}

export class ConsoleAdapter implements I18nAdapter {
  readonly name = 'console';

  private prefix: string;
  private timestamps: boolean;
  private locale: string;
  private resources: Record<string, TranslationResources>;
  private supportedLocales: string[];

  constructor(options: ConsoleAdapterOptions = {}) {
    this.prefix = options.prefix ?? '[I18n]';
    this.timestamps = options.timestamps ?? false;
    this.locale = options.defaultLocale ?? 'en';
    this.resources = options.resources ?? {};
    this.supportedLocales = options.supportedLocales ?? ['en'];
  }

  private log(action: string, data: Record<string, unknown>): void {
    const timestamp = this.timestamps ? `${new Date().toISOString()} ` : '';
    console.log(`${timestamp}${this.prefix} ${action}:`, data);
  }

  async initialize(): Promise<void> {
    this.log('INIT', {
      adapter: this.name,
      locale: this.locale,
      supportedLocales: this.supportedLocales,
    });
  }

  // ============================================
  // TRANSLATION
  // ============================================

  translate(key: string, params?: TranslationParams): string {
    const parts = key.split('.');
    const namespace = parts.length > 1 ? parts[0] : 'common';
    const actualKey = parts.length > 1 ? parts.slice(1).join('.') : key;

    // Try to find translation
    let translation: string | undefined;
    const localeResources = this.resources[this.locale];
    if (localeResources?.[namespace]?.[actualKey]) {
      const value = localeResources[namespace][actualKey];
      translation = typeof value === 'string' ? value : value.other;
    }

    // Fallback to key if no translation
    let result = translation ?? key;

    // Interpolate parameters
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        result = result.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(value));
        result = result.replace(new RegExp(`{${paramKey}}`, 'g'), String(value));
      });
    }

    this.log('TRANSLATE', { key, params, result, locale: this.locale });
    return result;
  }

  translatePlural(key: string, count: number, params?: TranslationParams): string {
    const parts = key.split('.');
    const namespace = parts.length > 1 ? parts[0] : 'common';
    const actualKey = parts.length > 1 ? parts.slice(1).join('.') : key;

    // Try to find plural forms
    const localeResources = this.resources[this.locale];
    const value = localeResources?.[namespace]?.[actualKey];

    let translation: string;
    if (typeof value === 'object' && value !== null) {
      // Select plural form based on count
      if (count === 0 && value.zero) {
        translation = value.zero;
      } else if (count === 1) {
        translation = value.one;
      } else if (count === 2 && value.two) {
        translation = value.two;
      } else {
        translation = value.other;
      }
    } else {
      translation = key;
    }

    // Interpolate parameters
    let result = translation;
    const allParams = { ...params, count };
    Object.entries(allParams).forEach(([paramKey, paramValue]) => {
      result = result.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue));
      result = result.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
    });

    this.log('TRANSLATE_PLURAL', { key, count, params, result });
    return result;
  }

  hasTranslation(key: string): boolean {
    const parts = key.split('.');
    const namespace = parts.length > 1 ? parts[0] : 'common';
    const actualKey = parts.length > 1 ? parts.slice(1).join('.') : key;

    const localeResources = this.resources[this.locale];
    const hasKey = !!localeResources?.[namespace]?.[actualKey];

    this.log('HAS_TRANSLATION', { key, hasKey });
    return hasKey;
  }

  // ============================================
  // LOCALE MANAGEMENT
  // ============================================

  getLocale(): string {
    return this.locale;
  }

  getLanguage(): string {
    return this.locale.split('-')[0];
  }

  getLocaleConfig(): LocaleConfig {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    const language = this.getLanguage();

    return {
      locale: this.locale,
      language,
      region: this.locale.split('-')[1],
      isRTL: rtlLanguages.includes(language),
      fallbacks: ['en'],
    };
  }

  async setLocale(locale: string): Promise<void> {
    const previousLocale = this.locale;
    this.locale = locale;
    this.log('SET_LOCALE', { from: previousLocale, to: locale });
  }

  getSupportedLocales(): string[] {
    return this.supportedLocales;
  }

  // ============================================
  // FORMATTING
  // ============================================

  formatDate(date: Date, options?: DateFormatOptions): string {
    const formatted = new Intl.DateTimeFormat(this.locale, {
      dateStyle: options?.dateStyle,
      timeStyle: options?.timeStyle,
      timeZone: options?.timeZone,
    }).format(date);

    this.log('FORMAT_DATE', { date: date.toISOString(), options, result: formatted });
    return formatted;
  }

  formatRelativeTime(date: Date, baseDate: Date = new Date()): string {
    const diffMs = date.getTime() - baseDate.getTime();
    const diffSeconds = Math.round(diffMs / 1000);
    const diffMinutes = Math.round(diffSeconds / 60);
    const diffHours = Math.round(diffMinutes / 60);
    const diffDays = Math.round(diffHours / 24);

    let formatted: string;
    const rtf = new Intl.RelativeTimeFormat(this.locale, { numeric: 'auto' });

    if (Math.abs(diffDays) >= 1) {
      formatted = rtf.format(diffDays, 'day');
    } else if (Math.abs(diffHours) >= 1) {
      formatted = rtf.format(diffHours, 'hour');
    } else if (Math.abs(diffMinutes) >= 1) {
      formatted = rtf.format(diffMinutes, 'minute');
    } else {
      formatted = rtf.format(diffSeconds, 'second');
    }

    this.log('FORMAT_RELATIVE_TIME', { date: date.toISOString(), result: formatted });
    return formatted;
  }

  formatNumber(value: number, options?: NumberFormatOptions): string {
    const formatted = new Intl.NumberFormat(this.locale, {
      style: options?.style,
      currency: options?.currency,
      currencyDisplay: options?.currencyDisplay,
      unit: options?.unit,
      minimumFractionDigits: options?.minimumFractionDigits,
      maximumFractionDigits: options?.maximumFractionDigits,
      useGrouping: options?.useGrouping,
    }).format(value);

    this.log('FORMAT_NUMBER', { value, options, result: formatted });
    return formatted;
  }

  formatCurrency(value: number, currency: string): string {
    const formatted = new Intl.NumberFormat(this.locale, {
      style: 'currency',
      currency,
    }).format(value);

    this.log('FORMAT_CURRENCY', { value, currency, result: formatted });
    return formatted;
  }

  formatPercent(value: number): string {
    const formatted = new Intl.NumberFormat(this.locale, {
      style: 'percent',
    }).format(value);

    this.log('FORMAT_PERCENT', { value, result: formatted });
    return formatted;
  }

  // ============================================
  // ACCESSIBILITY
  // ============================================

  async getAccessibilitySettings(): Promise<AccessibilitySettings> {
    const settings: AccessibilitySettings = {
      screenReaderEnabled: false,
      reduceMotionEnabled: false,
      boldTextEnabled: false,
      grayscaleEnabled: false,
      invertColorsEnabled: false,
      fontScale: 1,
    };

    this.log('GET_ACCESSIBILITY_SETTINGS', settings as unknown as Record<string, unknown>);
    return settings;
  }

  announceForAccessibility(message: string, priority: AnnouncementPriority = 'polite'): void {
    this.log('ANNOUNCE', { message, priority });
  }

  async isScreenReaderEnabled(): Promise<boolean> {
    this.log('IS_SCREEN_READER_ENABLED', { result: false });
    return false;
  }
}
