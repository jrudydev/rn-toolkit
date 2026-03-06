# @astacinco/rn-theming

Scope-based theming system for React Native with dark/light mode support.

## Features

- **ThemeProvider** with scope support
- **useTheme()** hook for components
- **Dark/Light mode** detection and manual override
- **Theme tokens**: colors, spacing, typography, shadows
- **Scope-based theming** (different themes for different UI sections)

## Installation

```bash
yarn add @astacinco/rn-theming
```

## Quick Start

```tsx
import { ThemeProvider, useTheme } from '@astacinco/rn-theming';

// Wrap your app
function App() {
  return (
    <ThemeProvider mode="auto">
      <MyScreen />
    </ThemeProvider>
  );
}

// Use in components
function MyScreen() {
  const { colors, spacing, mode } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background, padding: spacing.md }}>
      <Text style={{ color: colors.text }}>
        Current mode: {mode}
      </Text>
    </View>
  );
}
```

## API

### ThemeProvider

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'light' \| 'dark' \| 'auto'` | `'auto'` | Theme mode |
| `theme` | `ThemeTokens` | `defaultTheme` | Custom theme tokens |
| `scope` | `string` | `'global'` | Theme scope identifier |

### useTheme()

Returns the current theme context:

```typescript
interface ThemeContext {
  mode: 'light' | 'dark';
  colors: ColorTokens;
  spacing: SpacingTokens;
  typography: TypographyTokens;
  shadows: ShadowTokens;
  setMode: (mode: 'light' | 'dark' | 'auto') => void;
}
```

### Theme Tokens

```typescript
interface ColorTokens {
  // Backgrounds
  background: string;
  backgroundSecondary: string;
  surface: string;

  // Text
  text: string;
  textSecondary: string;
  textMuted: string;

  // Brand
  primary: string;
  primaryLight: string;
  primaryDark: string;

  // Semantic
  success: string;
  error: string;
  warning: string;
  info: string;

  // Borders
  border: string;
  borderLight: string;
}

interface SpacingTokens {
  xs: number;  // 4
  sm: number;  // 8
  md: number;  // 16
  lg: number;  // 24
  xl: number;  // 32
  xxl: number; // 48
}
```

## Scoped Themes

Use different themes for different parts of your app:

```tsx
<ThemeProvider scope="global" mode="light">
  <MainApp />

  {/* Modal has its own dark theme */}
  <ThemeProvider scope="modal" mode="dark">
    <Modal />
  </ThemeProvider>
</ThemeProvider>
```

## Testing

The package exports test utilities:

```tsx
import { TestThemeProvider } from '@astacinco/rn-theming/testing';

// Render component in both themes
renderWithThemes(<MyComponent />);
```
