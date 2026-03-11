/**
 * @astacinco/rn-logging
 *
 * Unified logging for React Native with pluggable adapters.
 *
 * @example
 * ```typescript
 * import { LogProvider, useLogger, ConsoleAdapter } from '@astacinco/rn-logging';
 *
 * // Setup
 * const adapter = new ConsoleAdapter({ prefix: '[MyApp]' });
 *
 * function App() {
 *   return (
 *     <LogProvider adapter={adapter}>
 *       <MyScreen />
 *     </LogProvider>
 *   );
 * }
 *
 * // Usage
 * function MyScreen() {
 *   const logger = useLogger('MyScreen');
 *
 *   useEffect(() => {
 *     logger.info('Screen mounted');
 *   }, []);
 *
 *   const handleAction = () => {
 *     logger.debug('Action triggered', { action: 'submit' });
 *   };
 * }
 * ```
 */

// Provider and hooks
export { LogProvider, useLogger, useLogContext } from './LogProvider';

// Adapters
export {
  ConsoleAdapter,
  NoOpAdapter,
  CompositeAdapter,
  type ConsoleAdapterConfig,
  type CompositeAdapterConfig,
} from './adapters';

// Types
export type {
  LogAdapter,
  LogConfig,
  LogLevel,
  LogEntry,
  LoggerInstance,
} from './types';

export { shouldLog, redactMeta, LOG_LEVEL_PRIORITY } from './types';
