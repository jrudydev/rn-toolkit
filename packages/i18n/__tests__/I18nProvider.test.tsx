/**
 * I18nProvider Tests
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { I18nProvider } from '../src/I18nProvider';
import { useTranslation } from '../src/hooks/useTranslation';
import { useLocale } from '../src/hooks/useLocale';
import { NoOpAdapter } from '../src/adapters/NoOpAdapter';
import { ConsoleAdapter } from '../src/adapters/ConsoleAdapter';
import type { I18nAdapter, I18nConfig } from '../src/types';

interface WrapperProps {
  children: React.ReactNode;
}

function createWrapper(adapter: I18nAdapter, config?: I18nConfig) {
  return function Wrapper({ children }: WrapperProps) {
    return (
      <I18nProvider adapter={adapter} config={config}>
        {children}
      </I18nProvider>
    );
  };
}

describe('I18nProvider', () => {
  it('initializes_adapter_onMount', async () => {
    const adapter = new NoOpAdapter();
    const initSpy = jest.spyOn(adapter, 'initialize');

    renderHook(() => useTranslation(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(initSpy).toHaveBeenCalledTimes(1);
    });
  });

  it('provides_isInitialized_state', async () => {
    const adapter = new NoOpAdapter();

    const { result } = renderHook(() => useTranslation(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });
  });

  it('provides_locale_info', async () => {
    const adapter = new NoOpAdapter();

    const { result } = renderHook(() => useLocale(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(result.current.locale).toBe('en');
      expect(result.current.language).toBe('en');
      expect(result.current.isRTL).toBe(false);
    });
  });

  it('setLocale_updatesContext', async () => {
    const adapter = new NoOpAdapter();

    const { result } = renderHook(() => useLocale(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(result.current.locale).toBe('en');
    });

    await act(async () => {
      await result.current.setLocale('es-ES');
    });

    expect(result.current.locale).toBe('es-ES');
  });
});

describe('I18nProvider with ConsoleAdapter', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('translates_keys_withResources', async () => {
    const adapter = new ConsoleAdapter({
      defaultLocale: 'en',
      resources: {
        en: {
          common: {
            hello: 'Hello World',
            welcome: 'Welcome, {{name}}!',
          },
        },
      },
    });

    const { result } = renderHook(() => useTranslation(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    expect(result.current.t('common.hello')).toBe('Hello World');
    expect(result.current.t('common.welcome', { name: 'John' })).toBe('Welcome, John!');
  });

  it('translatePlural_works', async () => {
    const adapter = new ConsoleAdapter({
      defaultLocale: 'en',
      resources: {
        en: {
          common: {
            items: {
              one: '1 item',
              other: '{{count}} items',
            },
          },
        },
      },
    });

    const { result } = renderHook(() => useTranslation(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    expect(result.current.tp('common.items', 1)).toBe('1 item');
    expect(result.current.tp('common.items', 5)).toBe('5 items');
  });

  it('hasKey_checksTranslationExists', async () => {
    const adapter = new ConsoleAdapter({
      defaultLocale: 'en',
      resources: {
        en: {
          common: {
            exists: 'I exist',
          },
        },
      },
    });

    const { result } = renderHook(() => useTranslation(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    expect(result.current.hasKey('common.exists')).toBe(true);
    expect(result.current.hasKey('common.missing')).toBe(false);
  });

  it('keyPrefix_prependsToKeys', async () => {
    const adapter = new ConsoleAdapter({
      defaultLocale: 'en',
      resources: {
        en: {
          profile: {
            title: 'Profile',
            subtitle: 'Your profile page',
          },
        },
      },
    });

    const { result } = renderHook(
      () => useTranslation({ keyPrefix: 'profile' }),
      { wrapper: createWrapper(adapter) }
    );

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    expect(result.current.t('title')).toBe('Profile');
    expect(result.current.t('subtitle')).toBe('Your profile page');
  });

  it('defaultParams_mergesWithParams', async () => {
    const adapter = new ConsoleAdapter({
      defaultLocale: 'en',
      resources: {
        en: {
          common: {
            greeting: 'Hello {{name}} from {{app}}',
          },
        },
      },
    });

    const { result } = renderHook(
      () => useTranslation({ defaultParams: { app: 'MyApp' } }),
      { wrapper: createWrapper(adapter) }
    );

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    expect(result.current.t('common.greeting', { name: 'John' })).toBe('Hello John from MyApp');
  });
});

describe('useLocale formatting', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('formatDate_formatsCorrectly', async () => {
    const adapter = new ConsoleAdapter({ defaultLocale: 'en-US' });

    const { result } = renderHook(() => useLocale(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(result.current.locale).toBe('en-US');
    });

    const date = new Date('2024-01-15T12:00:00Z');
    const formatted = result.current.formatDate(date, { dateStyle: 'short' });
    expect(typeof formatted).toBe('string');
  });

  it('formatNumber_formatsCorrectly', async () => {
    const adapter = new ConsoleAdapter({ defaultLocale: 'en-US' });

    const { result } = renderHook(() => useLocale(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(result.current.locale).toBe('en-US');
    });

    const formatted = result.current.formatNumber(1234.56);
    expect(formatted).toContain('1');
  });

  it('formatCurrency_formatsCorrectly', async () => {
    const adapter = new ConsoleAdapter({ defaultLocale: 'en-US' });

    const { result } = renderHook(() => useLocale(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(result.current.locale).toBe('en-US');
    });

    const formatted = result.current.formatCurrency(99.99, 'USD');
    expect(formatted).toContain('99.99');
  });

  it('formatPercent_formatsCorrectly', async () => {
    const adapter = new ConsoleAdapter({ defaultLocale: 'en-US' });

    const { result } = renderHook(() => useLocale(), {
      wrapper: createWrapper(adapter),
    });

    await waitFor(() => {
      expect(result.current.locale).toBe('en-US');
    });

    const formatted = result.current.formatPercent(0.75);
    expect(formatted).toContain('75');
  });

  it('getSupportedLocales_returnsArray', async () => {
    const adapter = new ConsoleAdapter({
      supportedLocales: ['en-US', 'es-ES', 'fr-FR'],
    });

    const { result } = renderHook(() => useLocale(), {
      wrapper: createWrapper(adapter),
    });

    expect(result.current.supportedLocales).toEqual(['en-US', 'es-ES', 'fr-FR']);
  });
});

describe('I18nProvider config options', () => {
  let consoleSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    warnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it('debug_logsInitialization', async () => {
    const adapter = new ConsoleAdapter();

    renderHook(() => useTranslation(), {
      wrapper: createWrapper(adapter, { debug: true }),
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[I18n] Initialized')
      );
    });
  });

  it('logMissingTranslations_warnsOnMissing', async () => {
    const adapter = new ConsoleAdapter({ defaultLocale: 'en', resources: {} });

    const { result } = renderHook(() => useTranslation(), {
      wrapper: createWrapper(adapter, { logMissingTranslations: true }),
    });

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    result.current.t('missing.key');

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Missing translation')
    );
  });

  it('onMissingTranslation_callsCustomHandler', async () => {
    const adapter = new ConsoleAdapter({ defaultLocale: 'en', resources: {} });
    const handler = jest.fn().mockReturnValue('Custom fallback');

    const { result } = renderHook(() => useTranslation(), {
      wrapper: createWrapper(adapter, {
        logMissingTranslations: true,
        onMissingTranslation: handler,
      }),
    });

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    const translation = result.current.t('missing.key');

    expect(handler).toHaveBeenCalledWith('missing.key', 'en');
    expect(translation).toBe('Custom fallback');
  });

  it('defaultLocale_setsInitialLocale', async () => {
    const adapter = new ConsoleAdapter();

    const { result } = renderHook(() => useLocale(), {
      wrapper: createWrapper(adapter, { defaultLocale: 'es-ES' }),
    });

    await waitFor(() => {
      expect(result.current.locale).toBe('es-ES');
    });
  });
});
