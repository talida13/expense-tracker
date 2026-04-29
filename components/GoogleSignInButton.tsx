"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface GoogleSignInButtonProps {
  className?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  className = "",
  onSuccess,
  onError,
}) => {
  const {
    signInWithGoogle,
    loading: authLoading,
    error: authError,
  } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<Error | null>(null);

  const loading = isLoading || authLoading;
  const error = localError || authError;

  const handleClick = async () => {
    setIsLoading(true);
    setLocalError(null);

    try {
      await signInWithGoogle();
      onSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Sign-in failed");
      setLocalError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleClick}
        disabled={loading}
        aria-busy={loading}
        aria-label={
          loading ? "Signing in with Google..." : "Sign in with Google"
        }
        className={`
          relative inline-flex items-center justify-center gap-2 rounded-lg
          px-4 py-2.5 font-medium transition-all duration-200
          bg-white border border-gray-300 text-gray-700
          hover:bg-gray-50 hover:border-gray-400
          active:bg-gray-100
          disabled:opacity-60 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          min-w-50 cursor-pointer
          ${className}
        `}
      >
        <svg
          className="h-5 w-5 shrink-0"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>

        <span>{loading ? "Signing in..." : "Sign in with Google"}</span>

        {loading && (
          <svg
            className="ml-2 h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
      </button>

      {error && (
        <div
          role="alert"
          className="rounded-md bg-red-50 p-3 text-sm text-red-800 border border-red-200"
        >
          <p className="font-medium">Sign-in failed</p>
          <p className="mt-1 text-red-700">{error.message}</p>
        </div>
      )}
    </div>
  );
};
