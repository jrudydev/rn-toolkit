/**
 * Challenge Detail Screen
 *
 * Shows challenge details, timer, and links to files.
 */

import React, { useState } from 'react';
import { ScrollView, StyleSheet, Linking, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, VStack, HStack, Button, Card, Divider, Badge } from '@astacinco/rn-primitives';
import { useTheme } from '@astacinco/rn-theming';
import { StatusBar } from 'expo-status-bar';

import { Timer, DifficultyBadge } from '../components';
import { challengeRegistry, type Challenge } from '../data';

interface ChallengeDetailScreenProps {
  route: {
    params: {
      challengeId: string;
    };
  };
  navigation: any;
}

type ChallengeVersion = 'packaged' | 'native';

export function ChallengeDetailScreen({ route, navigation }: ChallengeDetailScreenProps) {
  const { colors, mode, setMode } = useTheme();
  const { challengeId } = route.params;

  const [selectedVersion, setSelectedVersion] = useState<ChallengeVersion>('packaged');
  const [timerStarted, setTimerStarted] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  // Find challenge
  const challenge = challengeRegistry.challenges.find(c => c.id === challengeId);

  if (!challenge) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text variant="body">Challenge not found</Text>
      </SafeAreaView>
    );
  }

  // Get file paths based on version
  const getFilePath = (type: 'challenge' | 'cheatsheet' | 'solution'): string | undefined => {
    if (selectedVersion === 'native' && challenge.hasNativeVersion) {
      switch (type) {
        case 'challenge':
          return challenge.nativeChallengeFile;
        case 'cheatsheet':
          return challenge.nativeCheatsheetFile;
        case 'solution':
          return challenge.nativeSolutionFile;
      }
    }

    switch (type) {
      case 'challenge':
        return challenge.challengeFile;
      case 'cheatsheet':
        return challenge.cheatsheetFile;
      case 'solution':
        return challenge.solutionFile;
    }
  };

  const packages = challengeRegistry.packages.filter(p =>
    challenge.packages.includes(p.id)
  );

  const timeMinutes = selectedVersion === 'native' && challenge.hasNativeVersion
    ? Math.round(challenge.timeMinutes * 1.33) // Native takes ~33% longer
    : challenge.timeMinutes;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={mode === 'light' ? 'dark' : 'light'} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <VStack spacing="sm">
          <HStack justify="space-between" align="center">
            <DifficultyBadge difficulty={challenge.difficulty} />
            <Button
              label={mode === 'light' ? '🌙' : '☀️'}
              variant="ghost"
              size="sm"
              onPress={() => setMode(mode === 'light' ? 'dark' : 'light')}
            />
          </HStack>

          <Text variant="title">{challenge.title}</Text>

          <Text variant="body" color={colors.textSecondary}>
            {challenge.scenario}
          </Text>

          {challenge.alignedWith && (
            <HStack spacing="xs" align="center">
              <Text variant="caption" color={colors.primary}>
                Aligned with: {challenge.alignedWith}
              </Text>
            </HStack>
          )}
        </VStack>

        <Divider />

        {/* Version Toggle */}
        {challenge.hasNativeVersion && (
          <Card variant="outlined">
            <VStack spacing="sm">
              <Text variant="label">Choose version:</Text>
              <HStack spacing="sm">
                <Button
                  label={`Packaged (${challenge.timeMinutes} min)`}
                  variant={selectedVersion === 'packaged' ? 'primary' : 'outline'}
                  size="sm"
                  onPress={() => setSelectedVersion('packaged')}
                />
                <Button
                  label={`Native (${Math.round(challenge.timeMinutes * 1.33)} min)`}
                  variant={selectedVersion === 'native' ? 'primary' : 'outline'}
                  size="sm"
                  onPress={() => setSelectedVersion('native')}
                />
              </HStack>
              <Text variant="caption" color={colors.textMuted}>
                {selectedVersion === 'packaged'
                  ? 'Uses @astacinco packages - focus on integration'
                  : 'Build everything from scratch - shows fundamentals'}
              </Text>
            </VStack>
          </Card>
        )}

        {/* Timer */}
        <Timer
          durationMinutes={timeMinutes}
          onStart={() => setTimerStarted(true)}
          onComplete={() => setShowSolution(true)}
        />

        {/* Packages Used */}
        <Card variant="filled">
          <VStack spacing="sm">
            <Text variant="label">Packages used:</Text>
            <View style={styles.packagesGrid}>
              {packages.map(pkg => (
                <Badge
                  key={pkg.id}
                  label={pkg.displayName}
                  variant={pkg.tier === 'pro' ? 'primary' : 'default'}
                  standalone
                />
              ))}
            </View>
          </VStack>
        </Card>

        {/* Skills */}
        <Card variant="filled">
          <VStack spacing="sm">
            <Text variant="label">Skills tested:</Text>
            <View style={styles.skillsGrid}>
              {challenge.skills.map((skill, index) => (
                <View
                  key={index}
                  style={[styles.skillTag, { backgroundColor: colors.surface }]}
                >
                  <Text variant="caption" color={colors.textSecondary}>
                    {skill}
                  </Text>
                </View>
              ))}
            </View>
          </VStack>
        </Card>

        <Divider />

        {/* Action Buttons */}
        <VStack spacing="md">
          <Text variant="label">Challenge files:</Text>

          <Button
            label="📋 View Requirements"
            variant="primary"
            onPress={() => {
              // In a real app, this would navigate to a markdown viewer
              // For now, we'll just show the file path
              const file = getFilePath('challenge');
              console.log('Open:', file);
            }}
          />

          <Button
            label="📖 Open Cheatsheet"
            variant="outline"
            onPress={() => {
              const file = getFilePath('cheatsheet');
              console.log('Open:', file);
            }}
          />

          {/* Solution - only show after timer or if explicitly revealed */}
          {(showSolution || !timerStarted) && getFilePath('solution') && (
            <Button
              label={showSolution ? "✅ View Solution" : "👀 Peek at Solution"}
              variant="ghost"
              onPress={() => {
                if (!showSolution) {
                  setShowSolution(true);
                }
                const file = getFilePath('solution');
                console.log('Open:', file);
              }}
            />
          )}
        </VStack>

        {/* Tips */}
        <Card variant="outlined">
          <VStack spacing="sm">
            <Text variant="label">Tips:</Text>
            <Text variant="body" color={colors.textSecondary}>
              • Read the requirements completely before starting
            </Text>
            <Text variant="body" color={colors.textSecondary}>
              • Keep the cheatsheet open for quick reference
            </Text>
            <Text variant="body" color={colors.textSecondary}>
              • Focus on core functionality first, polish later
            </Text>
            <Text variant="body" color={colors.textSecondary}>
              • Test frequently as you build
            </Text>
          </VStack>
        </Card>
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
  packagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
});
