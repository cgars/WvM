/**
 * Unit tests for ApiKeyStore
 * Tests secure storage set/get/delete operations
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Capacitor Preferences
vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

import { Preferences } from '@capacitor/preferences';
import { apiKeyStore } from '../services/ApiKeyStore';

describe('ApiKeyStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null when no key is stored', async () => {
    vi.mocked(Preferences.get).mockResolvedValue({ value: null });
    
    const key = await apiKeyStore.getKey();
    expect(key).toBeNull();
  });

  it('should return stored key', async () => {
    const testKey = 'sk-test123';
    vi.mocked(Preferences.get).mockResolvedValue({ value: testKey });
    
    const key = await apiKeyStore.getKey();
    expect(key).toBe(testKey);
  });

  it('should store a key', async () => {
    const testKey = 'sk-test456';
    vi.mocked(Preferences.set).mockResolvedValue();
    
    await apiKeyStore.setKey(testKey);
    
    expect(Preferences.set).toHaveBeenCalledWith({
      key: 'openai_api_key',
      value: testKey,
    });
  });

  it('should delete a key', async () => {
    vi.mocked(Preferences.remove).mockResolvedValue();
    
    await apiKeyStore.deleteKey();
    
    expect(Preferences.remove).toHaveBeenCalledWith({
      key: 'openai_api_key',
    });
  });

  it('should handle errors gracefully on get', async () => {
    vi.mocked(Preferences.get).mockRejectedValue(new Error('Storage error'));
    
    const key = await apiKeyStore.getKey();
    expect(key).toBeNull();
  });

  it('should throw on set error', async () => {
    vi.mocked(Preferences.set).mockRejectedValue(new Error('Storage error'));
    
    await expect(apiKeyStore.setKey('test')).rejects.toThrow();
  });
});
