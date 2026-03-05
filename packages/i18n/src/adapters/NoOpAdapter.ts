/**
 * NoOp I18n Adapter
 *
 * A silent adapter that returns keys as-is.
 * Useful for testing or when no i18n is needed.
 */

import type {
  I18nAdapter,
  TranslationParams,
  LocaleConfig,
  DateFormatOptions,
  NumberFormatOptions,
  AccessibilitySettings,
  AnnouncementPriority,
} from '../types';

export class NoOpAdapter implements I18nAdapter {
  readonly name = 'noop';

  private locale = 'en';
  private supportedLocales = ['en'];

  async initialize(): Promise<void> {
    // No-op
  }

  // ============================================
  // TRANSLATION
  // ============================================

  translate(key: string, params?: TranslationParams): string {
    if (!params) return key;

    // Simple parameter interpolation for testing
    let result = key;
    Object.entries(params).forEach(([paramKey, value]) => {
      result = result.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(value));
      result = result.replace(new RegExp(`{${paramKey}}`, 'g'), String(value));
    });
    return result;
  }

  translatePlural(key: string, count: number, params?: TranslationParams): string {
    return this.translate(key, { ...params, count });
  }

  hasTranslation(_key: string): boolean {
    return false; // NoOp always returns false
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
    return {
      locale: this.locale,
      language: this.getLanguage(),
      region: this.locale.split('-')[1],
      isRTL: false,
      fallbacks: ['en'],
    };
  }

  async setLocale(locale: string): Promise<void> {
    this.locale = locale;
  }

  getSupportedLocales(): string[] {
    return this.supportedLocales;
  }

  // ============================================
  // FORMATTING
  // ============================================

  formatDate(date: Date, _options?: DateFormatOptions): string {
    return date.toISOString();
  }

  formatRelativeTime(date: Date, baseDate: Date = new Date()): string {
    const diffMs = date.getTime() - baseDate.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'tomorrow';
    if (diffDays === -1) return 'yesterday';
    if (diffDays > 0) return `in ${diffDays} days`;
    return `${Math.abs(diffDays)} days ago`;
  }

  formatNumber(value: number, _options?: NumberFormatOptions): string {
    return String(value);
  }

  formatCurrency(value: number, currency: string): string {
    return `${currency} ${value.toFixed(2)}`;
  }

  formatPercent(value: number): string {
    return `${(value * 100).toFixed(0)}%`;
  }

  // ============================================
  // ACCESSIBILITY
  // ============================================

  async getAccessibilitySettings(): Promise<AccessibilitySettings> {
    return {
      screenReaderEnabled: false,
      reduceMotionEnabled: false,
      boldTextEnabled: false,
      grayscaleEnabled: false,
      invertColorsEnabled: false,
      fontScale: 1,
    };
  }

  announceForAccessibility(_message: string, _priority?: AnnouncementPriority): void {
    // No-op
  }

  async isScreenReaderEnabled(): Promise<boolean> {
    return false;
  }
}
