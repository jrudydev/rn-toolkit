/**
 * Performance Adapters
 *
 * Built-in adapters for different performance monitoring backends.
 *
 * Note: FirebaseAdapter requires @react-native-firebase/perf and is exported
 * separately from '@astacinco/rn-performance/firebase' to avoid bundling
 * Firebase dependencies when not needed.
 */

export { NoOpAdapter } from './NoOpAdapter';
export { ConsoleAdapter } from './ConsoleAdapter';
export type { ConsoleAdapterOptions } from './ConsoleAdapter';
// FirebaseAdapter exported separately - see firebase.ts
