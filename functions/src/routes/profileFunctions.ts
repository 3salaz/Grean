import * as functions from "firebase-functions";
import {
  createProfile,
  updateProfileField,
  updateProfileBulk, // <-- Import the new function
  deleteProfile,
} from "../services/profileServices";
import {authMiddleware} from "../utils/authMiddleware";

/** ✅ Create a new profile
 * @param {any} data - The profile data.
 * @param {functions.https.CallableContext} context - The request context.
 * @returns {Promise<{success: boolean}>} Success response.
 */
export const createProfileFunction = functions.https.onCall(
    async (data, context) => {
      console.log("🔥 createProfileFunction TRIGGERED with data:", data);

      try {
        const uid = await authMiddleware(context);
        console.log("✅ User authenticated with UID:", uid);

        await createProfile(uid, data);
        console.log("✅ Profile created successfully in Firestore!");

        return {success: true};
      } catch (error) {
        console.error("❌ ERROR in createProfileFunction:", error);
        throw new functions.https.HttpsError(
            "internal",
            "Profile creation failed."
        );
      }
    }
);

/** ✅ Update profile
 * @param {any} data - The update data.
 * @param {functions.https.CallableContext} context - The request context.
 * @returns {Promise<{success: boolean}>} Success response.
 */
/** ✅ Update profile function supporting bulk updates */
export const updateProfileFunction = functions.https.onCall(
    async (data, context) => {
      const uid = await authMiddleware(context);

      // Check if bulk updates were provided
      if (data.updates && typeof data.updates === "object") {
        await updateProfileBulk(uid, data.updates);
      } else {
      // Fallback for single field updates
        await updateProfileField(uid, data.field, data.value, data.operation);
      }

      return {success: true};
    }
);

/** ✅ Delete profile
 * @param {any} data - The request data.
 * @param {functions.https.CallableContext} context - The request context.
 * @returns {Promise<{success: boolean}>} Success response.
 */
export const deleteProfileFunction = functions.https.onCall(
    async (data, context) => {
      const uid = await authMiddleware(context);
      await deleteProfile(uid);
      return {success: true};
    }
);
