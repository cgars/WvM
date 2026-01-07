# Bring Your Own API Key (BYO Key) Feature

## Overview

The MuseumApp now supports optional user-provided OpenAI-compatible API keys for enhanced online AI assistance. The app remains **fully functional without any API key**.

## Key Principles

- ✅ App works 100% without any API key
- ✅ BYO Key is optional, non-prominent, never blocks core flows
- ✅ Key is never used automatically - only after explicit user action
- ✅ Minimal UI - no onboarding, no upsell, no technical jargon
- ✅ Secure on-device storage only

## User Experience

### Settings Screen

Access: Tap the ⚙ icon on the main screen → "Eigene Werkzeuge"

Features:
- **OpenAI API Key (optional)** input field (secure text)
- **Testen** button - validates the key with a lightweight API call
- **Löschen** button - removes the stored key
- Status display:
  - "Nicht gesetzt" - no key configured
  - "Verbindung ok" - key is valid
  - "Antwort kam nicht an" - connection failed
- Privacy notice: "Bleibt auf deinem Gerät."

### Main Flow Integration

After OCR result screen (Post-Reading):

**Without API Key:**
- Standard offline options remain available
- Shows hint: "Online (eigener Schlüssel nötig)"

**With API Key:**
- "Tiefe öffnen (online)" - get AI explanation of the text
  - Choose depth: kurz / mittel / tief
- "Drüber quatschen (online)" - ask questions about the text

**When Offline:**
- Shows: "Online (Offline)"
- Online buttons are disabled

## Security & Privacy

### Storage
- Keys are stored using platform secure storage:
  - **iOS**: Keychain
  - **Android**: EncryptedSharedPreferences
- Implemented via Capacitor Preferences plugin
- Keys never leave the device
- No logging, no analytics, no crash reports include keys

### API Communication
- HTTPS only
- Bearer token authentication
- Configurable timeout (30 seconds)
- No fallback or app-owned keys

## Technical Implementation

### Core Modules

#### 1. ApiKeyStore (`src/services/ApiKeyStore.ts`)
```typescript
interface ApiKeyStore {
  getKey(): Promise<string | null>;
  setKey(key: string): Promise<void>;
  deleteKey(): Promise<void>;
}
```

#### 2. OpenAIClient (`src/services/OpenAIClient.ts`)
```typescript
class OpenAIClient {
  testKey(): Promise<{ success: boolean; error?: ApiError }>;
  explainText(text: string, depth: 'short' | 'medium' | 'deep'): Promise<string>;
  discussText(text: string, userQuestion: string): Promise<string>;
}
```

#### 3. useApiKey Hook (`src/hooks/useApiKey.ts`)
```typescript
const { hasKey, getClient, refreshKey } = useApiKey();
```

### Error Handling

All errors are mapped to user-friendly German messages:

| Error Type | User Message |
|------------|--------------|
| `unauthorized` | "Ungültiger Schlüssel" |
| `network` | "Offline" or "Verbindung fehlgeschlagen" |
| `rate_limit` | "Zu viele Anfragen" |
| `timeout` | "Zeitüberschreitung" |
| `unknown` | "Antwort kam nicht an" |

### API Configuration

Internal constants (not exposed in UI):
```typescript
const CONFIG = {
  baseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4o-mini',
  timeout: 30000, // 30 seconds
};
```

## Testing

Unit tests are included for:
- ✅ Key storage operations (set/get/delete)
- ✅ API client behavior
- ✅ Error mapping (401, 429, offline, timeout)
- ✅ Feature gating logic

Run tests:
```bash
npm test
```

## Edge Cases Handled

1. **No API Key**: Online features hidden with gentle hint
2. **Invalid Key**: Shows "Ungültiger Schlüssel", allows retry or delete
3. **Offline**: Detects offline state, disables online actions
4. **Rate Limited**: Shows "Zu viele Anfragen" with neutral message
5. **Timeout**: Shows "Zeitüberschreitung" after 30 seconds
6. **Network Errors**: Shows "Verbindung fehlgeschlagen"

## Dependencies Added

- `@capacitor/preferences` - Secure on-device storage
- `vitest` (dev) - Unit testing framework

## Privacy & Compliance

- **No data collection**: Keys stored only on device
- **No telemetry**: API key never logged or transmitted except to user's chosen endpoint
- **User control**: Easy deletion via settings
- **Transparency**: Clear privacy notice in UI

## Future Enhancements (Optional)

- Support for custom base URLs (for Azure, local models, etc.)
- Model selection in settings
- Token usage tracking (local only)
- Conversation history (local only)

## Development Notes

### Adding New Online Features

1. Check `hasKey` via `useApiKey()` hook
2. Gate feature availability in UI
3. Handle all error types from `OpenAIClient`
4. Never auto-trigger - require explicit user action
5. Keep UI calm and minimal

### Capacitor Sync

After code changes, sync with native platforms:
```bash
npx cap sync
```

## Support

For issues or questions about the BYO Key feature, refer to:
- API Key Storage: `src/services/ApiKeyStore.ts`
- API Client: `src/services/OpenAIClient.ts`
- Settings UI: `src/components/Settings.tsx`
- Integration: `src/App.tsx`
