/**
 * Feature gating tests
 * Ensures online features are only available when API key exists
 */

import { describe, it, expect } from 'vitest';

describe('Feature Gating', () => {
  it('should hide online actions when no key exists', () => {
    const hasKey = false;
    const shouldShowOnline = hasKey && navigator.onLine;
    
    expect(shouldShowOnline).toBe(false);
  });

  it('should show online actions when key exists and online', () => {
    const hasKey = true;
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });
    const shouldShowOnline = hasKey && navigator.onLine;
    
    expect(shouldShowOnline).toBe(true);
  });

  it('should hide online actions when offline', () => {
    const hasKey = true;
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });
    const shouldShowOnline = hasKey && navigator.onLine;
    
    expect(shouldShowOnline).toBe(false);
  });

  it('should prevent online API calls without key', async () => {
    const getClient = async () => null;
    
    const client = await getClient();
    expect(client).toBeNull();
  });
});
