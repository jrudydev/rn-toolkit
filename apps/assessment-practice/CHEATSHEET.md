# React Native Toolkit Cheatsheet

Quick reference for all `@astacinco` packages. Copy-paste ready.

---

## 1. Setup (App.tsx root)

```tsx
import { ThemeProvider } from '@astacinco/rn-theming';
import { I18nProvider, ConsoleAdapter } from '@astacinco/rn-i18n';
import { PerformanceProvider, ConsoleAdapter as PerfAdapter } from '@astacinco/rn-performance';

// Create adapters
const i18nAdapter = new ConsoleAdapter({
  defaultLocale: 'en',
  supportedLocales: ['en', 'es'],
  resources: { en: { /* translations */ } }
});
const perfAdapter = new PerfAdapter();

// Wrap app
<ThemeProvider mode="auto">
  <I18nProvider adapter={i18nAdapter}>
    <PerformanceProvider adapter={perfAdapter}>
      <App />
    </PerformanceProvider>
  </I18nProvider>
</ThemeProvider>
```

---

## 2. @astacinco/rn-primitives

### Imports
```tsx
import {
  Text,
  Button,
  Card,
  VStack,
  HStack,
  Container,
  Input,
  Divider,
  Switch,
  Avatar,
  Badge
} from '@astacinco/rn-primitives';
```

### Text
```tsx
<Text variant="title">Title</Text>
<Text variant="subtitle">Subtitle</Text>
<Text variant="body">Body text</Text>
<Text variant="caption">Caption</Text>
<Text variant="label">Label</Text>

// Props
variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'label'
color?: string  // override theme color
```

### Button
```tsx
<Button
  label="Click Me"
  onPress={() => {}}
  variant="primary"
  size="md"
  disabled={false}
  loading={false}
/>

// Variants: 'primary' | 'secondary' | 'outline' | 'ghost'
// Sizes: 'sm' | 'md' | 'lg'
```

### Card
```tsx
<Card variant="elevated" padding={16}>
  <Text>Card content</Text>
</Card>

// Variants: 'filled' | 'outlined' | 'elevated'
// padding?: number (default: spacing.md)
```

### Stacks (VStack / HStack)
```tsx
<VStack spacing="md" align="center">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</VStack>

<HStack spacing="sm" justify="space-between">
  <Button label="Left" onPress={() => {}} />
  <Button label="Right" onPress={() => {}} />
</HStack>

// spacing: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
// align: 'start' | 'center' | 'end' | 'stretch'
// justify: 'start' | 'center' | 'end' | 'space-between' | 'space-around'
```

### Container
```tsx
<Container padding={16} centered>
  <Text>Centered content</Text>
</Container>
```

### Input
```tsx
<Input
  value={text}
  onChangeText={setText}
  placeholder="Enter text"
  label="Field Label"
  error="Error message"
/>
```

### Divider
```tsx
<Divider variant="thin" />
<Divider variant="thick" />
```

### Switch
```tsx
<Switch
  value={isEnabled}
  onValueChange={setIsEnabled}
  size="md"
  label="Enable feature"
  labelPosition="right"
/>

// Sizes: 'sm' | 'md' | 'lg'
// labelPosition: 'left' | 'right'
// activeColor?: string (override theme)
// inactiveColor?: string (override theme)
```

### Avatar
```tsx
// With image
<Avatar
  source={{ uri: 'https://example.com/photo.jpg' }}
  size="md"
/>

// With fallback initials
<Avatar
  fallback="John Doe"
  size="lg"
/>

// Sizes: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
// rounded?: boolean (default: true)
// borderWidth?: number
// customSize?: number (override size prop)
```

### Badge
```tsx
// Count badge on avatar
<Badge count={5} position="top-right">
  <Avatar source={...} />
</Badge>

// Dot badge
<Badge dot variant="error">
  <Icon name="bell" />
</Badge>

// Standalone badge
<Badge count={99} maxCount={99} standalone />

// Variants: 'default' | 'primary' | 'error' | 'success' | 'warning'
// Positions: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
// Sizes: 'sm' | 'md' | 'lg'
// showZero?: boolean (show badge when count is 0)
// offset?: [x, y] (fine-tune position)
```

---

## 3. @astacinco/rn-theming

### Imports
```tsx
import { ThemeProvider, useTheme } from '@astacinco/rn-theming';
```

### Provider
```tsx
<ThemeProvider mode="auto">  {/* 'light' | 'dark' | 'auto' */}
  <App />
</ThemeProvider>
```

### useTheme Hook
```tsx
const { mode, colors, spacing, setMode } = useTheme();

// Toggle theme
<Button
  label={mode === 'light' ? 'Dark Mode' : 'Light Mode'}
  onPress={() => setMode(mode === 'light' ? 'dark' : 'light')}
/>

// Use colors
<View style={{ backgroundColor: colors.background }}>
  <Text style={{ color: colors.text }}>Themed text</Text>
</View>
```

### Color Tokens
```tsx
colors.background      // Main background
colors.surface         // Card/surface background
colors.surfaceElevated // Elevated surfaces
colors.text            // Primary text
colors.textSecondary   // Secondary text
colors.textMuted       // Muted/disabled text
colors.primary         // Brand primary
colors.secondary       // Brand secondary
colors.success         // Success state
colors.error           // Error state
colors.warning         // Warning state
colors.border          // Border color
```

### Spacing Tokens
```tsx
spacing.xs   // 4
spacing.sm   // 8
spacing.md   // 12
spacing.lg   // 16
spacing.xl   // 24
spacing.xxl  // 32
```

---

## 4. @astacinco/rn-i18n

### Imports
```tsx
import {
  I18nProvider,
  ConsoleAdapter,
  useTranslation,
  useLocale
} from '@astacinco/rn-i18n';
```

### Setup Adapter
```tsx
const adapter = new ConsoleAdapter({
  defaultLocale: 'en',
  supportedLocales: ['en', 'es'],
  resources: {
    en: {
      common: {
        welcome: 'Welcome, {{name}}!',
        items: { one: '1 item', other: '{{count}} items' },
      }
    },
    es: {
      common: {
        welcome: '¡Bienvenido, {{name}}!',
        items: { one: '1 artículo', other: '{{count}} artículos' },
      }
    }
  }
});
```

### useTranslation Hook
```tsx
const { t, tp } = useTranslation();

// Simple translation
<Text>{t('common.welcome', { name: 'John' })}</Text>
// Output: "Welcome, John!"

// Pluralization
<Text>{tp('common.items', count)}</Text>
// count=1: "1 item"
// count=5: "5 items"
```

### useLocale Hook
```tsx
const { locale, setLocale, formatCurrency, formatNumber, formatDate } = useLocale();

// Change language
<Button label="Español" onPress={() => setLocale('es')} />

// Format currency
<Text>{formatCurrency(99.99, 'USD')}</Text>  // "$99.99"

// Format number
<Text>{formatNumber(1234567)}</Text>  // "1,234,567"

// Format date
<Text>{formatDate(new Date())}</Text>
```

---

## 5. @astacinco/rn-performance

### Imports
```tsx
import {
  PerformanceProvider,
  ConsoleAdapter,
  usePerformance,
  useDebounce,
  useDebouncedCallback
} from '@astacinco/rn-performance';
```

### useDebounce (for values)
```tsx
const [searchText, setSearchText] = useState('');
const debouncedSearch = useDebounce(searchText, 300);

// Filter based on debounced value
const filtered = items.filter(item =>
  item.title.includes(debouncedSearch)
);

// Input updates immediately, filter waits 300ms
<Input value={searchText} onChangeText={setSearchText} />
```

### useDebouncedCallback (for functions)
```tsx
const { call: debouncedSave } = useDebouncedCallback(
  (value: string) => saveToServer(value),
  { delay: 500 }
);

<Input onChangeText={debouncedSave} />
```

### usePerformance
```tsx
const { measure, startTrace } = usePerformance();

// Measure async operation
const result = await measure('api_call', async () => {
  return fetch('/api/data');
});

// Manual trace
const trace = await startTrace('user_flow');
// ... do work
trace.stop();
```

---

## Common Patterns

### Themed Screen Layout
```tsx
function MyScreen() {
  const { colors, spacing } = useTheme();

  return (
    <Container style={{ backgroundColor: colors.background }}>
      <VStack spacing="md">
        <Text variant="title">Screen Title</Text>
        <Card variant="elevated">
          <Text>Content</Text>
        </Card>
      </VStack>
    </Container>
  );
}
```

### Search with Debounce
```tsx
function SearchableList() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const { t, tp } = useTranslation();

  const filtered = items.filter(item =>
    item.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <VStack spacing="md">
      <Input
        value={search}
        onChangeText={setSearch}
        placeholder={t('common.search')}
      />
      <Text variant="caption">
        {tp('common.results', filtered.length)}
      </Text>
      {filtered.map(item => (
        <Card key={item.id}>
          <Text>{item.title}</Text>
        </Card>
      ))}
    </VStack>
  );
}
```

### Theme Toggle
```tsx
function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <Button
      label={mode === 'light' ? '🌙 Dark' : '☀️ Light'}
      variant="outline"
      onPress={() => setMode(mode === 'light' ? 'dark' : 'light')}
    />
  );
}
```

---

## Native Mobile Dev Notes

| React Native | iOS (Swift) | Android (Kotlin) |
|--------------|-------------|------------------|
| `useState` | `@State` | `mutableStateOf` |
| `useEffect` | `onAppear/onChange` | `LaunchedEffect` |
| `VStack` | `VStack` | `Column` |
| `HStack` | `HStack` | `Row` |
| `ScrollView` | `ScrollView` | `LazyColumn` |
| `FlatList` | `List` | `LazyColumn` |
| `Pressable` | `Button` | `Clickable` |

---

## Quick Troubleshooting

**Theme not applying?**
- Ensure component is inside `<ThemeProvider>`
- Check you're using `useTheme()` hook

**Translations not working?**
- Check adapter has the translation key
- Verify locale is set correctly
- Check key path: `t('namespace.key')`

**Debounce not firing?**
- Make sure delay > 0
- Check component isn't unmounting

**TypeScript errors?**
- Import types: `import type { ButtonVariant } from '@astacinco/rn-primitives'`
