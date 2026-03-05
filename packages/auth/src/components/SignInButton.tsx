/**
 * SignInButton Component
 *
 * Pre-styled sign-in buttons for social providers.
 */

import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import type { AuthError, AuthUser, SignInButtonProps, SocialProvider } from '../types';

/**
 * Provider configuration
 */
interface ProviderConfig {
  name: string;
  backgroundColor: string;
  textColor: string;
  icon: string;
}

const PROVIDER_CONFIG: Record<SocialProvider, ProviderConfig> = {
  google: {
    name: 'Google',
    backgroundColor: '#FFFFFF',
    textColor: '#1F1F1F',
    icon: 'G',
  },
  apple: {
    name: 'Apple',
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    icon: '',
  },
  facebook: {
    name: 'Facebook',
    backgroundColor: '#1877F2',
    textColor: '#FFFFFF',
    icon: 'f',
  },
  twitter: {
    name: 'Twitter',
    backgroundColor: '#1DA1F2',
    textColor: '#FFFFFF',
    icon: 'X',
  },
  github: {
    name: 'GitHub',
    backgroundColor: '#24292E',
    textColor: '#FFFFFF',
    icon: 'GH',
  },
};

/**
 * SignInButton component
 *
 * Pre-styled button for signing in with social providers.
 *
 * @example
 * ```tsx
 * import { SignInButton } from '@rn-toolkit/auth';
 *
 * function LoginScreen() {
 *   return (
 *     <View>
 *       <SignInButton
 *         provider="google"
 *         onSuccess={(user) => console.log('Signed in:', user)}
 *         onError={(error) => console.error('Error:', error)}
 *       />
 *       <SignInButton provider="apple" variant="outlined" />
 *       <SignInButton provider="facebook" />
 *     </View>
 *   );
 * }
 * ```
 */
export function SignInButton({
  provider,
  variant = 'filled',
  text,
  disabled = false,
  loading: externalLoading,
  onSuccess,
  onError,
}: SignInButtonProps) {
  const { signInWithProvider } = useAuth();
  const [internalLoading, setInternalLoading] = useState(false);

  const isLoading = externalLoading ?? internalLoading;
  const config = PROVIDER_CONFIG[provider];

  const handlePress = useCallback(async () => {
    if (isLoading || disabled) return;

    setInternalLoading(true);
    try {
      const user = await signInWithProvider(provider);
      onSuccess?.(user);
    } catch (error) {
      onError?.(error as AuthError);
    } finally {
      setInternalLoading(false);
    }
  }, [provider, signInWithProvider, isLoading, disabled, onSuccess, onError]);

  const buttonText = text || `Continue with ${config.name}`;

  // Build styles based on variant
  const buttonStyle: ViewStyle[] = [styles.button];
  const textStyle: TextStyle[] = [styles.text];

  if (variant === 'filled') {
    buttonStyle.push({
      backgroundColor: config.backgroundColor,
      borderWidth: provider === 'google' ? 1 : 0,
      borderColor: '#747775',
    });
    textStyle.push({ color: config.textColor });
  } else if (variant === 'outlined') {
    buttonStyle.push(styles.outlined);
    textStyle.push(styles.outlinedText);
  } else if (variant === 'icon') {
    buttonStyle.push(styles.iconButton, {
      backgroundColor: config.backgroundColor,
    });
  }

  if (disabled || isLoading) {
    buttonStyle.push(styles.disabled);
  }

  return (
    <Pressable
      style={({ pressed }) => [
        ...buttonStyle,
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
      disabled={disabled || isLoading}
      accessibilityRole="button"
      accessibilityLabel={buttonText}
      accessibilityState={{ disabled: disabled || isLoading }}
    >
      {variant === 'icon' ? (
        <View style={styles.iconContainer}>
          {isLoading ? (
            <ActivityIndicator size="small" color={config.textColor} />
          ) : (
            <Text style={[styles.icon, { color: config.textColor }]}>
              {config.icon}
            </Text>
          )}
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Text style={[styles.icon, { color: variant === 'outlined' ? '#1F1F1F' : config.textColor }]}>
              {config.icon}
            </Text>
          </View>
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color={variant === 'outlined' ? '#1F1F1F' : config.textColor}
              style={styles.loader}
            />
          ) : (
            <Text style={textStyle}>{buttonText}</Text>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minHeight: 48,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#747775',
  },
  iconButton: {
    width: 48,
    height: 48,
    paddingHorizontal: 0,
    borderRadius: 24,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  icon: {
    fontSize: 18,
    fontWeight: '600',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
  outlinedText: {
    color: '#1F1F1F',
  },
  loader: {
    marginLeft: 8,
  },
});
