/**
 * ProBadge component
 *
 * Gold badge indicating pro-tier content.
 * Uses themed pro color for consistency across themes.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@astacinco/rn-theming';
import { Text } from '../Text';
import type { ProBadgeProps, ProBadgeSize } from './types';

const sizeConfig: Record<ProBadgeSize, { paddingH: number; paddingV: number; fontSize: number; radius: number }> = {
  sm: { paddingH: 4, paddingV: 1, fontSize: 9, radius: 3 },
  md: { paddingH: 6, paddingV: 2, fontSize: 11, radius: 4 },
  lg: { paddingH: 8, paddingV: 3, fontSize: 13, radius: 5 },
};

export function ProBadge({ size = 'md' }: ProBadgeProps) {
  const { colors } = useTheme();
  const config = sizeConfig[size];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.pro,
          paddingHorizontal: config.paddingH,
          paddingVertical: config.paddingV,
          borderRadius: config.radius,
        },
      ]}
    >
      <Text
        variant="label"
        style={[
          styles.text,
          { fontSize: config.fontSize },
        ]}
      >
        PRO
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#000',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
