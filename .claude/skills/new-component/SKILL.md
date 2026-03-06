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

Example: `/new-component Avatar`

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
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@astacinco/rn-theming';
import type { <ComponentName>Props } from './types';

export function <ComponentName>({
  children,
  variant = 'default',
  style,
  testID,
  ...props
}: <ComponentName>Props) {
  const { colors, spacing } = useTheme();

  return (
    <View
      testID={testID}
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          padding: spacing.md,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
  },
});
```

## Types Template

```typescript
// packages/primitives/src/<ComponentName>/types.ts
import type { ViewProps } from 'react-native';

export type <ComponentName>Variant = 'default' | 'outlined' | 'filled';

export interface <ComponentName>Props extends ViewProps {
  /**
   * Visual variant of the component
   * @default 'default'
   */
  variant?: <ComponentName>Variant;

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
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '@astacinco/rn-theming';
import { <ComponentName> } from '../src/<ComponentName>';

const renderWithTheme = (component: React.ReactElement, mode: 'light' | 'dark' = 'light') => {
  return render(
    <ThemeProvider mode={mode}>
      {component}
    </ThemeProvider>
  );
};

describe('<ComponentName>', () => {
  it('renders_correctly_inLightMode', () => {
    const { getByTestId } = renderWithTheme(
      <<ComponentName> testID="component">
        <Text>Content</Text>
      </<ComponentName>>
    );

    expect(getByTestId('component')).toBeTruthy();
  });

  it('renders_correctly_inDarkMode', () => {
    const { getByTestId } = renderWithTheme(
      <<ComponentName> testID="component">
        <Text>Content</Text>
      </<ComponentName>>,
      'dark'
    );

    expect(getByTestId('component')).toBeTruthy();
  });

  it('matches_lightTheme_snapshot', () => {
    const { toJSON } = renderWithTheme(
      <<ComponentName>>
        <Text>Content</Text>
      </<ComponentName>>
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('matches_darkTheme_snapshot', () => {
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

## SDUI Registration (if @astacinco/rn-sdui exists)

Add to `packages/sdui/src/ComponentRegistry.ts`:

```typescript
import { <ComponentName> } from '@astacinco/rn-primitives';

registry.register('<componentName>', <ComponentName>);
```

## Checklist

After creating the component:

- [ ] Component uses `useTheme()` for colors/spacing
- [ ] Types are properly exported
- [ ] Tests cover light and dark modes
- [ ] Snapshots generated for both themes
- [ ] Component exported from primitives index
- [ ] (Optional) Registered in SDUI ComponentRegistry
