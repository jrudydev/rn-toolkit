import type { ViewProps } from 'react-native';

export type StackSpacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch';
export type StackJustify = 'start' | 'center' | 'end' | 'space-between' | 'space-around';

export interface StackProps extends ViewProps {
  /**
   * Gap between items
   * @default 'none'
   */
  spacing?: StackSpacing;

  /**
   * Align items (cross axis)
   * @default 'stretch'
   */
  align?: StackAlign;

  /**
   * Justify content (main axis)
   * @default 'start'
   */
  justify?: StackJustify;

  /**
   * Test ID for testing
   */
  testID?: string;
}
