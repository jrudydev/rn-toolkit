import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@astacinco/rn-theming';
import { Text } from '../Text';
import type { TagProps, TagColor, TagSize, TagVariant } from './types';

const sizeConfig: Record<TagSize, { paddingH: number; paddingV: number; fontSize: number }> = {
  sm: { paddingH: 6, paddingV: 2, fontSize: 10 },
  md: { paddingH: 10, paddingV: 4, fontSize: 12 },
  lg: { paddingH: 14, paddingV: 6, fontSize: 14 },
};

export function Tag({
  label,
  color = 'default',
  size = 'md',
  variant = 'outlined',
  style,
  testID,
}: TagProps) {
  const { colors } = useTheme();
  const config = sizeConfig[size];

  const getColor = (c: TagColor): string => {
    switch (c) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      case 'info':
        return colors.info;
      case 'default':
      default:
        return colors.textSecondary;
    }
  };

  const tagColor = getColor(color);

  const getVariantStyles = (v: TagVariant) => {
    switch (v) {
      case 'filled':
        return {
          backgroundColor: tagColor,
          borderColor: tagColor,
          textColor: '#FFFFFF',
        };
      case 'outlined':
      default:
        return {
          backgroundColor: tagColor + '20', // 20% opacity
          borderColor: tagColor,
          textColor: tagColor,
        };
    }
  };

  const variantStyle = getVariantStyles(variant);

  return (
    <View
      testID={testID}
      style={[
        styles.tag,
        {
          backgroundColor: variantStyle.backgroundColor,
          borderColor: variantStyle.borderColor,
          paddingHorizontal: config.paddingH,
          paddingVertical: config.paddingV,
        },
        style,
      ]}
    >
      <Text
        variant="caption"
        style={{
          color: variantStyle.textColor,
          fontSize: config.fontSize,
          fontWeight: '500',
        }}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    borderRadius: 4,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
});
