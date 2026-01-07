import { useState, useEffect } from 'react';
import { apiKeyStore } from '../services/ApiKeyStore';
import { OpenAIClient } from '../services/OpenAIClient';

export function useApiKey() {
  const [hasKey, setHasKey] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkKey = async () => {
    const key = await apiKeyStore.getKey();
    setHasKey(!!key);
    setLoading(false);
  };

  useEffect(() => {
    checkKey();
  }, []);

  const getClient = async (): Promise<OpenAIClient | null> => {
    const key = await apiKeyStore.getKey();
    if (!key) return null;
    return new OpenAIClient(key);
  };

  return {
    hasKey,
    loading,
    getClient,
    refreshKey: checkKey,
  };
}
