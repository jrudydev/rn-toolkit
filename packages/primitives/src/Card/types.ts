import type { ViewProps } from 'react-native';

export type CardVariant = 'filled' | 'outlined' | 'elevated';

export interface CardProps extends ViewProps {
  /**
   * Card variant
   * @default 'filled'
   */
  variant?: CardVariant;

  /**
   * Override padding
   */
  padding?: number;

  /**
   * Test ID for testing
   */
  testID?: string;
}
