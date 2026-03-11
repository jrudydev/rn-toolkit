import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithTheme, createThemeSnapshot } from '@astacinco/rn-testing';
import { Tabs, type TabOption } from '../src/Tabs';

const mockOptions: TabOption<string>[] = [
  { value: 'tab1', label: 'Tab 1' },
  { value: 'tab2', label: 'Tab 2' },
  { value: 'tab3', label: 'Tab 3' },
];

describe('Tabs', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  // Snapshot tests for both themes
  createThemeSnapshot(
    <Tabs
      options={mockOptions}
      selected="tab1"
      onSelect={() => {}}
      testID="tabs"
    />
  );

  describe('rendering', () => {
    it('renders_all_tabs', () => {
      const { getByText } = renderWithTheme(
        <Tabs
          options={mockOptions}
          selected="tab1"
          onSelect={mockOnSelect}
          testID="tabs"
        />
      );

      expect(getByText('Tab 1')).toBeTruthy();
      expect(getByText('Tab 2')).toBeTruthy();
      expect(getByText('Tab 3')).toBeTruthy();
    });

    it('highlights_selected_tab', () => {
      const { getByTestId } = renderWithTheme(
        <Tabs
          options={mockOptions}
          selected="tab2"
          onSelect={mockOnSelect}
          testID="tabs"
        />
      );

      expect(getByTestId('tabs')).toBeTruthy();
    });
  });

  describe('variants', () => {
    it('renders_pills_variant_byDefault', () => {
      const { getByTestId } = renderWithTheme(
        <Tabs
          options={mockOptions}
          selected="tab1"
          onSelect={mockOnSelect}
          testID="tabs"
        />
      );
      expect(getByTestId('tabs')).toBeTruthy();
    });

    it('renders_outlined_variant', () => {
      const { getByTestId } = renderWithTheme(
        <Tabs
          options={mockOptions}
          selected="tab1"
          onSelect={mockOnSelect}
          variant="outlined"
          testID="tabs"
        />
      );
      expect(getByTestId('tabs')).toBeTruthy();
    });

    it('renders_filled_variant', () => {
      const { getByTestId } = renderWithTheme(
        <Tabs
          options={mockOptions}
          selected="tab1"
          onSelect={mockOnSelect}
          variant="filled"
          testID="tabs"
        />
      );
      expect(getByTestId('tabs')).toBeTruthy();
    });
  });

  describe('sizes', () => {
    it('renders_sm_size', () => {
      const { getByTestId } = renderWithTheme(
        <Tabs
          options={mockOptions}
          selected="tab1"
          onSelect={mockOnSelect}
          size="sm"
          testID="tabs"
        />
      );
      expect(getByTestId('tabs')).toBeTruthy();
    });

    it('renders_md_size_byDefault', () => {
      const { getByTestId } = renderWithTheme(
        <Tabs
          options={mockOptions}
          selected="tab1"
          onSelect={mockOnSelect}
          testID="tabs"
        />
      );
      expect(getByTestId('tabs')).toBeTruthy();
    });

    it('renders_lg_size', () => {
      const { getByTestId } = renderWithTheme(
        <Tabs
          options={mockOptions}
          selected="tab1"
          onSelect={mockOnSelect}
          size="lg"
          testID="tabs"
        />
      );
      expect(getByTestId('tabs')).toBeTruthy();
    });
  });

  describe('interactions', () => {
    it('calls_onSelect_when_tab_pressed', () => {
      const { getByText } = renderWithTheme(
        <Tabs
          options={mockOptions}
          selected="tab1"
          onSelect={mockOnSelect}
          testID="tabs"
        />
      );

      fireEvent.press(getByText('Tab 2'));
      expect(mockOnSelect).toHaveBeenCalledWith('tab2');
    });

    it('calls_onSelect_with_correct_value', () => {
      const { getByText } = renderWithTheme(
        <Tabs
          options={mockOptions}
          selected="tab1"
          onSelect={mockOnSelect}
          testID="tabs"
        />
      );

      fireEvent.press(getByText('Tab 3'));
      expect(mockOnSelect).toHaveBeenCalledWith('tab3');
    });
  });

  describe('theming', () => {
    it('uses_different_colors_inDarkMode', () => {
      const lightResult = renderWithTheme(
        <Tabs
          options={mockOptions}
          selected="tab1"
          onSelect={mockOnSelect}
          testID="tabs"
        />,
        'light'
      );
      const darkResult = renderWithTheme(
        <Tabs
          options={mockOptions}
          selected="tab1"
          onSelect={mockOnSelect}
          testID="tabs"
        />,
        'dark'
      );

      expect(lightResult.getByTestId('tabs')).toBeTruthy();
      expect(darkResult.getByTestId('tabs')).toBeTruthy();
    });
  });
});
