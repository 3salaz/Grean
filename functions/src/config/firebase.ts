import * as admin from "firebase-admin";

// ✅ Check if Firebase Admin is already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    // Uses default Firebase credentials
    credential: admin.credential.applicationDefault(),
    // Optional: Explicitly set storage bucket
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

// ✅ Export Firestore, Auth, and Storage services
export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();

// ✅ Export Admin SDK for advanced use cases
export { admin };
