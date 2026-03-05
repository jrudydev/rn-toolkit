import * as ExpoSecureStore from 'expo-secure-store';
import type { SecureStorageOptions, KeychainAccessibility } from '../types';

/**
 * Map our accessibility options to Expo's
 */
const accessibilityMap: Record<KeychainAccessibility, ExpoSecureStore.SecureStoreOptions['keychainAccessible']> = {
  WHEN_UNLOCKED: ExpoSecureStore.WHEN_UNLOCKED,
  AFTER_FIRST_UNLOCK: ExpoSecureStore.AFTER_FIRST_UNLOCK,
  ALWAYS: ExpoSecureStore.ALWAYS,
  WHEN_PASSCODE_SET_THIS_DEVICE_ONLY: ExpoSecureStore.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: ExpoSecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: ExpoSecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
};

/**
 * Convert our options to Expo's options
 */
function toExpoOptions(options?: SecureStorageOptions): ExpoSecureStore.SecureStoreOptions {
  if (!options) return {};

  const expoOptions: ExpoSecureStore.SecureStoreOptions = {};

  if (options.requireBiometric) {
    expoOptions.requireAuthentication = true;
  }

  if (options.keychainAccessible) {
    expoOptions.keychainAccessible = accessibilityMap[options.keychainAccessible];
  }

  return expoOptions;
}

/**
 * SecureStorage
 *
 * A secure storage wrapper around expo-secure-store that provides
 * Keychain (iOS) and Keystore (Android) secure storage.
 *
 * @example
 * ```typescript
 * // Store a token
 * await SecureStorage.set('auth_token', 'secret-token');
 *
 * // Retrieve a token
 * const token = await SecureStorage.get('auth_token');
 *
 * // Store with biometric protection
 * await SecureStorage.set('sensitive_data', 'value', {
 *   requireBiometric: true,
 * });
 * ```
 */
export const SecureStorage = {
  /**
   * Store a string value securely
   *
   * @param key - Storage key
   * @param value - Value to store
   * @param options - Storage options
   */
  async set(key: string, value: string, options?: SecureStorageOptions): Promise<void> {
    const expoOptions = toExpoOptions(options);
    await ExpoSecureStore.setItemAsync(key, value, expoOptions);
  },

  /**
   * Retrieve a stored string value
   *
   * @param key - Storage key
   * @param options - Storage options (must match set options)
   * @returns The stored value or null if not found
   */
  async get(key: string, options?: SecureStorageOptions): Promise<string | null> {
    const expoOptions = toExpoOptions(options);
    return ExpoSecureStore.getItemAsync(key, expoOptions);
  },

  /**
   * Delete a stored value
   *
   * @param key - Storage key
   * @param options - Storage options
   */
  async delete(key: string, options?: SecureStorageOptions): Promise<void> {
    const expoOptions = toExpoOptions(options);
    await ExpoSecureStore.deleteItemAsync(key, expoOptions);
  },

  /**
   * Check if a key exists in secure storage
   *
   * @param key - Storage key
   * @param options - Storage options
   * @returns True if the key exists
   */
  async has(key: string, options?: SecureStorageOptions): Promise<boolean> {
    const value = await SecureStorage.get(key, options);
    return value !== null;
  },

  /**
   * Store a JSON object securely
   *
   * @param key - Storage key
   * @param value - Object to store
   * @param options - Storage options
   */
  async setJSON<T>(key: string, value: T, options?: SecureStorageOptions): Promise<void> {
    const jsonString = JSON.stringify(value);
    await SecureStorage.set(key, jsonString, options);
  },

  /**
   * Retrieve a stored JSON object
   *
   * @param key - Storage key
   * @param options - Storage options
   * @returns The stored object or null if not found
   */
  async getJSON<T>(key: string, options?: SecureStorageOptions): Promise<T | null> {
    const jsonString = await SecureStorage.get(key, options);
    if (jsonString === null) return null;

    try {
      return JSON.parse(jsonString) as T;
    } catch {
      console.warn(`SecureStorage: Failed to parse JSON for key "${key}"`);
      return null;
    }
  },

  /**
   * Check if secure storage is available on this device
   *
   * @returns True if secure storage is available
   */
  async isAvailable(): Promise<boolean> {
    return ExpoSecureStore.isAvailableAsync();
  },
};
