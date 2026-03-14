/**
 * ProLockOverlay types
 */

export interface ProLockOverlayProps {
  /**
   * Callback when unlock button is pressed
   */
  onUnlockPress: () => void;

  /**
   * Callback when close/cancel button is pressed
   * If not provided, close button will not be shown
   */
  onClose?: () => void;

  /**
   * Custom message to display
   * @default 'Unlock with Pro to access this content'
   */
  message?: string;

  /**
   * Button label text
   * @default 'Unlock Pro Content'
   */
  buttonLabel?: string;
}
