"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Welcome</h1>
            <p className="text-gray-600">
              Sign in to your Expense Tracker account
            </p>
          </div>

          <div>
            <GoogleSignInButton
              className="w-full"
              onSuccess={() => {
                router.push("/");
              }}
            />
          </div>

          <div className="relative ">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 mb-8" />
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Why sign in?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Save your receipts</li>
              <li>✓ Create collections</li>
              <li>✓ Share with friends</li>
            </ul>
          </div>

          <p className="text-center text-sm text-gray-500">
            By signing in, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
