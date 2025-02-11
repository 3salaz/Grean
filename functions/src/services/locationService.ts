import { db, admin } from "../config/firebase";

export interface LocationData {
  locationType: string;
  street: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  homeName?: string;
  businessName?: string;
  businessPhoneNumber?: string;
  category?: string;
}

export const createLocation = async (userId: string, locationData: LocationData): Promise<string> => {
  const newLocationRef = db.collection("locations").doc();
  const newLocation = {
    id: newLocationRef.id,
    userId,
    ...locationData,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  };

  await db.runTransaction(async (transaction) => {
    transaction.set(newLocationRef, newLocation);
    const profileRef = db.collection("profiles").doc(userId);
    transaction.update(profileRef, {
      locations: admin.firestore.FieldValue.arrayUnion(newLocationRef.id),
    });
  });

  return newLocationRef.id;
};

export const deleteLocation = async (userId: string, locationId: string): Promise<void> => {
  const locationRef = db.collection("locations").doc(locationId);

  await db.runTransaction(async (transaction) => {
    transaction.delete(locationRef);
    const profileRef = db.collection("profiles").doc(userId);
    transaction.update(profileRef, {
      locations: admin.firestore.FieldValue.arrayRemove(locationId),
    });
  });
};
