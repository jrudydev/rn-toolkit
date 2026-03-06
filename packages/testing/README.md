# @astacinco/rn-testing

Testing utilities for React Native with automatic theme support.

## Installation

```bash
npm install @astacinco/rn-testing --save-dev
```

## Features

- `renderWithTheme()` - Render components with ThemeProvider
- `renderWithProviders()` - Render with all providers (theme, navigation, etc.)
- `createThemeSnapshot()` - Snapshot both light and dark modes automatically
- Mock utilities for navigation and SDUI

## Quick Start

```typescript
import { renderWithTheme, createThemeSnapshot } from '@astacinco/rn-testing';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders in light mode', () => {
    const { getByTestId } = renderWithTheme(<MyComponent />, 'light');
    expect(getByTestId('my-component')).toBeTruthy();
  });

  it('renders in dark mode', () => {
    const { getByTestId } = renderWithTheme(<MyComponent />, 'dark');
    expect(getByTestId('my-component')).toBeTruthy();
  });

  it('matches snapshots for both themes', () => {
    createThemeSnapshot(<MyComponent />);
  });
});
```

## API Reference

### renderWithTheme(component, mode?)

Renders a component wrapped in ThemeProvider.

```typescript
const { getByTestId, toJSON } = renderWithTheme(
  <Button label="Click me" />,
  'dark' // optional, defaults to 'light'
);
```

**Parameters:**
- `component` - React element to render
- `mode` - Theme mode: `'light'` | `'dark'` (default: `'light'`)

**Returns:** All utilities from `@testing-library/react-native`

### renderWithProviders(component, options?)

Renders with all providers configured.

```typescript
const result = renderWithProviders(<Screen />, {
  theme: 'dark',
  initialRoute: '/home',
});
```

**Options:**
- `theme` - Theme mode: `'light'` | `'dark'`
- `initialRoute` - Initial route for navigation testing

### createThemeSnapshot(component)

Creates snapshots for both light and dark themes.

```typescript
createThemeSnapshot(<Card title="Hello" />);
// Creates two snapshots:
// - "matches light theme snapshot"
// - "matches dark theme snapshot"
```

## Mocks

### mockNavigation

```typescript
import { mockNavigation } from '@astacinco/rn-testing';

const { navigate, back, currentRoute } = mockNavigation();

// Simulate navigation
navigate('/profile/123');
expect(currentRoute()).toBe('/profile/123');

back();
expect(currentRoute()).toBe('/home');
```

### mockSDUISchema

```typescript
import { mockSDUISchema } from '@astacinco/rn-testing';

const schema = mockSDUISchema({
  type: 'screen',
  children: [
    { type: 'text', props: { content: 'Hello' } },
  ],
});
```

## Best Practices

### Always Test Both Themes

```typescript
describe('ProfileCard', () => {
  it('renders correctly in light mode', () => {
    const { toJSON } = renderWithTheme(<ProfileCard />, 'light');
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders correctly in dark mode', () => {
    const { toJSON } = renderWithTheme(<ProfileCard />, 'dark');
    expect(toJSON()).toMatchSnapshot();
  });
});
```

### Or Use createThemeSnapshot

```typescript
describe('ProfileCard', () => {
  createThemeSnapshot(<ProfileCard user={mockUser} />);
});
```

### Naming Convention

Use descriptive test names:
```typescript
it('renders_title_whenUserProvided', () => { ... });
it('shows_placeholder_whenNoAvatar', () => { ... });
```

---

## DSL (Fluent Testing API) - PAID TIER

The DSL provides a fluent, chainable API for expressive test writing with significant boilerplate reduction.

### Entry Point

```typescript
import { dsl } from '@astacinco/rn-testing';

dsl.component(<Button />)    // Component testing
dsl.matrix(<Button />)       // Variant matrix testing
dsl.hook(() => useAuth())    // Hook testing
dsl.sdui(schema)             // SDUI testing
```

### Component Testing

```typescript
// Render with assertions
dsl.component(<Button label="Click" onPress={fn} />)
   .inTheme('dark')
   .render()
   .assert()
   .visible('button')
   .text('Click')
   .enabled('button')
   .done();

// Quick snapshot both themes
dsl.component(<Card><Text>Hello</Text></Card>)
   .snapshot('Card-basic');

// With props
dsl.component(<Button label="Test" onPress={fn} />)
   .withProps({ variant: 'primary', size: 'lg' })
   .inDarkMode()
   .render()
   .assert()
   .visible('button')
   .done();

// With additional providers
dsl.component(<ProtectedScreen />)
   .withProvider(AuthProvider, { user: mockUser })
   .render();
```

### Matrix Testing (All Combinations)

Generate multiple tests from variant combinations automatically:

```typescript
// Tests: 4 variants × 3 sizes × 2 themes = 24 snapshots!
dsl.matrix(<Button label="Test" onPress={fn} />)
   .withVariants('variant', ['primary', 'secondary', 'outline', 'ghost'])
   .withVariants('size', ['sm', 'md', 'lg'])
   .inThemes(['light', 'dark'])
   .snapshotAll();

// Filter specific combinations
dsl.matrix(<Card />)
   .withVariants('variant', ['elevated', 'outlined', 'filled'])
   .withVariants('padding', ['sm', 'md', 'lg'])
   .filter(({ variant, padding }) => {
     // Skip elevated with large padding
     return !(variant === 'elevated' && padding === 'lg');
   })
   .snapshotAll();

// Get combinations for custom testing
const combinations = dsl.matrix(<Button label="Test" onPress={fn} />)
   .withVariants('variant', ['primary', 'secondary'])
   .withVariants('disabled', [true, false])
   .getCombinations();

combinations.forEach(({ props, name }) => {
   it(name, () => { /* custom test logic */ });
});
```

### Hook Testing

```typescript
// Basic hook testing
const result = dsl.hook(() => useCounter())
   .withTheme('light')
   .render();

result.expectValue('count', 0)
      .expectFunction('increment', 'decrement');

// With providers
const authResult = await dsl.hook(() => useAuth())
   .withProvider(AuthProvider, { adapter: mockAdapter })
   .renderAndWait();

authResult.expectDefined('user', 'isLoading')
          .expectFunction('signIn', 'signOut');

// Wait for specific values
await dsl.hook(() => useAsync())
   .renderUntil('isLoading', false);

// Both themes
const { light, dark } = dsl.hook(() => useThemeAware())
   .renderBothThemes();
```

### SDUI Testing

```typescript
// Test existing schema
dsl.sdui(profileSchema)
   .withRenderer(SDUIRenderer)
   .withActionHandler(mockHandler)
   .render()
   .expectNodeCount('button', 2)
   .expectNodeCount('text', 5);

// Build schema programmatically
dsl.emptySDUI()
   .addNode(SDUIBuilder.text('Hello World', 'greeting'))
   .addNode(SDUIBuilder.button('Click Me', SDUIBuilder.navigate('/home')))
   .withRenderer(SDUIRenderer)
   .render();

// Static node builders
const textNode = SDUIBuilder.text('Welcome', 'welcome-text');
const buttonNode = SDUIBuilder.button('Submit', SDUIBuilder.api('/submit', 'POST'));
const cardNode = SDUIBuilder.card([textNode, buttonNode]);
const listNode = SDUIBuilder.list('users', SDUIBuilder.navigate('/user/:id'));
```

### Assertion Chain

All assertion methods are chainable:

```typescript
dsl.component(<Form />)
   .render()
   .assert()
   .visible('form')
   .visible('email-input')
   .visible('password-input')
   .text('Submit')
   .enabled('submit-button')
   .count('input', 2)
   .accessible('submit-button')
   .and  // alias for chaining
   .notVisible('error-message')
   .noText('Invalid')
   .done();
```

### Theme Assertions

```typescript
import { expectThemeDifference, expectColorDifference, expectAccessibility } from '@astacinco/rn-testing';

// Assert component looks different in each theme
expectThemeDifference(<Card title="Test" />);

// Assert specific color changes
expectColorDifference(<Button label="Click" />, 'backgroundColor', {
  light: '#FFFFFF',
  dark: '#1A1A1A',
});

// Check accessibility
expectAccessibility(<Button label="Submit" />, ['hasAccessibleLabel', 'hasRole']);
```

### Provider Presets

Create reusable provider configurations:

```typescript
import { createProviderConfig, combineProviders, createWrapperFromConfigs } from '@astacinco/rn-testing';

// Create preset
const authPreset = createProviderConfig(AuthProvider, {
  adapter: new NoOpAdapter(),
});

const analyticsPreset = createProviderConfig(AnalyticsProvider, {
  adapter: new ConsoleAdapter(),
});

// Combine presets
const allProviders = combineProviders(authPreset, analyticsPreset);

// Use with hooks
dsl.hook(() => useAuth())
   .withProviders(allProviders)
   .render();

// Or create wrapper for renderHook
const wrapper = createWrapperFromConfigs(allProviders);
const result = renderHook(() => useAuth(), { wrapper });
```

### Value Proposition

| Feature | Boilerplate Saved |
|---------|-------------------|
| Matrix Testing | 20+ tests from 3 lines |
| Theme Snapshots | Auto-generates both themes |
| Fluent Assertions | Readable, chainable checks |
| Provider Presets | No manual wrapper creation |
| SDUI Testing | First-class schema support |
