import {onCall} from "firebase-functions/v2/https";
import {createPickup, editPickup, deletePickup} from "./pickupServices.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

/**
 * ✅ Create a new pickup request (Callable Function)
 */
export const createPickupFunction = onCall(async (request) => {
  console.log("🔥 createPickupFunction TRIGGERED with data:", request.data);

  try {
    const uid = await authMiddleware(request);
    console.log("✅ User authenticated with UID:", uid);

    const pickupData = request.data;
    if (!pickupData) throw new Error("Pickup data is required.");

    const result = await createPickup(pickupData, uid);
    console.log(
        "✅ Pickup request created successfully with ID:",
        result.pickupId
    );

    return {pickupId: result.pickupId};
  } catch (error) {
    console.error("❌ ERROR in createPickupFunction:", error);
    throw new Error("Failed to create pickup.");
  }
});

/**
 * ✅ Edit an existing pickup request (Callable Function)
 */
export const updatePickupFunction = onCall(async (request) => {
  console.log("🔥 editPickupFunction TRIGGERED with data:", request.data);

  try {
    const uid = await authMiddleware(request);
    console.log("✅ User authenticated with UID:", uid);

    const {pickupId, updatedData} = request.data;
    if (!pickupId || !updatedData) {
      throw new Error("Pickup ID and updates are required.");
    }

    await editPickup(pickupId, updatedData, uid);
    console.log("✅ Pickup updated successfully.");

    return {success: true};
  } catch (error) {
    console.error("❌ ERROR in editPickupFunction:", error);
    throw new Error("Failed to update pickup.");
  }
});

/**
 * ✅ Delete a pickup request (Callable Function)
 */
export const deletePickupFunction = onCall(async (request) => {
  console.log("🔥 deletePickupFunction TRIGGERED with data:", request.data);

  try {
    const uid = await authMiddleware(request);
    console.log("✅ User authenticated with UID:", uid);

    const {pickupId} = request.data;
    if (!pickupId) throw new Error("Pickup ID is required.");

    await deletePickup(pickupId, uid);
    console.log("✅ Pickup deleted successfully.");

    return {success: true};
  } catch (error) {
    console.error("❌ ERROR in deletePickupFunction:", error);
    throw new Error("Failed to delete pickup.");
  }
});
