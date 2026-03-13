/**
 * Modal Component
 *
 * Theme-aware modal dialog for confirmations and alerts.
 */

import React from 'react';
import {
  Modal as RNModal,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { useTheme } from '@astacinco/rn-theming';
import { Text } from '../Text';
import { Button } from '../Button';
import { VStack, HStack } from '../Stack';
import type { ModalProps } from './types';

export function Modal({
  visible,
  onDismiss,
  title,
  message,
  actions,
  showCloseButton = true,
  closeOnBackdropPress = true,
  children,
  testID,
}: ModalProps) {
  const { colors } = useTheme();

  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onDismiss();
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
      testID={testID}
    >
      <Pressable
        style={styles.backdrop}
        onPress={handleBackdropPress}
      >
        <Pressable
          style={[
            styles.container,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <VStack spacing="md">
            {/* Header */}
            <HStack justify="space-between" align="center">
              <Text variant="subtitle">{title}</Text>
              {showCloseButton && (
                <Pressable
                  onPress={onDismiss}
                  style={[styles.closeButton, { backgroundColor: colors.surfaceElevated }]}
                  hitSlop={8}
                >
                  <Text variant="body" color={colors.textSecondary}>✕</Text>
                </Pressable>
              )}
            </HStack>

            {/* Content */}
            {message && (
              <Text variant="body" color={colors.textSecondary}>
                {message}
              </Text>
            )}
            {children}

            {/* Actions */}
            {actions && actions.length > 0 && (
              <HStack spacing="sm" justify="end" style={styles.actions}>
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    label={action.label}
                    variant={action.variant || (index === actions.length - 1 ? 'primary' : 'outline')}
                    onPress={action.onPress}
                    size="sm"
                  />
                ))}
              </HStack>
            )}
          </VStack>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    width: Math.min(width - 48, 400),
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    marginTop: 8,
  },
});
