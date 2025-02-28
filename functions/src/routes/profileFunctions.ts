import * as functions from "firebase-functions";
import { createProfile, readProfile, updateProfileField, deleteProfile } from "../services/profileServices";
import { authMiddleware } from "../utils/authMiddleware";

/** ✅ Create a new profile */
export const createProfileFunction = functions.https.onCall(async (data, context) => {
  console.log("🔥 createProfileFunction TRIGGERED with data:", data);

  try {
    const uid = authMiddleware(context);
    console.log("✅ User authenticated with UID:", uid);

    await createProfile(uid, data);
    console.log("✅ Profile created successfully in Firestore!");

    return { success: true };
  } catch (error) {
    console.error("❌ ERROR in createProfileFunction:", error);
    throw new functions.https.HttpsError("internal", "Profile creation failed.");
  }
});


/** ✅ Read user profile */
export const readProfileFunction = functions.https.onCall(async (data, context) => {
  const uid = authMiddleware(context);
  return await readProfile(uid);
});

/** ✅ Update profile */
export const updateProfileFunction = functions.https.onCall(async (data, context) => {
  const uid = authMiddleware(context);
  await updateProfileField(uid, data.field, data.value, data.operation);
  return { success: true };
});

/** ✅ Delete profile */
export const deleteProfileFunction = functions.https.onCall(async (data, context) => {
  const uid = authMiddleware(context);
  await deleteProfile(uid);
  return { success: true };
});
