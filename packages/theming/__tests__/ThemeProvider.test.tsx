import React from 'react';
import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';
import { ThemeProvider, useTheme } from '../src';

// Test component that displays theme info
function ThemeDisplay() {
  const { mode, colors } = useTheme();

  return (
    <View testID="theme-display">
      <Text testID="mode">{mode}</Text>
      <Text testID="background">{colors.background}</Text>
      <Text testID="text-color">{colors.text}</Text>
    </View>
  );
}

// SKIPPED: React 19 + React Native mockComponent.js incompatibility
// See: docs/TESTING_ISSUES.md
describe.skip('ThemeProvider', () => {
  it('renders_children_correctly', () => {
    const { getByText } = render(
      <ThemeProvider>
        <Text>Child Content</Text>
      </ThemeProvider>
    );

    expect(getByText('Child Content')).toBeTruthy();
  });

  it('provides_lightTheme_whenModeIsLight', () => {
    const { getByTestId } = render(
      <ThemeProvider mode="light">
        <ThemeDisplay />
      </ThemeProvider>
    );

    expect(getByTestId('mode').props.children).toBe('light');
    expect(getByTestId('background').props.children).toBe('#FFFFFF');
  });

  it('provides_darkTheme_whenModeIsDark', () => {
    const { getByTestId } = render(
      <ThemeProvider mode="dark">
        <ThemeDisplay />
      </ThemeProvider>
    );

    expect(getByTestId('mode').props.children).toBe('dark');
    expect(getByTestId('background').props.children).toBe('#0A0A0A');
  });

  it('merges_customTheme_withDefault', () => {
    // Using deep partial for test-only partial theme override
    // DeepMerge in ThemeProvider handles incomplete color objects
    const customTheme = {
      colors: {
        light: {
          primary: '#FF0000',
        },
        dark: {
          primary: '#FF0000',
        },
      },
    };

    function CustomThemeDisplay() {
      const { colors } = useTheme();
      return <Text testID="primary">{colors.primary}</Text>;
    }

    const { getByTestId } = render(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <ThemeProvider mode="light" theme={customTheme as any}>
        <CustomThemeDisplay />
      </ThemeProvider>
    );

    expect(getByTestId('primary').props.children).toBe('#FF0000');
  });

  it('supports_nestedProviders_withDifferentScopes', () => {
    function ScopeDisplay() {
      const { scope, mode } = useTheme();
      return (
        <View>
          <Text testID={`scope-${scope}`}>{scope}</Text>
          <Text testID={`mode-${scope}`}>{mode}</Text>
        </View>
      );
    }

    const { getByTestId } = render(
      <ThemeProvider scope="global" mode="light">
        <ScopeDisplay />
        <ThemeProvider scope="modal" mode="dark">
          <ScopeDisplay />
        </ThemeProvider>
      </ThemeProvider>
    );

    expect(getByTestId('scope-global').props.children).toBe('global');
    expect(getByTestId('mode-global').props.children).toBe('light');
    expect(getByTestId('scope-modal').props.children).toBe('modal');
    expect(getByTestId('mode-modal').props.children).toBe('dark');
  });
});
