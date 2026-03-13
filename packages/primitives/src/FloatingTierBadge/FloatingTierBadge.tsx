/**
 * FloatingTierBadge component
 *
 * A floating badge that appears in the corner of the screen
 * to indicate pro tier status. Uses themed colors with a
 * subtle glow effect inspired by the SparkLabs design.
 */

import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { useTheme } from '@astacinco/rn-theming';
import { Text } from '../Text';
import type { FloatingTierBadgeProps, TierBadgePosition } from './types';

const positionStyles: Record<TierBadgePosition, object> = {
  'top-right': { top: 16, right: 16 },
  'top-left': { top: 16, left: 16 },
  'bottom-right': { bottom: 16, right: 16 },
  'bottom-left': { bottom: 16, left: 16 },
};

export function FloatingTierBadge({
  visible,
  position = 'bottom-right',
  label = 'PRO',
  onPress,
}: FloatingTierBadgeProps) {
  const { colors, shadows } = useTheme();

  if (!visible) {
    return null;
  }

  const content = (
    <View
      style={[
        styles.badge,
        positionStyles[position],
        {
          backgroundColor: colors.proGlow,
          borderColor: colors.pro,
          // Apply shadow for glow effect
          shadowColor: colors.pro,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 8,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: colors.pro },
        ]}
      >
        {label}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.container,
          positionStyles[position],
          { opacity: pressed ? 0.8 : 1 },
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, positionStyles[position]]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
