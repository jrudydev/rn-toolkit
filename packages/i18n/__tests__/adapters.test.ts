/**
 * I18n Adapters Tests
 */

import { NoOpAdapter } from '../src/adapters/NoOpAdapter';
import { ConsoleAdapter } from '../src/adapters/ConsoleAdapter';

describe('NoOpAdapter', () => {
  let adapter: NoOpAdapter;

  beforeEach(() => {
    adapter = new NoOpAdapter();
  });

  it('has_correct_name', () => {
    expect(adapter.name).toBe('noop');
  });

  it('initialize_resolvesWithoutError', async () => {
    await expect(adapter.initialize()).resolves.toBeUndefined();
  });

  // Translation tests
  describe('translation', () => {
    it('translate_returnsKey_withoutParams', () => {
      expect(adapter.translate('common.hello')).toBe('common.hello');
    });

    it('translate_interpolatesParams', () => {
      expect(adapter.translate('Hello {{name}}', { name: 'World' })).toBe('Hello World');
    });

    it('translate_interpolates_braceParams', () => {
      expect(adapter.translate('Hello {name}', { name: 'World' })).toBe('Hello World');
    });

    it('translatePlural_includesCount', () => {
      expect(adapter.translatePlural('items', 5)).toBe('items');
    });

    it('hasTranslation_returnsFalse', () => {
      expect(adapter.hasTranslation('any.key')).toBe(false);
    });
  });

  // Locale tests
  describe('locale', () => {
    it('getLocale_returnsDefault', () => {
      expect(adapter.getLocale()).toBe('en');
    });

    it('getLanguage_returnsLanguageCode', () => {
      expect(adapter.getLanguage()).toBe('en');
    });

    it('setLocale_changesLocale', async () => {
      await adapter.setLocale('es-ES');
      expect(adapter.getLocale()).toBe('es-ES');
      expect(adapter.getLanguage()).toBe('es');
    });

    it('getLocaleConfig_returnsConfig', () => {
      const config = adapter.getLocaleConfig();
      expect(config.locale).toBe('en');
      expect(config.language).toBe('en');
      expect(config.isRTL).toBe(false);
    });

    it('getSupportedLocales_returnsArray', () => {
      expect(adapter.getSupportedLocales()).toEqual(['en']);
    });
  });

  // Formatting tests
  describe('formatting', () => {
    it('formatDate_returnsISOString', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      expect(adapter.formatDate(date)).toBe('2024-01-15T12:00:00.000Z');
    });

    it('formatRelativeTime_returnsToday', () => {
      const now = new Date();
      expect(adapter.formatRelativeTime(now)).toBe('today');
    });

    it('formatRelativeTime_returnsYesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(adapter.formatRelativeTime(yesterday)).toBe('yesterday');
    });

    it('formatRelativeTime_returnsTomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(adapter.formatRelativeTime(tomorrow)).toBe('tomorrow');
    });

    it('formatRelativeTime_returnsDaysAgo', () => {
      const past = new Date();
      past.setDate(past.getDate() - 5);
      expect(adapter.formatRelativeTime(past)).toBe('5 days ago');
    });

    it('formatNumber_returnsStringValue', () => {
      expect(adapter.formatNumber(1234.56)).toBe('1234.56');
    });

    it('formatCurrency_returnsCurrencyString', () => {
      expect(adapter.formatCurrency(99.99, 'USD')).toBe('USD 99.99');
    });

    it('formatPercent_returnsPercentString', () => {
      expect(adapter.formatPercent(0.75)).toBe('75%');
    });
  });

  // Accessibility tests
  describe('accessibility', () => {
    it('getAccessibilitySettings_returnsDefaults', async () => {
      const settings = await adapter.getAccessibilitySettings();
      expect(settings.screenReaderEnabled).toBe(false);
      expect(settings.reduceMotionEnabled).toBe(false);
      expect(settings.fontScale).toBe(1);
    });

    it('isScreenReaderEnabled_returnsFalse', async () => {
      expect(await adapter.isScreenReaderEnabled()).toBe(false);
    });

    it('announceForAccessibility_doesNotThrow', () => {
      expect(() => adapter.announceForAccessibility('Test message')).not.toThrow();
    });
  });
});

describe('ConsoleAdapter', () => {
  let adapter: ConsoleAdapter;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    adapter = new ConsoleAdapter({
      prefix: '[Test]',
      timestamps: false,
      defaultLocale: 'en-US',
      resources: {
        'en-US': {
          common: {
            hello: 'Hello',
            welcome: 'Welcome, {{name}}!',
            items: {
              one: '1 item',
              other: '{{count}} items',
            },
          },
        },
      },
      supportedLocales: ['en-US', 'es-ES'],
    });
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('has_correct_name', () => {
    expect(adapter.name).toBe('console');
  });

  it('initialize_logsToConsole', async () => {
    await adapter.initialize();
    expect(consoleSpy).toHaveBeenCalledWith('[Test] INIT:', expect.objectContaining({
      adapter: 'console',
      locale: 'en-US',
    }));
  });

  // Translation tests
  describe('translation', () => {
    it('translate_returnsTranslation', () => {
      const result = adapter.translate('common.hello');
      expect(result).toBe('Hello');
      expect(consoleSpy).toHaveBeenCalledWith('[Test] TRANSLATE:', expect.objectContaining({
        key: 'common.hello',
        result: 'Hello',
      }));
    });

    it('translate_interpolatesParams', () => {
      const result = adapter.translate('common.welcome', { name: 'John' });
      expect(result).toBe('Welcome, John!');
    });

    it('translate_fallsBackToKey_whenMissing', () => {
      const result = adapter.translate('missing.key');
      expect(result).toBe('missing.key');
    });

    it('translatePlural_returnsCorrectForm_forOne', () => {
      const result = adapter.translatePlural('common.items', 1);
      expect(result).toBe('1 item');
    });

    it('translatePlural_returnsCorrectForm_forMany', () => {
      const result = adapter.translatePlural('common.items', 5);
      expect(result).toBe('5 items');
    });

    it('hasTranslation_returnsTrue_whenExists', () => {
      expect(adapter.hasTranslation('common.hello')).toBe(true);
    });

    it('hasTranslation_returnsFalse_whenMissing', () => {
      expect(adapter.hasTranslation('missing.key')).toBe(false);
    });
  });

  // Locale tests
  describe('locale', () => {
    it('getLocale_returnsCurrentLocale', () => {
      expect(adapter.getLocale()).toBe('en-US');
    });

    it('getLanguage_returnsLanguageCode', () => {
      expect(adapter.getLanguage()).toBe('en');
    });

    it('setLocale_changesAndLogs', async () => {
      await adapter.setLocale('es-ES');
      expect(adapter.getLocale()).toBe('es-ES');
      expect(consoleSpy).toHaveBeenCalledWith('[Test] SET_LOCALE:', {
        from: 'en-US',
        to: 'es-ES',
      });
    });

    it('getLocaleConfig_returnsRTL_forArabic', async () => {
      await adapter.setLocale('ar-SA');
      const config = adapter.getLocaleConfig();
      expect(config.isRTL).toBe(true);
    });

    it('getSupportedLocales_returnsConfiguredLocales', () => {
      expect(adapter.getSupportedLocales()).toEqual(['en-US', 'es-ES']);
    });
  });

  // Formatting tests
  describe('formatting', () => {
    it('formatDate_logsAndReturns', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      const result = adapter.formatDate(date, { dateStyle: 'full' });
      expect(typeof result).toBe('string');
      expect(consoleSpy).toHaveBeenCalledWith('[Test] FORMAT_DATE:', expect.objectContaining({
        date: date.toISOString(),
      }));
    });

    it('formatRelativeTime_logsAndReturns', () => {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      const result = adapter.formatRelativeTime(date);
      expect(result).toContain('yesterday');
    });

    it('formatNumber_logsAndReturns', () => {
      const result = adapter.formatNumber(1234.56, { minimumFractionDigits: 2 });
      expect(typeof result).toBe('string');
      expect(consoleSpy).toHaveBeenCalledWith('[Test] FORMAT_NUMBER:', expect.objectContaining({
        value: 1234.56,
      }));
    });

    it('formatCurrency_logsAndReturns', () => {
      const result = adapter.formatCurrency(99.99, 'USD');
      expect(result).toContain('99.99');
      expect(consoleSpy).toHaveBeenCalledWith('[Test] FORMAT_CURRENCY:', expect.objectContaining({
        value: 99.99,
        currency: 'USD',
      }));
    });

    it('formatPercent_logsAndReturns', () => {
      const result = adapter.formatPercent(0.75);
      expect(result).toContain('75');
      expect(consoleSpy).toHaveBeenCalledWith('[Test] FORMAT_PERCENT:', expect.objectContaining({
        value: 0.75,
      }));
    });
  });

  // Accessibility tests
  describe('accessibility', () => {
    it('announceForAccessibility_logs', () => {
      adapter.announceForAccessibility('Test announcement', 'assertive');
      expect(consoleSpy).toHaveBeenCalledWith('[Test] ANNOUNCE:', {
        message: 'Test announcement',
        priority: 'assertive',
      });
    });
  });

  // Timestamp option test
  describe('timestamps', () => {
    it('includesTimestamp_whenEnabled', async () => {
      const adapterWithTimestamps = new ConsoleAdapter({ timestamps: true });
      await adapterWithTimestamps.initialize();

      const callArgs = consoleSpy.mock.calls[0][0];
      expect(callArgs).toMatch(/\d{4}-\d{2}-\d{2}T/);
    });
  });
});
