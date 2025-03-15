import admin from "firebase-admin";

// ✅ Ensure Firebase Admin is initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// ✅ Export Firestore instance (for compatibility)
export const db = admin.firestore();
const pickupCollection = db.collection("pickups");

/** ✅ Define the Pickup interface */
interface Pickup {
  id?: string;
  createdAt?: FirebaseFirestore.FieldValue;
  isAccepted: boolean;
  isCompleted: boolean;
  createdBy: {
    userId: string;
    displayName: string;
    email: string;
    photoURL: string;
  };
  addressData: { address: string };
  pickupDate: string;
  pickupTime: string;
  pickupNote?: string;
  materials: string[];
}

/**
 * ✅ Fetch all pickups for a given user.
 */
export const fetchPickups = async (userId: string): Promise<Pickup[]> => {
  try {
    const snapshot = await pickupCollection
      .where("createdBy.userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Pickup
    );
  } catch (error) {
    console.error("❌ Error fetching pickups:", error);
    throw new Error("Failed to fetch pickups.");
  }
};

/**
 * ✅ Create a new pickup request.
 */
export const createPickup = async (
  pickupData: Omit<Pickup, "id" | "createdAt">,
  userId: string
): Promise<{ pickupId: string }> => {
  try {
    const newPickup: Pickup = {
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      isAccepted: false,
      isCompleted: false,
      createdBy: {
        userId: userId,
        displayName: pickupData.createdBy?.displayName || "No Name",
        email: pickupData.createdBy?.email || "",
        photoURL: pickupData.createdBy?.photoURL || "",
      },
      addressData: pickupData.addressData || { address: "" },
      pickupDate: pickupData.pickupDate || "",
      pickupTime: pickupData.pickupTime || "",
      pickupNote: pickupData.pickupNote || "",
      materials: pickupData.materials || [],
    };

    const docRef = await pickupCollection.add(newPickup);
    return { pickupId: docRef.id };
  } catch (error) {
    console.error("❌ Error creating pickup:", error);
    throw new Error("Failed to create pickup.");
  }
};

/**
 * ✅ Edit an existing pickup.
 */
export const editPickup = async (
  pickupId: string,
  updatedData: Partial<Omit<Pickup, "id" | "createdAt">>,
  userId: string
): Promise<{ success: boolean }> => {
  try {
    const docRef = pickupCollection.doc(pickupId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      throw new Error("Pickup not found.");
    }

    const pickupData = docSnap.data() as Pickup;

    if (pickupData.createdBy.userId !== userId) {
      throw new Error("Unauthorized: You can only edit your own pickups.");
    }

    await docRef.update(updatedData);
    return { success: true };
  } catch (error) {
    console.error("❌ Error updating pickup:", error);
    throw new Error("Failed to update pickup.");
  }
};

/**
 * ✅ Delete a pickup request.
 */
export const deletePickup = async (
  pickupId: string,
  userId: string
): Promise<{ success: boolean }> => {
  try {
    const docRef = pickupCollection.doc(pickupId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      throw new Error("Pickup not found.");
    }

    const pickupData = docSnap.data() as Pickup;

    if (pickupData.createdBy.userId !== userId) {
      throw new Error("Unauthorized: You can only delete your own pickups.");
    }

    await docRef.delete();
    return { success: true };
  } catch (error) {
    console.error("❌ Error deleting pickup:", error);
    throw new Error("Failed to delete pickup.");
  }
};
