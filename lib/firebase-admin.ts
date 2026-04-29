let adminAuth: any = null;

try {
  if (typeof window === "undefined") {
    const admin = require("firebase-admin");

    if (admin.apps.length === 0) {
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = JSON.parse(
          process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
        );
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } else if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
        admin.initializeApp({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
      }
    }

    adminAuth = admin.auth();
  }
} catch (error) {
  console.warn("Firebase Admin SDK not available:", error);
}

export { adminAuth };
