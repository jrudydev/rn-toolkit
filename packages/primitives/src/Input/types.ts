import type { TextInputProps } from 'react-native';

export interface InputProps extends TextInputProps {
  /**
   * Input label
   */
  label?: string;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Disable the input
   */
  disabled?: boolean;

  /**
   * Test ID for testing
   */
  testID?: string;
}
