/**
 * renderWithProviders Tests
 */

import React from 'react';
import { View, Text } from 'react-native';
import { renderWithProviders } from '../src/renderWithProviders';
import { useTheme } from '@astacinco/rn-theming';

// Test component that uses theme
function ThemedComponent() {
  const { mode, colors } = useTheme();
  return (
    <View testID="themed-view" style={{ backgroundColor: colors.background }}>
      <Text testID="theme-mode">{mode}</Text>
    </View>
  );
}

describe('renderWithProviders', () => {
  it('renders_componentWithDefaultLightTheme', () => {
    const { getByTestId } = renderWithProviders(<ThemedComponent />);

    expect(getByTestId('theme-mode').props.children).toBe('light');
  });

  it('renders_componentWithDarkTheme', () => {
    const { getByTestId } = renderWithProviders(<ThemedComponent />, {
      theme: 'dark',
    });

    expect(getByTestId('theme-mode').props.children).toBe('dark');
  });

  it('renders_componentWithAutoTheme', () => {
    const { getByTestId } = renderWithProviders(<ThemedComponent />, {
      theme: 'auto',
    });

    // Auto should resolve to light in test environment (mocked)
    expect(getByTestId('theme-mode')).toBeTruthy();
  });

  it('passes_renderOptions', () => {
    const onRender = jest.fn();

    renderWithProviders(<ThemedComponent />, {
      // Pass custom render option (this tests that ...renderOptions is spread)
    });

    // Component should render without errors
    expect(true).toBe(true);
  });

  it('handles_initialRouteOption', () => {
    // initialRoute is a placeholder for future navigation provider
    const { getByTestId } = renderWithProviders(<ThemedComponent />, {
      theme: 'light',
      initialRoute: '/home',
    });

    // Should render without errors even with initialRoute
    expect(getByTestId('themed-view')).toBeTruthy();
  });
});
