# Free Packages Manual Testing Checklist

Use this checklist when manually testing the free packages before public release.

---

## Pre-Flight Checks

- [ ] `npm install` completes without errors
- [ ] `npm test` passes (500+ tests)
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes

---

## Package 1: @rn-toolkit/theming

### ThemeProvider
- [ ] App renders with ThemeProvider wrapper
- [ ] `mode="auto"` detects system preference
- [ ] `mode="light"` forces light mode
- [ ] `mode="dark"` forces dark mode

### useTheme Hook
- [ ] `colors` object is accessible
- [ ] `spacing` object is accessible
- [ ] `mode` returns current theme ('light' | 'dark')
- [ ] `setMode()` changes theme dynamically

### Color Tokens (verify in both themes)
| Token | Light | Dark | Check |
|-------|-------|------|-------|
| `background` | Light bg | Dark bg | [ ] |
| `surface` | White-ish | Dark gray | [ ] |
| `surfaceElevated` | Elevated | Elevated dark | [ ] |
| `text` | Dark text | Light text | [ ] |
| `textSecondary` | Muted | Muted light | [ ] |
| `primary` | Blue | Blue (lighter) | [ ] |
| `error` | Red | Red | [ ] |
| `success` | Green | Green | [ ] |
| `warning` | Yellow/Orange | Yellow | [ ] |
| `border` | Light border | Dark border | [ ] |

### Spacing Tokens
- [ ] `xs` (4px) renders correctly
- [ ] `sm` (8px) renders correctly
- [ ] `md` (16px) renders correctly
- [ ] `lg` (24px) renders correctly
- [ ] `xl` (32px) renders correctly
- [ ] `xxl` (48px) renders correctly

### Edge Cases
- [ ] Hot reload preserves theme state
- [ ] Theme toggle is instant (no flash)
- [ ] Nested ThemeProviders work (scoped theming)

---

## Package 2: @rn-toolkit/primitives

### Text Component
- [ ] `variant="title"` renders large bold text
- [ ] `variant="subtitle"` renders medium text
- [ ] `variant="body"` renders normal text
- [ ] `variant="caption"` renders small muted text
- [ ] `variant="label"` renders label text
- [ ] Custom color prop works
- [ ] Respects theme colors automatically

### Button Component
- [ ] `variant="primary"` - filled primary color
- [ ] `variant="secondary"` - filled secondary color
- [ ] `variant="outline"` - bordered, transparent bg
- [ ] `variant="ghost"` - no border, transparent bg
- [ ] `size="sm"` - small padding
- [ ] `size="md"` - medium padding (default)
- [ ] `size="lg"` - large padding
- [ ] `disabled` state shows muted appearance
- [ ] `onPress` fires correctly
- [ ] Loading state works (if implemented)

### Card Component
- [ ] `variant="filled"` - solid background
- [ ] `variant="outlined"` - border only
- [ ] `variant="elevated"` - shadow effect
- [ ] Children render inside card
- [ ] Padding is appropriate
- [ ] Respects theme colors

### Stack Components
- [ ] `VStack` arranges children vertically
- [ ] `HStack` arranges children horizontally
- [ ] `spacing="sm"` applies gap
- [ ] `spacing="md"` applies gap
- [ ] `spacing="lg"` applies gap
- [ ] `align="center"` centers children
- [ ] `align="flex-start"` aligns left/top
- [ ] `align="flex-end"` aligns right/bottom

### Input Component
- [ ] Renders with placeholder
- [ ] `label` prop shows label above
- [ ] `error` prop shows error message below
- [ ] Focus state changes border color
- [ ] Value changes propagate via `onChangeText`
- [ ] `secureTextEntry` works for passwords
- [ ] Disabled state is visible

### Container Component
- [ ] `padding` prop adds internal spacing
- [ ] `maxWidth` constrains width
- [ ] `centered` centers content
- [ ] Respects theme background

### Divider Component
- [ ] Renders horizontal line
- [ ] `variant="thin"` is 1px
- [ ] `variant="thick"` is thicker
- [ ] Respects theme border color

### Edge Cases
- [ ] All components work in both themes
- [ ] Components compose together correctly
- [ ] No visual glitches on theme toggle

---

## Package 3: @rn-toolkit/testing (FREE parts)

### renderWithTheme
```typescript
// Verify this works in a test file:
import { renderWithTheme } from '@rn-toolkit/testing';

const { getByText } = renderWithTheme(<Text>Hello</Text>, 'light');
expect(getByText('Hello')).toBeTruthy();
```
- [ ] Renders component in light mode
- [ ] Renders component in dark mode
- [ ] Returns all testing-library utilities

### createThemeSnapshot
```typescript
// Verify this creates two snapshots:
createThemeSnapshot(<Button label="Test" />);
// Should create: "matches light theme snapshot" and "matches dark theme snapshot"
```
- [ ] Creates light mode snapshot
- [ ] Creates dark mode snapshot
- [ ] Snapshots differ between themes

### Mock Utilities
- [ ] `mockNavigation()` returns navigation helpers
- [ ] `mockSDUISchema()` creates valid schema
- [ ] Mock functions can be spied on

---

## Package 4: @rn-toolkit/i18n

### I18nProvider
- [ ] App renders with I18nProvider
- [ ] Adapter prop accepts NoOpAdapter
- [ ] Adapter prop accepts ConsoleAdapter

### useTranslation Hook
- [ ] `t('key')` returns translated string
- [ ] Fallback to key if translation missing
- [ ] Interpolation works: `t('hello', { name: 'World' })`
- [ ] Pluralization works: `t('items', { count: 5 })`

### useLocale Hook
- [ ] `locale` returns current locale
- [ ] `setLocale()` changes language
- [ ] `supportedLocales` lists available locales

### useAccessibility Hook
- [ ] `announce()` triggers screen reader
- [ ] `isScreenReaderEnabled` returns boolean
- [ ] `preferredFontScale` returns scale factor

### Date/Time/Number Formatting
- [ ] `formatDate()` respects locale
- [ ] `formatTime()` respects locale
- [ ] `formatNumber()` respects locale
- [ ] `formatCurrency()` respects locale

### Adapters
- [ ] NoOpAdapter returns keys as-is
- [ ] ConsoleAdapter logs calls to console

---

## Package 5: @rn-toolkit/performance

### PerformanceProvider
- [ ] App renders with PerformanceProvider
- [ ] Adapter prop accepts NoOpAdapter
- [ ] Adapter prop accepts ConsoleAdapter

### usePerformance Hook
- [ ] `startTrace()` starts a trace
- [ ] `stopTrace()` stops a trace
- [ ] `setMetric()` records custom metric
- [ ] `incrementMetric()` increments metric

### useLeakDetector Hook
- [ ] Returns `trackSubscription` function
- [ ] Returns `trackEventListener` function
- [ ] Warns in console when leaks detected (dev mode)

### Memory Monitoring
- [ ] `getMemoryUsage()` returns stats (if available)
- [ ] Memory warnings appear in dev mode

### Adapters
- [ ] NoOpAdapter does nothing (for tests)
- [ ] ConsoleAdapter logs to console

---

## Integration Tests

### All Packages Together
- [ ] App runs with all providers nested
- [ ] No provider order issues
- [ ] Theme changes propagate to all components
- [ ] No memory leaks on navigation

### Example Provider Stack
```tsx
<PerformanceProvider adapter={perfAdapter}>
  <I18nProvider adapter={i18nAdapter}>
    <ThemeProvider mode="auto">
      <App />
    </ThemeProvider>
  </I18nProvider>
</PerformanceProvider>
```

---

## Platform-Specific

### Web
- [ ] All components render in browser
- [ ] Theme toggle works
- [ ] No console errors

### iOS (Simulator or Device)
- [ ] All components render
- [ ] Theme follows system setting
- [ ] Safe areas respected

### Android (Emulator or Device)
- [ ] All components render
- [ ] Theme follows system setting
- [ ] Status bar colors correct

---

## Sign-Off

| Tester | Date | Platform | Result |
|--------|------|----------|--------|
| | | Web | |
| | | iOS | |
| | | Android | |

**Notes:**
_Record any issues found during testing here._

---

## Pre-Release Checklist

After manual testing passes:

- [ ] Update version numbers in package.json files
- [ ] Update CHANGELOG.md for each package
- [ ] Run full test suite one more time
- [ ] Build packages (`npm run build`)
- [ ] Create git tag for release
- [ ] Publish to npm (or prepare for publish)
