import { db } from "../config/firebase.js";
import admin from "firebase-admin";

/** ✅ User profile interface */
export interface UserProfile {
  displayName: string;
  profilePic?: string | null;
  email: string;
  uid: string;
  locations: string[];
  pickups: string[];
  accountType: string;
  createdAt?: FirebaseFirestore.Timestamp;
}

/**
 * ✅ Create a new user profile
 */
export const createProfile = async (
  uid: string,
  profileData: Partial<UserProfile>
): Promise<void> => {
  try {
    const profileRef = db.collection("profiles").doc(uid);
    await profileRef.set({
      ...profileData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("❌ Error creating profile:", error);
    throw new Error("Failed to create profile.");
  }
};

/**
 * ✅ Update profile fields
 */
export const updateProfileField = async (
  uid: string,
  field: string,
  value: string | number | string[] | number[],
  operation: "update" | "addToArray" | "removeFromArray" = "update"
): Promise<void> => {
  try {
    const profileRef = db.collection("profiles").doc(uid);
    console.log(
      "Updating profile:",
      uid,
      "Field:",
      field,
      "Value:",
      value,
      "Operation:",
      operation
    );

    if (operation === "addToArray") {
      await profileRef.update({
        [field]: admin.firestore.FieldValue.arrayUnion(value),
      });
    } else if (operation === "removeFromArray") {
      await profileRef.update({
        [field]: admin.firestore.FieldValue.arrayRemove(value),
      });
    } else {
      await profileRef.update({ [field]: value });
    }
  } catch (error) {
    console.error("❌ Error updating profile field:", error);
    throw new Error("Failed to update profile field.");
  }
};

/**
 * ✅ Bulk update profile fields
 */
export const updateProfileBulk = async (
  uid: string,
  updates: Partial<UserProfile>
): Promise<void> => {
  try {
    const profileRef = db.collection("profiles").doc(uid);
    await profileRef.update({ ...updates });
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    throw new Error("Failed to update profile.");
  }
};

/**
 * ✅ Delete a profile
 */
export const deleteProfile = async (uid: string): Promise<void> => {
  try {
    const profileRef = db.collection("profiles").doc(uid);
    await profileRef.delete();
  } catch (error) {
    console.error("❌ Error deleting profile:", error);
    throw new Error("Failed to delete profile.");
  }
};
