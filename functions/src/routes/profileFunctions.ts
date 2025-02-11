import * as functions from "firebase-functions";
import { createProfile, readProfile, updateProfileField, deleteProfile } from "../services/profileService";
import { authMiddleware } from "../utils/authMiddleware";

/** ✅ Create a new profile */
export const createProfileFunction = functions.https.onCall(async (data, context) => {
  const uid = authMiddleware(context);
  await createProfile(uid, data);
  return { success: true };
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
