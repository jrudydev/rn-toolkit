# @rn-toolkit/auth

Firebase authentication for React Native with social login, email/password, phone authentication, and 2FA support.

## Installation

```bash
npm install @rn-toolkit/auth

# Required peer dependencies
npm install @react-native-firebase/app @react-native-firebase/auth
```

### Social Provider Setup (Optional)

For Google Sign-In:
```bash
npm install @react-native-google-signin/google-signin
```

For Apple Sign-In:
```bash
npm install @invertase/react-native-apple-authentication
```

For Facebook Login:
```bash
npm install react-native-fbsdk-next
```

## Quick Start

```tsx
import { AuthProvider, useAuth, SignInButton } from '@rn-toolkit/auth';

function App() {
  return (
    <AuthProvider>
      <MyApp />
    </AuthProvider>
  );
}

function LoginScreen() {
  const { signInWithEmail, isAuthenticated, loading } = useAuth();

  if (isAuthenticated) {
    return <HomeScreen />;
  }

  return (
    <View>
      <SignInButton provider="google" />
      <SignInButton provider="apple" />
      <SignInButton provider="facebook" />
    </View>
  );
}
```

## Features

- **Social Login**: Google, Apple, Facebook, Twitter, GitHub
- **Email/Password**: Sign up, sign in, password reset
- **Phone Authentication**: SMS verification
- **Multi-Factor Auth**: SMS, TOTP, Email verification
- **Session Management**: Token refresh, secure storage
- **Protected Routes**: Guard authenticated content

## API

### AuthProvider

Wraps your app to provide authentication context.

```tsx
<AuthProvider
  config={{
    onAuthStateChange: (user) => console.log('Auth changed:', user),
    onError: (error) => console.error('Auth error:', error),
  }}
>
  <App />
</AuthProvider>
```

### useAuth

Main hook for authentication operations.

```tsx
const {
  user,              // Current user or null
  loading,           // Loading state
  isAuthenticated,   // Boolean auth status
  signInWithEmail,   // Sign in with email/password
  signUpWithEmail,   // Create account
  signInWithProvider,// Social sign in
  signOut,           // Sign out
  // ... more methods
} = useAuth();
```

### useUser

Access current user information with helper methods.

```tsx
const {
  user,
  isAuthenticated,
  isEmailVerified,
  getInitials,      // Get user initials (e.g., "JD")
  getAvatarUrl,     // Get avatar URL or fallback
  hasProvider,      // Check if provider is linked
} = useUser();
```

### useSession

Manage user session and tokens.

```tsx
const {
  session,          // Current session
  isValid,          // Session validity
  expiresIn,        // Seconds until expiry
  refresh,          // Refresh session
  getToken,         // Get access token
} = useSession();
```

### SignInButton

Pre-styled social sign-in buttons.

```tsx
<SignInButton
  provider="google"
  variant="filled"    // 'filled' | 'outlined' | 'icon'
  onSuccess={(user) => console.log('Signed in:', user)}
  onError={(error) => console.error('Error:', error)}
/>
```

### ProtectedRoute

Guard routes that require authentication.

```tsx
<ProtectedRoute
  fallback={<LoginScreen />}
  onUnauthenticated={() => navigation.navigate('Login')}
  requireEmailVerified
>
  <SecureContent />
</ProtectedRoute>
```

## Types

```typescript
interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  // ... more
}

type SocialProvider = 'google' | 'apple' | 'facebook' | 'twitter' | 'github';

interface Session {
  token: string;
  expiresAt: Date;
  isValid: boolean;
}
```

## License

Commercial License - Part of @rn-toolkit paid tier.
