/**
 * @rn-toolkit/security
 *
 * Enterprise-grade security utilities for React Native applications.
 *
 * Features:
 * - Secure Storage (Keychain/Keystore)
 * - Input Sanitization (XSS prevention)
 * - Schema Validation (SDUI validation)
 * - Secure Components
 *
 * @packageDocumentation
 */

// Storage
export { SecureStorage } from './storage';

// Validation
export { sanitize, SchemaValidator, validateSchema } from './validation';

// Hooks
export { useSecureInput } from './hooks';

// Components
export { SecureTextInput } from './components';
export type { SecureTextInputProps } from './components';

// Types
export type {
  SecureStorageOptions,
  KeychainAccessibility,
  SanitizerType,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  SchemaValidatorOptions,
  UseSecureInputOptions,
  UseSecureInputReturn,
  SDUINodeForValidation,
  SDUIActionForValidation,
  SDUISchemaForValidation,
} from './types';
