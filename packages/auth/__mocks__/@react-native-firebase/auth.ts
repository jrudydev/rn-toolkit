/**
 * Mock for @react-native-firebase/auth
 */

const mockUser = {
  uid: 'test-user-123',
  email: 'test@example.com',
  displayName: 'Test User',
  phoneNumber: '+1234567890',
  photoURL: 'https://example.com/photo.jpg',
  emailVerified: true,
  isAnonymous: false,
  providerId: 'firebase',
  metadata: {
    creationTime: '2024-01-01T00:00:00Z',
    lastSignInTime: '2024-01-15T00:00:00Z',
  },
  providerData: [
    {
      providerId: 'google.com',
      uid: 'google-123',
      displayName: 'Test User',
      email: 'test@example.com',
      phoneNumber: null,
      photoURL: 'https://example.com/photo.jpg',
    },
  ],
  getIdTokenResult: jest.fn().mockResolvedValue({
    token: 'mock-token-123',
    expirationTime: new Date(Date.now() + 3600000).toISOString(),
  }),
  sendEmailVerification: jest.fn().mockResolvedValue(undefined),
  updateProfile: jest.fn().mockResolvedValue(undefined),
  updateEmail: jest.fn().mockResolvedValue(undefined),
  updatePassword: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
  reauthenticateWithCredential: jest.fn().mockResolvedValue({ user: null }),
  unlink: jest.fn().mockResolvedValue(null),
};

let currentUser: typeof mockUser | null = null;
let authStateCallback: ((user: typeof mockUser | null) => void) | null = null;

const mockAuth = {
  currentUser: null as typeof mockUser | null,
  onAuthStateChanged: jest.fn((callback: (user: typeof mockUser | null) => void) => {
    authStateCallback = callback;
    // Simulate initial auth state
    setTimeout(() => callback(currentUser), 0);
    return () => {
      authStateCallback = null;
    };
  }),
  signInWithEmailAndPassword: jest.fn().mockImplementation(async (email: string, password: string) => {
    if (email === 'test@example.com' && password === 'password123') {
      currentUser = { ...mockUser, email };
      authStateCallback?.(currentUser);
      return { user: currentUser };
    }
    throw { code: 'auth/wrong-password', message: 'Wrong password' };
  }),
  createUserWithEmailAndPassword: jest.fn().mockImplementation(async (email: string, password: string) => {
    if (password.length < 6) {
      throw { code: 'auth/weak-password', message: 'Password too weak' };
    }
    currentUser = { ...mockUser, email };
    authStateCallback?.(currentUser);
    return { user: currentUser };
  }),
  signInWithCredential: jest.fn().mockImplementation(async () => {
    currentUser = mockUser;
    authStateCallback?.(currentUser);
    return { user: currentUser };
  }),
  signInWithPhoneNumber: jest.fn().mockResolvedValue({
    verificationId: 'mock-verification-id',
  }),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
  signOut: jest.fn().mockImplementation(async () => {
    currentUser = null;
    authStateCallback?.(null);
  }),
};

const auth = jest.fn(() => mockAuth);

// Provider classes
auth.GoogleAuthProvider = {
  credential: jest.fn((idToken) => ({ idToken, providerId: 'google.com' })),
};

auth.AppleAuthProvider = {
  credential: jest.fn((identityToken, nonce) => ({ identityToken, nonce, providerId: 'apple.com' })),
};

auth.FacebookAuthProvider = {
  credential: jest.fn((accessToken) => ({ accessToken, providerId: 'facebook.com' })),
};

auth.PhoneAuthProvider = {
  credential: jest.fn((verificationId, code) => ({ verificationId, code, providerId: 'phone' })),
};

auth.EmailAuthProvider = {
  credential: jest.fn((email, password) => ({ email, password, providerId: 'password' })),
};

// Helper to reset mock state
export function __resetMockAuth() {
  currentUser = null;
  authStateCallback = null;
  mockAuth.currentUser = null;
  jest.clearAllMocks();
}

// Helper to set mock user
export function __setMockUser(user: typeof mockUser | null) {
  currentUser = user;
  mockAuth.currentUser = user;
  authStateCallback?.(user);
}

// Export mock user for tests
export { mockUser };

export default auth;
