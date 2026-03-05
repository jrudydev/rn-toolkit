import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { useTheme } from '@rn-toolkit/theming';
import type { TextProps, TextVariant } from './types';

const variantStyles: Record<TextVariant, { fontSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'; fontWeight: 'regular' | 'medium' | 'bold' }> = {
  title: { fontSize: 'xl', fontWeight: 'bold' },
  subtitle: { fontSize: 'lg', fontWeight: 'medium' },
  body: { fontSize: 'md', fontWeight: 'regular' },
  caption: { fontSize: 'sm', fontWeight: 'regular' },
  label: { fontSize: 'xs', fontWeight: 'medium' },
};

export function Text({
  children,
  variant = 'body',
  color,
  style,
  testID,
  ...props
}: TextProps) {
  const { colors, typography } = useTheme();
  const variantStyle = variantStyles[variant];

  const textColor = color ?? (variant === 'caption' ? colors.textSecondary : colors.text);

  return (
    <RNText
      testID={testID}
      style={[
        styles.base,
        {
          color: textColor,
          fontSize: typography.fontSize[variantStyle.fontSize],
          fontFamily: typography.fontFamily[variantStyle.fontWeight],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    // Base text styles
  },
});
