import {
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  User,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "./firebase";

export const signInWithGoogle = async (): Promise<User> => {
  try {
    await setPersistence(auth, browserLocalPersistence);

    const provider = new GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");

    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    throw handleAuthError(error);
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw handleAuthError(error);
  }
};

export const handleAuthError = (error: unknown): Error => {
  const authError = error as { code?: string; message?: string };

  const errorMessages: Record<string, string> = {
    "auth/popup-blocked":
      "Sign-in popup was blocked. Please allow popups for this site.",
    "auth/popup-closed-by-user": "Sign-in popup was closed before completion.",
    "auth/network-request-failed":
      "Network error. Please check your connection and try again.",
    "auth/unauthorized-domain": "This domain is not authorized for sign-in.",
    "auth/invalid-api-key": "Invalid API key configuration.",
    "auth/user-disabled": "This user account has been disabled.",
    "auth/account-exists-with-different-credential":
      "An account with this email already exists with a different sign-in method.",
  };

  const message =
    errorMessages[authError.code || ""] ||
    authError.message ||
    "An authentication error occurred. Please try again.";

  return new Error(message);
};
