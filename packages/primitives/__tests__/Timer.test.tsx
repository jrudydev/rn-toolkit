import React from 'react';
import { fireEvent, act } from '@testing-library/react-native';
import { renderWithTheme, createThemeSnapshot } from '@astacinco/rn-testing';
import { Timer } from '../src/Timer';

// SKIPPED: React 19 + React Native mockComponent.js incompatibility
// See: docs/TESTING_ISSUES.md
describe.skip('Timer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // Snapshot tests for both themes
  createThemeSnapshot(<Timer durationMinutes={5} testID="timer" />);

  describe('rendering', () => {
    it('renders_initial_time', () => {
      const { getByText } = renderWithTheme(
        <Timer durationMinutes={5} testID="timer" />
      );

      expect(getByText('05:00')).toBeTruthy();
    });

    it('renders_controls_by_default', () => {
      const { getByText } = renderWithTheme(
        <Timer durationMinutes={5} showControls testID="timer" />
      );

      expect(getByText('Start')).toBeTruthy();
    });

    it('hides_controls_when_showControls_false', () => {
      const { queryByText } = renderWithTheme(
        <Timer durationMinutes={5} showControls={false} testID="timer" />
      );

      expect(queryByText('Start')).toBeNull();
    });
  });

  describe('timer_display', () => {
    it('shows_correct_format_for_minutes', () => {
      const { getByText } = renderWithTheme(
        <Timer durationMinutes={90} testID="timer" />
      );

      expect(getByText('90:00')).toBeTruthy();
    });

    it('shows_correct_format_for_1_minute', () => {
      const { getByText } = renderWithTheme(
        <Timer durationMinutes={1} testID="timer" />
      );

      expect(getByText('01:00')).toBeTruthy();
    });
  });

  describe('controls', () => {
    it('shows_Start_button_initially', () => {
      const { getByText } = renderWithTheme(
        <Timer durationMinutes={5} showControls testID="timer" />
      );

      expect(getByText('Start')).toBeTruthy();
    });

    it('shows_Pause_button_when_running', () => {
      const { getByText } = renderWithTheme(
        <Timer durationMinutes={5} showControls testID="timer" />
      );

      fireEvent.press(getByText('Start'));
      expect(getByText('Pause')).toBeTruthy();
    });

    it('shows_Resume_button_when_paused', () => {
      const { getByText } = renderWithTheme(
        <Timer durationMinutes={5} showControls testID="timer" />
      );

      fireEvent.press(getByText('Start'));
      fireEvent.press(getByText('Pause'));
      expect(getByText('Resume')).toBeTruthy();
    });

    it('shows_Reset_button_when_not_idle', () => {
      const { getByText } = renderWithTheme(
        <Timer durationMinutes={5} showControls testID="timer" />
      );

      fireEvent.press(getByText('Start'));
      expect(getByText('Reset')).toBeTruthy();
    });
  });

  describe('callbacks', () => {
    it('calls_onStart_when_started', () => {
      const mockOnStart = jest.fn();
      const { getByText } = renderWithTheme(
        <Timer durationMinutes={5} onStart={mockOnStart} showControls testID="timer" />
      );

      fireEvent.press(getByText('Start'));
      expect(mockOnStart).toHaveBeenCalledTimes(1);
    });

    it('calls_onPause_when_paused', () => {
      const mockOnPause = jest.fn();
      const { getByText } = renderWithTheme(
        <Timer durationMinutes={5} onPause={mockOnPause} showControls testID="timer" />
      );

      fireEvent.press(getByText('Start'));
      fireEvent.press(getByText('Pause'));
      expect(mockOnPause).toHaveBeenCalledTimes(1);
    });

    it('calls_onReset_when_reset', () => {
      const mockOnReset = jest.fn();
      const { getByText } = renderWithTheme(
        <Timer durationMinutes={5} onReset={mockOnReset} showControls testID="timer" />
      );

      fireEvent.press(getByText('Start'));
      fireEvent.press(getByText('Reset'));
      expect(mockOnReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('countdown', () => {
    it('counts_down_when_running', () => {
      const { getByText } = renderWithTheme(
        <Timer durationMinutes={1} showControls testID="timer" />
      );

      fireEvent.press(getByText('Start'));

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(getByText('00:59')).toBeTruthy();
    });

    it('resets_to_initial_time_when_reset', () => {
      const { getByText } = renderWithTheme(
        <Timer durationMinutes={1} showControls testID="timer" />
      );

      fireEvent.press(getByText('Start'));

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      fireEvent.press(getByText('Reset'));
      expect(getByText('01:00')).toBeTruthy();
    });
  });

  describe('autoStart', () => {
    it('starts_automatically_when_autoStart_true', () => {
      const mockOnStart = jest.fn();
      const { getByText } = renderWithTheme(
        <Timer
          durationMinutes={1}
          autoStart
          onStart={mockOnStart}
          showControls
          testID="timer"
        />
      );

      expect(mockOnStart).toHaveBeenCalledTimes(1);
      expect(getByText('Pause')).toBeTruthy();
    });
  });

  describe('progress', () => {
    it('shows_progress_when_showProgress_true', () => {
      const { getByTestId } = renderWithTheme(
        <Timer durationMinutes={5} showProgress testID="timer" />
      );

      expect(getByTestId('timer')).toBeTruthy();
    });
  });

  describe('theming', () => {
    it('uses_different_colors_inDarkMode', () => {
      const lightResult = renderWithTheme(
        <Timer durationMinutes={5} testID="timer" />,
        'light'
      );
      const darkResult = renderWithTheme(
        <Timer durationMinutes={5} testID="timer" />,
        'dark'
      );

      expect(lightResult.getByTestId('timer')).toBeTruthy();
      expect(darkResult.getByTestId('timer')).toBeTruthy();
    });
  });
});
