/**
 * Challenge data types
 *
 * Extensible structure for both free and pro challenges.
 * Pro repo can import these types and add its own challenges.
 */

export type Difficulty = 'easy' | 'medium' | 'hard';
export type ChallengeStatus = 'not_started' | 'in_progress' | 'completed';
export type PackageTier = 'free' | 'pro';

export interface Package {
  id: string;
  name: string;
  displayName: string;
  tier: PackageTier;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  scenario: string;
  difficulty: Difficulty;
  timeMinutes: number;
  packages: string[]; // Package IDs
  tier: PackageTier;

  // File references (relative to assessment-practice folder)
  challengeFile: string;
  cheatsheetFile: string;
  solutionFile?: string;

  // For native version
  hasNativeVersion?: boolean;
  nativeChallengeFile?: string;
  nativeCheatsheetFile?: string;
  nativeSolutionFile?: string;

  // Metadata
  skills: string[];
  alignedWith?: string; // e.g., "Linktree Senior Mobile Engineer"
}

export interface ChallengeProgress {
  challengeId: string;
  status: ChallengeStatus;
  startedAt?: Date;
  completedAt?: Date;
  timeSpentMinutes?: number;
  notes?: string;
}

export interface ChallengeRegistry {
  packages: Package[];
  challenges: Challenge[];
}

// Helper to merge registries (free + pro)
export function mergeRegistries(...registries: ChallengeRegistry[]): ChallengeRegistry {
  return {
    packages: registries.flatMap(r => r.packages),
    challenges: registries.flatMap(r => r.challenges),
  };
}

// Filter helpers
export function filterByTier(challenges: Challenge[], tier: PackageTier): Challenge[] {
  return challenges.filter(c => c.tier === tier);
}

export function filterByDifficulty(challenges: Challenge[], difficulty: Difficulty): Challenge[] {
  return challenges.filter(c => c.difficulty === difficulty);
}

export function filterByPackage(challenges: Challenge[], packageId: string): Challenge[] {
  return challenges.filter(c => c.packages.includes(packageId));
}
