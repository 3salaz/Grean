import * as admin from "firebase-admin";

// ✅ Check if Firebase Admin is already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    // Uses default Firebase credentials
    credential: admin.credential.applicationDefault(),
  });
}

// ✅ Export Firestore, Auth, and Storage services
export const db = admin.firestore();
export const auth = admin.auth();

// ✅ Export Admin SDK for advanced use cases
export {admin};
