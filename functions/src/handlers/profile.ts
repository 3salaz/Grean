import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp(); // Ensure Firebase Admin SDK is initialized

const db = admin.firestore();

// Cloud Function to Securely Update User Profile
export const updateUserProfile = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  const uid = context.auth?.uid;
  if (!uid) {
    throw new functions.https.HttpsError("unauthenticated", "User must be logged in.");
  }

  // Reference to user's profile in Firestore
  const userProfileRef = db.collection("profiles").doc(uid);
  const userProfileSnap = await userProfileRef.get();

  if (!userProfileSnap.exists) {
    throw new functions.https.HttpsError("not-found", "Profile not found.");
  }

  // Prevent users from changing restricted fields
  if ("accountType" in data) {
    throw new functions.https.HttpsError("permission-denied", "You cannot update account type.");
  }

  // Validate and sanitize allowed fields
  const updateFields: Record<string, any> = {};
  if (typeof data.displayName === "string") updateFields.displayName = data.displayName;
  if (typeof data.email === "string") updateFields.email = data.email;
  if (typeof data.profilePic === "string") updateFields.profilePic = data.profilePic;

  // Update Firestore with sanitized data
  await userProfileRef.update(updateFields);

  return { success: true, message: "Profile updated successfully." };
});
