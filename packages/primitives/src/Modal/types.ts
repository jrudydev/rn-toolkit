import type { ReactNode } from 'react';

export interface ModalAction {
  /**
   * Button label
   */
  label: string;

  /**
   * Press handler
   */
  onPress: () => void;

  /**
   * Button variant
   * @default 'primary' for last action, 'outline' for others
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
}

export interface ModalProps {
  /**
   * Whether the modal is visible
   */
  visible: boolean;

  /**
   * Callback when modal is dismissed
   */
  onDismiss: () => void;

  /**
   * Modal title
   */
  title: string;

  /**
   * Modal message/content
   */
  message?: string;

  /**
   * Action buttons
   */
  actions?: ModalAction[];

  /**
   * Whether to show close button
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * Whether to close on backdrop press
   * @default true
   */
  closeOnBackdropPress?: boolean;

  /**
   * Custom content to render instead of message
   */
  children?: ReactNode;

  /**
   * Test ID
   */
  testID?: string;
}
