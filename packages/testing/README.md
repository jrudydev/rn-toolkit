# @rn-toolkit/testing

Testing utilities for React Native with automatic theme support.

## Installation

```bash
npm install @rn-toolkit/testing --save-dev
```

## Features

- `renderWithTheme()` - Render components with ThemeProvider
- `renderWithProviders()` - Render with all providers (theme, navigation, etc.)
- `createThemeSnapshot()` - Snapshot both light and dark modes automatically
- Mock utilities for navigation and SDUI

## Quick Start

```typescript
import { renderWithTheme, createThemeSnapshot } from '@rn-toolkit/testing';
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
import { mockNavigation } from '@rn-toolkit/testing';

const { navigate, back, currentRoute } = mockNavigation();

// Simulate navigation
navigate('/profile/123');
expect(currentRoute()).toBe('/profile/123');

back();
expect(currentRoute()).toBe('/home');
```

### mockSDUISchema

```typescript
import { mockSDUISchema } from '@rn-toolkit/testing';

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
