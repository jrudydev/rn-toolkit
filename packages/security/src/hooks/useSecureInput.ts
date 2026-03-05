import { useState, useCallback, useMemo } from 'react';
import type { UseSecureInputOptions, UseSecureInputReturn, SanitizerType } from '../types';
import { sanitize } from '../validation/sanitize';

/**
 * Apply sanitization based on type
 */
function applySanitizer(value: string, type?: SanitizerType): string {
  if (!type) return value;

  switch (type) {
    case 'text':
      return sanitize.text(value);
    case 'html':
      return sanitize.html(value);
    case 'email':
      return sanitize.email(value) ?? '';
    case 'url':
      return sanitize.url(value) ?? '';
    case 'sql':
      return sanitize.sql(value);
    default:
      return value;
  }
}

/**
 * Validate input based on sanitizer type
 */
function validateInput(value: string, type?: SanitizerType): boolean {
  if (!type || !value) return true;

  switch (type) {
    case 'email':
      return sanitize.email(value) !== null;
    case 'url':
      return sanitize.url(value) !== null;
    default:
      return true;
  }
}

/**
 * useSecureInput hook
 *
 * A React hook for handling secure input with automatic sanitization.
 *
 * @param options - Hook options
 * @returns Secure input state and handlers
 *
 * @example
 * ```typescript
 * function PasswordInput() {
 *   const { value, onChange, sanitizedValue, isValid } = useSecureInput({
 *     sanitizer: 'text',
 *     maxLength: 100,
 *   });
 *
 *   return (
 *     <TextInput
 *       value={value}
 *       onChangeText={onChange}
 *       maxLength={100}
 *     />
 *   );
 * }
 * ```
 */
export function useSecureInput(options: UseSecureInputOptions = {}): UseSecureInputReturn {
  const { sanitizer, maxLength, initialValue = '' } = options;

  const [value, setValue] = useState(initialValue);

  // Compute sanitized value
  const sanitizedValue = useMemo(() => {
    return applySanitizer(value, sanitizer);
  }, [value, sanitizer]);

  // Compute validity
  const isValid = useMemo(() => {
    return validateInput(value, sanitizer);
  }, [value, sanitizer]);

  // Handle change
  const onChange = useCallback(
    (text: string) => {
      // Apply max length
      let newValue = text;
      if (maxLength && newValue.length > maxLength) {
        newValue = newValue.slice(0, maxLength);
      }

      setValue(newValue);
    },
    [maxLength]
  );

  // Clear handler
  const clear = useCallback(() => {
    setValue('');
  }, []);

  return {
    value,
    sanitizedValue,
    onChange,
    clear,
    isValid,
  };
}
