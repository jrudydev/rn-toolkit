import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@astacinco/rn-theming';
import type { MarkdownViewerProps } from './types';

// Conditionally import markdown display
let Markdown: React.ComponentType<any> | null = null;
try {
  Markdown = require('react-native-markdown-display').default;
} catch {
  // react-native-markdown-display not installed
}

export function MarkdownViewer({
  content,
  style,
  testID,
}: MarkdownViewerProps) {
  const { colors, typography } = useTheme();

  // Theme-aware markdown styles
  const markdownStyles = {
    body: {
      color: colors.text,
      fontSize: typography.fontSize.md,
      lineHeight: typography.fontSize.md * 1.6,
    },
    heading1: {
      color: colors.text,
      fontSize: typography.fontSize.xxl,
      fontWeight: 'bold' as const,
      marginTop: 16,
      marginBottom: 8,
    },
    heading2: {
      color: colors.text,
      fontSize: typography.fontSize.xl,
      fontWeight: 'bold' as const,
      marginTop: 14,
      marginBottom: 6,
    },
    heading3: {
      color: colors.text,
      fontSize: typography.fontSize.lg,
      fontWeight: '600' as const,
      marginTop: 12,
      marginBottom: 4,
    },
    heading4: {
      color: colors.text,
      fontSize: typography.fontSize.md,
      fontWeight: '600' as const,
      marginTop: 10,
      marginBottom: 4,
    },
    paragraph: {
      marginTop: 0,
      marginBottom: 12,
    },
    link: {
      color: colors.primary,
    },
    blockquote: {
      backgroundColor: colors.surface,
      borderLeftColor: colors.primary,
      borderLeftWidth: 4,
      paddingLeft: 12,
      paddingVertical: 8,
      marginVertical: 8,
    },
    code_inline: {
      backgroundColor: colors.surface,
      color: colors.secondary,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      fontSize: typography.fontSize.sm,
      fontFamily: 'monospace',
    },
    code_block: {
      backgroundColor: colors.surface,
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
    },
    fence: {
      backgroundColor: colors.surface,
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
      fontFamily: 'monospace',
      fontSize: typography.fontSize.sm,
      color: colors.text,
    },
    list_item: {
      marginVertical: 4,
    },
    bullet_list: {
      marginVertical: 8,
    },
    ordered_list: {
      marginVertical: 8,
    },
    table: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      marginVertical: 8,
    },
    thead: {
      backgroundColor: colors.surface,
    },
    th: {
      padding: 8,
      borderBottomWidth: 1,
      borderColor: colors.border,
      fontWeight: '600' as const,
    },
    td: {
      padding: 8,
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    hr: {
      backgroundColor: colors.border,
      height: 1,
      marginVertical: 16,
    },
    strong: {
      fontWeight: 'bold' as const,
    },
    em: {
      fontStyle: 'italic' as const,
    },
  };

  // Fallback if markdown library not installed
  if (!Markdown) {
    return (
      <View testID={testID} style={[styles.container, style]}>
        <View style={[styles.fallback, { backgroundColor: colors.surface }]}>
          {/* Simple text display without markdown parsing */}
          <View>
            {content.split('\n').map((line, i) => (
              <View key={i} style={{ marginVertical: 2 }}>
                <View>
                  {/* Using native Text here as fallback */}
                  {React.createElement(
                    require('react-native').Text,
                    {
                      style: {
                        color: colors.text,
                        fontSize: typography.fontSize.sm,
                        fontFamily: 'monospace',
                      },
                    },
                    line
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View testID={testID} style={[styles.container, style]}>
      <Markdown style={markdownStyles}>
        {content}
      </Markdown>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fallback: {
    padding: 12,
    borderRadius: 8,
  },
});
