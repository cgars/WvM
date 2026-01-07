# BYO Key Feature - Quick Start Guide

## 🎯 For Users

### Without API Key (Default Behavior)
```
📱 Open App
 ↓
📸 Take Photo of Artwork
 ↓
📝 OCR Extracts Text
 ↓
🔊 Listen to Text (Vorlesen)
 ↓
💭 Choose:
   • Tiefe öffnen (offline avatars)
   • Weitergehen (back to museum)
   • Push-to-talk (voice input)
   
✅ Everything works perfectly!
```

### With API Key (Optional Enhancement)
```
📱 Open App
 ↓
⚙️ Tap Settings Icon → "Eigene Werkzeuge"
 ↓
🔑 Enter OpenAI API Key → "Testen"
 ↓
✅ "Verbindung ok"
 ↓
🔙 Back to App
 ↓
📸 Take Photo of Artwork
 ↓
📝 OCR Extracts Text
 ↓
🔊 Listen to Text (Vorlesen)
 ↓
💭 Choose:
   • Tiefe öffnen (offline avatars)
   • 🌐 Tiefe öffnen (online) ← NEW!
   • 🌐 Drüber quatschen (online) ← NEW!
   • Weitergehen (back to museum)
   
✨ Enhanced with AI assistance!
```

---

## 🛠️ For Developers

### File Structure
```
src/
├── services/
│   ├── ApiKeyStore.ts          # Secure storage (Keychain/Encrypted)
│   └── OpenAIClient.ts         # OpenAI API client
├── components/
│   ├── Settings.tsx            # Settings UI
│   └── Settings.css
├── hooks/
│   └── useApiKey.ts            # Key availability hook
├── __tests__/
│   ├── ApiKeyStore.test.ts
│   ├── OpenAIClient.test.ts
│   └── FeatureGating.test.ts
└── App.tsx                     # Main app with integrated features
```

### Key Integration Points

#### 1. Settings Access
```typescript
// In waiting screen
<button onClick={openSettings} className="settings-button">⚙</button>

// Settings component
<Settings onClose={closeSettings} />
```

#### 2. Feature Gating
```typescript
const { hasKey, getClient, refreshKey } = useApiKey();

// In post-reading screen
{hasKey && !isOffline && (
  <>
    <button onClick={openOnlineDepth} className="online-button">
      Tiefe öffnen (online)
    </button>
  </>
)}
```

#### 3. API Usage
```typescript
const client = await getClient();
const response = await client.explainText(ocrText, 'medium');
// or
const response = await client.discussText(ocrText, userQuestion);
```

### Error Handling Pattern
```typescript
try {
  const client = await getClient();
  const response = await client.explainText(text, depth);
  // Show response
} catch (error) {
  const apiError = error as ApiError;
  let errorMsg = 'Antwort kam nicht an';
  
  if (apiError.type === 'network') errorMsg = 'Offline';
  else if (apiError.type === 'unauthorized') errorMsg = 'Ungültiger Schlüssel';
  else if (apiError.type === 'rate_limit') errorMsg = 'Zu viele Anfragen';
  else if (apiError.type === 'timeout') errorMsg = 'Zeitüberschreitung';
  
  // Show error message
}
```

---

## 🧪 Testing

### Run Tests
```bash
# Once
npm test

# Watch mode
npm run test:watch
```

### Test Coverage
- ✅ Key storage (set/get/delete)
- ✅ API client (success, errors)
- ✅ Feature gating logic
- ✅ Error type mapping

---

## 🚀 Deployment

### Build
```bash
# Build web assets
npm run build

# Sync with native platforms
npx cap sync

# Open in Android Studio
npx cap open android

# Open in Xcode
npx cap open ios
```

### Dependencies
- `@capacitor/preferences` - Secure storage
- All other dependencies already present

---

## 🔒 Security Checklist

- [x] Keys stored in platform secure storage
- [x] Keys never logged
- [x] Keys never in analytics/crash reports
- [x] HTTPS only for API calls
- [x] No fallback/app-owned keys
- [x] Easy deletion via UI
- [x] No automatic API usage
- [x] Privacy notice shown to user

---

## 📱 User Flow Diagram

```
┌─────────────────────────────────────────┐
│         Waiting Screen                   │
│  [Foto machen] [Notiz] [⚙ Settings]    │
└─────────────────────────────────────────┘
                    │
        ┌───────────┴────────────┐
        │                        │
        ▼                        ▼
┌───────────────┐       ┌─────────────────┐
│   Camera      │       │   Settings      │
│  [Aufnehmen]  │       │  [Test] [Löschen]│
└───────────────┘       └─────────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│         OCR Result                       │
│  [Vorlesen] [Speed: langsam/normal/still]│
└─────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────┐
│       Post-Reading                       │
│  [Push-to-talk]                          │
│  [Tiefe öffnen]                          │
│  [Tiefe öffnen (online)] ← if hasKey    │
│  [Drüber quatschen (online)] ← if hasKey│
│  [Weitergehen]                           │
└─────────────────────────────────────────┘
        │
        ├──────────────┬─────────────┐
        ▼              ▼             ▼
┌──────────────┐ ┌───────────┐ ┌──────────┐
│ Offline Depth│ │Online Depth│ │Online Chat│
│  (Avatars)   │ │(AI Explain)│ │(AI Q&A)  │
└──────────────┘ └───────────┘ └──────────┘
```

---

## 💡 Design Principles

1. **Offline First**: App works 100% without any key
2. **Optional Enhancement**: Online features as opt-in
3. **No Disruption**: Existing flows unchanged
4. **Minimal UI**: Subtle, clean, no jargon
5. **User Control**: Easy to add, test, delete key
6. **Privacy**: Keys stay on device
7. **Error Friendly**: Calm, German messages
8. **Non-Blocking**: Never interrupt museum experience

---

## 🎨 UI States

### Settings Screen States
| State | Display | Actions Available |
|-------|---------|-------------------|
| Not Set | "Nicht gesetzt" (gray) | Testen (disabled if empty) |
| Testing | "Teste..." (blue) | All disabled |
| OK | "Verbindung ok" (green) | Testen, Löschen |
| Error | "Antwort kam nicht an" (red) | Testen, Löschen |

### Online Button States
| Condition | Display |
|-----------|---------|
| No key | "Online (eigener Schlüssel nötig)" (hint text) |
| Has key + online | Show online buttons |
| Has key + offline | "Online (Offline)" (hint text) |
| Loading | "Lädt..." |
| Error | Error message + "Nochmal versuchen" button |
| Success | Response text + "Zurück" button |

---

## 📝 API Configuration

Current defaults (internal, not exposed in UI):
```typescript
baseUrl: 'https://api.openai.com/v1'
model: 'gpt-4o-mini'
timeout: 30000 // 30 seconds
```

To change these, edit `src/services/OpenAIClient.ts`:
```typescript
const CONFIG = {
  baseUrl: 'https://your-api-endpoint.com/v1',
  model: 'your-preferred-model',
  timeout: 30000,
};
```

---

## 🌍 Internationalization

Currently hardcoded in German. To internationalize:

1. Extract strings to i18n file
2. Use translation keys
3. Support multiple languages

Example strings to extract:
- Settings: "Eigene Werkzeuge", "Nicht gesetzt", "Verbindung ok"
- Errors: "Ungültiger Schlüssel", "Offline", "Zu viele Anfragen"
- Actions: "Tiefe öffnen (online)", "Drüber quatschen (online)"

---

## 🎓 Learning Resources

### Capacitor Preferences
- [Official Docs](https://capacitorjs.com/docs/apis/preferences)
- Platform-specific secure storage automatically handled

### OpenAI API
- [API Reference](https://platform.openai.com/docs/api-reference)
- Compatible with other providers (Azure, local models)

### Testing with Vitest
- [Vitest Docs](https://vitest.dev/)
- Fast, Jest-compatible test runner

---

*Quick Start Guide - BYO Key Feature*  
*MuseumApp (WvM) - DEV1 Branch*
