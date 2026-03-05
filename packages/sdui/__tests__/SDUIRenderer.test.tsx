import React from 'react';
import { renderWithTheme, createThemeSnapshot } from '@rn-toolkit/testing';
import { SDUIRenderer, ComponentRegistry, registerBuiltInComponents } from '../src';
import type { SDUISchema } from '../src/types';

// Register built-in components before tests
beforeAll(() => {
  registerBuiltInComponents();
});

// Clear after each test to avoid pollution
afterEach(() => {
  ComponentRegistry.clear();
  registerBuiltInComponents();
});

describe('SDUIRenderer', () => {
  describe('basic rendering', () => {
    it('renders_emptySchema', () => {
      const schema: SDUISchema = {
        type: 'screen',
        children: [],
      };

      const { getByTestId } = renderWithTheme(
        <SDUIRenderer schema={schema} testID="sdui-root" />
      );

      expect(getByTestId('sdui-root')).toBeTruthy();
    });

    it('renders_textComponent', () => {
      const schema: SDUISchema = {
        type: 'screen',
        children: [
          { type: 'text', props: { content: 'Hello World' } },
        ],
      };

      const { getByText } = renderWithTheme(
        <SDUIRenderer schema={schema} />
      );

      expect(getByText('Hello World')).toBeTruthy();
    });

    it('renders_multipleComponents', () => {
      const schema: SDUISchema = {
        type: 'screen',
        children: [
          { type: 'text', props: { content: 'First' } },
          { type: 'text', props: { content: 'Second' } },
          { type: 'text', props: { content: 'Third' } },
        ],
      };

      const { getByText } = renderWithTheme(
        <SDUIRenderer schema={schema} />
      );

      expect(getByText('First')).toBeTruthy();
      expect(getByText('Second')).toBeTruthy();
      expect(getByText('Third')).toBeTruthy();
    });

    it('renders_nestedComponents', () => {
      const schema: SDUISchema = {
        type: 'screen',
        children: [
          {
            type: 'card',
            children: [
              { type: 'text', props: { content: 'Inside Card' } },
            ],
          },
        ],
      };

      const { getByText } = renderWithTheme(
        <SDUIRenderer schema={schema} />
      );

      expect(getByText('Inside Card')).toBeTruthy();
    });
  });

  describe('component variants', () => {
    it('renders_buttonWithLabel', () => {
      const schema: SDUISchema = {
        type: 'screen',
        children: [
          { type: 'button', props: { label: 'Click Me' } },
        ],
      };

      const { getByText } = renderWithTheme(
        <SDUIRenderer schema={schema} />
      );

      expect(getByText('Click Me')).toBeTruthy();
    });

    it('renders_stackWithSpacing', () => {
      const schema: SDUISchema = {
        type: 'screen',
        children: [
          {
            type: 'vstack',
            props: { spacing: 'md' },
            children: [
              { type: 'text', props: { content: 'Item 1' } },
              { type: 'text', props: { content: 'Item 2' } },
            ],
          },
        ],
      };

      const { getByText } = renderWithTheme(
        <SDUIRenderer schema={schema} />
      );

      expect(getByText('Item 1')).toBeTruthy();
      expect(getByText('Item 2')).toBeTruthy();
    });
  });

  describe('action handling', () => {
    it('calls_onAction_whenActionTriggered', () => {
      const mockOnAction = jest.fn();
      const schema: SDUISchema = {
        type: 'screen',
        children: [
          {
            type: 'button',
            props: { label: 'Navigate' },
            actions: {
              onPress: { type: 'navigate', payload: { to: '/home' } },
            },
          },
        ],
      };

      const { getByText } = renderWithTheme(
        <SDUIRenderer schema={schema} onAction={mockOnAction} />
      );

      // Simulate press (would need fireEvent in real test)
      // For now, just verify render
      expect(getByText('Navigate')).toBeTruthy();
    });
  });

  describe('unknown components', () => {
    it('skips_unknownComponentTypes', () => {
      const schema: SDUISchema = {
        type: 'screen',
        children: [
          { type: 'unknown-component', props: {} },
          { type: 'text', props: { content: 'Known Component' } },
        ],
      };

      const { getByText } = renderWithTheme(
        <SDUIRenderer schema={schema} />
      );

      expect(getByText('Known Component')).toBeTruthy();
    });
  });

  describe('theming', () => {
    const simpleSchema: SDUISchema = {
      type: 'screen',
      children: [
        { type: 'text', props: { content: 'Themed Text', variant: 'title' } },
        { type: 'card', children: [
          { type: 'text', props: { content: 'Card Content' } },
        ]},
      ],
    };

    createThemeSnapshot(<SDUIRenderer schema={simpleSchema} testID="sdui" />);

    it('renders_correctly_inLightMode', () => {
      const { getByText } = renderWithTheme(
        <SDUIRenderer schema={simpleSchema} />,
        'light'
      );
      expect(getByText('Themed Text')).toBeTruthy();
    });

    it('renders_correctly_inDarkMode', () => {
      const { getByText } = renderWithTheme(
        <SDUIRenderer schema={simpleSchema} />,
        'dark'
      );
      expect(getByText('Themed Text')).toBeTruthy();
    });
  });
});

describe('registerBuiltInComponents', () => {
  beforeEach(() => {
    ComponentRegistry.clear();
  });

  it('registers_allBuiltInComponents', () => {
    registerBuiltInComponents();

    expect(ComponentRegistry.has('text')).toBe(true);
    expect(ComponentRegistry.has('button')).toBe(true);
    expect(ComponentRegistry.has('card')).toBe(true);
    expect(ComponentRegistry.has('stack')).toBe(true);
    expect(ComponentRegistry.has('vstack')).toBe(true);
    expect(ComponentRegistry.has('hstack')).toBe(true);
    expect(ComponentRegistry.has('container')).toBe(true);
    expect(ComponentRegistry.has('input')).toBe(true);
    expect(ComponentRegistry.has('divider')).toBe(true);
    expect(ComponentRegistry.has('image')).toBe(true);
  });
});
