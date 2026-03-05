/**
 * Security package types
 */

/**
 * Secure storage options
 */
export interface SecureStorageOptions {
  /**
   * Require biometric authentication to access
   */
  requireBiometric?: boolean;

  /**
   * Key accessibility level (iOS)
   */
  keychainAccessible?: KeychainAccessibility;
}

/**
 * Keychain accessibility levels (iOS)
 */
export type KeychainAccessibility =
  | 'WHEN_UNLOCKED'
  | 'AFTER_FIRST_UNLOCK'
  | 'ALWAYS'
  | 'WHEN_PASSCODE_SET_THIS_DEVICE_ONLY'
  | 'WHEN_UNLOCKED_THIS_DEVICE_ONLY'
  | 'AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY';

/**
 * Sanitizer types
 */
export type SanitizerType = 'text' | 'html' | 'url' | 'email' | 'sql';

/**
 * Schema validation result
 */
export interface ValidationResult {
  /**
   * Whether the schema is valid
   */
  valid: boolean;

  /**
   * Array of validation errors
   */
  errors: ValidationError[];

  /**
   * Warnings (non-blocking issues)
   */
  warnings: ValidationWarning[];
}

/**
 * Validation error details
 */
export interface ValidationError {
  /**
   * Error code
   */
  code: string;

  /**
   * Human-readable message
   */
  message: string;

  /**
   * Path to the problematic node
   */
  path: string;

  /**
   * Severity level
   */
  severity: 'error' | 'critical';
}

/**
 * Validation warning details
 */
export interface ValidationWarning {
  /**
   * Warning code
   */
  code: string;

  /**
   * Human-readable message
   */
  message: string;

  /**
   * Path to the node
   */
  path: string;
}

/**
 * Schema validator options
 */
export interface SchemaValidatorOptions {
  /**
   * List of allowed component types
   */
  allowedTypes?: string[];

  /**
   * Maximum nesting depth (default: 20)
   */
  maxDepth?: number;

  /**
   * Maximum children per node (default: 100)
   */
  maxChildren?: number;

  /**
   * Maximum total nodes in schema (default: 1000)
   */
  maxNodes?: number;

  /**
   * Allow custom action types (default: false)
   */
  allowCustomActions?: boolean;

  /**
   * Allowed action types (default: navigate, api, setState)
   */
  allowedActionTypes?: string[];

  /**
   * Block dangerous prop patterns (default: true)
   */
  blockDangerousProps?: boolean;
}

/**
 * Secure input hook options
 */
export interface UseSecureInputOptions {
  /**
   * Sanitizer type to apply
   */
  sanitizer?: SanitizerType;

  /**
   * Maximum input length
   */
  maxLength?: number;

  /**
   * Debounce delay for sanitization (ms)
   */
  debounceMs?: number;

  /**
   * Initial value
   */
  initialValue?: string;
}

/**
 * Secure input hook return type
 */
export interface UseSecureInputReturn {
  /**
   * Current raw value
   */
  value: string;

  /**
   * Sanitized value
   */
  sanitizedValue: string;

  /**
   * Change handler
   */
  onChange: (text: string) => void;

  /**
   * Clear the input
   */
  clear: () => void;

  /**
   * Whether the input is valid
   */
  isValid: boolean;
}

/**
 * SDUI Node type (for validation)
 */
export interface SDUINodeForValidation {
  type: string;
  key?: string;
  props?: Record<string, unknown>;
  children?: SDUINodeForValidation[];
  actions?: Record<string, SDUIActionForValidation>;
}

/**
 * SDUI Action type (for validation)
 */
export interface SDUIActionForValidation {
  type: string;
  payload?: Record<string, unknown>;
}

/**
 * SDUI Schema type (for validation)
 */
export interface SDUISchemaForValidation {
  type: 'screen';
  id?: string;
  props?: Record<string, unknown>;
  children: SDUINodeForValidation[];
}
