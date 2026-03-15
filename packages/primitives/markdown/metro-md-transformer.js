/**
 * Custom Metro transformer for .md files
 *
 * Allows importing markdown files directly:
 *   import challengeContent from './CHALLENGE.md';
 *
 * The content is embedded at build time, no runtime file loading needed.
 *
 * SETUP:
 * 1. Copy this file to your project root
 * 2. Add to metro.config.js:
 *
 *    config.resolver.sourceExts = [...config.resolver.sourceExts, 'md'];
 *    config.transformer.babelTransformerPath = require.resolve('./metro-md-transformer.js');
 *
 * 3. Add types/md.d.ts for TypeScript support (see md.d.ts in this folder)
 */

const upstreamTransformer = require('@expo/metro-config/babel-transformer');
const fs = require('fs');

module.exports.transform = async ({ src, filename, options }) => {
  // Only handle .md files
  if (filename.endsWith('.md')) {
    // Read the file content and export as default string
    const content = fs.readFileSync(filename, 'utf8');
    const escaped = JSON.stringify(content);

    // Transform to a module that exports the string
    const code = `module.exports = ${escaped};`;

    return upstreamTransformer.transform({
      src: code,
      filename,
      options,
    });
  }

  // For all other files, use the default transformer
  return upstreamTransformer.transform({ src, filename, options });
};
