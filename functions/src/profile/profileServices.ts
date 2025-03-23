import {db, admin} from "../firebase";
import {UserProfile} from "./profileTypes";
import * as logger from "firebase-functions/logger";

/**
 * Create a new user profile
 * @param {string} uid - The user ID
 * @param {Partial<UserProfile>} profileData - The profile data to create
 * @return {Promise<void>}
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
    logger.info(`Profile created for UID: ${uid}`);
  } catch (error) {
    logger.error(`Error creating profile for UID: ${uid}`, error);
    throw new Error("Failed to create profile.");
  }
};

/**
 * Update profile fields
 * @param {string} uid - The user ID
 * @param {string} field - The field to update
 * @param {string | number | string[] | number[]} value - The value to update
 * @param {"update" | "addToArray" | "removeFromArray" | "set"}
 *  [operation="update"] - The operation to perform
 * @return {Promise<void>}
 */
export const updateProfileField = async (
    uid: string,
    field: string,
    value: string | number | string[] | number[],
    operation: "update" | "addToArray" | "removeFromArray" | "set" = "update"
): Promise<void> => {
  try {
    const profileRef = db.collection("profiles").doc(uid);
    logger.info(`Updating profile for UID: ${uid} - Field: ${field}`);

    if (operation === "addToArray") {
      await profileRef.update({
        [field]: admin.firestore.FieldValue.arrayUnion(value),
      });
    } else if (operation === "removeFromArray") {
      await profileRef.update({
        [field]: admin.firestore.FieldValue.arrayRemove(value),
      });
    } else if (operation === "set") {
      await profileRef.set(
          {
            [field]: value,
          },
          {merge: true}
      );
    } else {
      await profileRef.update({
        [field]: value,
      });
    }
    logger.info(`Profile updated for UID: ${uid} - Field: ${field}`);
  } catch (error) {
    logger.error(
        `Error updating profile for UID: ${uid} - Field: ${field}`,
        error
    );
    throw new Error("Failed to update profile.");
  }
};

/**
 * Delete a user profile
 * @param {string} uid - The user ID
 * @return {Promise<void>}
 */
export const deleteProfile = async (uid: string): Promise<void> => {
  try {
    const profileRef = db.collection("profiles").doc(uid);
    await profileRef.delete();
    logger.info(`Profile deleted for UID: ${uid}`);
  } catch (error) {
    logger.error(`Error deleting profile for UID: ${uid}`, error);
    throw new Error("Failed to delete profile.");
  }
};

/**
 * Update multiple profile fields
 * @param {string} uid - The user ID
 * @param {Partial<UserProfile>} updates - The fields to update
 * @return {Promise<void>}
 */
export const updateProfileBulk = async (
    uid: string,
    updates: Partial<UserProfile>
): Promise<void> => {
  try {
    const profileRef = db.collection("profiles").doc(uid);
    await profileRef.update(updates);
    logger.info(`Profile updated for UID: ${uid}`);
  } catch (error) {
    logger.error(`Error updating profile for UID: ${uid}`, error);
    throw new Error("Failed to update profile.");
  }
};
