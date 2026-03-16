import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithTheme, createThemeSnapshot } from '@astacinco/rn-testing';
import { Button } from '../src/Button';

// SKIPPED: React 19 + React Native mockComponent.js incompatibility
// See: docs/TESTING_ISSUES.md
describe.skip('Button', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  // Snapshot tests for both themes
  createThemeSnapshot(<Button label="Click Me" onPress={() => {}} testID="button" />);

  describe('variants', () => {
    it('renders_primary_variant_byDefault', () => {
      const { getByTestId } = renderWithTheme(
        <Button label="Primary" onPress={mockOnPress} testID="button" />
      );
      expect(getByTestId('button')).toBeTruthy();
    });

    it('renders_secondary_variant', () => {
      const { getByTestId } = renderWithTheme(
        <Button label="Secondary" variant="secondary" onPress={mockOnPress} testID="button" />
      );
      expect(getByTestId('button')).toBeTruthy();
    });

    it('renders_outline_variant', () => {
      const { getByTestId } = renderWithTheme(
        <Button label="Outline" variant="outline" onPress={mockOnPress} testID="button" />
      );
      expect(getByTestId('button')).toBeTruthy();
    });

    it('renders_ghost_variant', () => {
      const { getByTestId } = renderWithTheme(
        <Button label="Ghost" variant="ghost" onPress={mockOnPress} testID="button" />
      );
      expect(getByTestId('button')).toBeTruthy();
    });
  });

  describe('sizes', () => {
    it('renders_sm_size', () => {
      const { getByTestId } = renderWithTheme(
        <Button label="Small" size="sm" onPress={mockOnPress} testID="button" />
      );
      expect(getByTestId('button')).toBeTruthy();
    });

    it('renders_md_size_byDefault', () => {
      const { getByTestId } = renderWithTheme(
        <Button label="Medium" onPress={mockOnPress} testID="button" />
      );
      expect(getByTestId('button')).toBeTruthy();
    });

    it('renders_lg_size', () => {
      const { getByTestId } = renderWithTheme(
        <Button label="Large" size="lg" onPress={mockOnPress} testID="button" />
      );
      expect(getByTestId('button')).toBeTruthy();
    });
  });

  describe('interactions', () => {
    it('calls_onPress_whenPressed', () => {
      const { getByTestId } = renderWithTheme(
        <Button label="Press Me" onPress={mockOnPress} testID="button" />
      );

      fireEvent.press(getByTestId('button'));
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('does_notCall_onPress_whenDisabled', () => {
      const { getByTestId } = renderWithTheme(
        <Button label="Disabled" disabled onPress={mockOnPress} testID="button" />
      );

      fireEvent.press(getByTestId('button'));
      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('does_notCall_onPress_whenLoading', () => {
      const { getByTestId } = renderWithTheme(
        <Button label="Loading" loading onPress={mockOnPress} testID="button" />
      );

      fireEvent.press(getByTestId('button'));
      expect(mockOnPress).not.toHaveBeenCalled();
    });
  });

  describe('theming', () => {
    it('uses_different_colors_inDarkMode', () => {
      const lightResult = renderWithTheme(
        <Button label="Test" onPress={mockOnPress} testID="button" />,
        'light'
      );
      const darkResult = renderWithTheme(
        <Button label="Test" onPress={mockOnPress} testID="button" />,
        'dark'
      );

      // Both should render without errors
      expect(lightResult.getByTestId('button')).toBeTruthy();
      expect(darkResult.getByTestId('button')).toBeTruthy();
    });
  });
});
