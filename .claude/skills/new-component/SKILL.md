---
name: new-component
description: Scaffold a new themed UI component with tests and SDUI registration.
allowed-tools: Bash, Read, Write, Glob
---

# 🧩 New Component Generator

Creates a new themed UI component in `@astacinco/rn-primitives` with:
- Component file with theme integration
- TypeScript types
- Unit tests with theme snapshots
- SDUI registration (optional)

## Usage

```
/new-component <ComponentName>
```

Example: `/new-component Accordion`

---

## ⚠️ CRITICAL RULES

### 1. Fully Themable
- ALL colors must come from `useTheme()` → `colors.*`
- ALL spacing must come from `useTheme()` → `spacing.*`
- NO hardcoded color values (`#fff`, `rgb(...)`, etc.)
- NO hardcoded spacing values (`16`, `24`, etc.)

### 2. Composed of Packaged Primitives ONLY
- ✅ Use `Text`, `Button`, `Card`, `VStack`, `HStack`, `Container`, etc.
- ❌ NO raw React Native components (`View`, `Text`, `Pressable`)
- **Exception:** Only use raw RN if absolutely necessary AND discussed first

```tsx
// ✅ CORRECT
import { Text, Card, VStack, HStack, Button } from '@astacinco/rn-primitives';

function NewComponent() {
  return (
    <Card variant="elevated">
      <VStack spacing="md">
        <Text variant="title">Title</Text>
        <Button label="Action" onPress={handlePress} />
      </VStack>
    </Card>
  );
}

// ❌ WRONG - uses raw React Native
import { View, Text, TouchableOpacity } from 'react-native';

function NewComponent() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Title</Text>
    </View>
  );
}
```

### 3. StyleSheet for Layout ONLY
Use `StyleSheet` only for:
- `flex`, `flexDirection`, `alignItems`, `justifyContent`
- `position`, `top`, `left`, `right`, `bottom`
- `width`, `height`, `minWidth`, `maxWidth` (percentage or flex-based)
- `borderRadius` (using theme values when possible)

```tsx
// ✅ Layout-only styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

// ❌ Theme values in StyleSheet
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',     // ❌ Should be colors.surface
    padding: 16,                  // ❌ Should be spacing.md
    color: '#333',                // ❌ Should be colors.text
  },
});
```

---

## Files Created

```
packages/primitives/src/<ComponentName>/
├── <ComponentName>.tsx      # Main component
├── types.ts                 # TypeScript types
└── index.ts                 # Exports

packages/primitives/__tests__/
└── <ComponentName>.test.tsx # Tests with theme snapshots
```

## Component Template

```typescript
// packages/primitives/src/<ComponentName>/<ComponentName>.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@astacinco/rn-theming';
import { Card, VStack, Text } from '../';  // Import from sibling primitives
import type { <ComponentName>Props } from './types';

export function <ComponentName>({
  children,
  variant = 'default',
  testID,
  ...props
}: <ComponentName>Props) {
  const { colors, spacing } = useTheme();

  return (
    <Card
      testID={testID}
      variant={variant === 'outlined' ? 'outlined' : 'elevated'}
      {...props}
    >
      <VStack spacing="md">
        {children}
      </VStack>
    </Card>
  );
}
```

## Types Template

```typescript
// packages/primitives/src/<ComponentName>/types.ts
import type { ViewStyle, StyleProp } from 'react-native';

export type <ComponentName>Variant = 'default' | 'outlined' | 'filled';

export interface <ComponentName>Props {
  /**
   * Child content
   */
  children?: React.ReactNode;

  /**
   * Visual variant of the component
   * @default 'default'
   */
  variant?: <ComponentName>Variant;

  /**
   * Custom container style (layout only)
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
```

## Test Template

```typescript
// packages/primitives/__tests__/<ComponentName>.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '@astacinco/rn-theming';
import { <ComponentName> } from '../src/<ComponentName>';
import { Text } from '../src/Text';

const renderWithTheme = (component: React.ReactElement, mode: 'light' | 'dark' = 'light') => {
  return render(
    <ThemeProvider mode={mode}>
      {component}
    </ThemeProvider>
  );
};

describe('<ComponentName>', () => {
  it('renders correctly in light mode', () => {
    const { getByTestId } = renderWithTheme(
      <<ComponentName> testID="component">
        <Text>Content</Text>
      </<ComponentName>>
    );

    expect(getByTestId('component')).toBeTruthy();
  });

  it('renders correctly in dark mode', () => {
    const { getByTestId } = renderWithTheme(
      <<ComponentName> testID="component">
        <Text>Content</Text>
      </<ComponentName>>,
      'dark'
    );

    expect(getByTestId('component')).toBeTruthy();
  });

  it('matches light theme snapshot', () => {
    const { toJSON } = renderWithTheme(
      <<ComponentName>>
        <Text>Content</Text>
      </<ComponentName>>
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('matches dark theme snapshot', () => {
    const { toJSON } = renderWithTheme(
      <<ComponentName>>
        <Text>Content</Text>
      </<ComponentName>>,
      'dark'
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
```

## Index Export Template

```typescript
// packages/primitives/src/<ComponentName>/index.ts
export { <ComponentName> } from './<ComponentName>';
export type { <ComponentName>Props, <ComponentName>Variant } from './types';
```

## Don't Forget

After creating the component, add export to `packages/primitives/src/index.ts`:

```typescript
// Add to index.ts
export { <ComponentName> } from './<ComponentName>';
export type { <ComponentName>Props, <ComponentName>Variant } from './<ComponentName>';
```

## SDUI Registration (if @astacinco/rn-sdui exists)

Add to `packages/sdui/src/ComponentRegistry.ts`:

```typescript
import { <ComponentName> } from '@astacinco/rn-primitives';

registry.register('<componentName>', <ComponentName>);
```

---

## Checklist

After creating the component:

- [ ] **Themable:** Uses `useTheme()` for ALL colors and spacing
- [ ] **Composed:** Built with packaged primitives only (no raw RN)
- [ ] **Types:** Properly exported with JSDoc comments
- [ ] **Tests:** Cover light and dark modes
- [ ] **Snapshots:** Generated for both themes
- [ ] **Exported:** Added to primitives index.ts
- [ ] **SDUI:** (Optional) Registered in SDUI ComponentRegistry
