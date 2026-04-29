"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  className?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = "",
  onSuccess,
  onError,
}) => {
  const { signOut, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loading = isLoading || authLoading;

  const handleLogout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signOut();
      onSuccess?.();
      router.push("/login");
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Logout failed");
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleLogout}
        disabled={loading}
        aria-busy={loading}
        aria-label={loading ? "Logging out..." : "Log out"}
        className={`
            cursor-pointer
            inline-flex items-center justify-center gap-2 rounded-lg
            px-4 py-2 text-sm font-medium transition-all duration-200
            border border-red-200
            hover:bg-red-100 hover:border-red-300
            active:bg-red-200
            disabled:opacity-60 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 h-14 bg-destructive text-foreground-destructive
            ${className}
        `}
      >
        {loading ? "Logging out..." : "Log out"}
      </button>

      {error && (
        <div
          role="alert"
          className="rounded-md bg-red-50 p-2 text-sm text-red-800 border border-red-200"
        >
          {error.message}
        </div>
      )}
    </div>
  );
};
