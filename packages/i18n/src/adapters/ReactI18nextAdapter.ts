/**
 * React-i18next Adapter
 *
 * Production adapter using react-i18next library.
 * Requires: npm install i18next react-i18next
 */

import { AccessibilityInfo } from 'react-native';
import type {
  I18nAdapter,
  TranslationParams,
  LocaleConfig,
  DateFormatOptions,
  NumberFormatOptions,
  AccessibilitySettings,
  AnnouncementPriority,
} from '../types';

export interface ReactI18nextAdapterOptions {
  /** i18next instance (required) */
  i18n: unknown;
  /** Supported locales */
  supportedLocales?: string[];
}

export class ReactI18nextAdapter implements I18nAdapter {
  readonly name = 'react-i18next';

  private i18n: {
    t: (key: string, options?: Record<string, unknown>) => string;
    exists: (key: string) => boolean;
    language: string;
    languages: string[];
    changeLanguage: (lng: string) => Promise<unknown>;
    init: (options?: unknown) => Promise<unknown>;
    isInitialized: boolean;
  };
  private supportedLocales: string[];

  constructor(options: ReactI18nextAdapterOptions) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.i18n = options.i18n as any;
    this.supportedLocales = options.supportedLocales ?? ['en'];
  }

  async initialize(): Promise<void> {
    // i18next should be initialized before passing to adapter
    if (!this.i18n.isInitialized) {
      await this.i18n.init();
    }
  }

  // ============================================
  // TRANSLATION
  // ============================================

  translate(key: string, params?: TranslationParams): string {
    return this.i18n.t(key, params as Record<string, unknown>);
  }

  translatePlural(key: string, count: number, params?: TranslationParams): string {
    return this.i18n.t(key, { count, ...params } as Record<string, unknown>);
  }

  hasTranslation(key: string): boolean {
    return this.i18n.exists(key);
  }

  // ============================================
  // LOCALE MANAGEMENT
  // ============================================

  getLocale(): string {
    return this.i18n.language;
  }

  getLanguage(): string {
    return this.i18n.language.split('-')[0];
  }

  getLocaleConfig(): LocaleConfig {
    const locale = this.i18n.language;
    const language = this.getLanguage();
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];

    return {
      locale,
      language,
      region: locale.split('-')[1],
      isRTL: rtlLanguages.includes(language),
      fallbacks: this.i18n.languages.slice(1),
    };
  }

  async setLocale(locale: string): Promise<void> {
    await this.i18n.changeLanguage(locale);
  }

  getSupportedLocales(): string[] {
    return this.supportedLocales;
  }

  // ============================================
  // FORMATTING
  // ============================================

  formatDate(date: Date, options?: DateFormatOptions): string {
    return new Intl.DateTimeFormat(this.getLocale(), {
      dateStyle: options?.dateStyle,
      timeStyle: options?.timeStyle,
      timeZone: options?.timeZone,
    }).format(date);
  }

  formatRelativeTime(date: Date, baseDate: Date = new Date()): string {
    const diffMs = date.getTime() - baseDate.getTime();
    const diffSeconds = Math.round(diffMs / 1000);
    const diffMinutes = Math.round(diffSeconds / 60);
    const diffHours = Math.round(diffMinutes / 60);
    const diffDays = Math.round(diffHours / 24);

    const rtf = new Intl.RelativeTimeFormat(this.getLocale(), { numeric: 'auto' });

    if (Math.abs(diffDays) >= 1) {
      return rtf.format(diffDays, 'day');
    } else if (Math.abs(diffHours) >= 1) {
      return rtf.format(diffHours, 'hour');
    } else if (Math.abs(diffMinutes) >= 1) {
      return rtf.format(diffMinutes, 'minute');
    } else {
      return rtf.format(diffSeconds, 'second');
    }
  }

  formatNumber(value: number, options?: NumberFormatOptions): string {
    return new Intl.NumberFormat(this.getLocale(), {
      style: options?.style,
      currency: options?.currency,
      currencyDisplay: options?.currencyDisplay,
      unit: options?.unit,
      minimumFractionDigits: options?.minimumFractionDigits,
      maximumFractionDigits: options?.maximumFractionDigits,
      useGrouping: options?.useGrouping,
    }).format(value);
  }

  formatCurrency(value: number, currency: string): string {
    return new Intl.NumberFormat(this.getLocale(), {
      style: 'currency',
      currency,
    }).format(value);
  }

  formatPercent(value: number): string {
    return new Intl.NumberFormat(this.getLocale(), {
      style: 'percent',
    }).format(value);
  }

  // ============================================
  // ACCESSIBILITY
  // ============================================

  async getAccessibilitySettings(): Promise<AccessibilitySettings> {
    const [
      screenReaderEnabled,
      reduceMotionEnabled,
      boldTextEnabled,
      grayscaleEnabled,
      invertColorsEnabled,
    ] = await Promise.all([
      AccessibilityInfo.isScreenReaderEnabled(),
      AccessibilityInfo.isReduceMotionEnabled(),
      AccessibilityInfo.isBoldTextEnabled(),
      AccessibilityInfo.isGrayscaleEnabled(),
      AccessibilityInfo.isInvertColorsEnabled(),
    ]);

    return {
      screenReaderEnabled,
      reduceMotionEnabled,
      boldTextEnabled,
      grayscaleEnabled,
      invertColorsEnabled,
      fontScale: 1, // Would need PixelRatio for accurate value
    };
  }

  announceForAccessibility(message: string, _priority?: AnnouncementPriority): void {
    AccessibilityInfo.announceForAccessibility(message);
  }

  async isScreenReaderEnabled(): Promise<boolean> {
    return AccessibilityInfo.isScreenReaderEnabled();
  }
}
