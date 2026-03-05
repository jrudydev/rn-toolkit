/**
 * InAppNotification Component
 *
 * Displays in-app notifications with customizable appearance and behavior.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import type { InAppNotificationProps } from '../types';

const DEFAULT_DURATION = 4000;
const ANIMATION_DURATION = 300;

export function InAppNotification({
  notification,
  onDismiss,
  onPress,
  duration = DEFAULT_DURATION,
  position = 'top',
  style,
  containerStyle,
  showIcon = true,
  icon,
  swipeToDismiss = true,
}: InAppNotificationProps) {
  const [visible, setVisible] = useState(false);
  const translateY = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    // Clear the auto-dismiss timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: position === 'top' ? -100 : 100,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      onDismiss?.();
    });
  }, [translateY, opacity, position, onDismiss]);

  const show = useCallback(() => {
    setVisible(true);
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();

    if (duration > 0) {
      timerRef.current = setTimeout(dismiss, duration);
    }
  }, [translateY, opacity, duration, dismiss]);

  useEffect(() => {
    if (notification) {
      show();
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [notification, show]);

  const handlePress = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    dismiss();
    onPress?.(notification!);
  }, [dismiss, onPress, notification]);

  if (!visible || !notification) {
    return null;
  }

  const positionStyle = position === 'top' ? styles.positionTop : styles.positionBottom;

  return (
    <Animated.View
      style={[
        styles.container,
        positionStyle,
        containerStyle,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Pressable
        style={[styles.notification, style]}
        onPress={handlePress}
        accessibilityRole="alert"
        accessibilityLabel={`Notification: ${notification.title || ''} ${notification.body || ''}`}
      >
        {showIcon && (
          <View style={styles.iconContainer}>
            {icon ? (
              <Image source={icon as ImageSourcePropType} style={styles.icon} />
            ) : notification.imageUrl ? (
              <Image source={{ uri: notification.imageUrl }} style={styles.icon} />
            ) : (
              <View style={styles.defaultIcon}>
                <Text style={styles.defaultIconText}>!</Text>
              </View>
            )}
          </View>
        )}
        <View style={styles.content}>
          {notification.title && (
            <Text style={styles.title} numberOfLines={1}>
              {notification.title}
            </Text>
          )}
          {notification.body && (
            <Text style={styles.body} numberOfLines={2}>
              {notification.body}
            </Text>
          )}
        </View>
        {swipeToDismiss && (
          <Pressable
            style={styles.dismissButton}
            onPress={dismiss}
            accessibilityLabel="Dismiss notification"
            accessibilityRole="button"
          >
            <Text style={styles.dismissText}>x</Text>
          </Pressable>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 16,
  },
  positionTop: {
    top: 50,
  },
  positionBottom: {
    bottom: 50,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  defaultIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#4a90d9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultIconText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  body: {
    color: '#ccc',
    fontSize: 14,
  },
  dismissButton: {
    padding: 8,
    marginLeft: 8,
  },
  dismissText: {
    color: '#888',
    fontSize: 18,
  },
});
