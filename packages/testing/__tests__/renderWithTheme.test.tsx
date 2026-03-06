import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@astacinco/rn-theming';
import { renderWithTheme } from '../src/renderWithTheme';

// Test component that displays theme info
function ThemeDisplay({ testID }: { testID?: string }) {
  const { colors, mode } = useTheme();

  return (
    <View testID={testID} style={{ backgroundColor: colors.background }}>
      <Text testID="mode-text">{mode}</Text>
      <Text testID="bg-color">{colors.background}</Text>
    </View>
  );
}

describe('renderWithTheme', () => {
  it('renders_component_withLightThemeByDefault', () => {
    const { getByTestId } = renderWithTheme(<ThemeDisplay testID="container" />);

    expect(getByTestId('container')).toBeTruthy();
    expect(getByTestId('mode-text').props.children).toBe('light');
  });

  it('renders_component_withLightThemeWhenSpecified', () => {
    const { getByTestId } = renderWithTheme(<ThemeDisplay testID="container" />, 'light');

    expect(getByTestId('mode-text').props.children).toBe('light');
  });

  it('renders_component_withDarkThemeWhenSpecified', () => {
    const { getByTestId } = renderWithTheme(<ThemeDisplay testID="container" />, 'dark');

    expect(getByTestId('mode-text').props.children).toBe('dark');
  });

  it('provides_differentColors_forDifferentThemes', () => {
    const lightResult = renderWithTheme(<ThemeDisplay />, 'light');
    const darkResult = renderWithTheme(<ThemeDisplay />, 'dark');

    const lightBg = lightResult.getByTestId('bg-color').props.children;
    const darkBg = darkResult.getByTestId('bg-color').props.children;

    expect(lightBg).not.toBe(darkBg);
  });

  it('returns_allRenderUtilities', () => {
    const result = renderWithTheme(<ThemeDisplay testID="container" />);

    // Check that all common utilities are available
    expect(result.getByTestId).toBeDefined();
    expect(result.queryByTestId).toBeDefined();
    expect(result.toJSON).toBeDefined();
    expect(result.unmount).toBeDefined();
    expect(result.rerender).toBeDefined();
  });

  it('supports_snapshotTesting', () => {
    const { toJSON } = renderWithTheme(<ThemeDisplay testID="container" />);

    expect(toJSON()).toMatchSnapshot();
  });
});
