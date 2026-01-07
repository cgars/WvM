/**
 * Unit tests for OpenAIClient
 * Tests API interactions, error handling, and edge cases
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OpenAIClient } from '../services/OpenAIClient';

// Mock fetch
globalThis.fetch = vi.fn() as any;

describe('OpenAIClient', () => {
  let client: OpenAIClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new OpenAIClient('sk-test123');
  });

  it('should successfully test a valid key', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Hi!' } }],
      }),
    } as Response);

    const result = await client.testKey();
    expect(result.success).toBe(true);
  });

  it('should fail test with 401 unauthorized', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 401,
    } as Response);

    const result = await client.testKey();
    expect(result.success).toBe(false);
    expect(result.error?.type).toBe('unauthorized');
  });

  it('should handle rate limiting (429)', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 429,
    } as Response);

    await expect(client.chat([{ role: 'user', content: 'test' }])).rejects.toMatchObject({
      type: 'rate_limit',
    });
  });

  it('should handle network errors', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));
    
    // Mock offline
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });

    await expect(client.chat([{ role: 'user', content: 'test' }])).rejects.toMatchObject({
      type: 'network',
    });
  });

  it('should handle timeout', async () => {
    vi.mocked(fetch).mockImplementation(() => 
      new Promise((resolve) => setTimeout(resolve, 35000))
    );

    await expect(client.chat([{ role: 'user', content: 'test' }])).rejects.toMatchObject({
      type: 'timeout',
    });
  }, 35000);

  it('should successfully get chat response', async () => {
    const mockResponse = 'Das ist eine Antwort';
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: mockResponse } }],
      }),
    } as Response);

    const response = await client.chat([{ role: 'user', content: 'test' }]);
    expect(response).toBe(mockResponse);
  });

  it('should explain text with different depth levels', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Explanation' } }],
      }),
    } as Response);

    await client.explainText('Test text', 'short');
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining('2-3 Sätzen'),
      })
    );

    await client.explainText('Test text', 'deep');
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining('ausführlich'),
      })
    );
  });

  it('should discuss text with user question', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Discussion response' } }],
      }),
    } as Response);

    const response = await client.discussText('Artwork text', 'Was bedeutet das?');
    expect(response).toBe('Discussion response');
  });
});
