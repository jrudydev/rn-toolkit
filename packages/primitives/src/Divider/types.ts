import type { ViewProps } from 'react-native';

export type DividerVariant = 'thin' | 'thick';

export interface DividerProps extends ViewProps {
  /**
   * Divider variant
   * @default 'thin'
   */
  variant?: DividerVariant;

  /**
   * Override divider color
   */
  color?: string;

  /**
   * Test ID for testing
   */
  testID?: string;
}
