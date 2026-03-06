import React from 'react';
import { Text } from 'react-native';
import { renderWithTheme, createThemeSnapshot } from '@astacinco/rn-testing';
import { Card } from '../src/Card';

describe('Card', () => {
  // Snapshot tests for both themes
  createThemeSnapshot(
    <Card testID="card">
      <Text>Card content</Text>
    </Card>
  );

  describe('variants', () => {
    it('renders_filled_variant_byDefault', () => {
      const { getByTestId } = renderWithTheme(
        <Card testID="card">
          <Text>Content</Text>
        </Card>
      );
      expect(getByTestId('card')).toBeTruthy();
    });

    it('renders_outlined_variant', () => {
      const { getByTestId } = renderWithTheme(
        <Card variant="outlined" testID="card">
          <Text>Content</Text>
        </Card>
      );
      expect(getByTestId('card')).toBeTruthy();
    });

    it('renders_elevated_variant', () => {
      const { getByTestId } = renderWithTheme(
        <Card variant="elevated" testID="card">
          <Text>Content</Text>
        </Card>
      );
      expect(getByTestId('card')).toBeTruthy();
    });
  });

  describe('theming', () => {
    it('uses_different_colors_inDarkMode', () => {
      const lightResult = renderWithTheme(
        <Card testID="card">
          <Text>Test</Text>
        </Card>,
        'light'
      );
      const darkResult = renderWithTheme(
        <Card testID="card">
          <Text>Test</Text>
        </Card>,
        'dark'
      );

      const lightBg = lightResult.getByTestId('card').props.style[1].backgroundColor;
      const darkBg = darkResult.getByTestId('card').props.style[1].backgroundColor;

      expect(lightBg).not.toBe(darkBg);
    });
  });

  it('accepts_custom_padding', () => {
    const { getByTestId } = renderWithTheme(
      <Card padding={32} testID="card">
        <Text>Content</Text>
      </Card>
    );
    expect(getByTestId('card').props.style[1].padding).toBe(32);
  });
});
