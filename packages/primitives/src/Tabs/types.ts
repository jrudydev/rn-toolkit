import type { ViewStyle, StyleProp } from 'react-native';

export interface TabOption<T = string> {
  /**
   * Value to identify this tab
   */
  value: T;

  /**
   * Label to display
   */
  label: string;

  /**
   * Disable this tab
   */
  disabled?: boolean;
}

export type TabsSize = 'sm' | 'md' | 'lg';
export type TabsVariant = 'filled' | 'outlined' | 'pills';

export interface TabsProps<T = string> {
  /**
   * Available tab options
   */
  options: TabOption<T>[];

  /**
   * Currently selected value
   */
  selected: T;

  /**
   * Callback when tab is selected
   */
  onSelect: (value: T) => void;

  /**
   * Tab size
   * @default 'md'
   */
  size?: TabsSize;

  /**
   * Tab variant
   * @default 'pills'
   */
  variant?: TabsVariant;

  /**
   * Allow horizontal scrolling for many tabs
   * @default true
   */
  scrollable?: boolean;

  /**
   * Custom container style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
