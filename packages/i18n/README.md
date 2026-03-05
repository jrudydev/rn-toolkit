# @rn-toolkit/i18n

Internationalization with **adapter pattern** for React Native - swap i18n providers without code changes.

## Features

- **Adapter Pattern** - Swap i18n providers (react-i18next, react-intl, etc.) without changing app code
- **Built-in Adapters** - ReactI18next, Console (debug), NoOp (testing)
- **Translation** - Key-based translation with interpolation and pluralization
- **Formatting** - Date, number, currency, and percentage formatting
- **RTL Support** - Automatic RTL detection for Arabic, Hebrew, etc.
- **Accessibility** - Screen reader announcements and a11y settings
- **TypeScript** - Full type safety with comprehensive interfaces

## Installation

```bash
npm install @rn-toolkit/i18n
```

### For react-i18next (recommended for production)

```bash
npm install i18next react-i18next
```

## Quick Start

### 1. Choose your adapter

```tsx
import {
  I18nProvider,
  ReactI18nextAdapter,
  ConsoleAdapter,
  NoOpAdapter,
} from '@rn-toolkit/i18n';

// Production: react-i18next
const adapter = new ReactI18nextAdapter({ i18n: i18nextInstance });

// Development: Console logging
const adapter = new ConsoleAdapter({
  defaultLocale: 'en',
  resources: translations,
});

// Testing: No-op (silent)
const adapter = new NoOpAdapter();
```

### 2. Wrap your app

```tsx
function App() {
  const adapter = new ConsoleAdapter({
    defaultLocale: 'en-US',
    resources: {
      'en-US': {
        common: {
          welcome: 'Welcome, {{name}}!',
          items: { one: '1 item', other: '{{count}} items' },
        },
      },
      'es-ES': {
        common: {
          welcome: '¡Bienvenido, {{name}}!',
          items: { one: '1 artículo', other: '{{count}} artículos' },
        },
      },
    },
    supportedLocales: ['en-US', 'es-ES'],
  });

  return (
    <I18nProvider adapter={adapter} config={{ debug: __DEV__ }}>
      <MyApp />
    </I18nProvider>
  );
}
```

### 3. Use in components

```tsx
import { useTranslation, useLocale, useAccessibility } from '@rn-toolkit/i18n';

function HomeScreen() {
  // Translation
  const { t, tp } = useTranslation();

  // Locale & formatting
  const { locale, isRTL, formatCurrency, setLocale } = useLocale();

  // Accessibility
  const { announce, isScreenReaderEnabled } = useAccessibility();

  return (
    <View style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <Text>{t('common.welcome', { name: 'John' })}</Text>
      <Text>{tp('common.items', 5)}</Text>
      <Text>{formatCurrency(99.99, 'USD')}</Text>

      <Button
        title="Switch to Spanish"
        onPress={() => setLocale('es-ES')}
      />
    </View>
  );
}
```

## API Reference

### I18nProvider

Provider component that wraps your app with i18n context.

```tsx
<I18nProvider
  adapter={adapter}        // Required: I18n adapter
  config={{
    defaultLocale: 'en',   // Default locale
    fallbackLocale: 'en',  // Fallback when translation missing
    debug: false,          // Enable debug logging
    logMissingTranslations: false,  // Warn on missing keys
    onMissingTranslation: (key, locale) => string, // Custom handler
  }}
>
  {children}
</I18nProvider>
```

### Built-in Adapters

#### ConsoleAdapter (Development)

```typescript
import { ConsoleAdapter } from '@rn-toolkit/i18n';

const adapter = new ConsoleAdapter({
  prefix: '[I18n]',        // Log prefix
  timestamps: true,        // Include timestamps
  defaultLocale: 'en',     // Initial locale
  resources: {             // Translation resources
    en: {
      common: {
        hello: 'Hello',
        greeting: 'Hello, {{name}}!',
        items: { one: '1 item', other: '{{count}} items' },
      },
    },
  },
  supportedLocales: ['en', 'es', 'fr'],
});
```

#### NoOpAdapter (Testing)

```typescript
import { NoOpAdapter } from '@rn-toolkit/i18n';

const adapter = new NoOpAdapter();
// Returns keys as-is, useful for testing
```

#### ReactI18nextAdapter (Production)

```typescript
import { ReactI18nextAdapter } from '@rn-toolkit/i18n';
import i18n from './i18n'; // Your i18next instance

const adapter = new ReactI18nextAdapter({
  i18n,
  supportedLocales: ['en', 'es', 'fr'],
});
```

### Creating Custom Adapters

Implement the `I18nAdapter` interface:

```typescript
import type { I18nAdapter } from '@rn-toolkit/i18n';

class MyCustomAdapter implements I18nAdapter {
  readonly name = 'custom';

  async initialize() {
    // Initialize your i18n library
  }

  translate(key: string, params?: TranslationParams): string {
    // Return translated string
  }

  translatePlural(key: string, count: number, params?: TranslationParams): string {
    // Return plural-aware translation
  }

  // ... implement all other methods
}
```

### Hooks

#### useTranslation

Main hook for translations.

```typescript
const {
  t,          // Translate key: t('common.hello')
  tp,         // Translate plural: tp('items', 5)
  hasKey,     // Check key exists: hasKey('common.hello')
  locale,     // Current locale
  language,   // Current language code
  isReady,    // Provider initialized
} = useTranslation({
  keyPrefix: 'profile',           // Optional: prefix all keys
  defaultParams: { app: 'MyApp' }, // Optional: default params
});

// With prefix
const { t } = useTranslation({ keyPrefix: 'profile' });
t('title');  // Translates 'profile.title'
```

#### useLocale

Locale management and formatting.

```typescript
const {
  locale,            // Current locale (e.g., 'en-US')
  language,          // Language code (e.g., 'en')
  isRTL,             // Is right-to-left
  supportedLocales,  // Available locales
  setLocale,         // Change locale
  formatDate,        // Format date
  formatRelativeTime, // Format relative time
  formatNumber,      // Format number
  formatCurrency,    // Format currency
  formatPercent,     // Format percentage
} = useLocale();
```

#### useAccessibility

Accessibility features.

```typescript
const {
  isScreenReaderEnabled,  // Screen reader active
  isReduceMotionEnabled,  // Reduce motion preference
  isBoldTextEnabled,      // Bold text preference
  fontScale,              // Font scale multiplier
  announce,               // Announce to screen reader
  settings,               // Full settings object
} = useAccessibility();

// Announce action completion
announce('Item added to cart', 'polite');
```

## Formatting Examples

### Dates

```typescript
const { formatDate, formatRelativeTime } = useLocale();

// Date styles
formatDate(new Date(), { dateStyle: 'full' });    // "Monday, January 15, 2024"
formatDate(new Date(), { dateStyle: 'short' });   // "1/15/24"
formatDate(new Date(), { timeStyle: 'short' });   // "3:30 PM"

// Relative time
formatRelativeTime(yesterday);  // "yesterday"
formatRelativeTime(lastWeek);   // "7 days ago"
```

### Numbers & Currency

```typescript
const { formatNumber, formatCurrency, formatPercent } = useLocale();

formatNumber(1234.56);                    // "1,234.56"
formatNumber(1234.56, { style: 'decimal', minimumFractionDigits: 2 });

formatCurrency(99.99, 'USD');             // "$99.99"
formatCurrency(99.99, 'EUR');             // "€99.99"

formatPercent(0.75);                      // "75%"
```

## RTL Support

```tsx
function RTLAwareComponent() {
  const { isRTL } = useLocale();

  return (
    <View style={{
      flexDirection: isRTL ? 'row-reverse' : 'row',
      textAlign: isRTL ? 'right' : 'left',
    }}>
      <Text>This text respects RTL</Text>
    </View>
  );
}
```

## Pluralization

```tsx
const { tp } = useTranslation();

// In your resources:
// items: { one: '1 item', other: '{{count}} items' }

tp('items', 0);   // "0 items"
tp('items', 1);   // "1 item"
tp('items', 5);   // "5 items"
```

## Adapter Pattern Benefits

The adapter pattern allows you to:

1. **Swap providers easily** - Change from react-i18next to react-intl with one line
2. **Test without real i18n** - Use `NoOpAdapter` or `ConsoleAdapter`
3. **Debug translations** - Use `ConsoleAdapter` to see all translations
4. **Create custom adapters** - Build adapters for any i18n service

```typescript
// Switch providers without changing any component code:

// Before (react-i18next)
<I18nProvider adapter={new ReactI18nextAdapter({ i18n })}>

// After (custom solution)
<I18nProvider adapter={new MyCustomAdapter()}>

// Your components don't change at all!
```

## TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  I18nAdapter,
  I18nConfig,
  TranslationParams,
  PluralForms,
  DateFormatOptions,
  NumberFormatOptions,
  AccessibilitySettings,
  LocaleConfig,
} from '@rn-toolkit/i18n';
```

## License

MIT
