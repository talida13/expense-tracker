import { User as FirebaseUser } from "firebase/auth";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  role?: "user" | "admin" | "moderator";
  preferences?: {
    notifications: boolean;
    newsletter: boolean;
  };
}

export interface AuthState {
  user: FirebaseUser | null;
  loading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
}

export interface IAuthContext extends AuthState {
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export interface SignInResponse {
  user: FirebaseUser;
  isNewUser: boolean;
}

export interface AuthError extends Error {
  code?: string;
  userMessage?: string;
}

export type OnAuthSuccess = (user: FirebaseUser) => void;
export type OnAuthError = (error: AuthError) => void;
export type OnAuthStateChange = (user: FirebaseUser | null) => void;

export interface UserClaims {
  uid: string;
  email?: string;
  emailVerified?: boolean;
  displayName?: string;
  photoURL?: string;
  isAdmin?: boolean;
}
