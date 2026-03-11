/**
 * Firebase Performance Adapter
 *
 * Separate entry point to avoid bundling Firebase dependencies when not needed.
 *
 * @example
 * ```tsx
 * import { FirebaseAdapter } from '@astacinco/rn-performance/firebase';
 *
 * const adapter = new FirebaseAdapter();
 * ```
 *
 * Requirements:
 * - @react-native-firebase/app
 * - @react-native-firebase/perf
 */

export { FirebaseAdapter } from './adapters/FirebaseAdapter';
