/**
 * Challenge card for list display
 * Handles both Assessment and GenericChallenge types
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, Card, HStack, VStack, Tag } from '@astacinco/rn-primitives';
import { useTheme } from '@astacinco/rn-theming';
import { DifficultyBadge } from './DifficultyBadge';
import type { ChallengeItem, ChallengeStatus, Assessment } from '../types';

interface ChallengeCardProps {
  item: ChallengeItem;
  status?: ChallengeStatus;
  onPress: () => void;
}

export function ChallengeCard({ item, status = 'not_started', onPress }: ChallengeCardProps) {
  const { colors } = useTheme();
  const isAssessmentType = item.type === 'assessment';

  const getStatusLabel = () => {
    switch (status) {
      case 'completed':
        return { label: 'Done', color: colors.success };
      case 'in_progress':
        return { label: 'In Progress', color: colors.warning };
      default:
        return null;
    }
  };

  const statusInfo = getStatusLabel();

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
                {/* Type badge */}
                <Tag
                  label={isAssessmentType ? 'ASSESSMENT' : 'CHALLENGE'}
                  color={isAssessmentType ? 'primary' : 'secondary'}
                  size="sm"
                  variant="filled"
                />
                <DifficultyBadge difficulty={item.difficulty} size="sm" />
              </HStack>
              {statusInfo && (
                <Text variant="caption" style={{ color: statusInfo.color }}>
                  {statusInfo.label}
                </Text>
              )}
            </HStack>

            {/* Title */}
            <Text variant="subtitle">{item.title}</Text>

            {/* Description */}
            <Text variant="body" color={colors.textSecondary} numberOfLines={2}>
              {item.description}
            </Text>

            {/* Footer */}
            <HStack justify="space-between" align="center">
              <HStack spacing="xs" align="center">
                <Text variant="caption" color={colors.textMuted}>
                  {item.timeMinutes} min
                </Text>
                <Text variant="caption" color={colors.textMuted}>
                  •
                </Text>
                <Text variant="caption" color={colors.textMuted}>
                  {item.packages.length} packages
                </Text>
              </HStack>

              {isAssessmentType && (item as Assessment).hasNativeVersion && (
                <Text variant="caption" color={colors.primary}>
                  + Native version
                </Text>
              )}
            </HStack>

            {/* Skills */}
            <View style={styles.skillsContainer}>
              {item.skills.slice(0, 3).map((skill, index) => (
                <Tag
                  key={index}
                  label={skill}
                  color="default"
                  size="sm"
                  variant="outlined"
                />
              ))}
              {item.skills.length > 3 && (
                <Text variant="caption" color={colors.textMuted}>
                  +{item.skills.length - 3} more
                </Text>
              )}
            </View>

            {/* Required challenges indicator for assessments */}
            {isAssessmentType && (item as Assessment).requiredChallenges.length > 0 && (
              <Text variant="caption" color={colors.info}>
                Includes {(item as Assessment).requiredChallenges.length} required challenges
              </Text>
            )}
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
});
