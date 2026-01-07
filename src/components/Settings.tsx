import { useState, useEffect } from 'react';
import { apiKeyStore } from '../services/ApiKeyStore';
import { OpenAIClient } from '../services/OpenAIClient';
import './Settings.css';

type KeyStatus = 'not-set' | 'testing' | 'ok' | 'error';

interface SettingsProps {
  onClose: () => void;
}

export function Settings({ onClose }: SettingsProps) {
  const [apiKey, setApiKey] = useState('');
  const [keyStatus, setKeyStatus] = useState<KeyStatus>('not-set');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasExistingKey, setHasExistingKey] = useState(false);

  useEffect(() => {
    checkExistingKey();
  }, []);

  const checkExistingKey = async () => {
    const existingKey = await apiKeyStore.getKey();
    if (existingKey) {
      setHasExistingKey(true);
      setKeyStatus('ok');
    }
  };

  const handleTest = async () => {
    if (!apiKey.trim()) {
      setErrorMessage('Bitte Schlüssel eingeben');
      return;
    }

    setKeyStatus('testing');
    setErrorMessage('');

    try {
      const client = new OpenAIClient(apiKey.trim());
      const result = await client.testKey();

      if (result.success) {
        await apiKeyStore.setKey(apiKey.trim());
        setKeyStatus('ok');
        setHasExistingKey(true);
        setApiKey('');
      } else {
        setKeyStatus('error');
        if (result.error?.type === 'unauthorized') {
          setErrorMessage('Ungültiger Schlüssel');
        } else if (result.error?.type === 'network') {
          setErrorMessage('Keine Verbindung');
        } else if (result.error?.type === 'timeout') {
          setErrorMessage('Zeitüberschreitung');
        } else {
          setErrorMessage('Antwort kam nicht an');
        }
      }
    } catch (error) {
      setKeyStatus('error');
      setErrorMessage('Antwort kam nicht an');
    }
  };

  const handleDelete = async () => {
    try {
      await apiKeyStore.deleteKey();
      setKeyStatus('not-set');
      setHasExistingKey(false);
      setApiKey('');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Löschen fehlgeschlagen');
    }
  };

  const getStatusText = () => {
    switch (keyStatus) {
      case 'not-set':
        return 'Nicht gesetzt';
      case 'testing':
        return 'Teste...';
      case 'ok':
        return 'Verbindung ok';
      case 'error':
        return errorMessage || 'Antwort kam nicht an';
      default:
        return '';
    }
  };

  return (
    <div className="settings">
      <div className="settings-content">
        <button className="settings-close" onClick={onClose}>←</button>
        
        <h2>Eigene Werkzeuge</h2>

        <div className="settings-section">
          <label htmlFor="api-key">OpenAI API Key (optional)</label>
          <input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            disabled={keyStatus === 'testing'}
          />
          
          <div className="settings-status">
            <span className={`status-text status-${keyStatus}`}>
              {getStatusText()}
            </span>
          </div>

          <div className="settings-actions">
            <button 
              onClick={handleTest}
              disabled={keyStatus === 'testing' || !apiKey.trim()}
            >
              Testen
            </button>
            <button 
              onClick={handleDelete}
              disabled={!hasExistingKey || keyStatus === 'testing'}
              className="delete-button"
            >
              Löschen
            </button>
          </div>

          <p className="settings-privacy">Bleibt auf deinem Gerät.</p>
        </div>
      </div>
    </div>
  );
}
