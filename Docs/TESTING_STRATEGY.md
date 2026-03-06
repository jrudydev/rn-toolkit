# Testing Strategy

## Overview

Testing in this toolkit follows two approaches:
1. **Traditional Testing** (FREE) - Standard Jest + React Native Testing Library
2. **DSL Testing** (PAID) - Declarative, fluent API for readable tests

Both approaches support automatic theme variant testing (light + dark mode).

---

## Test Types

| Type | Location | Speed | Use Case |
|------|----------|-------|----------|
| Unit | `__tests__/*.test.ts` | Fast | Pure logic, hooks, utilities |
| Component | `__tests__/*.test.tsx` | Medium | Component rendering, props |
| Snapshot | `__tests__/__snapshots__/` | Fast | Visual regression |
| Integration | `__tests__/*.integration.test.tsx` | Slower | Multi-component flows |

---

## Traditional Testing (FREE)

### Basic Utilities

```typescript
import {
  renderWithTheme,
  renderWithProviders,
  createThemeSnapshot,
  mockNavigation,
} from '@astacinco/rn-testing';
```

### renderWithTheme

Renders a component wrapped in ThemeProvider:

```typescript
import { renderWithTheme } from '@astacinco/rn-testing';

it('renders with theme', () => {
  const { getByText } = renderWithTheme(
    <Button>Click me</Button>,
    { mode: 'dark' } // optional, defaults to 'light'
  );

  expect(getByText('Click me')).toBeTruthy();
});
```

### renderWithProviders

Renders with all providers (theme, navigation, etc.):

```typescript
import { renderWithProviders } from '@astacinco/rn-testing';

it('renders with all providers', () => {
  const { getByTestId } = renderWithProviders(
    <ProfileScreen />,
    {
      theme: { mode: 'dark' },
      navigation: { initialRoute: 'profile' },
    }
  );
});
```

### createThemeSnapshot

Generates snapshots for both light and dark modes:

```typescript
import { createThemeSnapshot } from '@astacinco/rn-testing';

describe('ProfileCard', () => {
  it('matches theme snapshots', () => {
    createThemeSnapshot(<ProfileCard user={mockUser} />);
    // Creates:
    // - __snapshots__/ProfileCard.light.snap
    // - __snapshots__/ProfileCard.dark.snap
  });
});
```

### Mocks

```typescript
import { mockNavigation, mockSDUISchema } from '@astacinco/rn-testing';

// Mock navigation
const navigation = mockNavigation();
navigation.navigate('profile', { id: '123' });
expect(navigation.currentRoute).toBe('profile');

// Mock SDUI schema
const schema = mockSDUISchema({
  type: 'screen',
  children: [{ type: 'text', props: { content: 'Hello' } }],
});
```

---

## DSL Testing (PAID)

The DSL provides a fluent, declarative API for more readable tests.

### Screen-Level Assertions

```typescript
import { dsl } from '@astacinco/rn-testing/dsl';

describe('ProfileScreen', () => {
  it('displays user information', () => {
    dsl.screen('Profile')
      .withProps({ userId: '123' })
      .renders()
      .hasComponent('Avatar')
      .hasComponent('Text', { variant: 'title' })
      .hasComponent('Button', { label: 'Edit Profile' })
      .matchesSnapshot();
  });
});
```

### Component-Level Assertions

```typescript
import { dsl } from '@astacinco/rn-testing/dsl';

describe('Button', () => {
  it('handles press state', () => {
    dsl.component('Button')
      .withProps({ label: 'Submit' })
      .renders()
      .when({ pressed: true })
      .hasStyle({ opacity: 0.8 })
      .when({ pressed: false })
      .hasStyle({ opacity: 1 });
  });

  it('renders variants correctly', () => {
    dsl.component('Button')
      .withProps({ variant: 'primary' })
      .hasStyle({ backgroundColor: 'colors.primary' })
      .withProps({ variant: 'secondary' })
      .hasStyle({ backgroundColor: 'colors.secondary' });
  });
});
```

### Theme Variant Testing

```typescript
import { dsl } from '@astacinco/rn-testing/dsl';

describe('Card', () => {
  it('adapts to theme', () => {
    dsl.component('Card')
      .inTheme('light')
      .hasStyle({ backgroundColor: '#FFFFFF' })
      .inTheme('dark')
      .hasStyle({ backgroundColor: '#1A1A1A' })
      .snapshotBothThemes();
  });
});
```

### Chaining Actions

```typescript
dsl.screen('LoginScreen')
  .renders()
  .findComponent('Input', { testID: 'email' })
  .type('user@example.com')
  .findComponent('Input', { testID: 'password' })
  .type('password123')
  .findComponent('Button', { label: 'Login' })
  .press()
  .expectNavigation('home');
```

---

## Naming Convention

Follow the pattern: `MethodName_Condition_ExpectedResult`

```typescript
describe('useTheme', () => {
  it('returns_darkColors_whenModeIsDark', () => { ... });
  it('returns_lightColors_whenModeIsLight', () => { ... });
  it('throws_error_whenOutsideProvider', () => { ... });
});

describe('Button', () => {
  it('renders_primaryVariant_whenVariantIsPrimary', () => { ... });
  it('calls_onPress_whenPressed', () => { ... });
  it('shows_disabled_whenDisabledIsTrue', () => { ... });
});
```

---

## Theme Testing Requirement

**Every visual component MUST have theme variant tests.**

### Minimum Coverage

```typescript
describe('ComponentName', () => {
  // Required: Both theme snapshots
  it('matches light theme snapshot', () => {
    const { toJSON } = renderWithTheme(<Component />, { mode: 'light' });
    expect(toJSON()).toMatchSnapshot();
  });

  it('matches dark theme snapshot', () => {
    const { toJSON } = renderWithTheme(<Component />, { mode: 'dark' });
    expect(toJSON()).toMatchSnapshot();
  });

  // OR use the helper
  it('matches theme snapshots', () => {
    createThemeSnapshot(<Component />);
  });
});
```

---

## Directory Structure

```
packages/
├── theming/
│   └── __tests__/
│       ├── ThemeProvider.test.tsx
│       ├── useTheme.test.tsx
│       └── __snapshots__/
├── primitives/
│   └── __tests__/
│       ├── Button.test.tsx
│       ├── Card.test.tsx
│       └── __snapshots__/
│           ├── Button.light.snap
│           └── Button.dark.snap
└── testing/
    ├── src/                    # FREE
    │   ├── renderWithTheme.ts
    │   ├── renderWithProviders.ts
    │   ├── createThemeSnapshot.ts
    │   ├── mocks/
    │   │   ├── mockNavigation.ts
    │   │   └── mockSDUISchema.ts
    │   └── index.ts
    └── src/dsl/               # PAID
        ├── screen.ts
        ├── component.ts
        ├── matchers.ts
        └── index.ts
```

---

## CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm test -- --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## Best Practices

1. **Test behavior, not implementation** - Focus on what the component does, not how
2. **Use meaningful test IDs** - `testID="profile-avatar"` not `testID="img1"`
3. **Keep tests focused** - One assertion concept per test
4. **Update snapshots intentionally** - Review changes before committing
5. **Mock external dependencies** - Navigation, API calls, etc.
6. **Test edge cases** - Empty states, loading, errors
