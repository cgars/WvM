# MuseumApp

A quiet, optional, user-led companion for museum visits.

## Features

- Offline-first OCR using Tesseract.js
- Camera integration for taking photos of labels/artwork
- Text-to-speech in German
- Optional depth exploration with avatars
- **NEW: Bring Your Own API Key** for optional online AI assistance
- No forced flows, no gamification

## What's New: BYO Key Feature

Users can now optionally provide their own OpenAI-compatible API key to unlock:
- **Online depth explanations** with adjustable detail levels (kurz/mittel/tief)
- **AI-powered Q&A** about artworks
- Secure on-device storage (Keychain on iOS, EncryptedSharedPreferences on Android)

**The app works 100% without any API key.** This is an optional enhancement only.

📖 [Full Feature Documentation](BYO_KEY_FEATURE.md)  
🚀 [Quick Start Guide](QUICK_START.md)  
💡 [Example Prompts](EXAMPLE_PROMPTS.md)  
📊 [Implementation Summary](IMPLEMENTATION_SUMMARY.md)

## Development

```bash
npm install
npm run dev
```

## Usage

1. Open the app in a browser with camera access.
2. Take a photo of a wall label or artwork.
3. OCR extracts the text.
4. Listen to the text or proceed to discussion.
5. Optionally open depth for more contemplation.

## Principles

- Offline first
- User chooses depth
- Silence is valid
- No progress indicators
- No social features
- No mandatory accounts

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
