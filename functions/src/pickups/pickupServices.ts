import * as admin from "firebase-admin";
import {Pickup, CreatePickupData, PickupUpdateOperation} from "./pickupTypes";

// Ensure Firebase Admin is initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// Export Firestore instance (for compatibility)
export const db = admin.firestore();
const pickupCollection = db.collection("pickups");

/**
 * Fetch all pickups for a given user.1
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
        (doc) => ({id: doc.id, ...doc.data()} as Pickup)
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
    const pickupId = docRef.id;

    // ✅ Update the user's profile with the new pickup ID
    const profileRef = db.collection("profiles").doc(uid);
    await profileRef.update({
      pickups: admin.firestore.FieldValue.arrayUnion(pickupId),
    });

    console.log(
        "✅ Pickup created successfully and added to user profile:",
        pickupId
    );
    return {pickupId};
  } catch (error) {
    console.error("❌ Error creating pickup:", error);
    throw new Error("Failed to create pickup.");
  }
};

/**
 * Update a single field of a pickup.
 * @param {string} uid - The user's unique ID.
 * @param {string} pickupId - The pickup ID to update.
 * @param {keyof Pickup} field - The field to update.
 * @param {any} value - The value to update.
 * @param {PickupUpdateOperation} [operation="update"]
 * The operation to perform.
 * @return {Promise<{ success: boolean }>}
 */

export const updatePickupField = async (
    uid: string,
    pickupId: string,
    field: keyof Pickup,
    value: Pickup[keyof Pickup],
    operation: PickupUpdateOperation = "update"
): Promise<{ success: boolean }> => {
  try {
    const docRef = pickupCollection.doc(pickupId);
    const doc = await docRef.get();
    const pickupData = doc.data();

    if (!doc.exists) {
      throw new Error("Pickup not found.");
    }

    // Check if the user is a driver or the creator
    const profileSnap = await db.collection("profiles").doc(uid).get();
    const profileData = profileSnap.data();
    const isDriver = profileData?.accountType === "Driver";

    const isCreator = pickupData?.createdBy?.userId === uid;

    if (!isCreator && !isDriver) {
      throw new Error("Unauthorized: You cannot update this pickup.");
    }

    // Apply the update operation
    if (operation === "addToArray") {
      await docRef.update({
        [field]: admin.firestore.FieldValue.arrayUnion(value),
      });
    } else if (operation === "removeFromArray") {
      await docRef.update({
        [field]: admin.firestore.FieldValue.arrayRemove(value),
      });
    } else if (operation === "set") {
      await docRef.set({[field]: value}, {merge: true});
    } else {
      await docRef.update({[field]: value});
    }

    return {success: true};
  } catch (error) {
    console.error(
        `❌ Error updating pickup field for ID: ${pickupId} - Field: ${field}`,
        error
    );
    throw new Error("Failed to update pickup field.");
  }
};

/**
 * Update multiple fields of a pickup.
 * @param {string} uid - The user's unique ID.
 * @param {string} pickupId - The pickup ID to update.
 * @param {Partial<Pickup>} updates - The updates to apply.
 * @return {Promise<{ success: boolean }>}
 */

export const updatePickupBulk = async (
    uid: string,
    pickupId: string,
    updates: Partial<Pickup>
): Promise<{ success: boolean }> => {
  try {
    const docRef = pickupCollection.doc(pickupId);
    const doc = await docRef.get();
    const pickupData = doc.data();

    if (!doc.exists) {
      throw new Error("Pickup not found.");
    }

    // Check if the user is a driver or the creator
    const profileSnap = await db.collection("profiles").doc(uid).get();
    const profileData = profileSnap.data();
    const isDriver = profileData?.accountType === "Driver";

    const isCreator = pickupData?.createdBy?.userId === uid;

    if (!isCreator && !isDriver) {
      throw new Error("Unauthorized: You cannot update this pickup.");
    }

    await docRef.update(updates);
    console.log(`✅ Pickup updated successfully for ID: ${pickupId}`);
    return {success: true};
  } catch (error) {
    console.error(`❌ Error updating pickup for ID: ${pickupId}`, error);
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

    // Delete the pickup document
    await docRef.delete();

    // ✅ Remove the pickup ID from the user's profile
    const profileRef = db.collection("profiles").doc(uid);
    await profileRef.update({
      pickups: admin.firestore.FieldValue.arrayRemove(pickupId),
    });

    console.log(
        "✅ Pickup deleted successfully and removed from user profile:",
        pickupId
    );
    return {success: true};
  } catch (error) {
    console.error("❌ Error deleting pickup:", error);
    throw new Error("Failed to delete pickup.");
  }
};
