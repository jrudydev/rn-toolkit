import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@astacinco/rn-theming';
import { Text } from '../Text';
import { Button } from '../Button';
import { Card } from '../Card';
import { VStack, HStack } from '../Stack';
import type { TimerProps, TimerState } from './types';

export function Timer({
  durationMinutes,
  onComplete,
  onStart,
  onPause,
  onReset,
  onTick,
  autoStart = false,
  lowTimeThreshold = 300,
  showProgress = true,
  showControls = true,
  style,
  testID,
}: TimerProps) {
  const { colors } = useTheme();
  const [state, setState] = useState<TimerState>(autoStart ? 'running' : 'idle');
  const [remainingSeconds, setRemainingSeconds] = useState(durationMinutes * 60);

  // Format time as MM:SS or HH:MM:SS
  const formatTime = useCallback((totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  }, []);

  // Timer effect
  useEffect(() => {
    if (state !== 'running') return;

    const interval = setInterval(() => {
      setRemainingSeconds(prev => {
        const newValue = prev - 1;
        onTick?.(newValue);

        if (newValue <= 0) {
          setState('completed');
          onComplete?.();
          return 0;
        }
        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state, onComplete, onTick]);

  // Reset when duration changes
  useEffect(() => {
    setRemainingSeconds(durationMinutes * 60);
  }, [durationMinutes]);

  // Handlers
  const handleStart = () => {
    setState('running');
    onStart?.();
  };

  const handlePause = () => {
    setState('paused');
    onPause?.();
  };

  const handleResume = () => {
    setState('running');
  };

  const handleReset = () => {
    setState('idle');
    setRemainingSeconds(durationMinutes * 60);
    onReset?.();
  };

  // Calculate progress
  const totalSeconds = durationMinutes * 60;
  const progress = (totalSeconds - remainingSeconds) / totalSeconds;
  const isLowTime = remainingSeconds < lowTimeThreshold && remainingSeconds > 0;

  return (
    <Card variant="elevated" style={style} testID={testID}>
      <VStack spacing="md" align="center">
        {/* Time Display */}
        <Text
          variant="title"
          style={styles.time}
          color={isLowTime && state === 'running' ? colors.error : colors.text}
        >
          {formatTime(remainingSeconds)}
        </Text>

        {/* Progress Bar */}
        {showProgress && (
          <View style={[styles.progressContainer, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${progress * 100}%`,
                  backgroundColor: isLowTime ? colors.error : colors.primary,
                },
              ]}
            />
          </View>
        )}

        {/* Status */}
        <Text variant="caption" color={colors.textSecondary}>
          {state === 'idle' && `${durationMinutes} minutes`}
          {state === 'running' && 'Time remaining'}
          {state === 'paused' && 'Paused'}
          {state === 'completed' && "Time's up!"}
        </Text>

        {/* Controls */}
        {showControls && (
          <HStack spacing="sm">
            {state === 'idle' && (
              <Button label="Start Timer" variant="primary" onPress={handleStart} />
            )}
            {state === 'running' && (
              <Button label="Pause" variant="outline" onPress={handlePause} />
            )}
            {state === 'paused' && (
              <>
                <Button label="Resume" variant="primary" onPress={handleResume} />
                <Button label="Reset" variant="ghost" onPress={handleReset} />
              </>
            )}
            {state === 'completed' && (
              <Button label="Reset" variant="outline" onPress={handleReset} />
            )}
          </HStack>
        )}
      </VStack>
    </Card>
  );
}

const styles = StyleSheet.create({
  time: {
    fontSize: 48,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  progressContainer: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
});
