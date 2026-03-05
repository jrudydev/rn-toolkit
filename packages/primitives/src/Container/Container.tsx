import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@rn-toolkit/theming';
import type { ContainerProps } from './types';

export function Container({
  children,
  padding,
  maxWidth,
  centered = false,
  style,
  testID,
  ...props
}: ContainerProps) {
  const { colors, spacing } = useTheme();

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        {
          backgroundColor: colors.background,
          padding: padding ?? spacing.md,
          maxWidth,
          alignSelf: centered ? 'center' : undefined,
          width: centered && maxWidth ? '100%' : undefined,
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
    flex: 1,
  },
});
