import * as admin from "firebase-admin";
import {
  Pickup,
  CreatePickupData,
  PickupUpdateOperation,
} from "./types";

// Ensure Firebase Admin is initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

export const db = admin.firestore();
const pickupCollection = db.collection("pickups");

/**
 * Fetch all pickups for a user.
 */
export const fetchPickups = async (userId: string): Promise<Pickup[]> => {
  const snapshot = await pickupCollection
    .where("createdBy.userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Pickup));
};

/**
 * Create a new pickup and update the user's profile.
 */
export const createPickup = async (
  uid: string,
  data: CreatePickupData
): Promise<{ pickupId: string }> => {
  const createdBy = {
    userId: uid,
    displayName: data.createdBy?.displayName?.trim() || "No Name",
    email: data.createdBy?.email || "",
    photoURL: data.createdBy?.photoURL || "",
  };

  const newPickup: Pickup = {
    ...data,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    isAccepted: false,
    isCompleted: false,
    createdBy,
  };

  const docRef = await pickupCollection.add(newPickup);
  const pickupId = docRef.id;

  await db.collection("profiles").doc(uid).update({
    pickups: admin.firestore.FieldValue.arrayUnion(pickupId),
  });

  return { pickupId };
};

/**
 * Update a specific field on a pickup.
 */
export const updatePickupField = async (
  uid: string,
  pickupId: string,
  field: keyof Pickup,
  value: Pickup[keyof Pickup],
  operation: PickupUpdateOperation = "update"
): Promise<{ success: boolean }> => {
  const docRef = pickupCollection.doc(pickupId);
  const doc = await docRef.get();
  const pickupData = doc.data();

  if (!doc.exists) throw new Error("Pickup not found.");

  const profile = await db.collection("profiles").doc(uid).get();
  const isDriver = profile.data()?.accountType === "Driver";
  const isCreator = pickupData?.createdBy?.userId === uid;

  if (!isCreator && !isDriver) throw new Error("Unauthorized.");

  if (operation === "addToArray") {
    await docRef.update({ [field]: admin.firestore.FieldValue.arrayUnion(value) });
  } else if (operation === "removeFromArray") {
    await docRef.update({ [field]: admin.firestore.FieldValue.arrayRemove(value) });
  } else if (operation === "set") {
    await docRef.set({ [field]: value }, { merge: true });
  } else {
    await docRef.update({ [field]: value });
  }

  return { success: true };
};

/**
 * Update multiple fields at once.
 */
export const updatePickupBulk = async (
  uid: string,
  pickupId: string,
  updates: Partial<Pickup>
): Promise<{ success: boolean }> => {
  const docRef = pickupCollection.doc(pickupId);
  const doc = await docRef.get();
  const pickupData = doc.data();

  if (!doc.exists) throw new Error("Pickup not found.");

  const profile = await db.collection("profiles").doc(uid).get();
  const isDriver = profile.data()?.accountType === "Driver";
  const isCreator = pickupData?.createdBy?.userId === uid;

  if (!isCreator && !isDriver) throw new Error("Unauthorized.");

  await docRef.update(updates);
  return { success: true };
};

/**
 * Delete a pickup and update the user's profile.
 */
export const deletePickup = async (
  uid: string,
  pickupId: string
): Promise<{ success: boolean }> => {
  const docRef = pickupCollection.doc(pickupId);
  const doc = await docRef.get();

  if (!doc.exists || doc.data()?.createdBy?.userId !== uid) {
    throw new Error("Unauthorized: You cannot delete this pickup.");
  }

  await docRef.delete();
  await db.collection("profiles").doc(uid).update({
    pickups: admin.firestore.FieldValue.arrayRemove(pickupId),
  });

  return { success: true };
};
