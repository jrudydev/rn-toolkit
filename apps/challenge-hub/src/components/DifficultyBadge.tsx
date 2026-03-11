/**
 * Difficulty badge component
 * Uses the packaged Tag component with difficulty-specific colors
 */

import React from 'react';
import { Tag, type TagColor } from '@astacinco/rn-primitives';
import type { Difficulty } from '../types';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  size?: 'sm' | 'md';
}

const difficultyConfig: Record<Difficulty, { label: string; color: TagColor }> = {
  easy: { label: 'Easy', color: 'success' },
  medium: { label: 'Medium', color: 'warning' },
  hard: { label: 'Hard', color: 'error' },
};

export function DifficultyBadge({ difficulty, size = 'md' }: DifficultyBadgeProps) {
  const config = difficultyConfig[difficulty];

  return (
    <Tag
      label={config.label}
      color={config.color}
      size={size}
      variant="outlined"
    />
  );
}
