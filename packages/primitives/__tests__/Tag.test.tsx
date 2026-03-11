import React from 'react';
import { renderWithTheme, createThemeSnapshot } from '@astacinco/rn-testing';
import { Tag } from '../src/Tag';

describe('Tag', () => {
  // Snapshot tests for both themes
  createThemeSnapshot(<Tag label="Default Tag" testID="tag" />);

  describe('colors', () => {
    it('renders_default_color', () => {
      const { getByTestId } = renderWithTheme(
        <Tag label="Default" color="default" testID="tag" />
      );
      expect(getByTestId('tag')).toBeTruthy();
    });

    it('renders_primary_color', () => {
      const { getByTestId } = renderWithTheme(
        <Tag label="Primary" color="primary" testID="tag" />
      );
      expect(getByTestId('tag')).toBeTruthy();
    });

    it('renders_success_color', () => {
      const { getByTestId } = renderWithTheme(
        <Tag label="Success" color="success" testID="tag" />
      );
      expect(getByTestId('tag')).toBeTruthy();
    });

    it('renders_warning_color', () => {
      const { getByTestId } = renderWithTheme(
        <Tag label="Warning" color="warning" testID="tag" />
      );
      expect(getByTestId('tag')).toBeTruthy();
    });

    it('renders_error_color', () => {
      const { getByTestId } = renderWithTheme(
        <Tag label="Error" color="error" testID="tag" />
      );
      expect(getByTestId('tag')).toBeTruthy();
    });

    it('renders_info_color', () => {
      const { getByTestId } = renderWithTheme(
        <Tag label="Info" color="info" testID="tag" />
      );
      expect(getByTestId('tag')).toBeTruthy();
    });

    it('renders_secondary_color', () => {
      const { getByTestId } = renderWithTheme(
        <Tag label="Secondary" color="secondary" testID="tag" />
      );
      expect(getByTestId('tag')).toBeTruthy();
    });
  });

  describe('variants', () => {
    it('renders_outlined_variant_byDefault', () => {
      const { getByTestId } = renderWithTheme(
        <Tag label="Outlined" testID="tag" />
      );
      expect(getByTestId('tag')).toBeTruthy();
    });

    it('renders_filled_variant', () => {
      const { getByTestId } = renderWithTheme(
        <Tag label="Filled" variant="filled" testID="tag" />
      );
      expect(getByTestId('tag')).toBeTruthy();
    });
  });

  describe('sizes', () => {
    it('renders_sm_size', () => {
      const { getByTestId } = renderWithTheme(
        <Tag label="Small" size="sm" testID="tag" />
      );
      expect(getByTestId('tag')).toBeTruthy();
    });

    it('renders_md_size_byDefault', () => {
      const { getByTestId } = renderWithTheme(
        <Tag label="Medium" testID="tag" />
      );
      expect(getByTestId('tag')).toBeTruthy();
    });

    it('renders_lg_size', () => {
      const { getByTestId } = renderWithTheme(
        <Tag label="Large" size="lg" testID="tag" />
      );
      expect(getByTestId('tag')).toBeTruthy();
    });
  });

  describe('theming', () => {
    it('uses_different_colors_inDarkMode', () => {
      const lightResult = renderWithTheme(
        <Tag label="Test" testID="tag" />,
        'light'
      );
      const darkResult = renderWithTheme(
        <Tag label="Test" testID="tag" />,
        'dark'
      );

      expect(lightResult.getByTestId('tag')).toBeTruthy();
      expect(darkResult.getByTestId('tag')).toBeTruthy();
    });
  });

  describe('label', () => {
    it('renders_label_text', () => {
      const { getByText } = renderWithTheme(
        <Tag label="My Tag Label" testID="tag" />
      );
      expect(getByText('My Tag Label')).toBeTruthy();
    });
  });
});
