/**
 * Challenge List Screen
 *
 * Shows all available challenges with filtering by tier and difficulty.
 */

import React, { useState, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, VStack, HStack, Button } from '@astacinco/rn-primitives';
import { useTheme } from '@astacinco/rn-theming';
import { StatusBar } from 'expo-status-bar';

import { ChallengeCard, FilterTabs, type FilterOption } from '../components';
import { challengeRegistry, type Difficulty, type PackageTier, type Challenge } from '../data';

type TierFilter = 'all' | PackageTier;
type DifficultyFilter = 'all' | Difficulty;

const tierOptions: FilterOption<TierFilter>[] = [
  { value: 'all', label: 'All' },
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
];

const difficultyOptions: FilterOption<DifficultyFilter>[] = [
  { value: 'all', label: 'All Levels' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

interface ChallengeListScreenProps {
  navigation: any; // Typed properly with react-navigation types
}

export function ChallengeListScreen({ navigation }: ChallengeListScreenProps) {
  const { colors, mode, setMode } = useTheme();

  const [tierFilter, setTierFilter] = useState<TierFilter>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');

  // Filter challenges
  const filteredChallenges = useMemo(() => {
    return challengeRegistry.challenges.filter(challenge => {
      if (tierFilter !== 'all' && challenge.tier !== tierFilter) {
        return false;
      }
      if (difficultyFilter !== 'all' && challenge.difficulty !== difficultyFilter) {
        return false;
      }
      return true;
    });
  }, [tierFilter, difficultyFilter]);

  // Group by difficulty for display
  const groupedChallenges = useMemo(() => {
    const groups: Record<Difficulty, Challenge[]> = {
      easy: [],
      medium: [],
      hard: [],
    };

    filteredChallenges.forEach(challenge => {
      groups[challenge.difficulty].push(challenge);
    });

    return groups;
  }, [filteredChallenges]);

  const handleChallengePress = (challenge: Challenge) => {
    navigation.navigate('ChallengeDetail', { challengeId: challenge.id });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={mode === 'light' ? 'dark' : 'light'} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <HStack justify="space-between" align="center">
          <VStack spacing="xs">
            <Text variant="title">Challenge Hub</Text>
            <Text variant="caption" color={colors.textSecondary}>
              {filteredChallenges.length} challenges available
            </Text>
          </VStack>
          <Button
            label={mode === 'light' ? '🌙' : '☀️'}
            variant="ghost"
            size="sm"
            onPress={() => setMode(mode === 'light' ? 'dark' : 'light')}
          />
        </HStack>

        {/* Filters */}
        <VStack spacing="sm">
          <Text variant="label" color={colors.textSecondary}>
            Filter by tier
          </Text>
          <FilterTabs
            options={tierOptions}
            selected={tierFilter}
            onSelect={setTierFilter}
          />
        </VStack>

        <VStack spacing="sm">
          <Text variant="label" color={colors.textSecondary}>
            Filter by difficulty
          </Text>
          <FilterTabs
            options={difficultyOptions}
            selected={difficultyFilter}
            onSelect={setDifficultyFilter}
          />
        </VStack>

        {/* Challenge List */}
        {difficultyFilter === 'all' ? (
          // Show grouped by difficulty
          <VStack spacing="lg">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map(difficulty => {
              const challenges = groupedChallenges[difficulty];
              if (challenges.length === 0) return null;

              return (
                <VStack key={difficulty} spacing="md">
                  <Text variant="subtitle" style={styles.sectionTitle}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </Text>
                  {challenges.map(challenge => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      onPress={() => handleChallengePress(challenge)}
                    />
                  ))}
                </VStack>
              );
            })}
          </VStack>
        ) : (
          // Show flat list
          <VStack spacing="md">
            {filteredChallenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onPress={() => handleChallengePress(challenge)}
              />
            ))}
          </VStack>
        )}

        {/* Empty state */}
        {filteredChallenges.length === 0 && (
          <View style={styles.emptyState}>
            <Text variant="body" color={colors.textMuted}>
              No challenges match your filters
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 20,
  },
  sectionTitle: {
    textTransform: 'capitalize',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
});
