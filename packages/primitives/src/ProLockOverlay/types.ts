/**
 * ProLockOverlay types
 */

export interface ProLockOverlayProps {
  /**
   * Callback when unlock button is pressed
   */
  onUnlockPress: () => void;

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
