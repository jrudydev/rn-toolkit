/**
 * Challenge Detail Screen
 *
 * Shows assessment or challenge details, timer, and instructions.
 */

import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, VStack, HStack, Button, Card, Divider, Tag, MarkdownViewer, AppHeader, AppFooter } from '@astacinco/rn-primitives';
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
  const [showRequirements, setShowRequirements] = useState(false);
  const [showCheatsheet, setShowCheatsheet] = useState(false);

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

  // Check if challenge has native version
  const hasNativeVersion = isAssessment
    ? assessment?.hasNativeVersion
    : !!challenge?.nativeSolution;

  // Calculate time based on selected version
  const timeMinutes = selectedVersion === 'native'
    ? (isAssessment
        ? Math.round(item.timeMinutes * 1.33)
        : challenge?.nativeTimeMinutes ?? item.timeMinutes)
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

      {/* Header */}
      <AppHeader
        title="Challenge Hub"
        showThemeToggle
        showPatreonLink
        glow={mode === 'dark'}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Item Type & Difficulty */}
        <VStack spacing="sm">
          <HStack spacing="sm" align="center">
            <Tag
              label={isAssessment ? 'ASSESSMENT' : 'CHALLENGE'}
              color={isAssessment ? 'primary' : 'secondary'}
              size="sm"
              variant="filled"
            />
            <DifficultyBadge difficulty={item.difficulty} />
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

        {/* Version Toggle - Show for items with native versions */}
        {hasNativeVersion && (
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
                  label={`Native (${isAssessment ? Math.round(item.timeMinutes * 1.33) : challenge?.nativeTimeMinutes ?? item.timeMinutes} min)`}
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
                <Tag
                  key={pkg.id}
                  label={pkg.displayName}
                  color="primary"
                  size="sm"
                  variant="outlined"
                />
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
                <Tag
                  key={index}
                  label={skill}
                  color="default"
                  size="sm"
                  variant="outlined"
                />
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

        {/* Instructions & Solutions - GenericChallenge only */}
        {!isAssessment && challenge && (
          <VStack spacing="md">
            {/* Instructions */}
            {challenge.instructions && (
              <>
                <Button
                  label={showInstructions ? "📋 Hide Instructions" : "📋 Show Instructions"}
                  variant="primary"
                  onPress={() => setShowInstructions(!showInstructions)}
                />
                {showInstructions && (
                  <Card variant="filled">
                    <MarkdownViewer content={challenge.instructions} />
                  </Card>
                )}
              </>
            )}

            {/* Cheatsheet */}
            {(selectedVersion === 'packaged' ? challenge.cheatsheet : challenge.nativeCheatsheet) && (
              <>
                <Button
                  label={showCheatsheet ? "📖 Hide Cheatsheet" : "📖 View Cheatsheet"}
                  variant="outline"
                  onPress={() => setShowCheatsheet(!showCheatsheet)}
                />
                {showCheatsheet && (
                  <Card variant="filled">
                    <MarkdownViewer
                      content={selectedVersion === 'packaged' ? challenge.cheatsheet! : challenge.nativeCheatsheet!}
                    />
                  </Card>
                )}
              </>
            )}

            {/* Solution - Show after timer completes or if not started */}
            {(showSolution || !timerStarted) && (
              <>
                <Button
                  label={showSolution ? "✅ Hide Solution" : "👀 Peek at Solution"}
                  variant="ghost"
                  onPress={() => setShowSolution(!showSolution)}
                />
                {showSolution && (
                  <Card variant="filled">
                    <MarkdownViewer
                      content={
                        selectedVersion === 'packaged'
                          ? challenge.solution
                          : challenge.nativeSolution ?? 'Native solution not available'
                      }
                    />
                  </Card>
                )}
              </>
            )}
          </VStack>
        )}

        {/* Action Buttons & Content - Assessments */}
        {isAssessment && (
          <VStack spacing="md">
            {/* Requirements */}
            <Button
              label={showRequirements ? "📋 Hide Requirements" : "📋 View Requirements"}
              variant="primary"
              onPress={() => setShowRequirements(!showRequirements)}
            />
            {showRequirements && (
              <Card variant="filled">
                <MarkdownViewer
                  content={
                    selectedVersion === 'native' && assessment?.nativeChallengeContent
                      ? assessment.nativeChallengeContent
                      : assessment?.challengeContent ?? 'Requirements not available'
                  }
                />
              </Card>
            )}

            {/* Cheatsheet */}
            <Button
              label={showCheatsheet ? "📖 Hide Cheatsheet" : "📖 View Cheatsheet"}
              variant="outline"
              onPress={() => setShowCheatsheet(!showCheatsheet)}
            />
            {showCheatsheet && (
              <Card variant="filled">
                <MarkdownViewer
                  content={
                    selectedVersion === 'native' && assessment?.nativeCheatsheetContent
                      ? assessment.nativeCheatsheetContent
                      : assessment?.cheatsheetContent ?? 'Cheatsheet not available'
                  }
                />
              </Card>
            )}

            {/* Solution - Show after timer completes or if not started */}
            {(showSolution || !timerStarted) && assessment?.solutionContent && (
              <>
                <Button
                  label={showSolution ? "✅ Hide Solution" : "👀 Peek at Solution"}
                  variant="ghost"
                  onPress={() => setShowSolution(!showSolution)}
                />
                {showSolution && (
                  <Card variant="filled">
                    <MarkdownViewer
                      content={
                        selectedVersion === 'native' && assessment?.nativeSolutionContent
                          ? assessment.nativeSolutionContent
                          : assessment?.solutionContent ?? 'Solution not available'
                      }
                    />
                  </Card>
                )}
              </>
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
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
});
