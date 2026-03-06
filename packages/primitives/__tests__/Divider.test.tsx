import React from 'react';
import { renderWithTheme, createThemeSnapshot } from '@astacinco/rn-testing';
import { Divider } from '../src/Divider';

describe('Divider', () => {
  // Snapshot tests for both themes
  createThemeSnapshot(<Divider testID="divider" />);

  describe('variants', () => {
    it('renders_thin_variant_byDefault', () => {
      const { getByTestId } = renderWithTheme(<Divider testID="divider" />);
      expect(getByTestId('divider').props.style[1].height).toBe(1);
    });

    it('renders_thick_variant', () => {
      const { getByTestId } = renderWithTheme(
        <Divider variant="thick" testID="divider" />
      );
      expect(getByTestId('divider').props.style[1].height).toBe(2);
    });
  });

  describe('theming', () => {
    it('uses_different_colors_inDarkMode', () => {
      const lightResult = renderWithTheme(<Divider testID="divider" />, 'light');
      const darkResult = renderWithTheme(<Divider testID="divider" />, 'dark');

      const lightColor = lightResult.getByTestId('divider').props.style[1].backgroundColor;
      const darkColor = darkResult.getByTestId('divider').props.style[1].backgroundColor;

      expect(lightColor).not.toBe(darkColor);
    });
  });

  it('accepts_custom_color', () => {
    const { getByTestId } = renderWithTheme(
      <Divider color="#FF0000" testID="divider" />
    );
    expect(getByTestId('divider').props.style[1].backgroundColor).toBe('#FF0000');
  });
});
