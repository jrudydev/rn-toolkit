import React from 'react';
import { Text, TextProps } from '@rn-toolkit/primitives';

export interface SDUITextProps extends TextProps {
  /**
   * Text content (alternative to children)
   */
  content?: string;
}

/**
 * SDUI Text component
 * Wraps @rn-toolkit/primitives Text with SDUI-specific props
 */
export function SDUIText({ content, children, ...props }: SDUITextProps) {
  return <Text {...props}>{content ?? children}</Text>;
}
