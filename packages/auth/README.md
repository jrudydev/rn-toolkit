# @rn-toolkit/auth

Authentication with **adapter pattern** for React Native - swap auth backends without code changes.

## Features

- **Adapter Pattern** - Swap authentication backends (Firebase, Supabase, custom) without changing app code
- **Built-in Adapters** - Firebase, Console (debug), NoOp (testing)
- **Social Login** - Google, Apple, Facebook, Twitter, GitHub
- **Email/Password** - Sign up, sign in, password reset
- **Phone Authentication** - SMS verification
- **Multi-Factor Auth** - SMS, TOTP, Email verification
- **Session Management** - Token refresh, secure storage
- **Protected Routes** - Guard authenticated content
- **TypeScript** - Full type safety

## Installation

```bash
npm install @rn-toolkit/auth
```

### For Firebase Auth (production)

```bash
npm install @react-native-firebase/app @react-native-firebase/auth
```

### Social Provider Setup (Optional)

```bash
# Google Sign-In
npm install @react-native-google-signin/google-signin

# Apple Sign-In
npm install @invertase/react-native-apple-authentication

# Facebook Login
npm install react-native-fbsdk-next
```

## Quick Start

### 1. Choose your adapter

```tsx
import {
  AuthProvider,
  FirebaseAuthAdapter,
  ConsoleAdapter,
  NoOpAdapter,
} from '@rn-toolkit/auth';

// Production: Firebase Auth
const adapter = new FirebaseAuthAdapter();

// Development: Console logging
const adapter = new ConsoleAdapter({ prefix: '[Auth]' });

// Testing: No-op (silent)
const adapter = new NoOpAdapter();
```

### 2. Wrap your app

```tsx
function App() {
  const adapter = __DEV__
    ? new ConsoleAdapter({ prefix: '[Auth]' })
    : new FirebaseAuthAdapter();

  return (
    <AuthProvider adapter={adapter}>
      <MyApp />
    </AuthProvider>
  );
}
```

### 3. Use in components

```tsx
import { useAuth, SignInButton, ProtectedRoute } from '@rn-toolkit/auth';

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

## API Reference

### AuthProvider

Provider component that wraps your app with auth context.

```tsx
<AuthProvider
  adapter={adapter}        // Required: Auth adapter
  config={{
    onAuthStateChange: (user) => console.log('Auth changed:', user),
    onError: (error) => console.error('Auth error:', error),
  }}
>
  <App />
</AuthProvider>
```

### Built-in Adapters

#### FirebaseAuthAdapter (Production)

```typescript
import { FirebaseAuthAdapter } from '@rn-toolkit/auth';

const adapter = new FirebaseAuthAdapter();
// Requires @react-native-firebase/auth
```

#### ConsoleAdapter (Development)

```typescript
import { ConsoleAdapter } from '@rn-toolkit/auth';

const adapter = new ConsoleAdapter({
  prefix: '[Auth]',       // Log prefix
  timestamps: false,      // Include timestamps
  autoSignIn: false,      // Auto sign in with mock user
});
```

#### NoOpAdapter (Testing)

```typescript
import { NoOpAdapter } from '@rn-toolkit/auth';

const adapter = new NoOpAdapter({
  autoSignIn: false,      // Auto sign in with mock user
});
// Silent - simulates auth without actual backend
```

### Creating Custom Adapters

Implement the `AuthAdapter` interface:

```typescript
import type { AuthAdapter } from '@rn-toolkit/auth';

class SupabaseAdapter implements AuthAdapter {
  readonly name = 'supabase';

  async initialize() {
    // Initialize Supabase client
  }

  onAuthStateChanged(callback: AuthStateCallback): () => void {
    // Subscribe to auth changes
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user ? toAuthUser(session.user) : null);
    });
  }

  async signInWithEmail(credentials) {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) throw error;
    return toAuthUser(data.user);
  }

  // ... implement all other methods
}
```

### Hooks

#### useAuth

Main hook for authentication operations.

```typescript
const {
  user,              // Current user or null
  loading,           // Loading state
  isAuthenticated,   // Boolean auth status
  signInWithEmail,   // Sign in with email/password
  signUpWithEmail,   // Create account
  signInWithProvider,// Social sign in
  signInWithPhone,   // Phone authentication
  confirmPhoneNumber,// Verify phone code
  signOut,           // Sign out
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updateEmail,
  updatePassword,
  deleteAccount,
  linkProvider,
  unlinkProvider,
  reauthenticate,
  getMfaFactors,
  enrollMfa,
  unenrollMfa,
} = useAuth();
```

#### useUser

Access current user information with helper methods.

```typescript
const {
  user,
  isAuthenticated,
  isEmailVerified,
  getInitials,      // Get user initials (e.g., "JD")
  getAvatarUrl,     // Get avatar URL or fallback
  hasProvider,      // Check if provider is linked
} = useUser();
```

#### useSession

Manage user session and tokens.

```typescript
const {
  session,          // Current session
  isValid,          // Session validity
  expiresIn,        // Seconds until expiry
  refresh,          // Refresh session
  getToken,         // Get access token
} = useSession();
```

### Components

#### SignInButton

Pre-styled social sign-in buttons.

```tsx
<SignInButton
  provider="google"
  variant="filled"    // 'filled' | 'outlined' | 'icon'
  text="Sign in with Google"
  disabled={false}
  loading={false}
  onSuccess={(user) => console.log('Signed in:', user)}
  onError={(error) => console.error('Error:', error)}
/>
```

#### ProtectedRoute

Guard routes that require authentication.

```tsx
<ProtectedRoute
  fallback={<LoginScreen />}
  loadingComponent={<LoadingSpinner />}
  onUnauthenticated={() => navigation.navigate('Login')}
  requireEmailVerified
>
  <SecureContent />
</ProtectedRoute>
```

## TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  AuthAdapter,
  AuthStateCallback,
  AuthUser,
  AuthState,
  AuthError,
  AuthErrorCode,
  AuthContextValue,
  AuthProviderConfig,
  EmailPasswordCredentials,
  PhoneAuthOptions,
  PhoneVerificationResult,
  Session,
  SocialProvider,
  MfaMethod,
  MfaEnrollmentInfo,
  SignInButtonProps,
  ProtectedRouteProps,
} from '@rn-toolkit/auth';
```

## Adapter Pattern Benefits

The adapter pattern allows you to:

1. **Swap backends easily** - Change from Firebase to Supabase with one line
2. **Test without real auth** - Use `NoOpAdapter` with `autoSignIn: true`
3. **Debug with visibility** - Use `ConsoleAdapter` to see all auth events
4. **Create custom adapters** - Build adapters for any auth provider

```typescript
// Switch providers without changing any component code:

// Development
<AuthProvider adapter={new ConsoleAdapter()}>

// Production
<AuthProvider adapter={new FirebaseAuthAdapter()}>

// Testing
<AuthProvider adapter={new NoOpAdapter({ autoSignIn: true })}>

// Custom (Supabase)
<AuthProvider adapter={new SupabaseAdapter()}>
```

## License

Commercial License - Part of @rn-toolkit paid tier.
