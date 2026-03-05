import React from 'react';
import { Text } from 'react-native';
import { renderWithTheme, createThemeSnapshot } from '@rn-toolkit/testing';
import { VStack, HStack } from '../src/Stack';

describe('VStack', () => {
  // Snapshot tests for both themes
  createThemeSnapshot(
    <VStack testID="vstack" spacing="md">
      <Text>Item 1</Text>
      <Text>Item 2</Text>
    </VStack>,
    'VStack'
  );

  it('renders_children_vertically', () => {
    const { getByTestId } = renderWithTheme(
      <VStack testID="vstack">
        <Text>Item 1</Text>
        <Text>Item 2</Text>
      </VStack>
    );
    expect(getByTestId('vstack').props.style[1].flexDirection).toBe('column');
  });

  it('applies_spacing', () => {
    const { getByTestId } = renderWithTheme(
      <VStack testID="vstack" spacing="md">
        <Text>Item 1</Text>
        <Text>Item 2</Text>
      </VStack>
    );
    expect(getByTestId('vstack').props.style[1].gap).toBe(16); // md = 16
  });

  it('applies_alignment', () => {
    const { getByTestId } = renderWithTheme(
      <VStack testID="vstack" align="center">
        <Text>Item</Text>
      </VStack>
    );
    expect(getByTestId('vstack').props.style[1].alignItems).toBe('center');
  });

  it('applies_justification', () => {
    const { getByTestId } = renderWithTheme(
      <VStack testID="vstack" justify="space-between">
        <Text>Item 1</Text>
        <Text>Item 2</Text>
      </VStack>
    );
    expect(getByTestId('vstack').props.style[1].justifyContent).toBe('space-between');
  });
});

describe('HStack', () => {
  // Snapshot tests for both themes
  createThemeSnapshot(
    <HStack testID="hstack" spacing="sm">
      <Text>Left</Text>
      <Text>Right</Text>
    </HStack>,
    'HStack'
  );

  it('renders_children_horizontally', () => {
    const { getByTestId } = renderWithTheme(
      <HStack testID="hstack">
        <Text>Left</Text>
        <Text>Right</Text>
      </HStack>
    );
    expect(getByTestId('hstack').props.style[1].flexDirection).toBe('row');
  });

  it('applies_spacing', () => {
    const { getByTestId } = renderWithTheme(
      <HStack testID="hstack" spacing="lg">
        <Text>Left</Text>
        <Text>Right</Text>
      </HStack>
    );
    expect(getByTestId('hstack').props.style[1].gap).toBe(24); // lg = 24
  });
});
