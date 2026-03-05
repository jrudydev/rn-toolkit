/**
 * SDUI Schema Validator
 *
 * Validates SDUI schemas before rendering to prevent malicious payloads
 * and ensure schema integrity.
 */

import type {
  ValidationResult,
  ValidationError,
  ValidationWarning,
  SchemaValidatorOptions,
  SDUISchemaForValidation,
  SDUINodeForValidation,
} from '../types';

/**
 * Default allowed SDUI component types
 */
const DEFAULT_ALLOWED_TYPES = [
  'text',
  'button',
  'card',
  'stack',
  'vstack',
  'hstack',
  'container',
  'input',
  'divider',
  'image',
  'list',
  'scroll',
  'spacer',
];

/**
 * Default allowed action types
 */
const DEFAULT_ALLOWED_ACTIONS = ['navigate', 'api', 'setState', 'custom'];

/**
 * Dangerous prop patterns to detect
 */
const DANGEROUS_PROP_PATTERNS = [
  /javascript:/i,
  /data:text\/html/i,
  /on\w+\s*=/i, // Event handlers
  /<script/i,
  /eval\s*\(/i,
  /Function\s*\(/i,
  /setTimeout\s*\(/i,
  /setInterval\s*\(/i,
  /document\./i,
  /window\./i,
  /__proto__/i,
  /constructor\s*\[/i,
  /prototype/i,
];

/**
 * Default validator options
 */
const DEFAULT_OPTIONS: Required<SchemaValidatorOptions> = {
  allowedTypes: DEFAULT_ALLOWED_TYPES,
  maxDepth: 20,
  maxChildren: 100,
  maxNodes: 1000,
  allowCustomActions: true,
  allowedActionTypes: DEFAULT_ALLOWED_ACTIONS,
  blockDangerousProps: true,
};

/**
 * SchemaValidator class
 *
 * Validates SDUI schemas for security and correctness.
 *
 * @example
 * ```typescript
 * const validator = new SchemaValidator({
 *   allowedTypes: ['text', 'button'],
 *   maxDepth: 10,
 * });
 *
 * const result = validator.validate(schema);
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export class SchemaValidator {
  private options: Required<SchemaValidatorOptions>;
  private nodeCount: number = 0;

  constructor(options?: SchemaValidatorOptions) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Validate an SDUI schema
   *
   * @param schema - The schema to validate
   * @returns Validation result with errors and warnings
   */
  validate(schema: unknown): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    this.nodeCount = 0;

    // Check if schema is an object
    if (!schema || typeof schema !== 'object') {
      errors.push({
        code: 'INVALID_SCHEMA',
        message: 'Schema must be an object',
        path: '',
        severity: 'critical',
      });
      return { valid: false, errors, warnings };
    }

    const typedSchema = schema as SDUISchemaForValidation;

    // Check root type
    if (typedSchema.type !== 'screen') {
      errors.push({
        code: 'INVALID_ROOT_TYPE',
        message: `Root type must be 'screen', got '${typedSchema.type}'`,
        path: '',
        severity: 'critical',
      });
    }

    // Check children array
    if (!Array.isArray(typedSchema.children)) {
      errors.push({
        code: 'INVALID_CHILDREN',
        message: 'Schema children must be an array',
        path: '.children',
        severity: 'critical',
      });
      return { valid: false, errors, warnings };
    }

    // Validate each child node
    for (let i = 0; i < typedSchema.children.length; i++) {
      this.validateNode(
        typedSchema.children[i],
        `.children[${i}]`,
        0,
        errors,
        warnings
      );
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate a single node recursively
   */
  private validateNode(
    node: unknown,
    path: string,
    depth: number,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    this.nodeCount++;

    // Check max nodes
    if (this.nodeCount > this.options.maxNodes) {
      errors.push({
        code: 'MAX_NODES_EXCEEDED',
        message: `Schema exceeds maximum node count of ${this.options.maxNodes}`,
        path,
        severity: 'critical',
      });
      return;
    }

    // Check depth
    if (depth > this.options.maxDepth) {
      errors.push({
        code: 'MAX_DEPTH_EXCEEDED',
        message: `Schema exceeds maximum depth of ${this.options.maxDepth}`,
        path,
        severity: 'error',
      });
      return;
    }

    // Check if node is an object
    if (!node || typeof node !== 'object') {
      errors.push({
        code: 'INVALID_NODE',
        message: 'Node must be an object',
        path,
        severity: 'error',
      });
      return;
    }

    const typedNode = node as SDUINodeForValidation;

    // Check node type
    if (!typedNode.type || typeof typedNode.type !== 'string') {
      errors.push({
        code: 'MISSING_TYPE',
        message: 'Node must have a type property',
        path,
        severity: 'error',
      });
      return;
    }

    // Check if type is allowed
    if (!this.options.allowedTypes.includes(typedNode.type.toLowerCase())) {
      errors.push({
        code: 'UNKNOWN_TYPE',
        message: `Unknown component type '${typedNode.type}'`,
        path: `${path}.type`,
        severity: 'error',
      });
    }

    // Validate props
    if (typedNode.props) {
      this.validateProps(typedNode.props, `${path}.props`, errors, warnings);
    }

    // Validate actions
    if (typedNode.actions) {
      this.validateActions(typedNode.actions, `${path}.actions`, errors, warnings);
    }

    // Validate children
    if (typedNode.children) {
      if (!Array.isArray(typedNode.children)) {
        errors.push({
          code: 'INVALID_CHILDREN',
          message: 'Node children must be an array',
          path: `${path}.children`,
          severity: 'error',
        });
      } else {
        if (typedNode.children.length > this.options.maxChildren) {
          errors.push({
            code: 'MAX_CHILDREN_EXCEEDED',
            message: `Node exceeds maximum children count of ${this.options.maxChildren}`,
            path: `${path}.children`,
            severity: 'error',
          });
        }

        for (let i = 0; i < typedNode.children.length; i++) {
          this.validateNode(
            typedNode.children[i],
            `${path}.children[${i}]`,
            depth + 1,
            errors,
            warnings
          );
        }
      }
    }
  }

  /**
   * Validate props for dangerous patterns
   */
  private validateProps(
    props: Record<string, unknown>,
    path: string,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    if (!this.options.blockDangerousProps) return;

    for (const [key, value] of Object.entries(props)) {
      const propPath = `${path}.${key}`;

      // Check for dangerous prop names
      if (key.toLowerCase().startsWith('on') && key.length > 2) {
        warnings.push({
          code: 'EVENT_HANDLER_PROP',
          message: `Event handler prop '${key}' detected`,
          path: propPath,
        });
      }

      // Check string values for dangerous patterns
      if (typeof value === 'string') {
        for (const pattern of DANGEROUS_PROP_PATTERNS) {
          if (pattern.test(value)) {
            errors.push({
              code: 'DANGEROUS_PROP_VALUE',
              message: `Dangerous pattern detected in prop '${key}'`,
              path: propPath,
              severity: 'critical',
            });
            break;
          }
        }
      }

      // Recursively check nested objects
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        this.validateProps(value as Record<string, unknown>, propPath, errors, warnings);
      }
    }
  }

  /**
   * Validate actions
   */
  private validateActions(
    actions: Record<string, unknown>,
    path: string,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    for (const [eventName, action] of Object.entries(actions)) {
      const actionPath = `${path}.${eventName}`;

      if (!action || typeof action !== 'object') {
        errors.push({
          code: 'INVALID_ACTION',
          message: `Action for '${eventName}' must be an object`,
          path: actionPath,
          severity: 'error',
        });
        continue;
      }

      const typedAction = action as { type?: string; payload?: Record<string, unknown> };

      // Check action type
      if (!typedAction.type || typeof typedAction.type !== 'string') {
        errors.push({
          code: 'MISSING_ACTION_TYPE',
          message: `Action for '${eventName}' must have a type`,
          path: actionPath,
          severity: 'error',
        });
        continue;
      }

      // Check if custom actions are disabled
      if (typedAction.type === 'custom' && !this.options.allowCustomActions) {
        errors.push({
          code: 'CUSTOM_ACTION_NOT_ALLOWED',
          message: 'Custom actions are not allowed',
          path: `${actionPath}.type`,
          severity: 'error',
        });
      }
      // Check if action type is allowed
      else if (!this.options.allowedActionTypes.includes(typedAction.type)) {
        errors.push({
          code: 'UNKNOWN_ACTION_TYPE',
          message: `Unknown action type '${typedAction.type}'`,
          path: `${actionPath}.type`,
          severity: 'error',
        });
      }

      // Validate action payload
      if (typedAction.payload) {
        this.validateProps(
          typedAction.payload,
          `${actionPath}.payload`,
          errors,
          warnings
        );
      }
    }
  }
}

/**
 * Quick validation function
 *
 * @param schema - The schema to validate
 * @param options - Validator options
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const result = validateSchema(mySchema);
 * if (!result.valid) {
 *   console.error('Invalid schema:', result.errors);
 * }
 * ```
 */
export function validateSchema(
  schema: unknown,
  options?: SchemaValidatorOptions
): ValidationResult {
  const validator = new SchemaValidator(options);
  return validator.validate(schema);
}
