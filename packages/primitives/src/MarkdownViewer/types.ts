import type { ViewStyle, StyleProp } from 'react-native';

export interface MarkdownViewerProps {
  /**
   * Markdown content to render
   */
  content: string;

  /**
   * Custom container style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
