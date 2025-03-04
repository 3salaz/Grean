import * as admin from "firebase-admin";
const db = admin.firestore();

/** ✅ Location Data Structure */
interface Location {
  locationType: string;
  street: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
  homeName?: string;
  businessName?: string;
  businessPhoneNumber?: string;
  category?: string;
}

/** ✅ Fetch user locations
 * @param {string} uid - The user's unique ID.
 * @return {Promise<Location[]>} Array of locations.
 */
export const fetchUserLocations = async (
    uid: string
): Promise<Location[]> => {
  const snapshot = await db
      .collection("locations")
      .where("uid", "==", uid)
      .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Location),
  }));
};

/** ✅ Create a new location
 * @param {string} uid - The user's unique ID.
 * @param {Location} data - The location details.
 * @return {Promise<{id: string}>} The created location ID.
 */
export const createLocation = async (
    uid: string,
    data: Location
): Promise<{ id: string }> => {
  const locationData = {
    ...data,
    uid,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  const locationRef = await db.collection("locations").add(locationData);
  return {id: locationRef.id};
};

/** ✅ Update an existing location
 * @param {string} uid - The user's unique ID.
 * @param {string} locationId - The location ID to update.
 * @param {Partial<Location>} updates - The updates to apply.
 * @return {Promise<{success: boolean}>} Success response.
 */
export const updateLocation = async (
    uid: string,
    locationId: string,
    updates: Partial<Location>
): Promise<{ success: boolean }> => {
  const locationRef = db.collection("locations").doc(locationId);
  const doc = await locationRef.get();

  if (!doc.exists || doc.data()?.uid !== uid) {
    throw new Error("Unauthorized: You cannot update this location.");
  }

  await locationRef.update(updates);
  return {success: true};
};

/** ✅ Delete a location
 * @param {string} uid - The user's unique ID.
 * @param {string} locationId - The location ID to delete.
 * @return {Promise<{success: boolean}>} Success response.
 */
export const deleteLocation = async (
    uid: string,
    locationId: string
): Promise<{ success: boolean }> => {
  const locationRef = db.collection("locations").doc(locationId);
  const doc = await locationRef.get();

  if (!doc.exists || doc.data()?.uid !== uid) {
    throw new Error("Unauthorized: You cannot delete this location.");
  }

  await locationRef.delete();
  return {success: true};
};
