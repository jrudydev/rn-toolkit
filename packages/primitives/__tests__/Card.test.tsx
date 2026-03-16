// SKIPPED: React 19 + React Native mockComponent.js incompatibility
// See: docs/TESTING_ISSUES.md
//
// This entire test file is commented out because importing from 'react-native'
// triggers mockComponent.js errors during Jest module initialization.
// The tests will be re-enabled when React Native fixes the mockComponent.js
// compatibility issue with React 19.

describe.skip('Card', () => {
  it('tests skipped due to React 19 incompatibility', () => {
    // See docs/TESTING_ISSUES.md
  });
});

/*
ORIGINAL TEST CODE - preserved for when React Native fixes the issue:

import React from 'react';
import { Text } from 'react-native';
import { renderWithTheme, createThemeSnapshot } from '@astacinco/rn-testing';
import { Card } from '../src/Card';

describe('Card', () => {
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
*/
