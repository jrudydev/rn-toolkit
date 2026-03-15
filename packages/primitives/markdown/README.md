# Markdown Loader for React Native

Import `.md` files directly in your React Native app and render them with `MarkdownViewer`.

## Quick Setup

### 1. Copy the transformer

Copy `metro-md-transformer.js` to your project root.

### 2. Update metro.config.js

```js
const config = getDefaultConfig(projectRoot);

// Handle .md files as source (not assets)
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'md');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'md'];

// Custom transformer for .md files
config.transformer.babelTransformerPath = require.resolve('./metro-md-transformer.js');

module.exports = config;
```

### 3. Add TypeScript support

Copy `md.d.ts` to your project's `types/` folder.

Update `tsconfig.json`:
```json
{
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "types/**/*.d.ts"
  ]
}
```

## Usage

```tsx
// Import markdown directly
import challengeContent from './CHALLENGE.md';
import { MarkdownViewer } from '@astacinco/rn-primitives';

function ChallengeScreen() {
  return <MarkdownViewer content={challengeContent} />;
}
```

## How It Works

The Metro transformer reads `.md` files at **build time** and embeds the content as a string in your bundle. No runtime file system access needed!

```
CHALLENGE.md (file) → Metro Transformer → "# Title\n\nContent..." (string in bundle)
```

## Benefits

- **No duplication** - Single source of truth for content
- **Build-time bundling** - Content is in your JS bundle
- **TypeScript support** - Full type checking
- **Works with MarkdownViewer** - Render beautifully
