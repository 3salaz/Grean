import admin from "firebase-admin";

// ✅ Ensure Firebase Admin is initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// ✅ Export Firestore instance (for compatibility)
export const db = admin.firestore();

/** ✅ Location Data Interface */
interface Location {
  id?: string;
  locationType: string;
  address: string;
  latitude?: number;
  longitude?: number;
  homeName?: string;
  businessName?: string;
  businessPhoneNumber?: string;
  category?: string;
  uid: string;
  createdAt?: FirebaseFirestore.FieldValue;
}

/**
 * ✅ Create a new location
 */
export const createLocation = async (
  uid: string,
  data: Omit<Location, "id" | "createdAt">
): Promise<{ locationId: string }> => {
  try {
    const locationData: Location = {
      ...data,
      uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const locationRef = await db.collection("locations").add(locationData);
    return { locationId: locationRef.id };
  } catch (error) {
    console.error("❌ Error creating location:", error);
    throw new Error("Failed to create location.");
  }
};

/**
 * ✅ Update an existing location
 */
export const updateLocation = async (
  uid: string,
  locationId: string,
  updates: Partial<Omit<Location, "id" | "createdAt">>
): Promise<{ success: boolean }> => {
  try {
    const locationRef = db.collection("locations").doc(locationId);
    const doc = await locationRef.get();

    if (!doc.exists) {
      throw new Error("Location not found.");
    }

    const locationData = doc.data() as Location;
    if (locationData.uid !== uid) {
      throw new Error("Unauthorized: You cannot update this location.");
    }

    await locationRef.update(updates);
    return { success: true };
  } catch (error) {
    console.error("❌ Error updating location:", error);
    throw new Error("Failed to update location.");
  }
};

/**
 * ✅ Delete a location
 */
export const deleteLocation = async (
  uid: string,
  locationId: string
): Promise<{ success: boolean }> => {
  try {
    const locationRef = db.collection("locations").doc(locationId);
    const doc = await locationRef.get();

    if (!doc.exists) {
      throw new Error("Location not found.");
    }

    const locationData = doc.data() as Location;
    if (locationData.uid !== uid) {
      throw new Error("Unauthorized: You cannot delete this location.");
    }

    await locationRef.delete();
    return { success: true };
  } catch (error) {
    console.error("❌ Error deleting location:", error);
    throw new Error("Failed to delete location.");
  }
};
