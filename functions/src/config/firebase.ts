import * as admin from "firebase-admin";

// 🔥 Initialize Firebase Admin SDK only if it hasn't been initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// Export services
export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();


export { admin };
