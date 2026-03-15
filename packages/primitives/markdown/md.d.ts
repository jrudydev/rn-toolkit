/**
 * TypeScript declaration for importing .md files
 *
 * Allows: import content from './README.md';
 * Returns the raw markdown string.
 *
 * SETUP:
 * 1. Copy this file to your project's types/ folder
 * 2. Add to tsconfig.json include:
 *    "include": ["**\/*.ts", "**\/*.tsx", "types/**\/*.d.ts"]
 */

declare module '*.md' {
  const content: string;
  export default content;
}
