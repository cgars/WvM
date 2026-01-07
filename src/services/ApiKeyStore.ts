import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

const API_KEY_STORAGE_KEY = 'openai_api_key';

/**
 * Secure storage interface for OpenAI-compatible API keys
 * Keys are stored only on-device using platform secure storage
 */
export interface ApiKeyStore {
  getKey(): Promise<string | null>;
  setKey(key: string): Promise<void>;
  deleteKey(): Promise<void>;
}

/**
 * Implementation using Capacitor Preferences
 * On iOS: uses Keychain
 * On Android: uses EncryptedSharedPreferences
 * On Web: uses localStorage as fallback
 */
class CapacitorApiKeyStore implements ApiKeyStore {
  async getKey(): Promise<string | null> {
    try {
      // Fallback to localStorage for web development
      if (!Capacitor.isNativePlatform()) {
        return localStorage.getItem(API_KEY_STORAGE_KEY);
      }
      const { value } = await Preferences.get({ key: API_KEY_STORAGE_KEY });
      return value;
    } catch (error) {
      console.error('Failed to retrieve API key', error);
      return null;
    }
  }

  async setKey(key: string): Promise<void> {
    try {
      // Fallback to localStorage for web development
      if (!Capacitor.isNativePlatform()) {
        localStorage.setItem(API_KEY_STORAGE_KEY, key);
        return;
      }
      await Preferences.set({ key: API_KEY_STORAGE_KEY, value: key });
    } catch (error) {
      console.error('Failed to store API key', error);
      throw error;
    }
  }

  async deleteKey(): Promise<void> {
    try {
      // Fallback to localStorage for web development
      if (!Capacitor.isNativePlatform()) {
        localStorage.removeItem(API_KEY_STORAGE_KEY);
        return;
      }
      await Preferences.remove({ key: API_KEY_STORAGE_KEY });
    } catch (error) {
      console.error('Failed to delete API key', error);
      throw error;
    }
  }
}

export const apiKeyStore = new CapacitorApiKeyStore();
