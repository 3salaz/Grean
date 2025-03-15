import { onCall } from "firebase-functions/v2/https"; // ✅ Updated import
import {
  createLocation,
  updateLocation,
  deleteLocation,
} from "../services/locationServices.js";
import { authMiddleware } from "../utils/authMiddleware.js";

/**
 * ✅ Create a new location (Callable Function)
 * @param {CallableRequest} request - The request object containing location data.
 * @returns {Promise<{locationId: string}>} - The created location ID.
 */
export const createLocationFunction = onCall(async (request) => {
  console.log("🔥 createLocationFunction TRIGGERED with data:", request.data);

  try {
    const uid = await authMiddleware(request);
    console.log("✅ User authenticated with UID:", uid);

    const result = await createLocation(uid, request.data);
    console.log("✅ Location created successfully with ID:", result.locationId);

    return { locationId: result.locationId };
  } catch (error) {
    console.error("❌ ERROR in createLocationFunction:", error);
    throw new Error("Failed to create location.");
  }
});

/**
 * ✅ Update a location (Callable Function)
 * @param {CallableRequest} request - The request object containing update data.
 * @returns {Promise<{success: boolean}>} - Whether the update was successful.
 */
export const updateLocationFunction = onCall(async (request) => {
  try {
    const uid = await authMiddleware(request);
    console.log("🔥 updateLocationFunction TRIGGERED for UID:", uid);

    const { locationId, updates } = request.data;
    if (!locationId || !updates)
      throw new Error("Missing locationId or updates.");

    await updateLocation(uid, locationId, updates);
    console.log("✅ Location updated successfully.");

    return { success: true };
  } catch (error) {
    console.error("❌ ERROR in updateLocationFunction:", error);
    throw new Error("Failed to update location.");
  }
});

/**
 * ✅ Delete a location (Callable Function)
 * @param {CallableRequest} request - The request object containing location ID.
 * @returns {Promise<{success: boolean}>} - Whether the deletion was successful.
 */
export const deleteLocationFunction = onCall(async (request) => {
  try {
    const uid = await authMiddleware(request);
    console.log("🔥 deleteLocationFunction TRIGGERED for UID:", uid);

    const { locationId } = request.data;
    if (!locationId) throw new Error("Missing locationId.");

    await deleteLocation(uid, locationId);
    console.log("✅ Location deleted successfully.");

    return { success: true };
  } catch (error) {
    console.error("❌ ERROR in deleteLocationFunction:", error);
    throw new Error("Failed to delete location.");
  }
});
