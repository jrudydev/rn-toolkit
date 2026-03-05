// Mock expo-secure-store before importing SecureStorage
jest.mock('expo-secure-store');

import { SecureStorage } from '../src/storage/SecureStorage';
import * as ExpoSecureStore from 'expo-secure-store';

// Get access to the mock helpers
const mockStore = ExpoSecureStore as typeof ExpoSecureStore & {
  __clearStore: () => void;
};

describe('SecureStorage', () => {
  beforeEach(() => {
    mockStore.__clearStore();
  });

  describe('set and get', () => {
    it('stores_and_retrieves_value', async () => {
      await SecureStorage.set('test_key', 'test_value');
      const result = await SecureStorage.get('test_key');

      expect(result).toBe('test_value');
    });

    it('returns_null_for_missing_key', async () => {
      const result = await SecureStorage.get('nonexistent_key');

      expect(result).toBeNull();
    });

    it('overwrites_existing_value', async () => {
      await SecureStorage.set('key', 'value1');
      await SecureStorage.set('key', 'value2');

      const result = await SecureStorage.get('key');
      expect(result).toBe('value2');
    });
  });

  describe('delete', () => {
    it('removes_stored_value', async () => {
      await SecureStorage.set('key', 'value');
      await SecureStorage.delete('key');

      const result = await SecureStorage.get('key');
      expect(result).toBeNull();
    });

    it('handles_deleting_nonexistent_key', async () => {
      // Should not throw
      await expect(SecureStorage.delete('nonexistent')).resolves.not.toThrow();
    });
  });

  describe('has', () => {
    it('returns_true_when_key_exists', async () => {
      await SecureStorage.set('key', 'value');

      const result = await SecureStorage.has('key');
      expect(result).toBe(true);
    });

    it('returns_false_when_key_missing', async () => {
      const result = await SecureStorage.has('nonexistent');
      expect(result).toBe(false);
    });
  });

  describe('setJSON and getJSON', () => {
    it('stores_and_retrieves_object', async () => {
      const obj = { id: '123', name: 'John', active: true };
      await SecureStorage.setJSON('user', obj);

      const result = await SecureStorage.getJSON('user');
      expect(result).toEqual(obj);
    });

    it('stores_and_retrieves_array', async () => {
      const arr = [1, 2, 3, 'four'];
      await SecureStorage.setJSON('items', arr);

      const result = await SecureStorage.getJSON('items');
      expect(result).toEqual(arr);
    });

    it('returns_null_for_missing_key', async () => {
      const result = await SecureStorage.getJSON('nonexistent');
      expect(result).toBeNull();
    });

    it('handles_nested_objects', async () => {
      const nested = {
        user: {
          profile: {
            settings: {
              theme: 'dark',
            },
          },
        },
      };
      await SecureStorage.setJSON('nested', nested);

      const result = await SecureStorage.getJSON('nested');
      expect(result).toEqual(nested);
    });
  });

  describe('isAvailable', () => {
    it('returns_availability_status', async () => {
      const result = await SecureStorage.isAvailable();
      expect(typeof result).toBe('boolean');
    });
  });
});
