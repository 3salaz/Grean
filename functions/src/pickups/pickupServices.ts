import * as admin from "firebase-admin";
import { Pickup, CreatePickupData } from "./pickupTypes";

// Ensure Firebase Admin is initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// Export Firestore instance (for compatibility)
export const db = admin.firestore();
const pickupCollection = db.collection("pickups");

/**
 * Fetch all pickups for a given user.
 * @param {string} userId - The user ID
 * @return {Promise<Pickup[]>}
 */
export const fetchPickups = async (userId: string): Promise<Pickup[]> => {
  try {
    const snapshot = await pickupCollection
      .where("createdBy.userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Pickup)
    );
  } catch (error) {
    console.error("❌ Error fetching pickups:", error);
    throw new Error("Failed to fetch pickups.");
  }
};

/**
 * Create a new pickup request.
 * @param {string} uid - The user's unique ID.
 * @param {CreatePickupData} data - The pickup data
 * @return {Promise<{ pickupId: string }>}
 */
export const createPickup = async (
  uid: string,
  data: CreatePickupData
): Promise<{ pickupId: string }> => {
  try {
    console.log("🚀 Received createdBy data:", data.createdBy);

    // Ensure createdBy fields are properly assigned
    const createdBy = {
      userId: uid,
      displayName: data.createdBy?.displayName?.trim() || "No Name",
      email: data.createdBy?.email || "",
      photoURL: data.createdBy?.photoURL || "",
    };

    console.log("🔍 Processed createdBy data:", createdBy);

    const newPickup: Pickup = {
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      isAccepted: false,
      isCompleted: false,
      createdBy,
    };

    const docRef = await pickupCollection.add(newPickup);
    console.log("✅ Pickup created successfully with ID:", docRef.id);
    return { pickupId: docRef.id };
  } catch (error) {
    console.error("❌ Error creating pickup:", error);
    throw new Error("Failed to create pickup.");
  }
};

/**
 * Update an existing pickup.
 * @param {string} uid - The user's unique ID.
 * @param {string} pickupId - The pickup ID to update.
 * @param {Partial<Pickup>} updates - The updates to apply.
 * @return {Promise<{ success: boolean }>}
 */
export const updatePickup = async (
  uid: string,
  pickupId: string,
  updates: Partial<Pickup>
): Promise<{ success: boolean }> => {
  try {
    console.log(
      "🚀 Updating pickup with ID:",
      pickupId,
      "and updates:",
      updates
    );
    const docRef = pickupCollection.doc(pickupId);
    const doc = await docRef.get();

    if (!doc.exists || doc.data()?.createdBy.userId !== uid) {
      throw new Error("Unauthorized: You cannot update this pickup.");
    }

    await docRef.update(updates);
    console.log("✅ Pickup updated successfully with ID:", pickupId);
    return { success: true };
  } catch (error) {
    console.error("❌ Error updating pickup:", error);
    throw new Error("Failed to update pickup.");
  }
};

/**
 * Delete a pickup request.
 * @param {string} uid - The user's unique ID.
 * @param {string} pickupId - The pickup ID to delete.
 * @return {Promise<{ success: boolean }>}
 */
export const deletePickup = async (
  uid: string,
  pickupId: string
): Promise<{ success: boolean }> => {
  try {
    console.log("🚀 Deleting pickup with ID:", pickupId);
    const docRef = pickupCollection.doc(pickupId);
    const doc = await docRef.get();

    if (!doc.exists || doc.data()?.createdBy.userId !== uid) {
      throw new Error("Unauthorized: You cannot delete this pickup.");
    }

    await docRef.delete();
    console.log("✅ Pickup deleted successfully with ID:", pickupId);
    return { success: true };
  } catch (error) {
    console.error("❌ Error deleting pickup:", error);
    throw new Error("Failed to delete pickup.");
  }
};
