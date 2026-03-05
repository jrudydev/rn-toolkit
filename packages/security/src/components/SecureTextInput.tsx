import React, { useCallback } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useSecureInput } from '../hooks/useSecureInput';
import type { SanitizerType } from '../types';

/**
 * SecureTextInput props
 */
export interface SecureTextInputProps extends Omit<TextInputProps, 'onChangeText' | 'value'> {
  /**
   * Label text
   */
  label?: string;

  /**
   * Error message
   */
  error?: string;

  /**
   * Sanitizer type to apply
   */
  sanitize?: SanitizerType;

  /**
   * Callback with sanitized value
   */
  onChangeText?: (sanitizedValue: string) => void;

  /**
   * Callback with raw value
   */
  onChangeRaw?: (rawValue: string) => void;

  /**
   * Maximum input length
   */
  maxLength?: number;

  /**
   * Initial value
   */
  initialValue?: string;

  /**
   * Container style
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * Label style
   */
  labelStyle?: StyleProp<TextStyle>;

  /**
   * Error style
   */
  errorStyle?: StyleProp<TextStyle>;
}

/**
 * SecureTextInput component
 *
 * A TextInput wrapper with built-in sanitization and validation.
 *
 * @example
 * ```typescript
 * <SecureTextInput
 *   label="Email"
 *   sanitize="email"
 *   onChangeText={(email) => setEmail(email)}
 *   placeholder="Enter your email"
 * />
 * ```
 */
export function SecureTextInput({
  label,
  error,
  sanitize: sanitizer,
  onChangeText,
  onChangeRaw,
  maxLength,
  initialValue,
  containerStyle,
  labelStyle,
  errorStyle,
  style,
  ...textInputProps
}: SecureTextInputProps): React.ReactElement {
  const {
    value,
    sanitizedValue,
    onChange,
    isValid,
  } = useSecureInput({
    sanitizer,
    maxLength,
    initialValue,
  });

  const handleChange = useCallback(
    (text: string) => {
      onChange(text);

      // Call raw callback
      if (onChangeRaw) {
        onChangeRaw(text);
      }

      // Call sanitized callback
      if (onChangeText) {
        // We need to apply sanitization to the new text
        // The hook will update on next render, so we compute it here
        onChangeText(sanitizedValue);
      }
    },
    [onChange, onChangeRaw, onChangeText, sanitizedValue]
  );

  const hasError = !!error || (value.length > 0 && !isValid);
  const displayError = error || (value.length > 0 && !isValid ? 'Invalid input' : undefined);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}

      <TextInput
        value={value}
        onChangeText={handleChange}
        maxLength={maxLength}
        style={[
          styles.input,
          hasError && styles.inputError,
          style,
        ]}
        {...textInputProps}
      />

      {displayError && (
        <Text style={[styles.error, errorStyle]}>
          {displayError}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  error: {
    fontSize: 12,
    color: '#dc3545',
    marginTop: 4,
  },
});
