/**
 * Mock for expo-secure-store
 */

const store: Map<string, string> = new Map();

export const WHEN_UNLOCKED = 1;
export const AFTER_FIRST_UNLOCK = 2;
export const ALWAYS = 3;
export const WHEN_PASSCODE_SET_THIS_DEVICE_ONLY = 4;
export const WHEN_UNLOCKED_THIS_DEVICE_ONLY = 5;
export const AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY = 6;

export async function setItemAsync(key: string, value: string): Promise<void> {
  store.set(key, value);
}

export async function getItemAsync(key: string): Promise<string | null> {
  return store.get(key) ?? null;
}

export async function deleteItemAsync(key: string): Promise<void> {
  store.delete(key);
}

export async function isAvailableAsync(): Promise<boolean> {
  return true;
}

// Test helper to clear the store
export function __clearStore(): void {
  store.clear();
}
