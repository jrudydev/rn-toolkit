/**
 * Difficulty badge component
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@astacinco/rn-primitives';
import { useTheme } from '@astacinco/rn-theming';
import type { Difficulty } from '../types';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  size?: 'sm' | 'md';
}

export function DifficultyBadge({ difficulty, size = 'md' }: DifficultyBadgeProps) {
  const { colors } = useTheme();

  const getColor = (): string => {
    switch (difficulty) {
      case 'easy':
        return colors.success;
      case 'medium':
        return colors.warning;
      case 'hard':
        return colors.error;
    }
  };

  const getLabel = (): string => {
    switch (difficulty) {
      case 'easy':
        return 'Easy';
      case 'medium':
        return 'Medium';
      case 'hard':
        return 'Hard';
    }
  };

  const color = getColor();
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: color + '20', // 20% opacity
          borderColor: color,
          paddingHorizontal: isSmall ? 6 : 10,
          paddingVertical: isSmall ? 2 : 4,
        },
      ]}
    >
      <Text
        variant="caption"
        style={{ fontSize: isSmall ? 10 : 12 }}
        color={color}
      >
        {getLabel()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 4,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
});
