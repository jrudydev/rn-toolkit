import React from 'react';
import { Text } from 'react-native';
import { renderWithTheme, createThemeSnapshot } from '@astacinco/rn-testing';
import { Container } from '../src/Container';

describe('Container', () => {
  // Snapshot tests for both themes
  createThemeSnapshot(
    <Container testID="container">
      <Text>Content</Text>
    </Container>
  );

  it('renders_children', () => {
    const { getByText } = renderWithTheme(
      <Container testID="container">
        <Text>Hello</Text>
      </Container>
    );
    expect(getByText('Hello')).toBeTruthy();
  });

  it('applies_maxWidth', () => {
    const { getByTestId } = renderWithTheme(
      <Container maxWidth={600} testID="container">
        <Text>Content</Text>
      </Container>
    );
    expect(getByTestId('container').props.style[1].maxWidth).toBe(600);
  });

  it('applies_custom_padding', () => {
    const { getByTestId } = renderWithTheme(
      <Container padding={32} testID="container">
        <Text>Content</Text>
      </Container>
    );
    expect(getByTestId('container').props.style[1].padding).toBe(32);
  });

  it('centers_whenCenteredProp', () => {
    const { getByTestId } = renderWithTheme(
      <Container centered testID="container">
        <Text>Content</Text>
      </Container>
    );
    expect(getByTestId('container').props.style[1].alignSelf).toBe('center');
  });

  describe('theming', () => {
    it('uses_different_colors_inDarkMode', () => {
      const lightResult = renderWithTheme(
        <Container testID="container">
          <Text>Test</Text>
        </Container>,
        'light'
      );
      const darkResult = renderWithTheme(
        <Container testID="container">
          <Text>Test</Text>
        </Container>,
        'dark'
      );

      const lightBg = lightResult.getByTestId('container').props.style[1].backgroundColor;
      const darkBg = darkResult.getByTestId('container').props.style[1].backgroundColor;

      expect(lightBg).not.toBe(darkBg);
    });
  });
});
