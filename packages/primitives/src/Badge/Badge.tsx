import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@astacinco/rn-theming';
import type { BadgeProps, BadgeVariant, BadgePosition, BadgeSize } from './types';

const sizeConfig: Record<BadgeSize, { minWidth: number; height: number; fontSize: number; dotSize: number; padding: number }> = {
  sm: { minWidth: 16, height: 16, fontSize: 10, dotSize: 8, padding: 4 },
  md: { minWidth: 20, height: 20, fontSize: 12, dotSize: 10, padding: 6 },
  lg: { minWidth: 24, height: 24, fontSize: 14, dotSize: 12, padding: 8 },
};

const getPositionStyle = (
  position: BadgePosition,
  offset: [number, number]
): { top?: number; bottom?: number; left?: number; right?: number } => {
  const [offsetX, offsetY] = offset;

  switch (position) {
    case 'top-right':
      return { top: offsetY, right: offsetX };
    case 'top-left':
      return { top: offsetY, left: offsetX };
    case 'bottom-right':
      return { bottom: offsetY, right: offsetX };
    case 'bottom-left':
      return { bottom: offsetY, left: offsetX };
  }
};

export function Badge({
  children,
  count,
  maxCount = 99,
  dot = false,
  variant = 'error',
  position = 'top-right',
  size = 'md',
  showZero = false,
  label,
  offset = [0, 0],
  hidden = false,
  standalone = false,
  style,
  badgeStyle,
  testID,
}: BadgeProps) {
  const { colors } = useTheme();
  const config = sizeConfig[size];

  const getVariantColor = (v: BadgeVariant): string => {
    switch (v) {
      case 'primary':
        return colors.primary;
      case 'error':
        return colors.error;
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'default':
      default:
        return colors.textSecondary;
    }
  };

  // Determine if badge should be visible
  const shouldShow = !hidden && (
    dot ||
    label ||
    (count !== undefined && (count > 0 || showZero))
  );

  // Format count text
  const getCountText = (): string => {
    if (label) return label;
    if (count === undefined) return '';
    if (count > maxCount) return `${maxCount}+`;
    return count.toString();
  };

  const badgeColor = getVariantColor(variant);
  const countText = getCountText();

  const badgeElement = shouldShow ? (
    <View
      testID={testID}
      style={[
        styles.badge,
        dot ? {
          width: config.dotSize,
          height: config.dotSize,
          borderRadius: config.dotSize / 2,
          backgroundColor: badgeColor,
        } : {
          minWidth: config.minWidth,
          height: config.height,
          borderRadius: config.height / 2,
          backgroundColor: badgeColor,
          paddingHorizontal: config.padding,
        },
        !standalone && getPositionStyle(position, offset),
        !standalone && styles.positioned,
        badgeStyle,
      ]}
    >
      {!dot && (
        <Text style={[styles.text, { fontSize: config.fontSize }]}>
          {countText}
        </Text>
      )}
    </View>
  ) : null;

  // Standalone badge (no wrapper)
  if (standalone || !children) {
    return badgeElement;
  }

  // Wrapper badge
  return (
    <View style={[styles.container, style]}>
      {children}
      {badgeElement}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  positioned: {
    position: 'absolute',
    zIndex: 1,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
});
