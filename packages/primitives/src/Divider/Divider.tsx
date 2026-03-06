import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@astacinco/rn-theming';
import type { DividerProps, DividerVariant } from './types';

const heightMap: Record<DividerVariant, number> = {
  thin: 1,
  thick: 2,
};

export function Divider({
  variant = 'thin',
  color,
  style,
  testID,
  ...props
}: DividerProps) {
  const { colors } = useTheme();

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        {
          backgroundColor: color ?? colors.border,
          height: heightMap[variant],
        },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
  },
});
