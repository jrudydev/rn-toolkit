/**
 * Theme Assertions
 *
 * Utilities for asserting theme-related differences.
 */

import type { ReactElement } from 'react';
import { renderWithTheme } from '../../renderWithTheme';

/**
 * Asserts that a component renders differently in light and dark themes.
 *
 * @param component - React element to test
 * @param assertion - Function to compare light and dark renders
 *
 * @example
 * ```typescript
 * expectThemeDifference(
 *   <Button label="Test" />,
 *   (light, dark) => {
 *     expect(light).not.toEqual(dark);
 *   }
 * );
 * ```
 */
export function expectThemeDifference(
  component: ReactElement,
  assertion: (lightTree: ReturnType<typeof JSON.parse>, darkTree: ReturnType<typeof JSON.parse>) => void
): void {
  const { toJSON: lightJSON } = renderWithTheme(component, 'light');
  const { toJSON: darkJSON } = renderWithTheme(component, 'dark');

  const lightTree = JSON.parse(JSON.stringify(lightJSON()));
  const darkTree = JSON.parse(JSON.stringify(darkJSON()));

  assertion(lightTree, darkTree);
}

/**
 * Finds a value in a tree by path.
 */
function getValueByPath(obj: unknown, path: string[]): unknown {
  let current: unknown = obj;
  for (const key of path) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }
  return current;
}

/**
 * Recursively finds all values matching a selector function.
 */
function findAllValues<T>(
  obj: unknown,
  selector: (value: unknown, path: string[]) => T | undefined,
  path: string[] = []
): T[] {
  const results: T[] = [];

  const selected = selector(obj, path);
  if (selected !== undefined) {
    results.push(selected);
  }

  if (obj && typeof obj === 'object') {
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        results.push(...findAllValues(item, selector, [...path, String(index)]));
      });
    } else {
      Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
        results.push(...findAllValues(value, selector, [...path, key]));
      });
    }
  }

  return results;
}

/**
 * Asserts that a specific style property differs between themes.
 *
 * @param component - React element to test
 * @param styleProp - Style property to check (e.g., 'backgroundColor')
 * @param expectations - Optional expected values for each theme
 *
 * @example
 * ```typescript
 * expectColorDifference(
 *   <Card><Text>Content</Text></Card>,
 *   'backgroundColor',
 *   { light: '#FFFFFF', dark: '#1A1A1A' }
 * );
 * ```
 */
export function expectColorDifference(
  component: ReactElement,
  styleProp: string,
  expectations?: { light?: string; dark?: string }
): void {
  const { toJSON: lightJSON } = renderWithTheme(component, 'light');
  const { toJSON: darkJSON } = renderWithTheme(component, 'dark');

  const lightTree = lightJSON();
  const darkTree = darkJSON();

  // Find all style values for the given property
  const findStyleProp = (value: unknown): string | undefined => {
    if (value && typeof value === 'object' && 'props' in value) {
      const props = (value as { props?: { style?: Record<string, unknown> } }).props;
      if (props?.style && styleProp in props.style) {
        return String(props.style[styleProp]);
      }
    }
    return undefined;
  };

  const lightColors = findAllValues(lightTree, findStyleProp);
  const darkColors = findAllValues(darkTree, findStyleProp);

  // At least one element should have the style property
  expect(lightColors.length).toBeGreaterThan(0);
  expect(darkColors.length).toBeGreaterThan(0);

  // Colors should be different between themes
  const lightSet = new Set(lightColors);
  const darkSet = new Set(darkColors);
  const hasAnyDifference = ![...lightSet].every((c) => darkSet.has(c));
  expect(hasAnyDifference).toBe(true);

  // Check specific expectations if provided
  if (expectations?.light) {
    expect(lightColors).toContain(expectations.light);
  }
  if (expectations?.dark) {
    expect(darkColors).toContain(expectations.dark);
  }
}

/**
 * Asserts that a component meets basic accessibility requirements.
 *
 * @param component - React element to test
 * @param rules - Optional specific rules to check
 *
 * @example
 * ```typescript
 * expectAccessibility(<Button label="Click" onPress={() => {}} />);
 * ```
 */
export type AccessibilityRule = 'hasLabel' | 'hasRole' | 'hasHint' | 'focusable';

export function expectAccessibility(
  component: ReactElement,
  rules: AccessibilityRule[] = ['hasLabel', 'hasRole']
): void {
  const { toJSON } = renderWithTheme(component, 'light');
  const tree = toJSON();

  const checkAccessibility = (node: unknown): boolean => {
    if (!node || typeof node !== 'object') return false;
    if (!('props' in node)) return false;

    const props = (node as { props: Record<string, unknown> }).props;
    const results: boolean[] = [];

    if (rules.includes('hasLabel')) {
      results.push(typeof props.accessibilityLabel === 'string' && props.accessibilityLabel.length > 0);
    }

    if (rules.includes('hasRole')) {
      results.push(typeof props.accessibilityRole === 'string' && props.accessibilityRole.length > 0);
    }

    if (rules.includes('hasHint')) {
      results.push(typeof props.accessibilityHint === 'string' && props.accessibilityHint.length > 0);
    }

    if (rules.includes('focusable')) {
      results.push(props.accessible !== false);
    }

    return results.length > 0 && results.some((r) => r);
  };

  const hasAccessibility = findAllValues(tree, (value) =>
    checkAccessibility(value) ? true : undefined
  );

  expect(hasAccessibility.length).toBeGreaterThan(0);
}
