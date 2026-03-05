import React from 'react';
import { renderWithTheme, createThemeSnapshot } from '@rn-toolkit/testing';
import { Text } from '../src/Text';

describe('Text', () => {
  // Snapshot tests for both themes
  createThemeSnapshot(<Text testID="text">Hello World</Text>);

  describe('variants', () => {
    it('renders_title_variant', () => {
      const { getByTestId } = renderWithTheme(
        <Text variant="title" testID="text">Title</Text>
      );
      expect(getByTestId('text')).toBeTruthy();
    });

    it('renders_subtitle_variant', () => {
      const { getByTestId } = renderWithTheme(
        <Text variant="subtitle" testID="text">Subtitle</Text>
      );
      expect(getByTestId('text')).toBeTruthy();
    });

    it('renders_body_variant_byDefault', () => {
      const { getByTestId } = renderWithTheme(
        <Text testID="text">Body</Text>
      );
      expect(getByTestId('text')).toBeTruthy();
    });

    it('renders_caption_variant', () => {
      const { getByTestId } = renderWithTheme(
        <Text variant="caption" testID="text">Caption</Text>
      );
      expect(getByTestId('text')).toBeTruthy();
    });

    it('renders_label_variant', () => {
      const { getByTestId } = renderWithTheme(
        <Text variant="label" testID="text">Label</Text>
      );
      expect(getByTestId('text')).toBeTruthy();
    });
  });

  describe('theming', () => {
    it('uses_different_colors_inDarkMode', () => {
      const lightResult = renderWithTheme(<Text testID="text">Test</Text>, 'light');
      const darkResult = renderWithTheme(<Text testID="text">Test</Text>, 'dark');

      const lightColor = lightResult.getByTestId('text').props.style[1].color;
      const darkColor = darkResult.getByTestId('text').props.style[1].color;

      expect(lightColor).not.toBe(darkColor);
    });
  });

  it('accepts_custom_color', () => {
    const { getByTestId } = renderWithTheme(
      <Text color="#FF0000" testID="text">Red Text</Text>
    );
    expect(getByTestId('text').props.style[1].color).toBe('#FF0000');
  });
});
