/**
 * Challenge card for list display
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, Card, HStack, VStack, Badge } from '@astacinco/rn-primitives';
import { useTheme } from '@astacinco/rn-theming';
import { DifficultyBadge } from './DifficultyBadge';
import type { Challenge, ChallengeStatus } from '../types';

interface ChallengeCardProps {
  challenge: Challenge;
  status?: ChallengeStatus;
  onPress: () => void;
}

export function ChallengeCard({ challenge, status = 'not_started', onPress }: ChallengeCardProps) {
  const { colors } = useTheme();

  const getStatusBadge = () => {
    switch (status) {
      case 'completed':
        return <Badge label="Done" variant="success" size="sm" standalone />;
      case 'in_progress':
        return <Badge label="In Progress" variant="warning" size="sm" standalone />;
      default:
        return null;
    }
  };

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <Card
          variant="elevated"
          style={{ opacity: pressed ? 0.8 : 1 }}
        >
          <VStack spacing="sm">
            {/* Header */}
            <HStack justify="space-between" align="center">
              <HStack spacing="sm" align="center">
                <DifficultyBadge difficulty={challenge.difficulty} size="sm" />
                {challenge.tier === 'pro' && (
                  <Badge label="PRO" variant="primary" size="sm" standalone />
                )}
              </HStack>
              {getStatusBadge()}
            </HStack>

            {/* Title */}
            <Text variant="subtitle">{challenge.title}</Text>

            {/* Description */}
            <Text variant="body" color={colors.textSecondary} numberOfLines={2}>
              {challenge.description}
            </Text>

            {/* Footer */}
            <HStack justify="space-between" align="center">
              <HStack spacing="xs" align="center">
                <Text variant="caption" color={colors.textMuted}>
                  {challenge.timeMinutes} min
                </Text>
                <Text variant="caption" color={colors.textMuted}>
                  •
                </Text>
                <Text variant="caption" color={colors.textMuted}>
                  {challenge.packages.length} packages
                </Text>
              </HStack>

              {challenge.hasNativeVersion && (
                <Text variant="caption" color={colors.primary}>
                  + Native version
                </Text>
              )}
            </HStack>

            {/* Skills */}
            <View style={styles.skillsContainer}>
              {challenge.skills.slice(0, 3).map((skill, index) => (
                <View
                  key={index}
                  style={[styles.skillTag, { backgroundColor: colors.surface }]}
                >
                  <Text variant="caption" color={colors.textSecondary}>
                    {skill}
                  </Text>
                </View>
              ))}
              {challenge.skills.length > 3 && (
                <Text variant="caption" color={colors.textMuted}>
                  +{challenge.skills.length - 3} more
                </Text>
              )}
            </View>
          </VStack>
        </Card>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  skillTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
