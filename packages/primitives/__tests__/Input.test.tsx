import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithTheme, createThemeSnapshot } from '@astacinco/rn-testing';
import { Input } from '../src/Input';

describe('Input', () => {
  // Snapshot tests for both themes
  createThemeSnapshot(
    <Input testID="input" placeholder="Enter text" />
  );

  it('renders_withLabel', () => {
    const { getByText } = renderWithTheme(
      <Input label="Email" testID="input" />
    );
    expect(getByText('Email')).toBeTruthy();
  });

  it('renders_withError', () => {
    const { getByText } = renderWithTheme(
      <Input error="This field is required" testID="input" />
    );
    expect(getByText('This field is required')).toBeTruthy();
  });

  it('renders_withPlaceholder', () => {
    const { getByTestId } = renderWithTheme(
      <Input placeholder="Enter email" testID="input" />
    );
    expect(getByTestId('input').props.placeholder).toBe('Enter email');
  });

  describe('interactions', () => {
    it('calls_onChangeText_whenTyping', () => {
      const mockOnChangeText = jest.fn();
      const { getByTestId } = renderWithTheme(
        <Input onChangeText={mockOnChangeText} testID="input" />
      );

      fireEvent.changeText(getByTestId('input'), 'hello');
      expect(mockOnChangeText).toHaveBeenCalledWith('hello');
    });

    it('is_notEditable_whenDisabled', () => {
      const { getByTestId } = renderWithTheme(
        <Input disabled testID="input" />
      );
      expect(getByTestId('input').props.editable).toBe(false);
    });
  });

  describe('theming', () => {
    it('uses_different_colors_inDarkMode', () => {
      const lightResult = renderWithTheme(
        <Input testID="input" />,
        'light'
      );
      const darkResult = renderWithTheme(
        <Input testID="input" />,
        'dark'
      );

      const lightBorder = lightResult.getByTestId('input').props.style[1].borderColor;
      const darkBorder = darkResult.getByTestId('input').props.style[1].borderColor;

      expect(lightBorder).not.toBe(darkBorder);
    });
  });
});
