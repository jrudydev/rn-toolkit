import type { ViewProps } from 'react-native';

export interface ContainerProps extends ViewProps {
  /**
   * Override padding
   */
  padding?: number;

  /**
   * Maximum width in pixels
   */
  maxWidth?: number;

  /**
   * Center the container horizontally
   */
  centered?: boolean;

  /**
   * Test ID for testing
   */
  testID?: string;
}
