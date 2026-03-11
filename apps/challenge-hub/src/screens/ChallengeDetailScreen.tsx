/**
 * Challenge Detail Screen
 *
 * Shows assessment or challenge details, timer, and instructions.
 */

import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, VStack, HStack, Button, Card, Divider } from '@astacinco/rn-primitives';
import { useTheme } from '@astacinco/rn-theming';
import { StatusBar } from 'expo-status-bar';

import { Timer, DifficultyBadge } from '../components';
import {
  challengeRegistry,
  type Assessment,
  type GenericChallenge,
  type ItemType,
} from '../data';

interface ChallengeDetailScreenProps {
  route: {
    params: {
      itemId: string;
      itemType: ItemType;
    };
  };
  navigation: any;
}

type ChallengeVersion = 'packaged' | 'native';

export function ChallengeDetailScreen({ route, navigation }: ChallengeDetailScreenProps) {
  const { colors, mode, setMode } = useTheme();
  const { itemId, itemType } = route.params;

  const [selectedVersion, setSelectedVersion] = useState<ChallengeVersion>('packaged');
  const [timerStarted, setTimerStarted] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // Find item based on type
  const item = itemType === 'assessment'
    ? challengeRegistry.assessments.find(a => a.id === itemId)
    : challengeRegistry.challenges.find(c => c.id === itemId);

  if (!item) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <VStack spacing="md" style={{ padding: 16 }}>
          <Text variant="body">Item not found</Text>
          <Button label="Go Back" onPress={() => navigation.goBack()} />
        </VStack>
      </SafeAreaView>
    );
  }

  const isAssessment = item.type === 'assessment';
  const assessment = isAssessment ? (item as Assessment) : null;
  const challenge = !isAssessment ? (item as GenericChallenge) : null;

  // Get packages
  const packages = challengeRegistry.packages.filter(p =>
    item.packages.includes(p.id)
  );

  // Calculate time for assessments with native version
  const timeMinutes = isAssessment && assessment?.hasNativeVersion && selectedVersion === 'native'
    ? Math.round(item.timeMinutes * 1.33)
    : item.timeMinutes;

  // Get required/bonus challenges for assessments
  const requiredChallenges = assessment?.requiredChallenges
    ? challengeRegistry.challenges.filter(c => assessment.requiredChallenges.includes(c.id))
    : [];

  const bonusChallenges = assessment?.bonusChallenges
    ? challengeRegistry.challenges.filter(c => assessment.bonusChallenges?.includes(c.id))
    : [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={mode === 'light' ? 'dark' : 'light'} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <VStack spacing="sm">
          <HStack justify="space-between" align="center">
            <HStack spacing="sm" align="center">
              <View style={[styles.typeBadge, {
                backgroundColor: isAssessment ? colors.primary : colors.secondary
              }]}>
                <Text variant="caption" style={{ color: '#fff', fontSize: 10 }}>
                  {isAssessment ? 'ASSESSMENT' : 'CHALLENGE'}
                </Text>
              </View>
              <DifficultyBadge difficulty={item.difficulty} />
            </HStack>
            <Button
              label={mode === 'light' ? '🌙' : '☀️'}
              variant="ghost"
              size="sm"
              onPress={() => setMode(mode === 'light' ? 'dark' : 'light')}
            />
          </HStack>

          <Text variant="title">{item.title}</Text>

          <Text variant="body" color={colors.textSecondary}>
            {isAssessment ? assessment?.scenario : item.description}
          </Text>

          {assessment?.alignedWith && (
            <HStack spacing="xs" align="center">
              <Text variant="caption" color={colors.primary}>
                Aligned with: {assessment.alignedWith}
              </Text>
            </HStack>
          )}
        </VStack>

        <Divider />

        {/* Version Toggle - Assessments only */}
        {isAssessment && assessment?.hasNativeVersion && (
          <Card variant="outlined">
            <VStack spacing="sm">
              <Text variant="label">Choose version:</Text>
              <HStack spacing="sm">
                <Button
                  label={`Packaged (${item.timeMinutes} min)`}
                  variant={selectedVersion === 'packaged' ? 'primary' : 'outline'}
                  size="sm"
                  onPress={() => setSelectedVersion('packaged')}
                />
                <Button
                  label={`Native (${Math.round(item.timeMinutes * 1.33)} min)`}
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
            <View style={styles.tagsGrid}>
              {packages.map(pkg => (
                <View
                  key={pkg.id}
                  style={[styles.tag, { backgroundColor: colors.primary + '20' }]}
                >
                  <Text variant="caption" color={colors.primary}>
                    {pkg.displayName}
                  </Text>
                </View>
              ))}
            </View>
          </VStack>
        </Card>

        {/* Skills */}
        <Card variant="filled">
          <VStack spacing="sm">
            <Text variant="label">Skills tested:</Text>
            <View style={styles.tagsGrid}>
              {item.skills.map((skill, index) => (
                <View
                  key={index}
                  style={[styles.tag, { backgroundColor: colors.surface }]}
                >
                  <Text variant="caption" color={colors.textSecondary}>
                    {skill}
                  </Text>
                </View>
              ))}
            </View>
          </VStack>
        </Card>

        {/* Required Challenges - Assessments only */}
        {isAssessment && requiredChallenges.length > 0 && (
          <Card variant="outlined">
            <VStack spacing="sm">
              <Text variant="label">Required Challenges:</Text>
              <Text variant="caption" color={colors.textMuted}>
                These must be completed as part of this assessment
              </Text>
              {requiredChallenges.map(c => (
                <HStack key={c.id} justify="space-between" align="center">
                  <HStack spacing="sm" align="center">
                    <DifficultyBadge difficulty={c.difficulty} size="sm" />
                    <Text variant="body">{c.title}</Text>
                  </HStack>
                  <Text variant="caption" color={colors.textMuted}>
                    ~{c.timeMinutes} min
                  </Text>
                </HStack>
              ))}
            </VStack>
          </Card>
        )}

        {/* Bonus Challenges - Assessments only */}
        {isAssessment && bonusChallenges.length > 0 && (
          <Card variant="filled">
            <VStack spacing="sm">
              <Text variant="label">Bonus Challenges (Optional):</Text>
              {bonusChallenges.map(c => (
                <HStack key={c.id} justify="space-between" align="center">
                  <Text variant="body" color={colors.textSecondary}>{c.title}</Text>
                  <Text variant="caption" color={colors.textMuted}>
                    ~{c.timeMinutes} min
                  </Text>
                </HStack>
              ))}
            </VStack>
          </Card>
        )}

        <Divider />

        {/* Instructions - GenericChallenge only */}
        {!isAssessment && challenge?.instructions && (
          <VStack spacing="md">
            <Button
              label={showInstructions ? "Hide Instructions" : "Show Instructions"}
              variant="outline"
              onPress={() => setShowInstructions(!showInstructions)}
            />
            {showInstructions && (
              <Card variant="filled">
                <Text variant="body" style={{ fontFamily: 'monospace', fontSize: 12 }}>
                  {challenge.instructions}
                </Text>
              </Card>
            )}
          </VStack>
        )}

        {/* Action Buttons - Assessments */}
        {isAssessment && (
          <VStack spacing="md">
            <Text variant="label">Challenge files:</Text>

            <Button
              label="📋 View Requirements"
              variant="primary"
              onPress={() => {
                const file = selectedVersion === 'native' && assessment?.nativeChallengeFile
                  ? assessment.nativeChallengeFile
                  : assessment?.challengeFile;
                console.log('Open:', file);
              }}
            />

            <Button
              label="📖 Open Cheatsheet"
              variant="outline"
              onPress={() => {
                const file = selectedVersion === 'native' && assessment?.nativeCheatsheetFile
                  ? assessment.nativeCheatsheetFile
                  : assessment?.cheatsheetFile;
                console.log('Open:', file);
              }}
            />

            {(showSolution || !timerStarted) && assessment?.solutionFile && (
              <Button
                label={showSolution ? "✅ View Solution" : "👀 Peek at Solution"}
                variant="ghost"
                onPress={() => {
                  if (!showSolution) {
                    setShowSolution(true);
                  }
                  const file = selectedVersion === 'native' && assessment?.nativeSolutionFile
                    ? assessment.nativeSolutionFile
                    : assessment?.solutionFile;
                  console.log('Open:', file);
                }}
              />
            )}
          </VStack>
        )}

        {/* Tips - Assessments only */}
        {isAssessment && (
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
                • Complete core tasks before required challenges
              </Text>
              <Text variant="body" color={colors.textSecondary}>
                • Test frequently as you build
              </Text>
            </VStack>
          </Card>
        )}

        {/* Back Button */}
        <Button
          label="← Back to List"
          variant="ghost"
          onPress={() => navigation.goBack()}
        />
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
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
});
