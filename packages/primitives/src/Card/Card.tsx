import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@rn-toolkit/theming';
import type { CardProps } from './types';

export function Card({
  children,
  variant = 'filled',
  padding,
  style,
  testID,
  ...props
}: CardProps) {
  const { colors, spacing, shadows } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: colors.surface,
          borderWidth: 0,
        };
      case 'outlined':
        return {
          backgroundColor: colors.background,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'elevated':
        return {
          backgroundColor: colors.surfaceElevated,
          borderWidth: 0,
          ...shadows.md,
        };
    }
  };

  const variantStyle = getVariantStyles();

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        {
          padding: padding ?? spacing.md,
          ...variantStyle,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
  },
});
