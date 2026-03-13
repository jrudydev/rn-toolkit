/**
 * Challenge List Screen
 *
 * Shows assessments and challenges with filtering.
 */

import React, { useState, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, VStack, HStack, Button, Tag, AppHeader, AppFooter } from '@astacinco/rn-primitives';
import { useTheme } from '@astacinco/rn-theming';
import { StatusBar } from 'expo-status-bar';

import { ChallengeCard, FilterTabs, type FilterOption } from '../components';
import {
  challengeRegistry,
  getAllItems,
  type Difficulty,
  type ChallengeItem,
  type ItemType,
} from '../data';

type TypeFilter = 'all' | ItemType;
type DifficultyFilter = 'all' | Difficulty;

const typeOptions: FilterOption<TypeFilter>[] = [
  { value: 'all', label: 'All' },
  { value: 'assessment', label: 'Assessments' },
  { value: 'challenge', label: 'Challenges' },
];

const difficultyOptions: FilterOption<DifficultyFilter>[] = [
  { value: 'all', label: 'All Levels' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

interface ChallengeListScreenProps {
  navigation: any;
}

export function ChallengeListScreen({ navigation }: ChallengeListScreenProps) {
  const { colors, mode, setMode } = useTheme();

  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');

  // Get all items
  const allItems = useMemo(() => getAllItems(challengeRegistry), []);

  // Filter items
  const filteredItems = useMemo(() => {
    return allItems.filter(item => {
      if (typeFilter !== 'all' && item.type !== typeFilter) {
        return false;
      }
      if (difficultyFilter !== 'all' && item.difficulty !== difficultyFilter) {
        return false;
      }
      return true;
    });
  }, [allItems, typeFilter, difficultyFilter]);

  // Separate assessments and challenges for grouped view
  const { assessments, challenges } = useMemo(() => {
    const assessments: ChallengeItem[] = [];
    const challenges: ChallengeItem[] = [];

    filteredItems.forEach(item => {
      if (item.type === 'assessment') {
        assessments.push(item);
      } else {
        challenges.push(item);
      }
    });

    return { assessments, challenges };
  }, [filteredItems]);

  const handleItemPress = (item: ChallengeItem) => {
    navigation.navigate('ChallengeDetail', {
      itemId: item.id,
      itemType: item.type,
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={mode === 'light' ? 'dark' : 'light'} />

      {/* Header */}
      <AppHeader
        title="Challenge Hub"
        subtitle={`${challengeRegistry.assessments.length} assessments • ${challengeRegistry.challenges.length} challenges`}
        showThemeToggle
        showPatreonLink
        glow={mode === 'dark'}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Type Filter */}
        <VStack spacing="sm">
          <Text variant="label" color={colors.textSecondary}>
            Type
          </Text>
          <FilterTabs
            options={typeOptions}
            selected={typeFilter}
            onSelect={setTypeFilter}
          />
        </VStack>

        {/* Difficulty Filter */}
        <VStack spacing="sm">
          <Text variant="label" color={colors.textSecondary}>
            Difficulty
          </Text>
          <FilterTabs
            options={difficultyOptions}
            selected={difficultyFilter}
            onSelect={setDifficultyFilter}
          />
        </VStack>

        {/* Content */}
        {typeFilter === 'all' ? (
          // Grouped view
          <VStack spacing="lg">
            {/* Assessments Section */}
            {assessments.length > 0 && (
              <VStack spacing="md">
                <HStack spacing="sm" align="center">
                  <Text variant="subtitle">Assessments</Text>
                  <Tag
                    label={String(assessments.length)}
                    color="primary"
                    size="sm"
                    variant="filled"
                  />
                </HStack>
                <Text variant="caption" color={colors.textMuted}>
                  Full timed challenges with specific use cases
                </Text>
                {assessments.map(item => (
                  <ChallengeCard
                    key={item.id}
                    item={item}
                    onPress={() => handleItemPress(item)}
                  />
                ))}
              </VStack>
            )}

            {/* Challenges Section */}
            {challenges.length > 0 && (
              <VStack spacing="md">
                <HStack spacing="sm" align="center">
                  <Text variant="subtitle">Generic Challenges</Text>
                  <Tag
                    label={String(challenges.length)}
                    color="secondary"
                    size="sm"
                    variant="filled"
                  />
                </HStack>
                <Text variant="caption" color={colors.textMuted}>
                  Reusable features you can apply to any assessment
                </Text>
                {challenges.map(item => (
                  <ChallengeCard
                    key={item.id}
                    item={item}
                    onPress={() => handleItemPress(item)}
                  />
                ))}
              </VStack>
            )}
          </VStack>
        ) : (
          // Flat list view
          <VStack spacing="md">
            {filteredItems.map(item => (
              <ChallengeCard
                key={item.id}
                item={item}
                onPress={() => handleItemPress(item)}
              />
            ))}
          </VStack>
        )}

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <View style={styles.emptyState}>
            <Text variant="body" color={colors.textMuted}>
              No items match your filters
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <AppFooter />
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
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
});
