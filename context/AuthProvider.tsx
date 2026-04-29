"use client";

import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { User, onAuthStateChanged } from "firebase/auth";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  isAuthenticated: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initAuth = async () => {
      try {
        const { auth } = await import("@/lib/firebase");
        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setLoading(false);
          setError(null);
          setIsInitialized(true);
        });
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Auth initialization failed");
        setError(error);
        setLoading(false);
        setIsInitialized(true);
        console.error("Auth initialization error:", error);
      }
    };

    initAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { signInWithGoogle: signIn } = await import("@/lib/auth");
      await signIn();
    } catch (err) {
      const { handleAuthError } = await import("@/lib/auth");
      const authError = handleAuthError(err);
      setError(authError);
      throw authError;
    } finally {
      setLoading(false);
    }
  }, []);

  const signOutUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { signOut } = await import("@/lib/auth");
      await signOut();
      setUser(null);
    } catch (err) {
      const { handleAuthError } = await import("@/lib/auth");
      const authError = handleAuthError(err);
      setError(authError);
      throw authError;
    } finally {
      setLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    loading: loading && !isInitialized,
    error,
    signInWithGoogle,
    signOut: signOutUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
