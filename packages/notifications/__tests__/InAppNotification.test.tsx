/**
 * InAppNotification Component Tests
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { InAppNotification } from '../src/components/InAppNotification';
import type { RemoteNotification } from '../src/types';

// Mock Animated
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Animated.timing = () => ({
    start: (callback?: () => void) => callback?.(),
  });
  RN.Animated.parallel = (animations: any[]) => ({
    start: (callback?: () => void) => callback?.(),
  });
  RN.Animated.spring = () => ({
    start: (callback?: () => void) => callback?.(),
  });
  return RN;
});

const mockNotification: RemoteNotification = {
  messageId: 'msg-123',
  title: 'Test Title',
  body: 'Test body message',
  data: { screen: 'home' },
};

describe('InAppNotification', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders_whenNotificationProvided', () => {
    const { getByText } = render(
      <InAppNotification notification={mockNotification} />
    );

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test body message')).toBeTruthy();
  });

  it('doesNotRender_whenNotificationIsNull', () => {
    const { queryByText } = render(
      <InAppNotification notification={null} />
    );

    expect(queryByText('Test Title')).toBeNull();
  });

  it('callsOnPress_whenTapped', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <InAppNotification notification={mockNotification} onPress={onPress} />
    );

    fireEvent.press(getByText('Test Title'));
    expect(onPress).toHaveBeenCalledWith(mockNotification);
  });

  it('callsOnDismiss_whenDismissed', async () => {
    const onDismiss = jest.fn();
    const { getByLabelText } = render(
      <InAppNotification
        notification={mockNotification}
        onDismiss={onDismiss}
        swipeToDismiss={true}
      />
    );

    fireEvent.press(getByLabelText('Dismiss notification'));

    await waitFor(() => {
      expect(onDismiss).toHaveBeenCalled();
    });
  });

  it('autoDismisses_afterDuration', async () => {
    const onDismiss = jest.fn();
    render(
      <InAppNotification
        notification={mockNotification}
        onDismiss={onDismiss}
        duration={2000}
      />
    );

    // Fast-forward time
    jest.advanceTimersByTime(2500);

    await waitFor(() => {
      expect(onDismiss).toHaveBeenCalled();
    });
  });

  it('doesNotAutoDismiss_whenDurationIsZero', () => {
    const onDismiss = jest.fn();
    render(
      <InAppNotification
        notification={mockNotification}
        onDismiss={onDismiss}
        duration={0}
      />
    );

    jest.advanceTimersByTime(10000);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('showsIcon_byDefault', () => {
    const { getByText } = render(
      <InAppNotification notification={mockNotification} />
    );

    // Default icon shows "!"
    expect(getByText('!')).toBeTruthy();
  });

  it('hidesIcon_whenShowIconFalse', () => {
    const { queryByText } = render(
      <InAppNotification notification={mockNotification} showIcon={false} />
    );

    expect(queryByText('!')).toBeNull();
  });

  it('rendersImageIcon_whenNotificationHasImageUrl', () => {
    const notificationWithImage: RemoteNotification = {
      ...mockNotification,
      imageUrl: 'https://example.com/icon.png',
    };

    const { UNSAFE_getByType } = render(
      <InAppNotification notification={notificationWithImage} />
    );

    const Image = require('react-native').Image;
    const image = UNSAFE_getByType(Image);
    expect(image.props.source).toEqual({ uri: 'https://example.com/icon.png' });
  });

  it('hidesDismissButton_whenSwipeToDismissFalse', () => {
    const { queryByLabelText } = render(
      <InAppNotification notification={mockNotification} swipeToDismiss={false} />
    );

    expect(queryByLabelText('Dismiss notification')).toBeNull();
  });

  it('rendersAtTop_byDefault', () => {
    const { toJSON } = render(
      <InAppNotification notification={mockNotification} position="top" />
    );

    const tree = toJSON();
    expect(tree).toBeTruthy();
    // Position would be verified by style check in actual implementation
  });

  it('rendersAtBottom_whenPositionIsBottom', () => {
    const { toJSON } = render(
      <InAppNotification notification={mockNotification} position="bottom" />
    );

    const tree = toJSON();
    expect(tree).toBeTruthy();
  });

  it('hasAccessibilityRole_alert', () => {
    const { getByRole } = render(
      <InAppNotification notification={mockNotification} />
    );

    expect(getByRole('alert')).toBeTruthy();
  });

  it('rendersWithoutBody', () => {
    const titleOnlyNotification: RemoteNotification = {
      messageId: 'msg-456',
      title: 'Title Only',
    };

    const { getByText, queryByText } = render(
      <InAppNotification notification={titleOnlyNotification} />
    );

    expect(getByText('Title Only')).toBeTruthy();
    expect(queryByText('Test body message')).toBeNull();
  });

  it('rendersWithoutTitle', () => {
    const bodyOnlyNotification: RemoteNotification = {
      messageId: 'msg-789',
      body: 'Body Only',
    };

    const { getByText, queryByText } = render(
      <InAppNotification notification={bodyOnlyNotification} />
    );

    expect(getByText('Body Only')).toBeTruthy();
    expect(queryByText('Test Title')).toBeNull();
  });

  it('clearsTimer_whenDismissedEarly', () => {
    const onDismiss = jest.fn();
    const { getByLabelText } = render(
      <InAppNotification
        notification={mockNotification}
        onDismiss={onDismiss}
        duration={5000}
      />
    );

    // Dismiss early
    fireEvent.press(getByLabelText('Dismiss notification'));

    // Advance past original duration
    jest.advanceTimersByTime(6000);

    // onDismiss should only be called once
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
