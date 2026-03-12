/**
 * Challenge data types
 *
 * Two-tier system:
 * - Assessments: Full timed challenges with specific use cases
 * - Generic Challenges: Reusable features that can be applied to any assessment
 */

export type Difficulty = 'easy' | 'medium' | 'hard';
export type ChallengeStatus = 'not_started' | 'in_progress' | 'completed';
export type PackageTier = 'free' | 'pro';
export type ItemType = 'assessment' | 'challenge';

export interface Package {
  id: string;
  name: string;
  displayName: string;
  tier: PackageTier;
}

/**
 * Assessment - A full timed challenge with specific use case
 * Has its own app folder (e.g., assessment-practice/)
 */
export interface Assessment {
  type: 'assessment';
  id: string;
  title: string;
  description: string;
  scenario: string;
  difficulty: Difficulty;
  timeMinutes: number;
  packages: string[]; // Package IDs used
  tier: PackageTier;

  // App folder reference
  appFolder: string; // e.g., 'assessment-practice'

  // File references (relative to app folder)
  challengeFile: string;
  cheatsheetFile: string;
  solutionFile?: string;

  // Inline content (embedded from files for in-app display)
  challengeContent?: string;
  cheatsheetContent?: string;
  solutionContent?: string;

  // Native version (without packages)
  hasNativeVersion?: boolean;
  nativeChallengeFile?: string;
  nativeCheatsheetFile?: string;
  nativeSolutionFile?: string;

  // Native inline content
  nativeChallengeContent?: string;
  nativeCheatsheetContent?: string;
  nativeSolutionContent?: string;

  // Required generic challenges for this assessment
  requiredChallenges: string[]; // GenericChallenge IDs
  bonusChallenges?: string[]; // Optional challenge IDs

  // Metadata
  skills: string[];
  alignedWith?: string; // e.g., "Linktree Senior Mobile Engineer"
}

/**
 * Generic Challenge - A reusable feature/task
 * Can be applied to any assessment
 */
export interface GenericChallenge {
  type: 'challenge';
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  timeMinutes: number; // Estimated time to complete (packaged version)
  packages: string[]; // Package IDs used
  tier: PackageTier;

  // Instructions (shared between versions)
  instructions: string; // Requirements, acceptance criteria

  // Packaged solution (using @astacinco packages)
  solution: string; // Complete working code with packages
  cheatsheet?: string; // Quick API reference for packages used

  // Native solution (using raw React Native - no packages)
  nativeTimeMinutes?: number; // Usually longer than packaged
  nativeSolution?: string; // Complete working code without packages
  nativeCheatsheet?: string; // React Native API reference

  // Future: Reactive solution (RxJS, MobX, etc.)
  // reactiveSolution?: string;
  // reactiveCheatsheet?: string;

  // Skills practiced
  skills: string[];
}

// Union type for list displays
export type ChallengeItem = Assessment | GenericChallenge;

export interface ChallengeProgress {
  itemId: string;
  itemType: ItemType;
  status: ChallengeStatus;
  startedAt?: Date;
  completedAt?: Date;
  timeSpentMinutes?: number;
  notes?: string;
}

export interface ChallengeRegistry {
  packages: Package[];
  assessments: Assessment[];
  challenges: GenericChallenge[];
}

// Helper to merge registries (free + pro)
export function mergeRegistries(...registries: ChallengeRegistry[]): ChallengeRegistry {
  return {
    packages: registries.flatMap(r => r.packages),
    assessments: registries.flatMap(r => r.assessments),
    challenges: registries.flatMap(r => r.challenges),
  };
}

// Filter helpers
export function filterByTier<T extends { tier: PackageTier }>(items: T[], tier: PackageTier): T[] {
  return items.filter(item => item.tier === tier);
}

export function filterByDifficulty<T extends { difficulty: Difficulty }>(items: T[], difficulty: Difficulty): T[] {
  return items.filter(item => item.difficulty === difficulty);
}

export function filterByPackage<T extends { packages: string[] }>(items: T[], packageId: string): T[] {
  return items.filter(item => item.packages.includes(packageId));
}

// Get all items (assessments + challenges) for unified list
export function getAllItems(registry: ChallengeRegistry): ChallengeItem[] {
  return [...registry.assessments, ...registry.challenges];
}

// Type guard helpers
export function isAssessment(item: ChallengeItem): item is Assessment {
  return item.type === 'assessment';
}

export function isGenericChallenge(item: ChallengeItem): item is GenericChallenge {
  return item.type === 'challenge';
}
