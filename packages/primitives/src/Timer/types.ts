import type { ViewStyle, StyleProp } from 'react-native';

export type TimerState = 'idle' | 'running' | 'paused' | 'completed';

export interface TimerProps {
  /**
   * Duration in minutes
   */
  durationMinutes: number;

  /**
   * Callback when timer completes
   */
  onComplete?: () => void;

  /**
   * Callback when timer starts
   */
  onStart?: () => void;

  /**
   * Callback when timer pauses
   */
  onPause?: () => void;

  /**
   * Callback when timer resets
   */
  onReset?: () => void;

  /**
   * Callback on each tick with remaining seconds
   */
  onTick?: (remainingSeconds: number) => void;

  /**
   * Auto-start the timer
   * @default false
   */
  autoStart?: boolean;

  /**
   * Threshold in seconds for "low time" warning
   * @default 300 (5 minutes)
   */
  lowTimeThreshold?: number;

  /**
   * Show progress bar
   * @default true
   */
  showProgress?: boolean;

  /**
   * Show controls (start/pause/reset buttons)
   * @default true
   */
  showControls?: boolean;

  /**
   * Custom container style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Test ID for testing
   */
  testID?: string;
}
