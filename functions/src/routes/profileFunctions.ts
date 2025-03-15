import { onCall } from "firebase-functions/v2/https"; // ✅ Updated import
import {
  createProfile,
  updateProfileField,
  updateProfileBulk,
  deleteProfile,
} from "../services/profileServices.js";
import { authMiddleware } from "../utils/authMiddleware.js";

/**
 * ✅ Create a new profile
 */
export const createProfileFunction = onCall(async (request) => {
  console.log("🔥 createProfileFunction TRIGGERED with data:", request.data);

  try {
    const uid = await authMiddleware(request);
    console.log("✅ User authenticated with UID:", uid);

    await createProfile(uid, request.data);
    console.log("✅ Profile created successfully in Firestore!");

    return { success: true };
  } catch (error) {
    console.error("❌ ERROR in createProfileFunction:", error);
    throw new Error("Profile creation failed.");
  }
});

/**
 * ✅ Update profile (supports bulk updates)
 */
export const updateProfileFunction = onCall(async (request) => {
  try {
    const uid = await authMiddleware(request);
    console.log("🔥 updateProfileFunction TRIGGERED for UID:", uid);

    if (request.data.updates && typeof request.data.updates === "object") {
      await updateProfileBulk(uid, request.data.updates);
      console.log("✅ Bulk profile updates applied.");
    } else {
      await updateProfileField(
        uid,
        request.data.field,
        request.data.value,
        request.data.operation
      );
      console.log("✅ Single profile field updated.");
    }

    return { success: true };
  } catch (error) {
    console.error("❌ ERROR in updateProfileFunction:", error);
    throw new Error("Profile update failed.");
  }
});

/**
 * ✅ Delete profile
 */
export const deleteProfileFunction = onCall(async (request) => {
  try {
    const uid = await authMiddleware(request);
    console.log("🔥 deleteProfileFunction TRIGGERED for UID:", uid);

    await deleteProfile(uid);
    console.log("✅ Profile deleted successfully.");

    return { success: true };
  } catch (error) {
    console.error("❌ ERROR in deleteProfileFunction:", error);
    throw new Error("Profile deletion failed.");
  }
});
