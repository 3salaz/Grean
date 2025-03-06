import * as functions from "firebase-functions";
import {
  createLocation,
  updateLocation,
  deleteLocation,
} from "../services/locationServices";

/** ✅ Create a location (Callable Function) */
export const createLocationFunction = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated.",
      );
    }
    const uid = context.auth.uid;
    try {
      const result = await createLocation(uid, data);
      // Return an object with a locationId property.
      return { locationId: result.locationId };
    } catch (error: unknown) {
      console.error("❌ Error creating location:", error);
      const errMsg = error instanceof Error ? error.message : "Unknown error.";
      throw new functions.https.HttpsError("internal", errMsg);
    }
  },
);

/** ✅ Update a location (Callable Function) */
export const updateLocationFunction = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated.",
      );
    }
    const uid = context.auth.uid;
    const { locationId, updates } = data;
    try {
      await updateLocation(uid, locationId, updates);
      return { success: true };
    } catch (error: unknown) {
      console.error("❌ Error updating location:", error);
      const errMsg = error instanceof Error ? error.message : "Unknown error.";
      throw new functions.https.HttpsError("internal", errMsg);
    }
  },
);

/** ✅ Delete a location (Callable Function) */
export const deleteLocationFunction = functions.https.onCall(
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated.",
      );
    }
    const uid = context.auth.uid;
    const { locationId } = data;
    try {
      await deleteLocation(uid, locationId);
      return { success: true };
    } catch (error: unknown) {
      console.error("❌ Error deleting location:", error);
      const errMsg = error instanceof Error ? error.message : "Unknown error.";
      throw new functions.https.HttpsError("internal", errMsg);
    }
  },
);
