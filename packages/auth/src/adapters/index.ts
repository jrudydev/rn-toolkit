/**
 * Auth Adapters
 *
 * Export all authentication adapters and types.
 */

export type { AuthAdapter, AuthStateCallback } from './types';
export { NoOpAdapter } from './NoOpAdapter';
export { ConsoleAdapter, type ConsoleAdapterOptions } from './ConsoleAdapter';
export { FirebaseAuthAdapter } from './FirebaseAuthAdapter';
