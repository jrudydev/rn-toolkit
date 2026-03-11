/**
 * Challenge data registry
 *
 * This file imports and merges challenge registries.
 * Pro repo can extend this by adding its own registry.
 */

import { freeRegistry } from './free-challenges';
import { mergeRegistries, type ChallengeRegistry } from '../types';

// Import pro registry if available (will be added by pro repo)
// import { proRegistry } from '@astacinco/rn-toolkit-pro/challenges';

// For now, just export free challenges
// When pro repo is set up, it will extend this
export const challengeRegistry: ChallengeRegistry = mergeRegistries(
  freeRegistry,
  // proRegistry, // Uncomment when pro challenges are available
);

// Re-export for convenience
export { freeRegistry } from './free-challenges';
export * from '../types';
