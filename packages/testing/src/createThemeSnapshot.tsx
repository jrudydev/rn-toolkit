import React from 'react';
import { renderWithTheme } from './renderWithTheme';

/**
 * Creates snapshot tests for both light and dark themes.
 * This function should be called inside a describe block.
 *
 * @param component - React element to snapshot
 * @param testNamePrefix - Optional prefix for test names
 *
 * @example
 * ```typescript
 * describe('ProfileCard', () => {
 *   createThemeSnapshot(<ProfileCard user={mockUser} />);
 * });
 * ```
 *
 * This will create two tests:
 * - "matches light theme snapshot"
 * - "matches dark theme snapshot"
 */
export function createThemeSnapshot(
  component: React.ReactElement,
  testNamePrefix: string = ''
): void {
  const prefix = testNamePrefix ? `${testNamePrefix} ` : '';

  it(`${prefix}matches light theme snapshot`, () => {
    const { toJSON } = renderWithTheme(component, 'light');
    expect(toJSON()).toMatchSnapshot();
  });

  it(`${prefix}matches dark theme snapshot`, () => {
    const { toJSON } = renderWithTheme(component, 'dark');
    expect(toJSON()).toMatchSnapshot();
  });
}

/**
 * Creates snapshot tests with custom configurations.
 * Allows more control over what gets tested.
 *
 * @param component - React element to snapshot
 * @param options - Configuration options
 *
 * @example
 * ```typescript
 * describe('Button', () => {
 *   createThemedSnapshots(<Button label="Click" />, {
 *     variants: [
 *       { name: 'default', props: {} },
 *       { name: 'disabled', props: { disabled: true } },
 *     ],
 *   });
 * });
 * ```
 */
export interface ThemedSnapshotOptions {
  /**
   * Optional test name prefix
   */
  testNamePrefix?: string;

  /**
   * Only test specific themes
   * @default ['light', 'dark']
   */
  themes?: Array<'light' | 'dark'>;
}

export function createThemedSnapshots(
  component: React.ReactElement,
  options: ThemedSnapshotOptions = {}
): void {
  const { testNamePrefix = '', themes = ['light', 'dark'] } = options;
  const prefix = testNamePrefix ? `${testNamePrefix} ` : '';

  themes.forEach((theme) => {
    it(`${prefix}matches ${theme} theme snapshot`, () => {
      const { toJSON } = renderWithTheme(component, theme);
      expect(toJSON()).toMatchSnapshot();
    });
  });
}
